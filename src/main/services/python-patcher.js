const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PATCHER_SCRIPT = path.join(__dirname, "en_new_binary_patcher_v5.py");
const PATCHER_CACHE_DIR = path.join(os.tmpdir(), "altere-patcher-cache");
const PATCHER_CACHE_SCRIPT = path.join(PATCHER_CACHE_DIR, "en_new_binary_patcher_v5.py");

function resolvePythonCommand() {
  const pyCheck = spawnSync("py", ["-3", "--version"], { windowsHide: true });
  if (pyCheck.status === 0) {
    return { command: "py", argsPrefix: ["-3"] };
  }

  const pythonCheck = spawnSync("python", ["--version"], { windowsHide: true });
  if (pythonCheck.status === 0) {
    return { command: "python", argsPrefix: [] };
  }

  throw new Error("Python 3 was not found. Install Python 3 or launcher py.");
}

function resolveBundledBinary(name) {
  const candidates = [
    path.join(path.resolve(__dirname, "../../.."), "vendor", "ffmpeg", name),
    path.join(process.resourcesPath || "", "vendor", "ffmpeg", name),
    path.join(path.dirname(process.execPath), "vendor", "ffmpeg", name),
    path.join(path.resolve(__dirname, "../../../.."), "vendor", "ffmpeg", name),
  ];
  const found = candidates.find((candidate) => candidate && fs.existsSync(candidate));
  if (!found) {
    throw new Error(`Bundled ${name} was not found.`);
  }
  return found;
}

function runPythonBinaryPatcher({
  inputPath,
  outputPath,
  onProcess,
  isCancelled,
}) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(PATCHER_SCRIPT)) {
      reject(new Error("Python patcher script was not found."));
      return;
    }

    const py = resolvePythonCommand();
    const scriptPath = prepareAsciiScriptPath();
    const ffmpegPath = resolveBundledBinary("ffmpeg.exe");
    const ffprobePath = resolveBundledBinary("ffprobe.exe");
    const args = [
      ...py.argsPrefix,
      scriptPath,
      inputPath,
      outputPath,
      "--ffmpeg",
      ffmpegPath,
      "--ffprobe",
      ffprobePath,
    ];

    const child = spawn(py.command, args, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    let stdout = "";

    onProcess?.(child);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
      if (stdout.length > 16000) {
        stdout = stdout.slice(-16000);
      }
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
      if (stderr.length > 16000) {
        stderr = stderr.slice(-16000);
      }
    });

    child.on("error", (error) => reject(error));
    child.on("close", (code, signal) => {
      onProcess?.(null);
      if (code === 0) {
        resolve();
        return;
      }
      const cancelled =
        Boolean(isCancelled?.()) ||
        (typeof signal === "string" && /term|int|kill/i.test(signal));
      if (cancelled) {
        const error = new Error("Patch cancelled.");
        error.code = "PATCH_CANCELLED";
        reject(error);
        return;
      }
      const details = [stderr.trim(), stdout.trim()].filter(Boolean).join("\n");
      reject(new Error(details || `Python patcher exited with code ${code}.`));
    });
  });
}

function prepareAsciiScriptPath() {
  fs.mkdirSync(PATCHER_CACHE_DIR, { recursive: true });
  const sourceStat = fs.statSync(PATCHER_SCRIPT);
  let needsCopy = true;
  if (fs.existsSync(PATCHER_CACHE_SCRIPT)) {
    const targetStat = fs.statSync(PATCHER_CACHE_SCRIPT);
    needsCopy = sourceStat.size !== targetStat.size || sourceStat.mtimeMs > targetStat.mtimeMs;
  }
  if (needsCopy) {
    fs.copyFileSync(PATCHER_SCRIPT, PATCHER_CACHE_SCRIPT);
  }
  return PATCHER_CACHE_SCRIPT;
}

module.exports = {
  runPythonBinaryPatcher,
};
