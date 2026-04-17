from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from blue_finance.agents.orchestrator import EstimationOrchestrator


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python scripts/run_estimation.py <questionnaire.json>")

    questionnaire_path = Path(sys.argv[1])
    questionnaire = json.loads(questionnaire_path.read_text(encoding="utf-8"))
    orchestrator = EstimationOrchestrator.from_settings()
    result = orchestrator.estimate(questionnaire)
    print(result.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
