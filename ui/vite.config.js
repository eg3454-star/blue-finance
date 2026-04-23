import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react(), estimateApiPlugin()],
});

function estimateApiPlugin() {
  const jobs = new Map();

  return {
    name: "estimate-api",
    configureServer(server) {
      server.middlewares.use("/api/make-estimates", async (req, res) => {
        const subPath = (req.url || "/").split("?")[0];
        if (req.method === "POST" && (subPath === "/" || subPath === "")) {
          try {
            const requestBody = await readJsonBody(req);
            const questionnaire = requestBody?.questionnaire;
            if (!questionnaire || typeof questionnaire !== "object") {
              throw new Error("Request body must include a questionnaire object.");
            }

            const uiDir = path.dirname(fileURLToPath(import.meta.url));
            const projectRoot = path.resolve(uiDir, "..");
            const questionnaireDir = path.join(projectRoot, "data", "generated_questionnaires");
            await fs.mkdir(questionnaireDir, { recursive: true });

            const timestamp = buildTimestamp();
            const jobId = randomUUID();
            const questionnairePath = path.join(
              questionnaireDir,
              `questionnaire_${timestamp}.json`,
            );
            await fs.writeFile(
              questionnairePath,
              JSON.stringify(questionnaire, null, 2),
              "utf-8",
            );

            const runDir = path.join(projectRoot, "data", "estimation_runs", jobId);
            const checkpointDir = path.join(runDir, "checkpoints");
            const progressPath = path.join(runDir, "progress.json");
            await fs.mkdir(checkpointDir, { recursive: true });

            const job = {
              jobId,
              status: "queued",
              stage: "queued",
              progress: 0,
              message: "Queued for estimation run.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              questionnairePath,
              filledQuestionnairePath: null,
              estimation: null,
              filledQuestionnaire: null,
              stderr: null,
              error: null,
              runDir,
              checkpointDir,
              progressPath,
            };
            jobs.set(jobId, job);
            void runEstimationJob({ job, questionnaire, projectRoot, jobs });

            res.statusCode = 202;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                jobId,
                status: job.status,
                stage: job.stage,
                progress: job.progress,
                message: job.message,
              }),
            );
            return;
          } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error",
              }),
            );
            return;
          }
        }

        if (req.method === "GET") {
          const jobId = subPath.replace(/^\/+/, "");
          if (!jobId) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Job id is required." }));
            return;
          }
          const job = jobs.get(jobId);
          if (!job) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Unknown estimation job id." }));
            return;
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              jobId: job.jobId,
              status: job.status,
              stage: job.stage,
              progress: job.progress,
              message: job.message,
              questionnairePath: job.questionnairePath,
              filledQuestionnairePath: job.filledQuestionnairePath,
              estimation: job.estimation,
              filledQuestionnaire: job.filledQuestionnaire,
              stderr: job.stderr,
              error: job.error,
              runDir: job.runDir,
              checkpointDir: job.checkpointDir,
              progressPath: job.progressPath,
              createdAt: job.createdAt,
              updatedAt: job.updatedAt,
            }),
          );
          return;
        }

        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed" }));
      });
    },
  };
}

