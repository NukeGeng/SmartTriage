#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

python_for() {
  local service_dir="$1"
  if [ -x "$service_dir/.venv/bin/python" ]; then
    printf '%s\n' "$service_dir/.venv/bin/python"
  elif [ -x "$service_dir/.venv/Scripts/python.exe" ]; then
    printf '%s\n' "$service_dir/.venv/Scripts/python.exe"
  elif command -v python3 >/dev/null 2>&1; then
    command -v python3
  else
    command -v python
  fi
}

log() {
  printf '\n==> %s\n' "$1"
}

AI_PY="$(python_for "$ROOT_DIR/ai-service")"

cd "$ROOT_DIR/ai-service"

log "Generating sample dataset"
"$AI_PY" scripts/generate_sample_dataset.py

log "Training category model"
"$AI_PY" scripts/train_category_model.py \
  --dataset-path data/training/versions/synthetic-v2/training.csv \
  --dataset-version synthetic-v2 \
  --promote

log "Building duplicate index"
"$AI_PY" scripts/build_duplicate_index.py

log "AI training assets are ready"
