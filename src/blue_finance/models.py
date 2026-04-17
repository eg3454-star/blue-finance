from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


ConfidenceLevel = Literal["low", "medium", "high"]


class ProjectFact(BaseModel):
    field_name: str
    value: str
    source_hint: str | None = None
    confidence: ConfidenceLevel = "medium"


class ProjectProfile(BaseModel):
    project_name: str | None = None
    geography: str | None = None
    sector: str | None = None
    subsector: str | None = None
    instrument_type: str | None = None
    project_stage: str | None = None
    sponsor: str | None = None
    use_of_proceeds: str | None = None
    known_fields: dict[str, str] = Field(default_factory=dict)
    missing_fields: list[str] = Field(default_factory=list)
    extracted_facts: list[ProjectFact] = Field(default_factory=list)
    caveats: list[str] = Field(default_factory=list)


class SourceReference(BaseModel):
    title: str
    url: str
    reason_for_use: str | None = None


class ExternalResearchResult(BaseModel):
    question: str
    summary: str
    takeaways: list[str] = Field(default_factory=list)
    sources: list[SourceReference] = Field(default_factory=list)


class ComparableProject(BaseModel):
    name: str
    source_path: str | None = None
    similarity_reason: str
    known_estimates: dict[str, str] = Field(default_factory=dict)


class ComparableProjectSet(BaseModel):
    search_query: str
    comparable_projects: list[ComparableProject] = Field(default_factory=list)
    takeaways: list[str] = Field(default_factory=list)


class FieldEstimate(BaseModel):
    field_name: str
    estimated_value: str
    unit: str | None = None
    estimation_type: Literal["direct", "range", "scenario"] = "range"
    range_low: float | None = None
    range_high: float | None = None
    confidence: ConfidenceLevel = "medium"
    reasoning: str
    assumptions: list[str] = Field(default_factory=list)
    supporting_sources: list[str] = Field(default_factory=list)
    requires_human_review: bool = False


class EstimationOutput(BaseModel):
    project_profile: ProjectProfile
    comparable_projects: list[ComparableProject] = Field(default_factory=list)
    external_research: list[ExternalResearchResult] = Field(default_factory=list)
    estimates: list[FieldEstimate] = Field(default_factory=list)
    next_questions: list[str] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)
