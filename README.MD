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

## 💡 Usage

### Web UI
1. Open `http://localhost:8000`
2. Type your requirement
3. Click "Generate & Download JSON"
4. Three phases execute automatically
5. JSON downloads instantly
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
