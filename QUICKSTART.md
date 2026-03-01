# Getting Started - Project Steve

## Prerequisites

Make sure you have **Node.js** installed (version 14 or higher).

Check your Node.js version:
```bash
node --version
npm --version
```

## Installation Steps

### 1. Install Dependencies
Navigate to the project folder and run:
```bash
npm install
```

This installs all required packages:
- **express** - Web server framework
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment configuration
- **axios** - HTTP requests
- **multer** - File upload handling

### 2. Configure Environment (Optional)
Edit `.env` file to customize settings:
```
PORT=3000              # Change the server port if needed
NODE_ENV=development   # Keep as development for now
```

### 3. Start the Server
```bash
npm start
```

You should see:
```
🚀 Project Steve - Premium AI Workflow Engine Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Dashboard: http://localhost:3000
🔌 API: http://localhost:3000/api
💚 Health: http://localhost:3000/api/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Open in Browser
Visit: **http://localhost:3000**

You'll see the beautiful interactive dashboard!

## How to Use

1. **Describe Your Workflow**
   - Enter your automation requirements in natural language
   - Example: "Create a workflow that monitors Stripe webhooks, saves payments to PostgreSQL, and sends confirmation emails"

2. **Generate Workflow**
   - Click "⚡ Generate Workflow" button
   - The backend processes through three phases:
     - 🏗️ **Build Captain** - Generates architecture
     - ✅ **QA Compliance** - Validates structure
     - 🛡️ **Security Architect** - Hardens security

3. **Download & Import**
   - The JSON file downloads automatically
   - Go to your n8n instance
   - Create new workflow → Import from file
   - Upload the downloaded JSON
   - Deploy!

## API Testing

Test the API endpoints using curl or Postman:

### Test Health
```bash
curl http://localhost:3000/api/health
```

### Generate a Workflow
```bash
curl -X POST http://localhost:3000/api/generate-workflow \
  -H "Content-Type: application/json" \
  -d '{"requirements": "Create webhook listener that saves to database"}'
```

### Download Generated Workflow
```bash
curl http://localhost:3000/api/workflow/{workflowId}/export -o workflow.json
```

## Troubleshooting

### Port Already In Use
```bash
# Use a different port
PORT=3001 npm start
```

### npm install fails
```bash
# Clear npm cache
npm cache clean --force
npm install
```

### Server Won't Start
- Check if Node.js is installed: `node --version`
- Check for error messages in the console
- Make sure all files are in the correct directory

## Project Structure

```
.
├── index.html              # Frontend Dashboard UI
├── server.js               # Express Backend Server
├── package.json            # Node dependencies
├── .env                    # Configuration
├── .gitignore              # Git ignore rules
├── prompts/                # AI Agent Prompts
├── samples/                # Example Workflows
├── templates/              # Workflow Templates
└── workflows/              # Generated Workflows
```

## Frontend & Backend Connection

✅ **Frontend** (`index.html`) sends requests to **Backend** (`server.js`)
✅ **Backend** processes through three AI phases
✅ **Result** is sent back to frontend and auto-downloaded

The connection is seamless - just enter your requirements and let the AI do the work!

## Next Steps

- Explore the dashboard features
- Generate your first workflow
- Import it into n8n
- Customize and deploy

Need help? Check the README.MD or reach out on GitHub!
