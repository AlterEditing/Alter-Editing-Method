const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { copyAndPatchElst, isAlreadyPatchedVideo } = require("./elst-patcher");
const { runFfprobe, spawnFfmpegWithProgress } = require("./ffmpeg");

const SUPPORTED_EXTENSIONS = new Set([".mp4", ".mov"]);
const MAX_BITRATE_KBPS = 1_000_000;
const MIN_BITRATE_KBPS = 200;

let activePatch = null;

function isSupportedVideoPath(filePath) {
  return SUPPORTED_EXTENSIONS.has(path.extname(String(filePath || "")).toLowerCase());
}

function createDefaultOutputPath(inputPath, mode = "balanced") {
  if (!inputPath) {
    return "";
  }

  const parsed = path.parse(inputPath);
  const extension = mode === "source" ? parsed.ext || ".mov" : ".mp4";
  return path.join(parsed.dir, `${parsed.name}_AlterE${extension}`);
}

async function probeVideo(filePath) {
  const source = normalizeInputPath(filePath);
  await assertVideoIsNotAlreadyPatched(source);

  const probe = await runFfprobe([
    "-v",
    "error",
    "-show_streams",
    "-show_format",
    "-of",
    "json",
    source,
  ]);

  const payload = JSON.parse(probe.stdout || "{}");
  const streams = Array.isArray(payload.streams) ? payload.streams : [];
  const format = payload.format || {};
  const videoStream = streams.find((stream) => stream.codec_type === "video") || {};
  const audioStream = streams.find((stream) => stream.codec_type === "audio") || {};

  const durationSeconds = toNumber(format.duration);
  const fileSizeBytes = toInteger(format.size) || (await safeStatSize(source));
  const formatBitrateKbps = bitsPerSecondToKbps(format.bit_rate);
  const videoBitrateKbps = bitsPerSecondToKbps(videoStream.bit_rate) || formatBitrateKbps;
  const audioBitrateKbps =
    bitsPerSecondToKbps(audioStream.bit_rate) ||
    (videoBitrateKbps > 0 ? Math.max(96, Math.round(videoBitrateKbps * 0.08)) : 0);

  return {
    path: source,
    name: path.basename(source),
    extension: path.extname(source).toLowerCase(),
    sizeBytes: fileSizeBytes,
    durationSeconds,
    width: toInteger(videoStream.width),
    height: toInteger(videoStream.height),
    fps: parseFrameRate(videoStream.avg_frame_rate || videoStream.r_frame_rate),
    codec: String(videoStream.codec_name || ""),
    hasAudio: Boolean(audioStream.codec_type),
    videoBitrateKbps,
    audioBitrateKbps,
  };
}

async function patchVideo({
  inputPath,
  outputPath,
  mode,
  outputBitrateKbps,
  sourceVideoBitrateKbps,
  durationSeconds,
  onProgress,
}) {
  if (activePatch) {
    throw new Error("A patch operation is already running.");
  }

  const source = normalizeInputPath(inputPath);
  await assertVideoIsNotAlreadyPatched(source);
  if (!outputPath) {
    throw new Error("Output path is not selected.");
  }

  const target = path.resolve(outputPath);
  const normalizedMode = normalizeMode(mode);
  const sourceBitrate = Math.max(0, Number(sourceVideoBitrateKbps || 0));
  const outputBitrate = calculateOutputBitrateKbps(normalizedMode, sourceBitrate, outputBitrateKbps);

  if (source.toLowerCase() === target.toLowerCase()) {
    throw new Error("Output path must be different from the source video.");
  }

  await fs.promises.mkdir(path.dirname(target), { recursive: true });
  onProgress?.(4);

  let tempPath = null;
  let patchedTempPath = null;

  try {
    patchedTempPath = createTempOutputPath(target);

    if (normalizedMode === "source") {
      onProgress?.(60);
      await copyAndPatchElst(source, patchedTempPath);
      await commitOutput(patchedTempPath, target);
      patchedTempPath = null;
      onProgress?.(100);
      return { outputPath: target, mode: normalizedMode, outputBitrateKbps: sourceBitrate };
    }

    tempPath = createTempRenderPath(target);
    activePatch = { child: null, tempPath, cancelling: false };
    await renderHevc({
      inputPath: source,
      outputPath: tempPath,
      bitrateKbps: outputBitrate,
      durationSeconds,
      onProgress: (renderProgress) => {
        const scaled = 8 + Math.round(renderProgress * 0.86);
        onProgress?.(Math.max(8, Math.min(94, scaled)));
      },
    });

    onProgress?.(96);
    await copyAndPatchElst(tempPath, patchedTempPath);
    await commitOutput(patchedTempPath, target);
    patchedTempPath = null;
    await safeRemove(tempPath);
    tempPath = null;
    onProgress?.(100);
    return { outputPath: target, mode: normalizedMode, outputBitrateKbps: outputBitrate };
  } catch (error) {
    if (error?.code === "PATCH_CANCELLED") {
      const cancelled = new Error("Patch cancelled.");
      cancelled.code = "PATCH_CANCELLED";
      throw cancelled;
    }
    throw error;
  } finally {
    if (tempPath) {
      await safeRemove(tempPath);
    }
    if (patchedTempPath) {
      await safeRemove(patchedTempPath);
    }
    activePatch = null;
  }
}

