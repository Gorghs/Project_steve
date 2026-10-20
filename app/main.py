import os
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import time

from app.routes.workflow import router as workflow_router
from app.services.workflow_service import WorkflowService
from app.logger import setup_logger, log_request, log_response, log_error

load_dotenv()

app = FastAPI(
    title="Secure Workflow Automation API",
    description="FastAPI backend for workflow generation and management",
    version="1.0.0"
)

logger = setup_logger("main")
workflow_service = WorkflowService()

ROOT_DIR = Path(__file__).parent.parent
ASSETS_DIR = ROOT_DIR / "assets"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    if not request.url.path.startswith("/docs") and not request.url.path.startswith("/redoc") and not request.url.path.startswith("/openapi.json"):
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    log_request(logger, request.method, request.url.path)
    
    response = await call_next(request)
    
    process_time = (time.time() - start_time) * 1000
    log_response(logger, request.method, request.url.path, response.status_code, process_time)
    
    return response


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "uptime": workflow_service.get_uptime(),
        "timestamp": datetime.utcnow().isoformat()
    }


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail if isinstance(exc.detail, dict) else {"error": exc.detail}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    log_error(logger, request.method, request.url.path, str(exc), 500)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "details": str(exc)}
    )


@app.get("/")
async def root():
    return FileResponse(str(ROOT_DIR / "index.html"), media_type="text/html")


@app.get("/app.js")
async def serve_app_js():
    return FileResponse(str(ROOT_DIR / "app.js"), media_type="application/javascript")


# Static assets (stickers, icons, og image, favicons)
app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR), check_dir=False), name="assets")


# Crawl directives - served as plain text / xml, not the SPA shell
@app.get("/robots.txt")
async def serve_robots():
    return FileResponse(str(ROOT_DIR / "robots.txt"), media_type="text/plain")


@app.get("/sitemap.xml")
async def serve_sitemap():
    return FileResponse(str(ROOT_DIR / "sitemap.xml"), media_type="application/xml")


@app.get("/favicon.ico")
async def serve_favicon():
    return FileResponse(str(ROOT_DIR / "favicon.ico"), media_type="image/x-icon")


@app.get("/favicon.svg")
async def serve_favicon_svg():
    return FileResponse(str(ASSETS_DIR / "favicon.svg"), media_type="image/svg+xml")


app.include_router(workflow_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
