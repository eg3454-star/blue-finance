# Blue Finance Best Practices

This note translates the blue bond guidance referenced by the user into practical rules for this repository. It combines direct takeaways from official guidance with implementation choices for estimation workflows.

## Core Guidance Anchors

Primary sources reviewed:

- IFC press release announcing the global practitioner's guide: https://www.ifc.org/en/pressroom/2023/new-guidance-on-blue-bonds-to-help-unlock-finance-for-a-sustainable-ocean-economy
- UNEP FI announcement of the same guide: https://www.unepfi.org/themes/ecosystems/new-guidance-on-blue-bonds-to-help-unlock-finance-for-a-sustainable-ocean-economy/
- UNEP FI Sustainable Blue Economy Finance Principles: https://www.unepfi.org/blue-finance/the-principles/
- IFC Guidelines for Blue Finance: https://www.ifc.org/en/insights-reports/2025/guidelines-for-blue-finance
- IFC Guidelines for Blue Finance PDF snippet surfaced via official search result: https://www.ifc.org/content/dam/ifc/doc/mgrt/ifc-guidelines-for-blue-finance.pdf

## What The Official Guidance Repeats

The common themes across IFC and UNEP FI are:

- Blue finance needs clear eligibility criteria, not just ocean-themed language.
- Blue bond and blue loan use of proceeds should align with established green-bond style discipline.
- Key performance indicators should be explicit, relevant, and reportable.
- Market credibility depends on transparency, impact reporting, and protection against blue-washing.
- Projects should be evaluated with scientific rigor, long-term risk awareness, and legal compliance.
- SDG 14 alignment matters, but projects should also avoid undermining other environmental and social goals.

## Blue Finance Screening Rules

Use these rules before a project or estimate is treated as "blue":

1. The activity should contribute directly to SDG 6 or SDG 14 outcomes, not only have a loose marine connection.
2. The activity should fit credible eligible-use categories such as water and wastewater management, marine ecosystem protection, fisheries and aquaculture transition, sustainable shipping, marine pollution reduction, offshore renewable energy, or similar blue-economy sectors named by IFC.
3. The activity should be screened for material harm to adjacent goals such as biodiversity, livelihoods, food systems, circularity, or climate.
4. The project should show at least minimum ESG safeguards and clearly state which standards, regulations, or frameworks it follows.
5. If the project cannot explain how proceeds will be used, governed, and reported, treat the estimate as low-confidence.

## Transaction-Level Best Practices

These are the most operationally useful structuring rules for the repository:

- Keep the blue use-of-proceeds logic explicit and separate from broader green claims.
- Document project assessment and selection criteria.
- Document management of proceeds.
- Document impact reporting commitments and relevant KPIs.
- Tie the transaction narrative to measurable environmental outputs or outcomes.
- Prefer evidence that can be audited or traced back to a document, framework, or public source.
- Mark any unresolved dependency, assumption, or proxy clearly.

## KPI Expectations

For estimates and justifications, prefer KPIs in one of these families:

- Water: water treated, wastewater capacity, water quality improvement, access gains, leakage reduction.
- Pollution: plastics avoided, effluent reduction, waste recovered, runoff reduction.
- Ecosystems: habitat restored, mangrove or coastal ecosystem area protected, biodiversity indicators.
- Climate and transport: emissions reduced, vessel efficiency gains, renewable-energy capacity tied to marine assets.
- Food systems: fishery sustainability metrics, aquaculture resource efficiency, traceability improvements.
- Social and livelihoods: jobs supported, local livelihoods protected, community inclusion, resilience outcomes.

## Estimation Rules For Missing Questionnaire Fields

The guidance above does not prescribe exact numerical estimation formulas for fields like `mezzanine_impact_pct`. The rules below are an implementation inference for this repository.

Inference: estimates should be evidence-ranked and conservative because official guidance emphasizes transparency, scientific rigor, and market integrity.

Use this evidence hierarchy:

1. Direct statements in project documents.
2. Internal comparable projects with known estimates.
3. Reputable external data points or benchmark ranges.
4. Expert heuristic based on project type, geography, stage, instrument, and impact pathway.

When generating a missing value:

- Return a range when the evidence does not support a precise point estimate.
- Include a confidence level of `low`, `medium`, or `high`.
- Show the strongest evidence source types used.
- Note whether the estimate is document-backed, comparable-backed, externally benchmarked, or heuristic.
- Flag human review whenever the estimate materially affects pricing, credit decisioning, or disclosure language.

## Estimation Heuristics For Finance Structuring

When the missing field is a financial or blended-finance variable rather than a pure environmental KPI:

- Use project stage, sponsor quality, jurisdiction risk, tenor, technology maturity, and revenue visibility as first-order drivers.
- Use comparable projects from the same subsector and geography before cross-sector analogs.
- If using cross-sector analogs, explain why the operating risks and impact mechanics are still comparable.
- Distinguish between estimated impact intensity and estimated capital-stack positioning.
- Avoid false precision. Two decimals without hard evidence should be treated as suspicious.

## Rules For `mezzanine_impact_pct`

This field is not defined in the source guidance, so the repository should treat it as a derived estimate that needs an explicit definition. Recommended working definition:

`mezzanine_impact_pct = estimated share of the project's total measurable blue impact attributable to the mezzanine tranche's catalytic role in enabling the transaction`

Use only if the team agrees with that definition. If adopted:

- Estimate against the whole financing plan, not against the mezzanine slice alone.
- Consider whether the mezzanine capital is truly catalytic, subordinated, risk-absorbing, or crowding in senior capital.
- Increase the percentage only when there is evidence that the transaction likely would not proceed, or would be materially smaller, without mezzanine support.
- Lower the percentage when mezzanine appears incremental but non-catalytic.
- Always explain attribution assumptions because impact attribution is structurally judgment-heavy.

## Source-Backed Governance Checklist

Before finalizing an estimate, confirm:

- the project is actually eligible as blue finance
- the claimed impact path is measurable
- the legal and ESG baseline is not missing
- the estimate includes confidence and assumptions
- sources are transparent enough to defend later
- the answer does not overstate certainty

## Practical Implication For This Repo

The orchestrator should never output a naked estimate. Every estimate should carry:

- rationale
- supporting evidence
- confidence
- assumptions
- human-review flag
- next questions that would tighten the estimate
