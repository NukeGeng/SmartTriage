import argparse
import json
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.config import settings
from app.ml.training_pipeline import ARTIFACT_NAMES, promote_training_run


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Promote a validated SmartTriage training run")
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--model-dir", default=settings.MODEL_DIR)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    model_dir = Path(args.model_dir)
    run_dir = model_dir / "runs" / args.run_id
    missing = [name for name in ARTIFACT_NAMES if not (run_dir / name).exists()]
    if missing:
        raise FileNotFoundError(f"Training run is missing artifacts: {missing}")

    marker = promote_training_run(run_dir, model_dir)
    print(json.dumps(marker, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
