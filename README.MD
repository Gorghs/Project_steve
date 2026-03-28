# Project Steve - Secure Workflow Automation API

**FastAPI-powered backend for intelligent workflow generation with three-phase processing: Build → QA → Security.**

> Paste a requirement, get a hardened n8n workflow JSON. Minimal surface, maximum signal.

## 🚀 Quick Start

### Installation
```bash
pip install -r requirements.txt
```

### Run Server
```bash
uvicorn app.main:app --reload
```

### Access
- **Frontend:** `http://localhost:8000`
- **Swagger Docs:** `http://localhost:8000/docs`
- **API Health:** `http://localhost:8000/api/health`

Production-ready workflow generation in seconds.

## ✨ Core Features

- **🔄 Three-Phase Pipeline** - Build → QA → Security validation
- **⚡ Instant JSON** - Convert prompts to n8n workflows instantly
- **🛡️ API Key Auth** - Secure endpoints with X-API-Key
- **📊 Structured Logging** - JSON-formatted request tracking
- **🌐 CORS Ready** - Works with any frontend
- **💾 In-Memory Storage** - Fast, stateless management
- **📥 Export Workflows** - Download as JSON files
- **📚 Interactive Docs** - Swagger & ReDoc built-in

## 📁 Architecture

```
app/
├── main.py                    # FastAPI + middleware + static files
├── routes/
│   └── workflow.py           # 5 workflow endpoints
├── services/
│   └── workflow_service.py   # 3-phase logic
├── schemas.py                # Pydantic models
├── auth.py                   # API key authentication
└── logger.py                 # JSON logging
```

## � Three-Phase Processing

### Phase 1: Build 🏗️
Creates workflow architecture with nodes, connections, and requirements

### Phase 2: QA ✅
Validates structure, transforms naming, runs 4 compliance checks

### Phase 3: Security 🛡️
Adds timeout, retries, rate limiting, SSL verification, SSRF prevention

## 📡 API Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/` | NO | Serves frontend |
| `GET` | `/api/health` | NO | Health check |
| `POST` | `/api/generate-workflow` | YES | Generate workflow |
| `GET` | `/api/workflow/{id}` | YES | Get workflow |
| `GET` | `/api/workflow/{id}/export` | YES | Download JSON |
| `GET` | `/api/workflows` | YES | List all |

## 💡 Usage

### Web UI
1. Open `http://localhost:8000`
2. Type your requirement
3. Click "Generate & Download JSON"
4. Three phases execute automatically
5. JSON downloads instantly

### API
```bash
curl -X POST http://localhost:8000/api/generate-workflow \
  -H "X-API-Key: default-api-key-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{"requirements":"Email notification workflow"}'
```

## 📊 Response Example

```json
{
  "success": true,
  "workflow_id": "1234567890",
  "workflow": {
    "name": "Generated Workflow",
    "nodes": [...],
    "connections": [...],
    "security": {
      "timeout": 300,
      "retryCount": 3
    }
  },
  "phases": {
    "build": {...},
    "qa": {...},
    "security": {...}
  }
}
```

## 🔧 Configuration

**Environment Variables**
```bash
API_KEY=your-secure-key-here  # Default: default-api-key-change-in-production
```

**Server**
- Host: `0.0.0.0`
- Port: `8000`
- Reload: Enabled in dev mode

**Authentication**
- Header: `X-API-Key`
- Required for all `/api/*` endpoints (except `/health`)

## 🧪 Testing

```bash
# Health check
curl http://localhost:8000/api/health

# List workflows
curl http://localhost:8000/api/workflows \
  -H "X-API-Key: default-api-key-change-in-production"

# Generate workflow
curl -X POST http://localhost:8000/api/generate-workflow \
  -H "X-API-Key: default-api-key-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{"requirements":"Your requirement here"}'
```

## 📚 Documentation

- **Interactive Docs:** `http://localhost:8000/docs` (Swagger)
- **Alternative Docs:** `http://localhost:8000/redoc`
- **Full Report:** See [VERIFICATION_REPORT.md](VERIFICATION_REPORT.md)

## 🛡️ Security

- **CSP:** Content Security Policy enabled
- **HSTS:** HTTP Strict Transport Security
- **CORS:** Configured for all origins
- **API Key Auth:** Token-based protection
- **SSRF Prevention:** Built-in
- **Data:** In-memory (no persistence)

## 📦 Tech Stack

- **Framework:** FastAPI 0.104.1
- **Server:** Uvicorn 0.24.0
- **Validation:** Pydantic 2.5.0
- **Config:** python-dotenv 1.0.0
- **Frontend:** Vanilla HTML/CSS/JS

## ✅ Status

**Production Ready**
- All endpoints tested
- Full error handling
- Security headers configured
- Documentation complete
- Workflows stored in-memory

---

**Project Steve** — FastAPI Backend | Intelligent Workflow Automation | 2026
