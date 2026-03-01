# Project Steve

Enterprise-grade AI workflow automation platform that transforms business requirements into production-ready n8n workflows using advanced intelligent agents.

## 🚀 Quick Start

### Installation & Running

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Platform**
   ```bash
   npm start
   ```

3. **Access Dashboard**
   ```
   http://localhost:3000
   ```

Premium AI automation, ready in seconds.

## ✨ Enterprise Features

- **🤖 Intelligent Architecture** - Advanced NLP transforms requirements into sophisticated workflows
- **🛡️ Military-Grade Security** - Enterprise-level scanning with zero-trust principles
- **✅ Compliance Automation** - Automated quality gates for enterprise standards
- **⚡ Unmatched Performance** - 30 seconds from concept to deployment-ready code
- **🔐 Zero Secrets** - Enterprise credential abstraction by design
- **🎯 Deterministic Flows** - Native-only architecture, zero code injection
- **📡 Full Backend Integration** - Connected Express API with three-phase processing

## 📁 Project Structure

```
├── index.html                  # Premium UI Dashboard
├── server.js                   # Enterprise API Server
├── package.json                # Dependencies
├── .env                        # Configuration
├── prompts/                    # AI Agent System Prompts
│   ├── n8n_Build_Captain.md   # Architecture Generation
│   ├── n8n_QA_Compliance.md   # Quality Assurance
│   └── n8n_Security_Architect.md # Security Hardening
├── samples/                    # Reference Workflows
└── workflows/                  # Generated Workflows
```

## 💡 AI Agent Processing

### Three-Phase Enterprise Pipeline

1. **Build Phase** 🏗️
   - Build Captain analyzes business requirements
   - Generates multi-node workflow architecture
   - Produces n8n-native JSON structure

2. **QA Phase** ✅
   - Validates against enterprise standards
   - Enforces naming conventions
   - Verifies error handling and resilience
   - Ensures deterministic logic

3. **Security Phase** 🛡️
   - Scans for security vulnerabilities
   - Enforces SSRF prevention
   - Validates authentication mechanisms
   - Applies rate limiting & timeouts

### API Endpoints

```
POST   /api/generate-workflow      # Generate workflow
GET    /api/workflow/:id           # Retrieve workflow
GET    /api/workflow/:id/export    # Download JSON
GET    /api/workflows              # List all workflows
GET    /api/health                 # Health check
```

## 🎯 Usage

1. Open `http://localhost:3000`
2. Describe your automation requirements
3. Click "Generate Workflow"
4. Three AI agents process in parallel:
   - Build Captain → Architecture
   - QA Compliance → Validation
   - Security Architect → Hardening
5. Download JSON automatically
6. Import into n8n

## 📊 Enterprise Outputs

Every generated workflow includes:
- ✅ Production-ready error handling
- ✅ Native n8n node architecture
- ✅ No hardcoded credentials
- ✅ SSRF vulnerability protection
- ✅ Enforced authentication
- ✅ Rate limiting & timeouts
- ✅ Deterministic logic flows
- ✅ Enterprise compliance

## 🔧 Configuration

Edit `.env`:
```
PORT=3000              # Server port
NODE_ENV=development   # Environment
```



---

**Project Steve** — Enterprise AI Workflow Platform | Crafted with precision by Karthick
