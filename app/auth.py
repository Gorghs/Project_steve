import os
from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
from typing import Optional


api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def verify_api_key(api_key: Optional[str] = Security(api_key_header)) -> str:
    required_key = os.getenv("API_KEY", "default-api-key-change-in-production")
    
    if not api_key:
        raise HTTPException(status_code=403, detail="API key missing")
    
    if api_key != required_key:
        raise HTTPException(status_code=403, detail="Invalid API key")
    
    return api_key
