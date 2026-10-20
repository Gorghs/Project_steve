/**
 * Project Steve — Semantic Workflow Generator
 * 
 * Synthesizes realistic, production-grade n8n-style workflow graphs
 * from natural language user requirements.
 * 
 * Pure vanilla JavaScript — zero external dependencies, 100% CSP compliant.
 * Dual-environment support: works seamlessly in Browser and Node.js.
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    const exports = factory();
    root.WorkflowGenerator = exports;
    root.generateWorkflowFromPrompt = exports.generateWorkflowFromPrompt;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  // =========================================================================
  // 1. KEYWORD & INTENT TAXONOMY WITH SPECIFICITY WEIGHTS
  // =========================================================================

  const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
    'will', 'with', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'please',
    'want', 'need', 'like', 'when', 'then', 'into', 'onto', 'should', 'would',
    'can', 'could', 'every', 'each', 'all', 'any', 'some', 'about', 'just', 'so'
  ]);

  /**
   * Checks if text contains the keyword using whole-word boundary for single words,
   * or substring matching for multi-word phrases.
   */
  function matchKeyword(text, keyword) {
    if (!text || !keyword) return false;
    const kw = keyword.toLowerCase();
    if (kw.includes(' ')) {
      return text.includes(kw);
    }
    const escaped = kw.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(text);
  }

  const INTENT_RULES = {
    triggers: [
      {
        type: 'stripe',
        weights: [
          { kw: 'stripe', weight: 15 },
          { kw: 'payment', weight: 8 },
          { kw: 'charge', weight: 8 },
          { kw: 'subscription', weight: 8 },
          { kw: 'invoice', weight: 6 },
          { kw: 'checkout', weight: 6 },
          { kw: 'billing', weight: 6 }
        ],
        builder: (ctx) => ({
          type: 'stripe',
          category: 'trigger',
          name: 'Stripe Webhook',
          description: 'Captures real-time Stripe payment and subscription lifecycle events',
          paramsPreview: {
            event: ctx.hasAny(['subscription', 'sub']) ? 'customer.subscription.created' : 'payment_intent.succeeded',
            mode: 'live',
            signatureVerify: 'whsec_enabled'
          }
        })
      },
      {
        type: 'schedule',
        weights: [
          { kw: 'cron', weight: 15 },
          { kw: 'schedule', weight: 12 },
          { kw: 'daily', weight: 10 },
          { kw: 'hourly', weight: 10 },
          { kw: 'every morning', weight: 10 },
          { kw: 'every night', weight: 10 },
          { kw: 'weekly', weight: 10 },
          { kw: 'interval', weight: 8 },
          { kw: 'every', weight: 6 },
          { kw: 'periodic', weight: 6 }
        ],
        builder: (ctx) => {
          let cron = '0 9 * * *';
          let interval = 'Every day at 9:00 AM UTC';
          if (ctx.hasAny(['hourly', 'hour'])) {
            cron = '0 * * * *';
            interval = 'Every hour';
          } else if (ctx.hasAny(['weekly', 'week'])) {
            cron = '0 9 * * 1';
            interval = 'Every Monday at 9:00 AM UTC';
          } else if (ctx.hasAny(['midnight', 'nightly', 'night'])) {
            cron = '0 0 * * *';
            interval = 'Every night at 12:00 AM UTC';
          }
          return {
            type: 'schedule',
            category: 'trigger',
            name: 'Schedule Trigger',
            description: `Automated timer running on scheduled cron: ${interval}`,
            paramsPreview: {
              cronExpression: cron,
              timezone: 'UTC',
              intervalHuman: interval
            }
          };
        }
      },
      {
        type: 'github',
        weights: [
          { kw: 'github', weight: 15 },
          { kw: 'pull request', weight: 12 },
          { kw: 'pr', weight: 10 },
          { kw: 'git push', weight: 10 },
          { kw: 'commit', weight: 8 },
          { kw: 'repo', weight: 8 },
          { kw: 'repository', weight: 8 },
          { kw: 'release', weight: 8 }
        ],
        builder: (ctx) => ({
          type: 'github',
          category: 'trigger',
          name: 'GitHub Webhook',
          description: 'Triggers on repository events (commits, PRs, issues, or releases)',
          paramsPreview: {
            event: ctx.hasAny(['pr', 'pull request']) ? 'pull_request.opened' : ctx.hasAny(['issue']) ? 'issues.opened' : 'push',
            repository: 'org/production-repo',
            branches: 'main, release/*'
          }
        })
      },
      {
        type: 'gmail',
        weights: [
          { kw: 'new email', weight: 12 },
          { kw: 'email received', weight: 12 },
          { kw: 'incoming email', weight: 12 },
          { kw: 'unread email', weight: 10 },
          { kw: 'inbox', weight: 8 }
        ],
        builder: () => ({
          type: 'gmail',
          category: 'trigger',
          name: 'Gmail Trigger',
          description: 'Polls inbox for new incoming emails matching query filters',
          paramsPreview: {
            filter: 'label:UNREAD -category:promotions',
            markAsRead: true,
            downloadAttachments: false
          }
        })
      },
      {
        type: 'webhook',
        weights: [
          { kw: 'webhook', weight: 15 },
          { kw: 'http request', weight: 10 },
          { kw: 'incoming request', weight: 10 },
          { kw: 'post request', weight: 10 },
          { kw: 'endpoint', weight: 8 },
          { kw: 'callback', weight: 8 },
          { kw: 'api call', weight: 8 },
          { kw: 'log api', weight: 10 }
        ],
        builder: (ctx) => ({
          type: 'webhook',
          category: 'trigger',
          name: 'HTTP Webhook Trigger',
          description: 'Listens for incoming HTTP POST payloads with secure token verification',
          paramsPreview: {
            httpMethod: 'POST',
            path: `/webhooks/${ctx.primaryNoun || 'event-ingest'}`,
            auth: 'Bearer / Header Token'
          }
        })
      }
    ],

    transforms: [
      {
        type: 'openai',
        weights: [
          { kw: 'openai', weight: 15 },
          { kw: 'gpt', weight: 15 },
          { kw: 'claude', weight: 15 },
          { kw: 'llm', weight: 12 },
          { kw: 'ai', weight: 10 },
          { kw: 'sentiment', weight: 10 },
          { kw: 'summarize', weight: 9 },
          { kw: 'summary', weight: 8 },
          { kw: 'digest', weight: 7 },
          { kw: 'classify', weight: 8 }
        ],
        builder: (ctx) => ({
          type: 'openai',
          category: 'transform',
          name: ctx.hasAny(['summary', 'summarize', 'digest']) ? 'AI Executive Summary' : ctx.hasAny(['sentiment', 'classify']) ? 'AI Sentiment Classifier' : 'AI / LLM Analysis',
          description: 'Processes text through OpenAI LLM for extraction, synthesis and insights',
          paramsPreview: {
            model: 'gpt-4o',
            temperature: 0.2,
            prompt: `Analyze and structure payload: {{ $json.${ctx.primaryNoun || 'data'} }}`
          }
        })
      },
      {
        type: 'filter',
        weights: [
          { kw: 'filter', weight: 12 },
          { kw: 'validate', weight: 12 },
          { kw: 'check', weight: 8 },
          { kw: 'only if', weight: 10 },
          { kw: 'verify', weight: 8 },
          { kw: 'sanitize', weight: 8 },
          { kw: 'threshold', weight: 8 },
          { kw: 'severity', weight: 8 }
        ],
        builder: (ctx) => ({
          type: 'filter',
          category: 'transform',
          name: 'Data Validation & Filter',
          description: 'Enforces schema validation and filters non-qualifying records',
          paramsPreview: {
            condition: ctx.hasAny(['error', 'critical', 'severity']) ? 'severity IN ["ERROR", "CRITICAL"]' : 'data.status === "ACTIVE"',
            stopOnEmpty: true,
            dropInvalid: true
          }
        })
      },
      {
        type: 'code',
        weights: [
          { kw: 'transform', weight: 12 },
          { kw: 'normalize', weight: 10 },
          { kw: 'parse', weight: 10 },
          { kw: 'json', weight: 8 },
          { kw: 'format', weight: 8 },
          { kw: 'calculate', weight: 8 },
          { kw: 'aggregate', weight: 8 },
          { kw: 'map', weight: 8 }
        ],
        builder: (ctx) => ({
          type: 'code',
          category: 'transform',
          name: 'Transform & Normalize',
          description: 'Executes lightweight JavaScript data transformation and enrichment',
          paramsPreview: {
            mode: 'runOnceForEachItem',
            outputFields: 'id, timestamp, cleanPayload',
            sanitizeHTML: true
          }
        })
      }
    ],

    actions: [
      {
        type: 'discord',
        weights: [
          { kw: 'discord', weight: 15 },
          { kw: 'discord webhook', weight: 15 },
          { kw: 'discord server', weight: 12 }
        ],
        builder: () => ({
          type: 'discord',
          category: 'action',
          name: 'Discord Webhook',
          description: 'Posts formatted embed cards to Discord community channels',
          paramsPreview: {
            channelId: 'announcements',
            embedTitle: 'Automated Event Update',
            embedColor: '#5865f2'
          }
        })
      },
      {
        type: 'airtable',
        weights: [
          { kw: 'airtable', weight: 15 },
          { kw: 'base', weight: 6 },
          { kw: 'spreadsheet', weight: 6 }
        ],
        builder: () => ({
          type: 'airtable',
          category: 'action',
          name: 'Airtable Create Record',
          description: 'Synchronizes structured entities into Airtable Base',
          paramsPreview: {
            baseId: 'appBaseOps',
            table: 'Tasks',
            typecast: true
          }
        })
      },
      {
        type: 'slack',
        weights: [
          { kw: 'slack', weight: 15 },
          { kw: 'channel', weight: 8 },
          { kw: 'notify slack', weight: 12 },
          { kw: 'alert slack', weight: 12 },
          { kw: 'slack alert', weight: 12 },
          { kw: 'log to slack', weight: 12 }
        ],
        builder: (ctx) => {
          const isError = ctx.hasAny(['error', 'fail', 'bug', 'critical']);
          return {
            type: 'slack',
            category: 'action',
            name: isError ? 'Slack Incident Alert' : 'Slack Notification',
            description: 'Dispatches real-time structured message to Slack channel',
            paramsPreview: {
              channel: isError ? '#incident-alerts' : '#ops-notifications',
              text: '🔔 Workflow Event: {{ $json.summary || "Action Completed" }}',
              color: isError ? '#ef4444' : '#10b981'
            }
          };
        }
      },
      {
        type: 'postgres',
        weights: [
          { kw: 'postgres', weight: 15 },
          { kw: 'postgresql', weight: 15 },
          { kw: 'sql', weight: 8 },
          { kw: 'database', weight: 8 },
          { kw: 'db', weight: 8 },
          { kw: 'table', weight: 5 },
          { kw: 'save to db', weight: 10 },
          { kw: 'store in db', weight: 10 },
          { kw: 'upsert', weight: 8 }
        ],
        builder: (ctx) => {
          const tableName = ctx.hasAny(['payment', 'stripe']) ? 'payments' : ctx.hasAny(['user', 'customer']) ? 'users' : ctx.hasAny(['order', 'sale']) ? 'orders' : 'audit_logs';
          return {
            type: 'postgres',
            category: 'action',
            name: 'PostgreSQL Upsert',
            description: `Persists validated records into PostgreSQL table [${tableName}]`,
            paramsPreview: {
              table: tableName,
              operation: 'upsert',
              conflictKey: 'external_id'
            }
          };
        }
      },
      {
        type: 'mysql',
        weights: [
          { kw: 'mysql', weight: 15 },
          { kw: 'mariadb', weight: 15 }
        ],
        builder: () => ({
          type: 'mysql',
          category: 'action',
          name: 'MySQL Insert',
          description: 'Executes high-throughput SQL write transaction',
          paramsPreview: {
            table: 'records',
            operation: 'insert',
            timeout: '15000ms'
          }
        })
      },
      {
        type: 'gmail',
        weights: [
          { kw: 'email me', weight: 12 },
          { kw: 'send email', weight: 12 },
          { kw: 'email digest', weight: 12 },
          { kw: 'send gmail', weight: 12 },
          { kw: 'email', weight: 6 },
          { kw: 'mail', weight: 5 }
        ],
        builder: (ctx) => ({
          type: 'gmail',
          category: 'action',
          name: 'Send Gmail Notification',
          description: 'Sends formatted email report with dynamic HTML templating',
          paramsPreview: {
            to: 'team@company.internal',
            subject: ctx.hasAny(['digest', 'sales']) ? '📊 Automated Daily Digest Briefing' : '🚀 Workflow Notification: Task Completed',
            format: 'html'
          }
        })
      },
      {
        type: 'http',
        weights: [
          { kw: 'http request', weight: 12 },
          { kw: 'post to', weight: 10 },
          { kw: 'external api', weight: 10 },
          { kw: 'dispatch webhook', weight: 10 },
          { kw: 'forward', weight: 8 },
          { kw: 'api endpoint', weight: 8 }
        ],
        builder: () => ({
          type: 'http',
          category: 'action',
          name: 'HTTP Request Dispatcher',
          description: 'Calls external REST API endpoint with retry backoff',
          paramsPreview: {
            method: 'POST',
            url: 'https://api.external-service.com/v1/sync',
            retryOnFail: true
          }
        })
      }
    ]
  };

  // =========================================================================
  // 2. TEXT ANALYSIS & CONTEXT EXTRACTION
  // =========================================================================

  function tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9_\-\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
  }

  function createContext(rawPrompt) {
    const promptLower = (rawPrompt || '').toLowerCase();
    const tokens = tokenize(rawPrompt);

    const hasWord = (word) => matchKeyword(promptLower, word);
    const hasAny = (list) => list.some((k) => matchKeyword(promptLower, k));

    // Calculate rule match score
    const scoreRule = (rule) => {
      let score = 0;
      for (const item of rule.weights) {
        if (matchKeyword(promptLower, item.kw)) {
          score += item.weight;
        }
      }
      return score;
    };

    // Extract dominant topic/noun for contextual parameter naming
    const nouns = tokens.filter(
      (t) => !['sync', 'send', 'log', 'track', 'create', 'update', 'run', 'get', 'post', 'fetch', 'notify', 'alert'].includes(t)
    );
    const primaryNoun = nouns[0] || 'payload';
    const secondaryNoun = nouns[1] || 'item';

    return {
      rawPrompt,
      promptLower,
      tokens,
      primaryNoun,
      secondaryNoun,
      hasWord,
      hasAny,
      scoreRule
    };
  }

  function titleCase(str) {
    if (!str) return '';
    return str
      .split(/[-_\s]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  // =========================================================================
  // 3. SEMANTIC WORKFLOW SYNTHESIS
  // =========================================================================

  /**
   * Synthesizes an n8n-style workflow graph from user prompt text.
   * 
   * @param {string} promptText - User requirements prompt
   * @param {object} [options] - Optional layout offsets
   * @returns {object} Formatted workflow object
   */
  function generateWorkflowFromPrompt(promptText, options = {}) {
    const rawPrompt = (promptText || '').trim();
    const ctx = createContext(rawPrompt);

    // 1. Resolve Trigger Node (scored by match strength)
    let triggerNode = null;
    const scoredTriggers = INTENT_RULES.triggers
      .map((rule) => ({ rule, score: ctx.scoreRule(rule) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scoredTriggers.length > 0) {
      triggerNode = scoredTriggers[0].rule.builder(ctx);
    } else {
      // Default trigger if none matched
      if (ctx.hasAny(['timer', 'daily', 'hourly', 'every', 'interval', 'schedule', 'nightly'])) {
        triggerNode = INTENT_RULES.triggers.find((r) => r.type === 'schedule').builder(ctx);
      } else if (ctx.hasAny(['email', 'mail', 'digest']) && !ctx.hasAny(['send email', 'notify'])) {
        triggerNode = INTENT_RULES.triggers.find((r) => r.type === 'gmail').builder(ctx);
      } else {
        // Intelligent Custom Trigger
        const nounTitle = titleCase(ctx.primaryNoun);
        triggerNode = {
          type: 'webhook',
          category: 'trigger',
          name: `${nounTitle} Event Trigger`,
          description: `Ingests incoming events and webhooks related to ${ctx.primaryNoun}`,
          paramsPreview: {
            httpMethod: 'POST',
            path: `/v1/events/${ctx.primaryNoun.replace(/[^a-z0-9_-]/g, '')}`,
            responseMode: 'onReceived'
          }
        };
      }
    }

    // 2. Resolve Intermediate Transforms / Processing Nodes
    const transformNodes = [];

    // Check if AI is requested or implied (e.g. "summary", "digest", "classify", "analyze", "ai", "smart")
    if (ctx.hasAny(['ai', 'llm', 'gpt', 'openai', 'summary', 'summarize', 'sentiment', 'classify', 'digest', 'smart', 'analyze'])) {
      const aiRule = INTENT_RULES.transforms.find((r) => r.type === 'openai');
      transformNodes.push(aiRule.builder(ctx));
    }

    // Check if Filter / Validation is requested or beneficial
    if (ctx.hasAny(['filter', 'validate', 'check', 'only if', 'condition', 'verify', 'sanitize', 'error', 'clean']) || transformNodes.length === 0) {
      const filterRule = INTENT_RULES.transforms.find((r) => r.type === 'filter');
      transformNodes.push(filterRule.builder(ctx));
    }

    // Check if Code / Set / Data Mapping is requested or needed
    if (ctx.hasAny(['transform', 'parse', 'json', 'format', 'normalize', 'map', 'restructure', 'convert', 'extract']) || (transformNodes.length === 1 && !ctx.hasAny(['ai', 'llm']))) {
      transformNodes.push({
        type: 'code',
        category: 'transform',
        name: 'Transform & Normalize Payload',
        description: `Formats and shapes ${ctx.primaryNoun} payload for downstream systems`,
        paramsPreview: {
          mappingMode: 'autoStructure',
          timestamp: 'ISO8601',
          sourceField: `item.${ctx.primaryNoun}`
        }
      });
    }

    // Cap at 2 transforms to maintain clean layout
    if (transformNodes.length > 2) {
      transformNodes.length = 2;
    }

    // 3. Resolve Destination / Action Nodes (scored by match strength)
    const scoredActions = INTENT_RULES.actions
      .map((rule) => ({ rule, score: ctx.scoreRule(rule) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    const actionNodes = [];
    const usedActionTypes = new Set();

    for (const item of scoredActions) {
      const rule = item.rule;
      // Prevent duplicating trigger as action unless user explicitly mentioned sending/storing it
      if (rule.type === triggerNode.type && !ctx.hasAny(['send', 'post to', 'notify', 'insert', 'save', 'store'])) {
        continue;
      }
      if (!usedActionTypes.has(rule.type)) {
        usedActionTypes.add(rule.type);
        actionNodes.push(rule.builder(ctx));
      }
      if (actionNodes.length >= 2) break;
    }

    // Fallback actions if none matched
    if (actionNodes.length === 0) {
      if (ctx.hasAny(['sync', 'store', 'save', 'record', 'keep', 'database', 'archive'])) {
        actionNodes.push(INTENT_RULES.actions.find((r) => r.type === 'postgres').builder(ctx));
      } else if (ctx.hasAny(['alert', 'notify', 'tell', 'warn', 'ping'])) {
        actionNodes.push(INTENT_RULES.actions.find((r) => r.type === 'slack').builder(ctx));
      } else {
        // Universal default: Database Upsert + Slack Confirmation
        const nounTitle = titleCase(ctx.primaryNoun);
        actionNodes.push({
          type: 'postgres',
          category: 'action',
          name: `Store ${nounTitle} Record`,
          description: `Persists processed ${ctx.primaryNoun} payload into primary database`,
          paramsPreview: {
            table: `${ctx.primaryNoun}_records`,
            operation: 'upsert',
            autoRetry: true
          }
        });
        actionNodes.push({
          type: 'slack',
          category: 'action',
          name: 'Slack Status Alert',
          description: 'Broadcasts sync confirmation message to notifications channel',
          paramsPreview: {
            channel: '#pipeline-activity',
            message: `Completed processing for ${nounTitle} event`
          }
        });
      }
    }

    if (actionNodes.length > 2) {
      actionNodes.length = 2;
    }

    // 4. Resolve Error Handler Branch
    const hasSlackAction = actionNodes.some((a) => a.type === 'slack');
    const errorNode = {
      type: hasSlackAction ? 'slack' : 'error',
      category: 'error',
      name: hasSlackAction ? 'Incident Alert (Slack)' : 'Error Handler & Retry',
      description: 'Catches pipeline runtime exceptions, triggers retries, and notifies on-call engineering',
      paramsPreview: {
        onError: 'continueErrorOutput',
        alertChannel: '#dev-ops-incidents',
        autoRetryBackoff: 'exponential'
      }
    };

    // =========================================================================
    // 4. GRID LAYOUT & COORDINATE PLACEMENT
    // =========================================================================

    const pipelineSequence = [triggerNode, ...transformNodes, ...actionNodes];

    const startX = options.startX || 60;
    const startY = options.startY || 180;
    const stepX = options.stepX || 260;
    const errorY = options.errorY || 360;

    const nodes = [];
    const connections = [];

    // Layout main pipeline nodes left-to-right
    pipelineSequence.forEach((nodeData, idx) => {
      const nodeId = `node-${idx + 1}`;
      nodes.push({
        id: nodeId,
        name: nodeData.name,
        type: nodeData.type,
        category: nodeData.category,
        description: nodeData.description,
        paramsPreview: nodeData.paramsPreview,
        x: startX + idx * stepX,
        y: startY
      });

      if (idx > 0) {
        connections.push({
          from: `node-${idx}`,
          to: nodeId,
          type: 'main'
        });
      }
    });

    // Layout Error Node
    // Attach error branch to the node being guarded (last transform or first action)
    const errorSourceIdx = Math.min(Math.max(1, transformNodes.length), nodes.length - 1);
    const errorSourceNode = nodes[errorSourceIdx] || nodes[0];
    const errorNodeId = `node-err-${nodes.length + 1}`;

    nodes.push({
      id: errorNodeId,
      name: errorNode.name,
      type: errorNode.type,
      category: 'error',
      description: errorNode.description,
      paramsPreview: errorNode.paramsPreview,
      x: errorSourceNode.x,
      y: errorY
    });

    connections.push({
      from: errorSourceNode.id,
      to: errorNodeId,
      type: 'error'
    });

    const workflowTitle = generateWorkflowTitle(rawPrompt, triggerNode, actionNodes);
    const workflowDescription = generateWorkflowSummary(rawPrompt, nodes);

    const result = {
      name: workflowTitle,
      description: workflowDescription,
      rawPrompt: rawPrompt,
      createdAt: new Date().toISOString(),
      nodes: nodes,
      connections: connections,
      stats: {
        nodeCount: nodes.length,
        triggers: 1,
        transforms: transformNodes.length,
        actions: actionNodes.length,
        errors: 1
      },
      toN8nJSON: function () {
        return convertToN8nJSON(this);
      }
    };

    return result;
  }

  // =========================================================================
  // 5. METADATA HELPERS
  // =========================================================================

  function generateWorkflowTitle(prompt, trigger, actions) {
    if (!prompt || prompt.trim().length === 0) {
      return 'Automated Event Processing Pipeline';
    }

    const trimmed = prompt.trim();
    if (trimmed.length <= 48 && !trimmed.includes('\n')) {
      return titleCase(trimmed);
    }

    const triggerName = trigger.name.replace(/ Trigger| Webhook/g, '');
    const actionNames = actions.map((a) => a.name.replace(/ Insert| Upsert| Notification| Record/g, '')).join(' & ');
    return `${triggerName} → ${actionNames || 'Execution Pipeline'}`;
  }

  function generateWorkflowSummary(prompt, nodes) {
    const nodeNames = nodes.filter((n) => n.category !== 'error').map((n) => n.name).join(' → ');
    return `Production n8n automation: [${nodeNames}]. Includes automated error interception and incident dispatch.`;
  }

  // =========================================================================
  // 6. NATIVE n8n JSON COMPATIBILITY CONVERTER
  // =========================================================================

  function convertToN8nJSON(workflow) {
    const typeMapping = {
      stripe: 'n8n-nodes-base.stripeTrigger',
      webhook: 'n8n-nodes-base.webhook',
      schedule: 'n8n-nodes-base.scheduleTrigger',
      github: 'n8n-nodes-base.githubTrigger',
      gmail: 'n8n-nodes-base.gmail',
      postgres: 'n8n-nodes-base.postgres',
      mysql: 'n8n-nodes-base.mySql',
      slack: 'n8n-nodes-base.slack',
      discord: 'n8n-nodes-base.discord',
      airtable: 'n8n-nodes-base.airtable',
      http: 'n8n-nodes-base.httpRequest',
      openai: 'n8n-nodes-base.openAi',
      code: 'n8n-nodes-base.code',
      filter: 'n8n-nodes-base.if',
      error: 'n8n-nodes-base.errorTrigger'
    };

    const n8nNodes = workflow.nodes.map((node) => ({
      id: node.id,
      name: node.name,
      type: typeMapping[node.type] || 'n8n-nodes-base.function',
      typeVersion: 1,
      position: [node.x, node.y],
      parameters: Object.assign({}, node.paramsPreview)
    }));

    const n8nConnections = {};
    workflow.connections.forEach((conn) => {
      const sourceNode = workflow.nodes.find((n) => n.id === conn.from);
      const targetNode = workflow.nodes.find((n) => n.id === conn.to);
      if (!sourceNode || !targetNode) return;

      const connKey = sourceNode.name;
      if (!n8nConnections[connKey]) {
        n8nConnections[connKey] = { main: [[]] };
      }

      n8nConnections[connKey].main[0].push({
        node: targetNode.name,
        type: conn.type === 'error' ? 'error' : 'main',
        index: 0
      });
    });

    return {
      name: workflow.name,
      nodes: n8nNodes,
      connections: n8nConnections,
      active: false,
      settings: {
        executionOrder: 'v1'
      },
      meta: {
        templateCredsSetupCompleted: true,
        generatedBy: 'Project Steve Agentic Builder'
      }
    };
  }

  // =========================================================================
  // 7. PRE-BUILT REFERENCE TEMPLATES
  // =========================================================================

  const SAMPLE_TEMPLATES = {
    stripeToPostgres: 'Sync Stripe payments to Postgres',
    dailySalesDigest: 'Email me a daily sales digest',
    apiErrorAlerts: 'Log API errors to Slack',
    githubDiscordReview: 'GitHub PR created notify Discord and create Airtable task'
  };

  return {
    generateWorkflowFromPrompt,
    convertToN8nJSON,
    createContext,
    matchKeyword,
    SAMPLE_TEMPLATES
  };
});
