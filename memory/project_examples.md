# Comparable Project Template

Store comparable projects as markdown or JSON with explicit known fields so retrieval can work well.

## Markdown Example

```markdown
# Project Name

- geography: Indonesia
- sector: Sustainable aquaculture
- instrument_type: Blue bond
- stage: Expansion
- sponsor_quality: Established regional operator
- project_size_usd: 120000000

## Use Of Proceeds

- wastewater treatment upgrades
- coastal ecosystem protection
- traceability systems

## Known Estimates

- mezzanine_impact_pct: 18-25
- blended_finance_need_pct: 12-15
- expected_blue_kpi_intensity: Medium-high

## Outcome Metrics

- wastewater_treated_m3: 1800000 per year
- plastic_leakage_reduction_tons: 950 per year
- habitat_restored_hectares: 420

## Why Comparable

- same region
- similar use-of-proceeds
- similar financing structure

## Source Quality

- internal memo
- investment committee note
- public issuer framework
```

## JSON Example

```json
{
  "project_name": "Example Blue Port Upgrade",
  "geography": "Philippines",
  "sector": "Sustainable shipping",
  "instrument_type": "Blue loan",
  "known_estimates": {
    "mezzanine_impact_pct": "10-16",
    "credit_enhancement_need_pct": "8-12"
  },
  "outcome_metrics": {
    "emissions_reduction_pct": "14",
    "wastewater_capture_m3": "250000"
  },
  "why_comparable": [
    "same subsector",
    "same emerging-market context"
  ]
}
```
