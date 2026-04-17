# Project Memory

## Current Architecture

The repo now assumes a four-part estimation flow:

1. Parse local project documents into a structured project profile.
2. Retrieve similar internal reference projects from an in-memory vector index.
3. Browse external sources for missing market, policy, or benchmark context.
4. Merge all evidence into source-backed estimates for unresolved questionnaire fields.

## Design Decisions

- Prompts are stored as plain `.txt` files under `prompts/` for easy iteration.
- The vector layer uses LangChain's `InMemoryVectorStore` so the first version stays simple.
- Comparable project retrieval is separate from document parsing because the comparable corpus should evolve independently.
- `memory/best_practices.md` is treated as a standing governance input to the orchestrator.

## Immediate Next Steps

- Add real user project files to `data/documents/`.
- Add comparable project notes with known outcomes to `data/reference_projects/`.
- Refine prompt wording per field and per user role.
- Decide the formal definition of fields like `mezzanine_impact_pct` before production use.
