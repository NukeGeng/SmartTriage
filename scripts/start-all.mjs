#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";
const children = [];
let shuttingDown = false;

function log(message) {
  console.log(`\n==> ${message}`);
}

function pathFromRoot(...parts) {
  return join(rootDir, ...parts);
}

function run(command, cwd = rootDir) {
  const result = spawnSync(command, {
    cwd,
    env: process.env,
    shell: true,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function spawnService(name, command, cwd) {
  log(`Starting ${name}`);
  const child = spawn(command, {
    cwd,
    env: process.env,
    shell: true,
    stdio: "inherit",
  });
  children.push({ name, child });

  child.on("exit", (code) => {
    if (shuttingDown) {
      return;
    }
    console.error(`\n${name} stopped with code ${code ?? 0}. Shutting down other services.`);
    shutdown(code ?? 1);
  });
}

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  log("Stopping local services");
  for (const { child } of children) {
    if (child.killed || child.exitCode !== null) {
      continue;
    }
    if (isWindows) {
      spawnSync(`taskkill /pid ${child.pid} /t /f`, { shell: true, stdio: "ignore" });
    } else {
      child.kill("SIGTERM");
    }
  }
  process.exit(exitCode);
}

function copyEnvIfMissing(exampleRelativePath, targetRelativePath) {
  const examplePath = pathFromRoot(...exampleRelativePath.split("/"));
  const targetPath = pathFromRoot(...targetRelativePath.split("/"));
  if (!existsSync(targetPath) && existsSync(examplePath)) {
    copyFileSync(examplePath, targetPath);
    console.log(`Created ${targetRelativePath}`);
  }
}

function pythonCommand(serviceDirName) {
  const serviceDir = pathFromRoot(serviceDirName);
  const windowsPython = join(serviceDir, ".venv", "Scripts", "python.exe");
  const unixPython = join(serviceDir, ".venv", "bin", "python");
  if (existsSync(windowsPython)) {
    return `"${windowsPython}"`;
  }
  if (existsSync(unixPython)) {
    return `"${unixPython}"`;
  }
  return isWindows ? "python" : "python3";
}

function ensurePythonEnv(serviceDirName) {
  const serviceDir = pathFromRoot(serviceDirName);
  const windowsPython = join(serviceDir, ".venv", "Scripts", "python.exe");
  const unixPython = join(serviceDir, ".venv", "bin", "python");
  const hasVenv = existsSync(windowsPython) || existsSync(unixPython);

  if (!hasVenv) {
    log(`Creating ${serviceDirName} virtual environment`);
    run(`${isWindows ? "python" : "python3"} -m venv .venv`, serviceDir);
    log(`Installing ${serviceDirName} dependencies`);
    run(`${pythonCommand(serviceDirName)} -m pip install --upgrade pip`, serviceDir);
    run(`${pythonCommand(serviceDirName)} -m pip install -r requirements.txt`, serviceDir);
  }
}

function ensureFrontendDeps() {
  if (!existsSync(pathFromRoot("frontend", "node_modules"))) {
    log("Installing frontend dependencies");
    run("npm install", pathFromRoot("frontend"));
  }
}

function ensureAiArtifacts(aiPython) {
  const classifierPath = pathFromRoot("ai-service", "models", "category_classifier.joblib");
  const vectorizerPath = pathFromRoot("ai-service", "models", "tfidf_vectorizer.joblib");
  if (existsSync(classifierPath) && existsSync(vectorizerPath)) {
    console.log("AI model artifacts already exist, skipping training.");
    return;
  }

  log("Generating AI dataset");
  run(`${aiPython} scripts/generate_sample_dataset.py`, pathFromRoot("ai-service"));
  log("Training AI model");
  run(`${aiPython} scripts/train_category_model.py`, pathFromRoot("ai-service"));
  log("Building duplicate index");
  run(`${aiPython} scripts/build_duplicate_index.py`, pathFromRoot("ai-service"));
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

log("Preparing SmartTriage local environment");
copyEnvIfMissing("backend/.env.example", "backend/.env");
copyEnvIfMissing("ai-service/.env.example", "ai-service/.env");
copyEnvIfMissing("frontend/.env.local.example", "frontend/.env.local");

ensurePythonEnv("backend");
ensurePythonEnv("ai-service");
ensureFrontendDeps();

const backendPython = pythonCommand("backend");
const aiPython = pythonCommand("ai-service");

log("Starting PostgreSQL with Docker Compose");
run("docker compose up -d postgres", rootDir);

log("Running backend migrations");
run(`${backendPython} -m alembic upgrade head`, pathFromRoot("backend"));

log("Seeding backend demo users");
run(`${backendPython} scripts/seed_users.py`, pathFromRoot("backend"));

ensureAiArtifacts(aiPython);

console.log("\nSmartTriage is starting:");
console.log("  Frontend:   http://localhost:3000");
console.log("  Backend:    http://localhost:8000/api/v1/health");
console.log("  AI Service: http://localhost:8001/api/v1/health");
console.log("\nPress Ctrl+C to stop backend, AI service, and frontend.");

spawnService(
  "AI service",
  `${aiPython} -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001`,
  pathFromRoot("ai-service"),
);
spawnService(
  "Backend",
  `${backendPython} -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`,
  pathFromRoot("backend"),
);
spawnService(
  "Frontend",
  "npm run dev -- --hostname 0.0.0.0 --port 3000",
  pathFromRoot("frontend"),
);
