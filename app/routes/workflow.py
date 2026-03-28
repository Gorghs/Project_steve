from fastapi import APIRouter, HTTPException, Depends, Query, BackgroundTasks
from fastapi.responses import JSONResponse
import json
from datetime import datetime

from app.schemas import (
    GenerateWorkflowRequest,
    GenerateWorkflowResponse,
    WorkflowExportResponse,
    ErrorResponse,
    WorkflowListResponse,
)
from app.services.workflow_service import WorkflowService
from app.auth import verify_api_key
from app.logger import setup_logger, log_request, log_response, log_error

router = APIRouter(prefix="/api", tags=["workflows"])
logger = setup_logger("workflow_routes")

workflow_service = WorkflowService()


@router.post("/generate-workflow", response_model=GenerateWorkflowResponse)
async def generate_workflow(
    request: GenerateWorkflowRequest,
    api_key: str = Depends(verify_api_key),
):
    log_request(logger, "POST", "/api/generate-workflow", {"requirements_length": len(request.requirements)})
    
    try:
        if not request.requirements or not request.requirements.strip():
            log_error(logger, "POST", "/api/generate-workflow", "Empty requirements", 400)
            raise HTTPException(status_code=400, detail={"error": "Requirements cannot be empty", "details": "Please provide valid automation requirements"})
        
        result = workflow_service.generate_workflow(request.requirements)
        
        if not result.get("success"):
            log_error(logger, "POST", "/api/generate-workflow", result.get("error", "Unknown error"), 500)
            raise HTTPException(status_code=500, detail={"error": result.get("error"), "details": result.get("details")})
        
        log_response(logger, "POST", "/api/generate-workflow", 200, 0)
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        log_error(logger, "POST", "/api/generate-workflow", str(e), 500)
        raise HTTPException(status_code=500, detail={"error": "Internal server error", "details": str(e)})


@router.get("/workflow/{workflow_id}", response_model=dict)
async def get_workflow(
    workflow_id: str,
    api_key: str = Depends(verify_api_key),
):
    log_request(logger, "GET", f"/api/workflow/{workflow_id}")
    
    try:
        workflow = workflow_service.get_workflow(workflow_id)
        
        if not workflow:
            log_error(logger, "GET", f"/api/workflow/{workflow_id}", "Workflow not found", 404)
            raise HTTPException(status_code=404, detail={"error": "Workflow not found", "details": f"No workflow with ID {workflow_id}"})
        
        log_response(logger, "GET", f"/api/workflow/{workflow_id}", 200, 0)
        return {"success": True, "workflow_id": workflow_id, "workflow": workflow}
    
    except HTTPException:
        raise
    except Exception as e:
        log_error(logger, "GET", f"/api/workflow/{workflow_id}", str(e), 500)
        raise HTTPException(status_code=500, detail={"error": "Internal server error", "details": str(e)})


@router.get("/workflow/{workflow_id}/export")
async def export_workflow(
    workflow_id: str,
    api_key: str = Depends(verify_api_key),
):
    log_request(logger, "GET", f"/api/workflow/{workflow_id}/export")
    
    try:
        workflow = workflow_service.get_workflow(workflow_id)
        
        if not workflow:
            log_error(logger, "GET", f"/api/workflow/{workflow_id}/export", "Workflow not found", 404)
            raise HTTPException(status_code=404, detail={"error": "Workflow not found", "details": f"No workflow with ID {workflow_id}"})
        
        log_response(logger, "GET", f"/api/workflow/{workflow_id}/export", 200, 0)
        
        return JSONResponse(
            content=workflow,
            headers={"Content-Disposition": f"attachment; filename=workflow_{workflow_id}.json"}
        )
    
    except HTTPException:
        raise
    except Exception as e:
        log_error(logger, "GET", f"/api/workflow/{workflow_id}/export", str(e), 500)
        raise HTTPException(status_code=500, detail={"error": "Internal server error", "details": str(e)})


@router.get("/workflows", response_model=WorkflowListResponse)
async def list_workflows(
    api_key: str = Depends(verify_api_key),
):
    log_request(logger, "GET", "/api/workflows")
    
    try:
        workflows = workflow_service.list_workflows()
        log_response(logger, "GET", "/api/workflows", 200, 0)
        return {"workflows": workflows, "count": len(workflows)}
    
    except Exception as e:
        log_error(logger, "GET", "/api/workflows", str(e), 500)
        raise HTTPException(status_code=500, detail={"error": "Internal server error", "details": str(e)})


@router.get("/test")
async def test_endpoint():
    log_request(logger, "GET", "/api/test")
    log_response(logger, "GET", "/api/test", 200, 0)
    return {"status": "API is working"}
