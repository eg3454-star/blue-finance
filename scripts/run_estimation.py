from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from blue_finance.agents.orchestrator import EstimationOrchestrator


GENERATED_QUESTIONNAIRE_DIR = ROOT_DIR / "data" / "generated_questionnaires"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run blue-finance estimation workflow.")
    parser.add_argument("questionnaire", nargs="?", help="Path to questionnaire JSON file.")
    parser.add_argument("--progress-file", dest="progress_file", help="Path to write progress JSON.")
    parser.add_argument(
        "--checkpoint-dir",
        dest="checkpoint_dir",
        help="Directory to persist stage checkpoints and logs.",
    )
    parser.add_argument("--job-id", dest="job_id", help="Optional estimation job id.")
    return parser


def resolve_questionnaire_path(path_argument: str | None) -> Path:
    if path_argument:
        return Path(path_argument)
    latest = latest_generated_questionnaire()
    if latest is not None:
        return latest
    raise SystemExit(
        "Usage: python scripts/run_estimation.py <questionnaire.json>\n"
        "No questionnaire path provided and no generated questionnaires found in "
        f"{GENERATED_QUESTIONNAIRE_DIR}."
    )


def latest_generated_questionnaire() -> Path | None:
    if not GENERATED_QUESTIONNAIRE_DIR.exists():
        return None
    candidates = sorted(
        GENERATED_QUESTIONNAIRE_DIR.glob("questionnaire_*.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )
    return candidates[0] if candidates else None


def save_estimation_output(estimation_payload: dict[str, object]) -> Path:
    output_dir = ROOT_DIR / "data" / "estimation_outputs"
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    output_path = output_dir / f"estimation_{timestamp}.json"
    output_path.write_text(
        json.dumps(estimation_payload, indent=2, ensure_ascii=True),
        encoding="utf-8",
    )
    return output_path


class ProgressTracker:
    def __init__(
        self,
        *,
        progress_file: Path | None,
        checkpoint_dir: Path | None,
        job_id: str | None,
    ) -> None:
        self.progress_file = progress_file
        self.checkpoint_dir = checkpoint_dir
        self.job_id = job_id
        self._sequence = 0
        if self.progress_file:
            self.progress_file.parent.mkdir(parents=True, exist_ok=True)
        if self.checkpoint_dir:
            self.checkpoint_dir.mkdir(parents=True, exist_ok=True)

    def emit(
        self,
        *,
        stage: str,
        progress: int,
        message: str,
        meta: dict[str, Any] | None = None,
    ) -> None:
        self._sequence += 1
        payload: dict[str, Any] = {
            "sequence": self._sequence,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "pid": os.getpid(),
            "job_id": self.job_id,
            "stage": stage,
            "progress": max(0, min(progress, 100)),
            "message": message,
            "meta": meta or {},
        }
        if self.progress_file:
            self.progress_file.write_text(json.dumps(payload, ensure_ascii=True), encoding="utf-8")
        if self.checkpoint_dir:
            checkpoint_path = self.checkpoint_dir / f"{self._sequence:03d}_{stage}.json"
            checkpoint_path.write_text(json.dumps(payload, indent=2, ensure_ascii=True), encoding="utf-8")
            log_path = self.checkpoint_dir / "run.log"
            with log_path.open("a", encoding="utf-8") as log_file:
                log_file.write(json.dumps(payload, ensure_ascii=True) + "\n")
        print(f"__PROGRESS__{json.dumps(payload, ensure_ascii=True)}", file=sys.stderr, flush=True)


def main() -> None:
    args = build_parser().parse_args()
    questionnaire_path = resolve_questionnaire_path(args.questionnaire)
    tracker = ProgressTracker(
        progress_file=Path(args.progress_file) if args.progress_file else None,
        checkpoint_dir=Path(args.checkpoint_dir) if args.checkpoint_dir else None,
        job_id=args.job_id,
    )
    tracker.emit(stage="initializing", progress=2, message="Loading questionnaire input.")
    try:
        questionnaire = json.loads(questionnaire_path.read_text(encoding="utf-8"))
        orchestrator = EstimationOrchestrator.from_settings()
        tracker.emit(stage="initializing", progress=6, message="Estimator initialized.")
        result = orchestrator.estimate(questionnaire, progress_callback=tracker.emit)
        payload = result.model_dump()
        output_path = save_estimation_output(payload)
        tracker.emit(
            stage="finalizing",
            progress=98,
            message="Writing estimation output.",
            meta={"estimation_output_path": str(output_path)},
        )
        tracker.emit(stage="complete", progress=100, message="Run finished successfully.")
        print(json.dumps(payload, indent=2, ensure_ascii=True))
    except Exception as exc:
        tracker.emit(
            stage="failed",
            progress=100,
            message="Run failed.",
            meta={"error": str(exc)},
        )
        raise


if __name__ == "__main__":
    main()
