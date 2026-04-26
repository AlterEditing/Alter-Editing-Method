const fs = require("fs");
const path = require("path");

const ELST_SIGNATURE = Buffer.from([0x65, 0x6c, 0x73, 0x74, 0x00, 0x00, 0x00, 0x00]);
const PATCH_BYTES = Buffer.from([0x10, 0x00, 0x00, 0x01]);
const CHUNK_SIZE = 1024 * 1024;
const OVERLAP_SIZE = 11;
const HEADER_SIZE = 8;
const EXTENDED_HEADER_SIZE = 16;
const MAX_BOX_DEPTH = 10;
const CONTAINER_BOX_TYPES = new Set([
  "moov",
  "trak",
  "edts",
  "mdia",
  "minf",
  "dinf",
  "stbl",
  "moof",
  "traf",
]);

async function copyAndPatchElst(sourcePath, outputPath) {
  const source = path.resolve(sourcePath);
  const output = path.resolve(outputPath);

  if (source.toLowerCase() === output.toLowerCase()) {
    throw new Error("Output path must be different from the source video.");
  }

  await fs.promises.mkdir(path.dirname(output), { recursive: true });
  await fs.promises.copyFile(source, output);

  try {
    await patchFirstElstInPlace(output);
  } catch (error) {
    await fs.promises.rm(output, { force: true }).catch(() => {});
    throw error;
  }
}

async function patchFirstElstInPlace(filePath) {
  const parsedState = await getFirstElstPatchState(filePath);
  if (parsedState.found) {
    const handle = await fs.promises.open(filePath, "r+");
    try {
      await handle.write(PATCH_BYTES, 0, PATCH_BYTES.length, parsedState.patchOffset);
      return;
    } finally {
      await handle.close();
    }
  }

  throw new Error("Suitable elst atom was not found for patching.");
}

async function getFirstElstPatchState(filePath, options = {}) {
  const fallbackScan = options.fallbackScan !== false;
  const stat = await fs.promises.stat(filePath);
  const parsed = await findFirstElstByBoxes(filePath, stat.size);
  if (parsed) {
    return parsed;
  }

  if (!fallbackScan) {
    return { found: false, patched: false };
  }

  return scanFirstElstPatchState(filePath);
}

async function scanFirstElstPatchState(filePath) {
  const handle = await fs.promises.open(filePath, "r");
  let position = 0;
  let tail = Buffer.alloc(0);

  try {
    const readBuffer = Buffer.alloc(CHUNK_SIZE);
    while (true) {
      const { bytesRead } = await handle.read(readBuffer, 0, CHUNK_SIZE, position);
      if (bytesRead <= 0) {
        break;
      }

      const chunk = readBuffer.subarray(0, bytesRead);
      const scanBuffer = Buffer.concat([tail, chunk]);
      const scanStart = position - tail.length;
      const patchOffset = findPatchOffset(scanBuffer);

      if (patchOffset >= 0) {
        const absoluteTypeOffset = scanStart + patchOffset;
        return {
          found: true,
          typeOffset: absoluteTypeOffset,
          patchOffset: absoluteTypeOffset + 8,
          patched: scanBuffer.subarray(patchOffset + 8, patchOffset + 12).equals(PATCH_BYTES),
        };
      }

      tail = scanBuffer.subarray(Math.max(0, scanBuffer.length - OVERLAP_SIZE));
      position += bytesRead;
    }
  } finally {
    await handle.close();
  }

  return { found: false, patched: false };
}

async function findFirstElstByBoxes(filePath, fileSize) {
  const handle = await fs.promises.open(filePath, "r");
  try {
    return await findBoxRecursive(handle, 0, fileSize, 0);
  } finally {
    await handle.close();
  }
}

async function findBoxRecursive(handle, start, end, depth) {
  if (depth > MAX_BOX_DEPTH) {
    return null;
  }

  let position = start;
  while (position + HEADER_SIZE <= end) {
    const box = await readBoxHeader(handle, position, end);
    if (!box || box.size <= 0) {
      return null;
    }

    const boxEnd = Math.min(end, position + box.size);
    if (boxEnd <= position || boxEnd > end + 8) {
      return null;
    }

    if (box.type === "elst") {
      const versionFlags = await readBytes(handle, box.headerEnd, 4);
      const patchBytes = await readBytes(handle, box.headerEnd + 4, 4);
      if (!versionFlags.equals(Buffer.alloc(4))) {
        return null;
      }
      return {
        found: true,
        typeOffset: position + 4,
        patchOffset: box.headerEnd + 4,
        patched: patchBytes.equals(PATCH_BYTES),
      };
    }

    if (CONTAINER_BOX_TYPES.has(box.type)) {
      const found = await findBoxRecursive(handle, box.headerEnd, boxEnd, depth + 1);
      if (found) {
        return found;
      }
    }

    position = boxEnd;
  }

  return null;
}

async function readBoxHeader(handle, position, parentEnd) {
  const base = await readBytes(handle, position, HEADER_SIZE);
  if (base.length < HEADER_SIZE) {
    return null;
  }

  const smallSize = base.readUInt32BE(0);
  const type = base.toString("ascii", 4, 8);

  if (!isPlausibleBoxType(type)) {
    return null;
  }

  if (smallSize === 1) {
    const extended = await readBytes(handle, position + HEADER_SIZE, 8);
    if (extended.length < 8) {
      return null;
    }
    const size = Number(extended.readBigUInt64BE(0));
    return {
      type,
      size,
      headerEnd: position + EXTENDED_HEADER_SIZE,
    };
  }

  if (smallSize === 0) {
    return {
      type,
      size: parentEnd - position,
      headerEnd: position + HEADER_SIZE,
    };
  }

  return {
    type,
    size: smallSize,
    headerEnd: position + HEADER_SIZE,
  };
}

async function readBytes(handle, position, length) {
  const buffer = Buffer.alloc(length);
  const { bytesRead } = await handle.read(buffer, 0, length, position);
  return bytesRead === length ? buffer : buffer.subarray(0, bytesRead);
}

function isPlausibleBoxType(type) {
  return /^[A-Za-z0-9 _-]{4}$/.test(type);
}

async function isAlreadyPatchedVideo(filePath) {
  const state = await getFirstElstPatchState(filePath, { fallbackScan: false });
  return Boolean(state.found && state.patched);
}

function findPatchOffset(buffer) {
  const max = buffer.length - 12;
  for (let offset = 0; offset <= max; offset += 1) {
    if (buffer.subarray(offset, offset + ELST_SIGNATURE.length).equals(ELST_SIGNATURE)) {
      return offset;
    }
  }
  return -1;
}

module.exports = {
  copyAndPatchElst,
  getFirstElstPatchState,
  isAlreadyPatchedVideo,
  patchFirstElstInPlace,
};
