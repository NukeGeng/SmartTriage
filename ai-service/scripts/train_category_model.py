import argparse
import json
import sys
from datetime import UTC, datetime
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.config import settings
from app.ml.training_pipeline import promote_training_run, train_category_model


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train a versioned SmartTriage category model")
    parser.add_argument("--dataset-path", default=settings.DATASET_PATH)
    parser.add_argument("--dataset-version", default=None)
    parser.add_argument("--model-dir", default=settings.MODEL_DIR)
    parser.add_argument("--run-id", default=None)
    parser.add_argument("--promote", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    dataset_path = Path(args.dataset_path)
    dataset_version = args.dataset_version or dataset_path.parent.name
    timestamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
    run_id = args.run_id or f"{dataset_version}-{timestamp}"
    run_dir = Path(args.model_dir) / "runs" / run_id
    metadata = train_category_model(
        dataset_path=dataset_path,
        output_dir=run_dir,
        dataset_version=dataset_version,
        run_id=run_id,
    )
    if args.promote:
        promote_training_run(run_dir, args.model_dir)
        metadata["promoted"] = True
    else:
        metadata["promoted"] = False
    print(json.dumps(metadata, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