function cancelActivePatch() {
  if (!activePatch?.child) {
    if (!activePatch) {
      return false;
    }
    activePatch.cancelling = true;
    return true;
  }

  activePatch.cancelling = true;
  activePatch.child.kill("SIGTERM");
  return true;
}

function isPatchInProgress() {
  return Boolean(activePatch);
}

async function renderHevc({ inputPath, outputPath, bitrateKbps, durationSeconds, onProgress }) {
  const bitrate = clampInteger(bitrateKbps, MIN_BITRATE_KBPS, MAX_BITRATE_KBPS);
  const args = [
    "-y",
    "-i",
    inputPath,
    "-map",
    "0:v:0",
    "-map",
    "0:a?",
    "-map_metadata",
    "0",
    "-c:v",
    "libx265",
    "-b:v",
    `${bitrate}k`,
    "-maxrate",
    `${bitrate}k`,
    "-bufsize",
    `${Math.max(400, bitrate * 2)}k`,
    "-pix_fmt",
    "yuv420p",
    "-tag:v",
    "hvc1",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    outputPath,
  ];

  await spawnFfmpegWithProgress(args, {
    durationSeconds,
    onProgress,
    isCancelled: () => Boolean(activePatch?.cancelling),
    onProcess: (child) => {
      if (activePatch) {
        activePatch.child = child;
        if (child && activePatch.cancelling) {
          child.kill("SIGTERM");
        }
      }
    },
  });
}

function normalizeInputPath(filePath) {
  const source = path.resolve(String(filePath || ""));
  if (!fs.existsSync(source)) {
    throw new Error("Source video was not found.");
  }

  if (!isSupportedVideoPath(source)) {
    throw new Error("Only MP4 and MOV videos are supported.");
  }

  return source;
}

async function assertVideoIsNotAlreadyPatched(filePath) {
  if (await isAlreadyPatchedVideo(filePath)) {
    throw new Error("Video is already patched.");
  }
}

function normalizeMode(mode) {
  const value = String(mode || "").toLowerCase();
  if (value === "low" || value === "balanced" || value === "source" || value === "custom") {
    return value;
  }
  return "balanced";
}

function calculateOutputBitrateKbps(mode, sourceBitrateKbps, overrideBitrateKbps = 0) {
  const source = Math.max(0, Number(sourceBitrateKbps || 0));
  if (mode === "source") {
    return source;
  }
  const override = Number(overrideBitrateKbps || 0);
  if (override > 0) {
    return clampInteger(override, MIN_BITRATE_KBPS, MAX_BITRATE_KBPS);
  }
  if (source <= 0) {
    return mode === "low" ? 4000 : 10000;
  }
  const divider = mode === "low" ? 4 : 2;
  return clampInteger(Math.round(source / divider), MIN_BITRATE_KBPS, MAX_BITRATE_KBPS);
}

function createTempRenderPath(outputPath) {
  const parsed = path.parse(outputPath);
  const id = crypto.randomBytes(5).toString("hex");
  return path.join(parsed.dir, `${parsed.name}.render-${id}.tmp.mp4`);
}

function createTempOutputPath(outputPath) {
  const parsed = path.parse(outputPath);
  const id = crypto.randomBytes(5).toString("hex");
  const extension = parsed.ext || ".mp4";
  return path.join(parsed.dir, `${parsed.name}.patched-${id}.tmp${extension}`);
}

async function commitOutput(tempPath, outputPath) {
  await fs.promises.rm(outputPath, { force: true }).catch(() => {});
  await fs.promises.rename(tempPath, outputPath);
}

async function safeRemove(filePath) {
  if (!filePath) {
    return;
  }
  await fs.promises.rm(filePath, { force: true }).catch(() => {});
}

async function safeStatSize(filePath) {
  try {
    const stat = await fs.promises.stat(filePath);
    return stat.size;
  } catch {
    return 0;
  }
}

function bitsPerSecondToKbps(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed / 1000) : 0;
}

function parseFrameRate(value) {
  const text = String(value || "0");
  if (text.includes("/")) {
    const [left, right] = text.split("/");
    const numerator = Number(left);
    const denominator = Number(right);
    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
    return 0;
  }
  return toNumber(text);
}

function toInteger(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function toNumber(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clampInteger(value, min, max) {
  const parsed = Math.round(Number(value || 0));
  if (!Number.isFinite(parsed)) {
    return min;
  }
  return Math.max(min, Math.min(max, parsed));
}

module.exports = {
  calculateOutputBitrateKbps,
  cancelActivePatch,
  createDefaultOutputPath,
  isAlreadyPatchedVideo,
  isPatchInProgress,
  isSupportedVideoPath,
  patchVideo,
  probeVideo,
};
