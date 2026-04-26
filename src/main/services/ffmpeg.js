const { app } = require("electron");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function resolveBundledBinary(name) {
  const candidates = [
    path.join(app.getAppPath(), "vendor", "ffmpeg", name),
    path.join(process.resourcesPath || "", "vendor", "ffmpeg", name),
    path.join(path.dirname(process.execPath), "vendor", "ffmpeg", name),
  ];

  const found = candidates.find((candidate) => candidate && fs.existsSync(candidate));
  if (!found) {
    throw new Error(`Bundled ${name} was not found.`);
  }
  return found;
}

function runFfprobe(args) {
  return runProcess(resolveBundledBinary("ffprobe.exe"), args);
}

function runProcess(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
      if (stderr.length > 12000) {
        stderr = stderr.slice(-12000);
      }
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(trimProcessError(stderr) || `Process exited with code ${code}.`));
    });
  });
}

function spawnFfmpegWithProgress(args, { durationSeconds, onProgress, onProcess, isCancelled }) {
  return new Promise((resolve, reject) => {
    const command = resolveBundledBinary("ffmpeg.exe");
    const child = spawn(command, ["-progress", "pipe:1", "-nostats", ...args], {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderr = "";
    let lastProgress = 0;

    onProcess?.(child);
    onProgress?.(0);

    child.stdout.on("data", (chunk) => {
      const lines = chunk.toString("utf8").split(/\r?\n/);
      for (const line of lines) {
        const fraction = parseProgressFraction(line, durationSeconds);
        if (fraction === null) {
          continue;
        }
        const progress = Math.max(lastProgress, Math.min(100, Math.round(fraction * 100)));
        if (progress !== lastProgress) {
          lastProgress = progress;
          onProgress?.(progress);
        }
      }
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
      if (stderr.length > 16000) {
        stderr = stderr.slice(-16000);
      }
    });

    child.on("error", reject);
    child.on("close", (code, signal) => {
      onProcess?.(null);
      if (code === 0) {
        onProgress?.(100);
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
      reject(new Error(trimProcessError(stderr) || `FFmpeg exited with code ${code}.`));
    });
  });
}

function parseProgressFraction(line, durationSeconds) {
  const duration = Number(durationSeconds || 0);
  if (!line || duration <= 0 || !line.includes("=")) {
    return null;
  }

  const [key, rawValue] = line.split("=", 2);
  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    return null;
  }

  let microseconds = null;
  if (key === "out_time_us" || key === "out_time_ms") {
    microseconds = value;
  } else if (key === "out_time_ns") {
    microseconds = value / 1000;
  }

  if (microseconds === null) {
    return null;
  }

  return Math.max(0, Math.min(1, microseconds / (duration * 1_000_000)));
}

function trimProcessError(stderr) {
  return String(stderr || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-8)
    .join("\n");
}

module.exports = {
  runFfprobe,
  spawnFfmpegWithProgress,
};
