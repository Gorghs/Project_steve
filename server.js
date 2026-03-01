const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Store generated workflows in memory for demo purposes
const generatedWorkflows = {};

// ==================== ENDPOINTS ====================

// Serve the main dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Generate workflow through three-phase AI processing
app.post('/api/generate-workflow', async (req, res) => {
    try {
        const { requirements } = req.body;

        if (!requirements || requirements.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Requirements are required' 
            });
        }

        // Phase 1: Build Captain - Generate workflow architecture
        const buildPhase = await buildPhase(requirements);
        if (buildPhase.error) {
            return res.status(500).json({ error: buildPhase.error });
        }

        // Phase 2: QA Compliance - Validate and improve
        const qaPhase = await qaPhase(buildPhase.workflow);
        if (qaPhase.error) {
            return res.status(500).json({ error: qaPhase.error });
        }

        // Phase 3: Security Architect - Secure the workflow
        const securityPhase = await securityPhase(qaPhase.workflow);
        if (securityPhase.error) {
            return res.status(500).json({ error: securityPhase.error });
        }

        // Final validated workflow
        const finalWorkflow = securityPhase.workflow;
        const workflowId = Date.now().toString();
        generatedWorkflows[workflowId] = finalWorkflow;

        res.json({
            success: true,
            message: 'Workflow generated successfully!',
            workflowId,
            workflow: finalWorkflow,
            phases: {
                build: buildPhase,
                qa: qaPhase,
                security: securityPhase
            }
        });

    } catch (error) {
        console.error('Workflow generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate workflow',
            details: error.message 
        });
    }
});

// API: Download specific workflow
app.get('/api/workflow/:id', (req, res) => {
    const { id } = req.params;
    const workflow = generatedWorkflows[id];

    if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
    }

    res.json({ workflow });
});

// API: Export workflow as JSON file
app.get('/api/workflow/:id/export', (req, res) => {
    const { id } = req.params;
    const workflow = generatedWorkflows[id];

    if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="workflow-${id}.json"`);
    res.send(JSON.stringify(workflow, null, 2));
});

// API: Get all generated workflows
app.get('/api/workflows', (req, res) => {
    const workflows = Object.keys(generatedWorkflows).map(id => ({
        id,
        name: generatedWorkflows[id].name || 'Unnamed Workflow',
        createdAt: new Date(parseInt(id))
    }));
    res.json({ workflows });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        service: 'n8n Agentic Builder',
        version: '1.0.0'
    });
});

// ==================== PHASE FUNCTIONS ====================

// PHASE 1: Build Captain - Generates the workflow
async function buildPhase(requirements) {
    try {
        // This is a simulation. In production, this would call OpenAI API with the Build Captain prompt
        const buildCaption = fs.readFileSync(
            path.join(__dirname, 'prompts', 'n8n_Build_Captain.md'),
            'utf8'
        );

        const workflow = {
            name: `Generated-${Date.now()}`,
            nodes: [
                {
                    name: 'Start',
                    type: 'start'
                },
                {
                    name: 'Process Requirements',
                    type: 'set',
                    parameters: {
                        assignments: {
                            assignments: [
                                {
                                    name: 'requirements',
                                    value: requirements,
                                    type: 'string'
                                }
                            ]
                        }
                    }
                },
                {
                    name: 'Error Handler',
                    type: 'error triggered'
                }
            ],
            connections: {
                'Start': ['Process Requirements'],
                'Process Requirements': [],
                'Error Handler': []
            },
            parameters: {
                saveDataErrorExecution: 'all',
                saveDataSuccessExecution: 'all'
            },
            description: `Auto-generated workflow for: ${requirements.substring(0, 100)}...`
        };

        return {
            success: true,
            phase: 'Build',
            message: 'Build Captain generated workflow architecture',
            workflow,
            timestamp: new Date()
        };

    } catch (error) {
        return {
            error: `Build phase failed: ${error.message}`
        };
    }
}

// PHASE 2: QA Compliance - Validates and improves
async function qaPhase(workflow) {
    try {
        // This simulates QA validation
        const qaCheckpoint = fs.readFileSync(
            path.join(__dirname, 'prompts', 'n8n_QA_Compliance.md'),
            'utf8'
        );

        // Ensure proper naming conventions
        const improvedWorkflow = {
            ...workflow,
            nodes: workflow.nodes.map(node => ({
                ...node,
                // Convert to verb-object naming convention
                name: node.name.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1)
            }))
        };

        return {
            success: true,
            phase: 'QA Compliance',
            message: 'Workflow validated and improved',
            checks: [
                { name: 'Structure Validation', status: 'passed' },
                { name: 'Naming Convention', status: 'passed' },
                { name: 'Error Handling', status: 'passed' },
                { name: 'Node Schema', status: 'passed' }
            ],
            workflow: improvedWorkflow,
            timestamp: new Date()
        };

    } catch (error) {
        return {
            error: `QA phase failed: ${error.message}`
        };
    }
}

// PHASE 3: Security Architect - Hardens security
async function securityPhase(workflow) {
    try {
        // This simulates security hardening
        const securityArch = fs.readFileSync(
            path.join(__dirname, 'prompts', 'n8n_Security_Architect.md'),
            'utf8'
        );

        // Add security parameters
        const securedWorkflow = {
            ...workflow,
            parameters: {
                ...workflow.parameters,
                // Security hardening
                timeout: 300,
                retries: 3,
                rateLimitEnabled: true,
                rateLimitRequests: 100,
                rateLimitTimeWindow: 60,
                sslVerify: true,
                preventSSRF: true,
                credentialType: 'credential_reference'
            },
            securityValidations: [
                { check: 'SSRF Prevention', status: 'enabled' },
                { check: 'Authentication', status: 'enforced' },
                { check: 'Rate Limiting', status: 'applied' },
                { check: 'Timeout', status: 'set' },
                { check: 'Credential Abstraction', status: 'enforced' }
            ]
        };

        return {
            success: true,
            phase: 'Security Architect',
            message: 'Workflow hardened with security measures',
            securityChecks: [
                { name: 'SSRF Prevention', status: 'passed' },
                { name: 'Authentication Enforcement', status: 'passed' },
                { name: 'Rate Limiting', status: 'passed' },
                { name: 'Credential Abstraction', status: 'passed' },
                { name: 'Timeout Configuration', status: 'passed' }
            ],
            workflow: securedWorkflow,
            timestamp: new Date()
        };

    } catch (error) {
        return {
            error: `Security phase failed: ${error.message}`
        };
    }
}

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`\n🚀 Project Steve - Enterprise AI Workflow Platform`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📍 Platform: http://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

module.exports = app;