async function runEstimationJob({ job, questionnaire, projectRoot, jobs }) {
  const runScriptPath = path.join(projectRoot, "scripts", "run_estimation.py");
  const pythonBin = await resolvePythonBin(projectRoot);
  updateJob(jobs, job.jobId, {
    status: "running",
    stage: "initializing",
    progress: 3,
    message: "Starting estimation process.",
  });
  try {
    const commandResult = await runCommandWithProgress(
      pythonBin,
      [
        runScriptPath,
        job.questionnairePath,
        "--progress-file",
        job.progressPath,
        "--checkpoint-dir",
        job.checkpointDir,
        "--job-id",
        job.jobId,
      ],
      projectRoot,
      (progressUpdate) => {
        updateJob(jobs, job.jobId, {
          status: progressUpdate.stage === "failed" ? "failed" : "running",
          stage: progressUpdate.stage || "running",
          progress: Number.isFinite(progressUpdate.progress) ? progressUpdate.progress : 0,
          message: progressUpdate.message || "Working...",
        });
      },
    );
    const estimation = JSON.parse(commandResult.stdout);
    const filledQuestionnaire = applyEstimates(questionnaire, estimation?.estimates || []);
    const filledPath = path.join(
      path.dirname(job.questionnairePath),
      `${path.basename(job.questionnairePath, ".json")}_filled.json`,
    );
    await fs.writeFile(
      filledPath,
      JSON.stringify(filledQuestionnaire, null, 2),
      "utf-8",
    );
    updateJob(jobs, job.jobId, {
      status: "completed",
      stage: "complete",
      progress: 100,
      message: "Estimation complete.",
      estimation,
      filledQuestionnaire,
      filledQuestionnairePath: filledPath,
      stderr: commandResult.stderr?.trim() || null,
      error: null,
    });
  } catch (error) {
    updateJob(jobs, job.jobId, {
      status: "failed",
      stage: "failed",
      progress: 100,
      message: "Estimation failed.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function resolvePythonBin(projectRoot) {
  if (process.env.PYTHON_BIN && process.env.PYTHON_BIN.trim()) {
    return process.env.PYTHON_BIN.trim();
  }

  // Prefer the project-local venv to avoid interpreter/package mismatch.
  const projectVenvPython = path.join(projectRoot, "blue env", "bin", "python");
  try {
    await fs.access(projectVenvPython);
    return projectVenvPython;
  } catch {
    // Fall back below when local venv is missing.
  }

  return "python3";
}

function updateJob(jobs, jobId, patch) {
  const existing = jobs.get(jobId);
  if (!existing) return;
  jobs.set(jobId, {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

function parseProgressMarkers(stderrText) {
  const updates = [];
  for (const line of stderrText.split("\n")) {
    if (!line.startsWith("__PROGRESS__")) continue;
    const payloadText = line.slice("__PROGRESS__".length);
    try {
      updates.push(JSON.parse(payloadText));
    } catch {
      // Ignore malformed progress lines.
    }
  }
  return updates;
}

function runCommandWithProgress(command, args, cwd, onProgress) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: process.env });
    let stdout = "";
    let stderr = "";
    let stderrBuffer = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      stderrBuffer += text;
      const lines = stderrBuffer.split("\n");
      stderrBuffer = lines.pop() || "";
      for (const line of lines) {
        for (const update of parseProgressMarkers(line)) {
          onProgress(update);
        }
      }
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (stderrBuffer.trim()) {
        for (const update of parseProgressMarkers(stderrBuffer)) {
          onProgress(update);
        }
      }
      if (code !== 0) {
        const detail = stderr?.trim() || stdout?.trim() || `Exit code ${code}`;
        reject(new Error(`Estimation command failed: ${detail}`));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf-8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function buildTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    now.getUTCFullYear().toString() +
    pad(now.getUTCMonth() + 1) +
    pad(now.getUTCDate()) +
    "T" +
    pad(now.getUTCHours()) +
    pad(now.getUTCMinutes()) +
    pad(now.getUTCSeconds()) +
    "Z"
  );
}

function applyEstimates(questionnaire, estimates) {
  const filled = { ...questionnaire };
  const isMissing = (value) =>
    value === null ||
    value === undefined ||
    value === "" ||
    value === "unknown" ||
    value === "Unknown" ||
    value === "n/a" ||
    value === "N/A";
  for (const estimate of estimates) {
    if (!estimate || typeof estimate !== "object") {
      continue;
    }
    const fieldName = estimate.field_name;
    if (typeof fieldName !== "string") {
      continue;
    }
    if (!(fieldName in filled)) {
      continue;
    }
    if (!isMissing(filled[fieldName])) {
      continue;
    }
    const low = estimate.range_low;
    const high = estimate.range_high;
    if (typeof low === "number" && typeof high === "number") {
      filled[fieldName] = `${low} - ${high}`;
      continue;
    }
    filled[fieldName] = estimate.estimated_value ?? filled[fieldName];
  }
  return filled;
}
