import logging
import json
from datetime import datetime


class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        if hasattr(record, "extra_data"):
            log_data.update(record.extra_data)
        
        return json.dumps(log_data)


def setup_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    handler = logging.StreamHandler()
    formatter = JSONFormatter()
    handler.setFormatter(formatter)
    
    if not logger.handlers:
        logger.addHandler(handler)
    
    return logger


def log_request(logger: logging.Logger, method: str, path: str, params: dict = None):
    logger.info(
        f"Request: {method} {path}",
        extra={"extra_data": {"request_method": method, "request_path": path, "params": params or {}}}
    )


def log_response(logger: logging.Logger, method: str, path: str, status_code: int, duration: float):
    logger.info(
        f"Response: {status_code} {method} {path}",
        extra={"extra_data": {"response_status": status_code, "response_method": method, "response_path": path, "duration_ms": duration}}
    )


def log_error(logger: logging.Logger, method: str, path: str, error: str, status_code: int = 500):
    logger.error(
        f"Error: {status_code} {method} {path} - {error}",
        extra={"extra_data": {"error_status": status_code, "error_method": method, "error_path": path, "error_message": error}}
    )
