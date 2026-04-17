# Blue Finance Estimation Agents

This repository is now structured as a small LangChain-based multi-agent scaffold for blue finance structuring work. It is designed for a workflow where a user uploads project documents, fills a partially complete questionnaire, and the system estimates unresolved fields such as `mezzanine_impact_pct` by combining:

- project-document extraction
- internal comparable-project retrieval
- external browsing
- source-backed blue finance best practices

## Repository Layout

```text
.
|-- data/
|   |-- documents/            # User-uploaded project documents to parse
|   |-- reference_projects/   # Comparable projects with known estimates
|   `-- indexes/              # Optional dumped vector indexes
|-- memory/
|   |-- best_practices.md     # Blue finance guidance and estimation guardrails
|   |-- project_examples.md   # Template for comparable-project notes
|   `-- project_memory.md     # Working architecture notes
|-- prompts/
|   |-- browsing_agent_system.txt
|   |-- document_parser_system.txt
|   |-- orchestrator_system.txt
|   `-- query_agent_system.txt
|-- scripts/
|   |-- build_index.py
|   `-- run_estimation.py
`-- src/blue_finance/
    |-- agents/
    |   |-- base.py
    |   |-- browsing_agent.py
    |   |-- document_parser.py
    |   |-- orchestrator.py
    |   `-- query_agent.py
    |-- config.py
    |-- document_store.py
    |-- models.py
    `-- prompts.py
```

## Agent Responsibilities

- `DocumentParserAgent`: extracts the project profile, known questionnaire answers, and missing fields from local project documents.
- `BrowsingAgent`: searches for missing context, benchmarks, market signals, and policy/regulatory details using web search.
- `QueryAgent`: retrieves similar internal projects from the in-memory vector store and summarizes usable analogs.
- `EstimationOrchestrator`: combines document evidence, comparable projects, external research, and `memory/best_practices.md` to estimate unresolved fields with rationale and confidence.

## Setup

1. Install Python 3.11+.
2. Install dependencies:

```powershell
pip install -e .
```

3. Copy `.env.example` values into your shell or env file.
4. Put project source documents under `data/documents/`.
5. Put comparable-project notes or files under `data/reference_projects/`.
6. Start from `data/questionnaire_template.json` for the questionnaire payload shape.

## Suggested Reference Project Format

The retrieval layer works best when comparable projects are stored as markdown or JSON files with explicit fields such as:

- project name
- country / region
- sector / subsector
- instrument type
- capital stack notes
- known estimates
- source quality
- outcome / impact metrics

See `memory/project_examples.md` for a starter template.

## Scripts

Build or refresh the in-memory index and optionally dump it:

```powershell
python scripts/build_index.py
```

Run an estimation against a questionnaire JSON file:

```powershell
python scripts/run_estimation.py data/questionnaire.json
```

## Notes

- Prompt instructions live in plain-text files under `prompts/` so you can refine behavior without changing Python code.
- `memory/best_practices.md` includes both source-backed blue bond guidance and repo-specific estimation rules inferred from that guidance.
- I could not run a local smoke test in this session because `python` was not installed in the workspace environment.
