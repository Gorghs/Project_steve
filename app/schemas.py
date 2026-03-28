from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class GenerateWorkflowRequest(BaseModel):
    requirements: str = Field(..., min_length=1, description="Automation requirements")


class NodeInfo(BaseModel):
    id: str
    name: str
    type: str
    parameters: Dict[str, Any] = {}
    position: List[int] = [0, 0]


class WorkflowNode(BaseModel):
    id: str
    name: str
    type: str
    parameters: Dict[str, Any] = {}
    position: List[int] = [0, 0]


class WorkflowConnection(BaseModel):
    source_node: str
    source_output: str
    target_node: str
    target_input: str


class PhaseResult(BaseModel):
    success: bool
    phase: str
    message: str
    workflow: Optional[Dict[str, Any]] = None
    checks: Optional[List[Dict[str, Any]]] = None
    security_checks: Optional[List[Dict[str, Any]]] = None
    timestamp: str


class GenerateWorkflowResponse(BaseModel):
    success: bool
    workflow_id: str
    workflow: Dict[str, Any]
    phases: Dict[str, PhaseResult]


class WorkflowExportResponse(BaseModel):
    workflow_id: str
    workflow: Dict[str, Any]
    exported_at: str


class HealthResponse(BaseModel):
    status: str
    version: str
    uptime: float


class ErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None


class WorkflowListResponse(BaseModel):
    workflows: List[Dict[str, Any]]
    count: int
