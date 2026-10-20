/**
 * Project Steve — Interactive n8n-Style Workflow Canvas Engine
 * Pure vanilla JavaScript · Zero external libraries · 100% CSP compliant
 */

(function (global) {
  'use strict';

  const raf = (typeof requestAnimationFrame === 'function')
    ? requestAnimationFrame
    : (typeof window !== 'undefined' && window.requestAnimationFrame)
      ? window.requestAnimationFrame.bind(window)
      : (cb) => setTimeout(cb, 16);

  // SVG Icons for Node Categories and Types
  const ICONS = {
    webhook: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    http: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    set: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
    respond: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
    slack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="13" y="2" width="3" height="8" rx="1.5"/><path d="M19 8.5a2.5 2.5 0 0 1-5 0V7a1 1 0 0 1 1-1h1.5a2.5 2.5 0 0 1 2.5 2.5z"/><rect x="8" y="14" width="3" height="8" rx="1.5"/><path d="M5 15.5A2.5 2.5 0 0 1 10 15.5V17a1 1 0 0 1-1 1H7.5A2.5 2.5 0 0 1 5 15.5z"/><rect x="14" y="13" width="8" height="3" rx="1.5"/><path d="M15.5 19a2.5 2.5 0 0 1 0-5H17a1 1 0 0 1 1 1v1.5a2.5 2.5 0 0 1-2.5 2.5z"/><rect x="2" y="8" width="8" height="3" rx="1.5"/><path d="M8.5 5A2.5 2.5 0 0 1 8.5 10H7a1 1 0 0 1-1-1V7.5A2.5 2.5 0 0 1 8.5 5z"/></svg>`,
    schedule: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    branch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
    default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>`
  };

  // Node type classification and color styling
  const NODE_CONFIGS = {
    webhook: {
      category: 'Trigger',
      icon: ICONS.webhook,
      bg: '#ffeedb',
      color: '#ea580c'
    },
    httprequest: {
      category: 'Network',
      icon: ICONS.http,
      bg: '#e0f2fe',
      color: '#0284c7'
    },
    set: {
      category: 'Transform',
      icon: ICONS.set,
      bg: '#dcfce7',
      color: '#16a34a'
    },
    respondtowebhook: {
      category: 'Output',
      icon: ICONS.respond,
      bg: '#f3e8ff',
      color: '#9333ea'
    },
    errortrigger: {
      category: 'Error Handler',
      icon: ICONS.error,
      bg: '#fee2e2',
      color: '#dc2626'
    },
    emailsend: {
      category: 'Notification',
      icon: ICONS.email,
      bg: '#ffedd5',
      color: '#c2410c'
    },
    code: {
      category: 'Code',
      icon: ICONS.code,
      bg: '#fef3c7',
      color: '#d97706'
    },
    postgres: {
      category: 'Database',
      icon: ICONS.database,
      bg: '#e0e7ff',
      color: '#4f46e5'
    },
    slack: {
      category: 'Chat',
      icon: ICONS.slack,
      bg: '#fce7f3',
      color: '#db2777'
    },
    scheduletrigger: {
      category: 'Schedule',
      icon: ICONS.schedule,
      bg: '#ccfbf1',
      color: '#0d9488'
    },
    if: {
      category: 'Routing',
      icon: ICONS.branch,
      bg: '#fef08a',
      color: '#ca8a04'
    }
  };

  function getNodeMeta(type, node) {
    if (global.WorkflowIcons && typeof global.WorkflowIcons.getNodeMeta === 'function') {
      const nodeObj = (node && typeof node === 'object') ? node : (typeof type === 'object' ? type : { type: type });
      const rich = global.WorkflowIcons.getNodeMeta(nodeObj);
      if (rich) {
        return {
          category: rich.badge || rich.subtitle || 'Action',
          icon: rich.iconSvg,
          bg: rich.bgColor,
          color: rich.color
        };
      }
    }
    if (!type) return { category: 'Action', icon: ICONS.default, bg: '#f1f5f9', color: '#475569' };
    const lower = String(type).toLowerCase().replace(/n8n-nodes-base\./, '');
    for (const key of Object.keys(NODE_CONFIGS)) {
      if (lower.includes(key)) {
        return NODE_CONFIGS[key];
      }
    }
    return { category: 'Action', icon: ICONS.default, bg: '#f1f5f9', color: '#475569' };
  }

  function cleanTypeName(type) {
    if (!type) return 'Node';
    return type.replace(/^n8n-nodes-base\./, '');
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return String(str ?? '');
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Generates realistic mock output preview based on node type
   */
  function generateMockExecutionData(node) {
    const type = (node.type || '').toLowerCase();
    const params = node.parameters || {};

    if (type.includes('webhook')) {
      return {
        headers: {
          host: "api.project-steve.internal",
          "user-agent": "Stripe/1.0 (+https://stripe.com/docs/webhooks)",
          "content-type": "application/json",
          "x-request-id": "req_" + Math.random().toString(36).substring(2, 10)
        },
        params: {},
        query: {},
        body: {
          id: "evt_3N8n001Steve99",
          object: "event",
          type: "payment_intent.succeeded",
          data: {
            amount: 4900,
            currency: "usd",
            customer: "cus_R3v89qLz",
            status: "succeeded"
          }
        }
      };
    }

    if (type.includes('httprequest')) {
      return {
        statusCode: 200,
        statusMessage: "OK",
        headers: {
          "content-type": "application/json; charset=utf-8",
          "x-ratelimit-remaining": "99"
        },
        data: {
          id: "res_8829104",
          total: 1,
          items: [
            {
              id: "item_42",
              name: "Steve Pro Automation Plan",
              status: "active",
              synced_at: new Date().toISOString()
            }
          ]
        }
      };
    }

    if (type.includes('set')) {
      const stringVals = params.values?.string || [];
      const numVals = params.values?.number || [];
      const out = {};
      stringVals.forEach(v => { out[v.name || 'field'] = "sample_value"; });
      numVals.forEach(v => { out[v.name || 'count'] = 42; });
      if (Object.keys(out).length === 0) {
        out.resourceId = "res_8829104";
        out.status = "processed";
      }
      return out;
    }

    if (type.includes('respond')) {
      return {
        responseCode: params.responseCode || 200,
        responseSent: true,
        body: { status: "success", delivered: true }
      };
    }

    if (type.includes('errortrigger')) {
      return {
        execution: {
          id: "exec_err_" + Math.floor(Math.random() * 90000 + 10000),
          mode: "error-handler",
          timestamp: new Date().toISOString()
        },
        workflow: {
          id: "wf_current",
          name: "Golden Sample Pipeline"
        },
        error: {
          message: "Connection reset by peer at upstream service",
          name: "NodeApiError",
          node: "fetch-resource"
        }
      };
    }

    if (type.includes('email')) {
      return {
        to: params.toEmail || "ops@example.com",
        from: params.fromEmail || "alerts@example.com",
        subject: params.subject || "Workflow Notification",
        messageId: `<steve-${Date.now()}@internal.mail>`,
        accepted: [params.toEmail || "ops@example.com"],
        status: "sent"
      };
    }

    return {
      node: node.name,
      type: cleanTypeName(node.type),
      status: "success",
      timestamp: new Date().toISOString()
    };
  }

  function ensureStylesLoaded() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('wf-canvas-styles')) return;
    const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      link => link.href && link.href.includes('workflow-canvas.css')
    );
    if (existing) return;

    const link = document.createElement('link');
    link.id = 'wf-canvas-styles';
    link.rel = 'stylesheet';
    link.href = '/assets/workflow-canvas.css';
    document.head.appendChild(link);
  }

  /**
   * Main Workflow Canvas Class
   */
  class WorkflowCanvas {
    constructor(container, options = {}) {
      if (typeof container === 'string') {
        this.container = document.querySelector(container);
      } else {
        this.container = container;
      }

      if (!this.container) {
        throw new Error('WorkflowCanvas: Container element not found');
      }

      this.options = Object.assign(
        {
          minZoom: 0.4,
          maxZoom: 2.0,
          zoomStep: 0.15,
          defaultNodeWidth: 260,
          defaultNodeHeight: 84,
          autoFitOnRender: true,
          theme: 'light'
        },
        options
      );

      // Pan & Zoom state
      this.panX = 0;
      this.panY = 0;
      this.zoom = 1.0;
      this.isPanning = false;
      this.panStartX = 0;
      this.panStartY = 0;

      // Active workflow data
      this.workflowData = null;
      this.nodes = [];
      this.nodeMap = new Map();
      this.edges = [];

      // Dragging state
      this.activeDragNode = null;
      this.dragPointerStart = { x: 0, y: 0 };
      this.dragNodeStart = { x: 0, y: 0 };
      this.dragDistance = 0;
      this.rafPending = false;

      // Selected node for inspector
      this.selectedNode = null;

      // Bind methods
      this.onWheel = this.onWheel.bind(this);
      this.onContainerPointerDown = this.onContainerPointerDown.bind(this);
      this.onPointerMove = this.onPointerMove.bind(this);
      this.onPointerUp = this.onPointerUp.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);

      // Build DOM skeleton
      this.initDom();
      this.bindEvents();
    }

    initDom() {
      ensureStylesLoaded();
      // Ensure host container has necessary class
      this.container.classList.add('wf-canvas-container');
      this.container.tabIndex = 0;

      // Viewport layer (scaled and translated)
      this.viewport = document.createElement('div');
      this.viewport.className = 'wf-viewport';

      // SVG layer for bezier curves
      const svgNs = 'http://www.w3.org/2000/svg';
      this.svgLayer = document.createElementNS(svgNs, 'svg');
      this.svgLayer.setAttribute('class', 'wf-svg-layer');

      // Edge defs for particles or gradients if needed
      const defs = document.createElementNS(svgNs, 'defs');
      this.svgLayer.appendChild(defs);

      // HTML layer for interactive nodes
      this.nodesLayer = document.createElement('div');
      this.nodesLayer.className = 'wf-nodes-layer';

      this.viewport.appendChild(this.svgLayer);
      this.viewport.appendChild(this.nodesLayer);
      this.container.appendChild(this.viewport);

      // Workflow Name Badge (Top Left)
      this.metaBadge = document.createElement('div');
      this.metaBadge.className = 'wf-meta-badge';
      this.metaBadge.style.display = 'none';
      this.container.appendChild(this.metaBadge);

      // Floating Controls Bar (Bottom Right)
      this.controlsBar = document.createElement('div');
      this.controlsBar.className = 'wf-controls-bar';
      this.controlsBar.setAttribute('role', 'toolbar');
      this.controlsBar.setAttribute('aria-label', 'Canvas Controls');
      this.controlsBar.innerHTML = `
        <button class="wf-ctrl-btn" data-action="zoom-in" title="Zoom In (+)" aria-label="Zoom in">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <span class="wf-ctrl-zoom-text" data-action="reset-zoom" title="Reset Zoom (100%)">100%</span>
        <button class="wf-ctrl-btn" data-action="zoom-out" title="Zoom Out (−)" aria-label="Zoom out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div class="wf-ctrl-divider"></div>
        <button class="wf-ctrl-btn" data-action="fit-view" title="Fit to View" aria-label="Fit to view">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        </button>
        <button class="wf-ctrl-btn" data-action="reset-view" title="Reset to Center" aria-label="Reset to center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
        </button>
      `;
      this.container.appendChild(this.controlsBar);

      this.zoomTextEl = this.controlsBar.querySelector('.wf-ctrl-zoom-text');

      // Inspector Slide-over Panel (created lazily or hidden)
      this.inspector = document.createElement('div');
      this.inspector.className = 'wf-inspector-panel';
      this.inspector.style.display = 'none';
      this.container.appendChild(this.inspector);

      this.applyTransform();
    }

    bindEvents() {
      // Pan & Zoom events
      this.container.addEventListener('wheel', this.onWheel, { passive: false });
      this.container.addEventListener('pointerdown', this.onContainerPointerDown);
      window.addEventListener('pointermove', this.onPointerMove);
      window.addEventListener('pointerup', this.onPointerUp);
      window.addEventListener('pointercancel', this.onPointerUp);
      window.addEventListener('keydown', this.onKeyDown);

      // Controls Bar click events
      this.controlsBar.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        if (action === 'zoom-in') this.zoomIn();
        else if (action === 'zoom-out') this.zoomOut();
        else if (action === 'reset-zoom') this.setZoom(1.0);
        else if (action === 'fit-view') this.fitToView();
        else if (action === 'reset-view') this.resetView();
      });
    }

    applyTransform() {
      this.viewport.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
      this.container.style.backgroundPosition = `${this.panX}px ${this.panY}px`;
      this.container.style.backgroundSize = `${24 * this.zoom}px ${24 * this.zoom}px`;
      if (this.zoomTextEl) {
        this.zoomTextEl.textContent = `${Math.round(this.zoom * 100)}%`;
      }
    }

    setZoom(targetZoom, clientCenterX, clientCenterY) {
      const newZoom = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, targetZoom));
      if (Math.abs(newZoom - this.zoom) < 0.001) return;

      const rect = this.container.getBoundingClientRect();
      const cx = clientCenterX !== undefined ? clientCenterX - rect.left : rect.width / 2;
      const cy = clientCenterY !== undefined ? clientCenterY - rect.top : rect.height / 2;

      // Keep world coordinates under cursor stationary
      const worldX = (cx - this.panX) / this.zoom;
      const worldY = (cy - this.panY) / this.zoom;

      this.zoom = newZoom;
      this.panX = cx - worldX * newZoom;
      this.panY = cy - worldY * newZoom;

      this.applyTransform();
    }

    zoomIn() {
      this.setZoom(this.zoom * (1 + this.options.zoomStep));
    }

    zoomOut() {
      this.setZoom(this.zoom / (1 + this.options.zoomStep));
    }

    resetView() {
      this.zoom = 1.0;
      if (this.nodes.length === 0) {
        this.panX = 0;
        this.panY = 0;
      } else {
        // Center the nodes at 100%
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        this.nodes.forEach(n => {
          minX = Math.min(minX, n.x);
          minY = Math.min(minY, n.y);
          maxX = Math.max(maxX, n.x + n.width);
          maxY = Math.max(maxY, n.y + n.height);
        });
        const rect = this.container.getBoundingClientRect();
        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;
        this.panX = rect.width / 2 - midX;
        this.panY = rect.height / 2 - midY;
      }
      this.applyTransform();
    }

    fitToView(padding = 70) {
      if (this.nodes.length === 0) return;

      const rect = this.container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      this.nodes.forEach(n => {
        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + n.width);
        maxY = Math.max(maxY, n.y + n.height);
      });

      const bboxWidth = maxX - minX;
      const bboxHeight = maxY - minY;

      const availWidth = Math.max(100, rect.width - padding * 2);
      const availHeight = Math.max(100, rect.height - padding * 2);

      const scaleX = availWidth / (bboxWidth || 1);
      const scaleY = availHeight / (bboxHeight || 1);
      let newZoom = Math.min(scaleX, scaleY);
      newZoom = Math.max(this.options.minZoom, Math.min(1.2, newZoom));

      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;

      this.zoom = newZoom;
      this.panX = rect.width / 2 - midX * newZoom;
      this.panY = rect.height / 2 - midY * newZoom;

      this.applyTransform();
    }

    onWheel(e) {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.09 : 0.91;
      this.setZoom(this.zoom * factor, e.clientX, e.clientY);
    }

    onContainerPointerDown(e) {
      // If clicking node or controls, ignore canvas pan
      if (e.target.closest('.wf-node') || e.target.closest('.wf-controls-bar') || e.target.closest('.wf-inspector-panel')) {
        return;
      }

      this.isPanning = true;
      this.panStartX = e.clientX - this.panX;
      this.panStartY = e.clientY - this.panY;
      this.container.classList.add('wf-panning');

      // Deselect inspector if clicking canvas backdrop
      this.closeInspector();
    }

    onPointerMove(e) {
      if (this.isPanning) {
        this.panX = e.clientX - this.panStartX;
        this.panY = e.clientY - this.panStartY;
        this.applyTransform();
        return;
      }

      if (this.activeDragNode) {
        const dx = (e.clientX - this.dragPointerStart.x) / this.zoom;
        const dy = (e.clientY - this.dragPointerStart.y) / this.zoom;
        this.dragDistance = Math.hypot(e.clientX - this.dragPointerStart.x, e.clientY - this.dragPointerStart.y);

        this.activeDragNode.x = Math.round(this.dragNodeStart.x + dx);
        this.activeDragNode.y = Math.round(this.dragNodeStart.y + dy);

        // Update node card transform
        this.activeDragNode.el.style.transform = `translate(${this.activeDragNode.x}px, ${this.activeDragNode.y}px)`;

        // Request animation frame for updating connected bezier lines
        if (!this.rafPending) {
          this.rafPending = true;
          raf(() => {
            this.updateNodeConnections(this.activeDragNode);
            this.rafPending = false;
          });
        }
      }
    }

    onPointerUp(e) {
      if (this.isPanning) {
        this.isPanning = false;
        this.container.classList.remove('wf-panning');
      }

      if (this.activeDragNode) {
        const draggedNode = this.activeDragNode;
        draggedNode.el.classList.remove('wf-node-dragging');
        this.activeDragNode = null;

        // Final snap update for all curves
        this.updateNodeConnections(draggedNode);

        // If movement was minimal, consider it an intentional click
        if (this.dragDistance < 6) {
          this.inspectNode(draggedNode);
        }
      }
    }

    onKeyDown(e) {
      if (e.key === 'Escape') {
        this.closeInspector();
      }
    }

    /**
     * Compute cubic Bezier curve coordinates between ports
     */
    computeBezierPath(x1, y1, x2, y2, isError = false) {
      if (isError) {
        // Error path leaves bottom port vertically downwards then curves to target input
        const dy = Math.max(45, Math.abs(y2 - y1) * 0.45);
        const cx1 = x1;
        const cy1 = y1 + dy;
        const dx = Math.max(50, Math.abs(x2 - x1) * 0.4);
        const cx2 = x2 - dx;
        const cy2 = y2;
        return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
      }

      // Standard forward or looping connection
      const dx = x2 - x1;
      if (dx >= 0) {
        const offset = Math.max(40, dx * 0.45);
        const cx1 = x1 + offset;
        const cy1 = y1;
        const cx2 = x2 - offset;
        const cy2 = y2;
        return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
      } else {
        // Target is to the left of source (backwards flow)
        const offset = Math.max(70, Math.abs(dx) * 0.5);
        const dyOffset = y2 >= y1 ? 55 : -55;
        const cx1 = x1 + offset;
        const cy1 = y1 + dyOffset;
        const cx2 = x2 - offset;
        const cy2 = y2 - dyOffset;
        return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
      }
    }

    /**
     * Update curves for all edges attached to a specific node (or all edges)
     */
    updateNodeConnections(node) {
      const edgesToUpdate = node
        ? this.edges.filter(e => e.source === node || e.target === node)
        : this.edges;

      for (let i = 0; i < edgesToUpdate.length; i++) {
        const edge = edgesToUpdate[i];
        const src = edge.source;
        const tgt = edge.target;

        // Port positions:
        // Input port: (x, y + height / 2)
        // Output port: (x + width, y + height / 2)
        // Error port: (x + width / 2, y + height)
        let x1, y1;
        if (edge.isError) {
          x1 = src.x + src.width / 2;
          y1 = src.y + src.height;
        } else {
          x1 = src.x + src.width;
          y1 = src.y + src.height / 2;
        }

        const x2 = tgt.x;
        const y2 = tgt.y + tgt.height / 2;

        const pathD = this.computeBezierPath(x1, y1, x2, y2, edge.isError);

        edge.trackPath.setAttribute('d', pathD);
        edge.pulsePath.setAttribute('d', pathD);
        edge.hitboxPath.setAttribute('d', pathD);

        if (edge.animateMotion) {
          edge.animateMotion.setAttribute('path', pathD);
        }
      }
    }

    /**
     * Parse workflow JSON and instantiate elements
     */
    render(workflowData) {
      if (!workflowData || !Array.isArray(workflowData.nodes)) {
        console.warn('WorkflowCanvas.render: Invalid workflow data', workflowData);
        return;
      }

      this.workflowData = workflowData;
      this.clear();

      // Show Workflow Name Badge if present
      if (workflowData.name) {
        this.metaBadge.innerHTML = `
          <span>${escapeHtml(workflowData.name)}</span>
          <span class="wf-meta-pill">${workflowData.nodes.length} nodes</span>
        `;
        this.metaBadge.style.display = 'flex';
      } else {
        this.metaBadge.style.display = 'none';
      }

      // 1. Process nodes & calculate positions
      const rawNodes = workflowData.nodes;
      const defaultW = this.options.defaultNodeWidth;
      const defaultH = this.options.defaultNodeHeight;

      this.nodes = rawNodes.map((rawNode, index) => {
        let posX = 120 + (index % 4) * 320;
        let posY = 140 + Math.floor(index / 4) * 160;

        if (Array.isArray(rawNode.position) && rawNode.position.length >= 2) {
          posX = rawNode.position[0];
          posY = rawNode.position[1];
        } else if (typeof rawNode.x === 'number' && typeof rawNode.y === 'number') {
          posX = rawNode.x;
          posY = rawNode.y;
        }

        const node = {
          raw: rawNode,
          id: rawNode.id || `node_${index + 1}`,
          name: rawNode.name || `Node ${index + 1}`,
          type: rawNode.type || 'n8n-nodes-base.default',
          typeVersion: rawNode.typeVersion || 1,
          parameters: rawNode.parameters || rawNode.paramsPreview || {},
          credentials: rawNode.credentials || null,
          x: posX,
          y: posY,
          width: defaultW,
          height: defaultH,
          el: null
        };

        return node;
      });

      // Populate lookup maps by both name and ID
      this.nodeMap.clear();
      this.nodes.forEach(n => {
        this.nodeMap.set(n.name, n);
        this.nodeMap.set(n.id, n);
      });

      // 2. Render Node HTML Cards
      this.nodes.forEach(node => {
        const meta = getNodeMeta(node.type, node);
        const card = document.createElement('div');
        card.className = 'wf-node';
        card.dataset.id = node.id;
        card.style.transform = `translate(${node.x}px, ${node.y}px)`;
        card.style.width = `${node.width}px`;

        // Check if node is an error-handling node
        const isErrorNode = node.type.toLowerCase().includes('error');

        // Parameter preview snippet
        let paramSummary = '';
        if (node.parameters.httpMethod && node.parameters.path) {
          paramSummary = `${node.parameters.httpMethod} /${node.parameters.path}`;
        } else if (node.parameters.requestMethod && node.parameters.url) {
          paramSummary = `${node.parameters.requestMethod} ${node.parameters.url}`;
        } else if (node.parameters.toEmail) {
          paramSummary = `→ ${node.parameters.toEmail}`;
        } else if (node.parameters.values) {
          const count = (node.parameters.values.string?.length || 0) + (node.parameters.values.number?.length || 0);
          paramSummary = `${count} fields`;
        }

        card.innerHTML = `
          <!-- Left Input Port (center-left) -->
          <div class="wf-port wf-port-input" data-port="input" title="Input Port">
            <div class="wf-port-tooltip">Input</div>
          </div>

          <!-- Main Card Content -->
          <div class="wf-node-inner">
            <div class="wf-node-header">
              <div class="wf-node-icon" style="background: ${meta.bg}; color: ${meta.color};">
                ${meta.icon}
              </div>
              <div class="wf-node-meta">
                <div class="wf-node-title" title="${escapeHtml(node.name)}">${escapeHtml(node.name)}</div>
                <div class="wf-node-type" title="${escapeHtml(node.type)}">${escapeHtml(cleanTypeName(node.type))}</div>
              </div>
              <div class="wf-node-status" title="Active">
                <div class="wf-status-dot active"></div>
              </div>
            </div>

            <div class="wf-node-footer">
              <div class="wf-node-badges">
                <span class="wf-badge wf-badge-version">v${node.typeVersion}</span>
                <span class="wf-badge">${escapeHtml(meta.category)}</span>
                ${node.credentials ? `<span class="wf-badge wf-badge-auth">🔑 Auth</span>` : ''}
              </div>
              ${paramSummary ? `<span class="wf-badge-hint" title="${escapeHtml(paramSummary)}">${escapeHtml(paramSummary)}</span>` : ''}
            </div>
          </div>

          <!-- Right Output Port (center-right) -->
          <div class="wf-port wf-port-output" data-port="output" title="Output Port">
            <div class="wf-port-tooltip">Output</div>
          </div>

          <!-- Bottom Error Port (center-bottom) -->
          <div class="wf-port wf-port-error" data-port="error" title="Error Output">
            <div class="wf-port-dot-inner"></div>
            <div class="wf-port-tooltip">Error Output</div>
          </div>
        `;

        // Attach dragging listener to node card
        card.addEventListener('pointerdown', (e) => {
          // If clicking a port, don't drag
          if (e.target.closest('.wf-port')) {
            return;
          }
          e.stopPropagation();
          this.activeDragNode = node;
          this.dragPointerStart = { x: e.clientX, y: e.clientY };
          this.dragNodeStart = { x: node.x, y: node.y };
          this.dragDistance = 0;
          card.classList.add('wf-node-dragging');
        });

        this.nodesLayer.appendChild(card);
        node.el = card;

        // Measure actual rendered height for exact port alignment
        const measuredHeight = card.offsetHeight;
        if (measuredHeight > 0) {
          node.height = measuredHeight;
        }
      });

      // 3. Parse Connections and build SVG Edges
      this.edges = [];
      const connections = workflowData.connections || {};
      const svgNs = 'http://www.w3.org/2000/svg';

      if (Array.isArray(connections)) {
        connections.forEach(conn => {
          const sourceNode = this.nodeMap.get(conn.from) || this.nodeMap.get(conn.source);
          const targetNode = this.nodeMap.get(conn.to) || this.nodeMap.get(conn.target);
          if (!sourceNode || !targetNode) return;

          const isError = conn.type === 'error' ||
                          (targetNode.type && targetNode.type.toLowerCase().includes('error'));
          this.createEdgeElement(sourceNode, targetNode, isError, 0);
        });
      } else {
        for (const [sourceKey, routeMap] of Object.entries(connections)) {
          const sourceNode = this.nodeMap.get(sourceKey);
          if (!sourceNode) continue;

          // Parse main outputs
          if (routeMap.main && Array.isArray(routeMap.main)) {
            routeMap.main.forEach((outputList, outputIndex) => {
              if (!Array.isArray(outputList)) return;
              outputList.forEach(conn => {
                const targetNode = this.nodeMap.get(conn.node);
                if (!targetNode) return;

                // Check if connection is marked error or links to error handler
                const isError = conn.type === 'error' ||
                                (targetNode.type && targetNode.type.toLowerCase().includes('error'));

                this.createEdgeElement(sourceNode, targetNode, isError, outputIndex);
              });
            });
          }

          // Parse dedicated error outputs
          if (routeMap.error && Array.isArray(routeMap.error)) {
            routeMap.error.forEach((errorList) => {
              if (!Array.isArray(errorList)) return;
              errorList.forEach(conn => {
                const targetNode = this.nodeMap.get(conn.node);
                if (!targetNode) return;
                this.createEdgeElement(sourceNode, targetNode, true, 0);
              });
            });
          }
        }
      }

      // Initial edge render
      this.updateNodeConnections(null);

      // Auto-fit or reset view on initial render
      if (this.options.autoFitOnRender) {
        raf(() => this.fitToView());
      } else {
        this.resetView();
      }
    }

    createEdgeElement(sourceNode, targetNode, isError, outputIndex) {
      const svgNs = 'http://www.w3.org/2000/svg';
      const edgeGroup = document.createElementNS(svgNs, 'g');
      edgeGroup.setAttribute('class', `wf-edge ${isError ? 'wf-edge-error' : ''}`);

      // 1. Invisible wide hitbox path for easy hovering/clicking
      const hitbox = document.createElementNS(svgNs, 'path');
      hitbox.setAttribute('class', 'wf-edge-hitbox');

      // 2. Base track path (solid guide line)
      const track = document.createElementNS(svgNs, 'path');
      track.setAttribute('class', 'wf-edge-track');

      // 3. Pulse animation path (flowing dash-offset)
      const pulse = document.createElementNS(svgNs, 'path');
      pulse.setAttribute('class', `wf-edge-pulse ${isError ? 'wf-edge-error' : ''}`);

      // 4. Flowing Glowing Particle (SVG circle animated along path)
      const particle = document.createElementNS(svgNs, 'circle');
      particle.setAttribute('class', `wf-edge-particle ${isError ? 'particle-error' : ''}`);
      particle.setAttribute('r', '3.5');

      const animMotion = document.createElementNS(svgNs, 'animateMotion');
      animMotion.setAttribute('dur', isError ? '2.8s' : '2.1s');
      animMotion.setAttribute('repeatCount', 'indefinite');
      animMotion.setAttribute('rotate', 'auto');
      particle.appendChild(animMotion);

      edgeGroup.appendChild(hitbox);
      edgeGroup.appendChild(track);
      edgeGroup.appendChild(pulse);
      edgeGroup.appendChild(particle);

      this.svgLayer.appendChild(edgeGroup);

      const edgeRecord = {
        source: sourceNode,
        target: targetNode,
        isError: !!isError,
        outputIndex: outputIndex || 0,
        group: edgeGroup,
        hitboxPath: hitbox,
        trackPath: track,
        pulsePath: pulse,
        particle: particle,
        animateMotion: animMotion
      };

      this.edges.push(edgeRecord);
    }

    /**
     * Inspect Node parameters and mock output
     */
    inspectNode(node) {
      if (!node) return;

      this.selectedNode = node;

      // Highlight selected node
      this.nodes.forEach(n => {
        if (n.el) {
          n.el.classList.toggle('selected', n === node);
        }
      });

      const meta = getNodeMeta(node.type, node);
      const mockOutput = generateMockExecutionData(node);
      const paramKeys = Object.keys(node.parameters || {});

      let paramsHtml = '';
      if (paramKeys.length === 0) {
        paramsHtml = `<div class="wf-inspector-kv"><span class="wf-inspector-k">Parameters</span><span class="wf-inspector-v">None</span></div>`;
      } else {
        paramsHtml = paramKeys.map(key => {
          let val = node.parameters[key];
          if (typeof val === 'object' && val !== null) {
            val = JSON.stringify(val);
          }
          return `
            <div class="wf-inspector-kv">
              <span class="wf-inspector-k" title="${escapeHtml(key)}">${escapeHtml(key)}</span>
              <span class="wf-inspector-v" title="${escapeHtml(String(val))}">${escapeHtml(String(val))}</span>
            </div>
          `;
        }).join('');
      }

      this.inspector.innerHTML = `
        <div class="wf-inspector-header">
          <div class="wf-inspector-title-group">
            <div class="wf-node-icon" style="background: ${meta.bg}; color: ${meta.color}; width: 26px; height: 26px; min-width: 26px;">
              ${meta.icon}
            </div>
            <div class="wf-inspector-title" title="${escapeHtml(node.name)}">${escapeHtml(node.name)}</div>
          </div>
          <button class="wf-inspector-close" data-action="close" aria-label="Close inspector">✕</button>
        </div>

        <div class="wf-inspector-body">
          <div class="wf-inspector-section">
            <div class="wf-inspector-section-label">Node Status</div>
            <div class="wf-inspector-kv">
              <span class="wf-inspector-k">Type</span>
              <span class="wf-inspector-v">${escapeHtml(cleanTypeName(node.type))}</span>
            </div>
            <div class="wf-inspector-kv">
              <span class="wf-inspector-k">Version</span>
              <span class="wf-inspector-v">v${node.typeVersion}</span>
            </div>
            <div class="wf-inspector-kv">
              <span class="wf-inspector-k">Health</span>
              <span class="wf-inspector-v" style="color: #10b981; font-weight: 600;">Active · Ready</span>
            </div>
          </div>

          <div class="wf-inspector-section">
            <div class="wf-inspector-section-label">Configured Parameters</div>
            ${paramsHtml}
          </div>

          ${node.credentials ? `
          <div class="wf-inspector-section">
            <div class="wf-inspector-section-label">Credentials & Auth</div>
            <div class="wf-inspector-kv">
              <span class="wf-inspector-k">Auth Type</span>
              <span class="wf-inspector-v">${escapeHtml(Object.keys(node.credentials)[0] || 'Default')}</span>
            </div>
            <div class="wf-inspector-kv">
              <span class="wf-inspector-k">Credential ID</span>
              <span class="wf-inspector-v">••••••••••••••</span>
            </div>
          </div>` : ''}

          <div class="wf-inspector-section">
            <div class="wf-inspector-section-label">Mock Execution Output</div>
            <div class="wf-inspector-code">${escapeHtml(JSON.stringify(mockOutput, null, 2))}</div>
            <div class="wf-inspector-actions">
              <button class="wf-inspector-btn" data-action="copy-mock">Copy Output JSON</button>
            </div>
          </div>
        </div>
      `;

      this.inspector.style.display = 'flex';

      // Bind close button and copy button
      const closeBtn = this.inspector.querySelector('[data-action="close"]');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeInspector());
      }

      const copyBtn = this.inspector.querySelector('[data-action="copy-mock"]');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(JSON.stringify(mockOutput, null, 2));
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy Output JSON'; }, 1800);
          } catch (err) {
            console.warn('Clipboard write failed:', err);
          }
        });
      }
    }

    closeInspector() {
      this.inspector.style.display = 'none';
      if (this.selectedNode) {
        if (this.selectedNode.el) {
          this.selectedNode.el.classList.remove('selected');
        }
        this.selectedNode = null;
      }
    }

    clear() {
      this.closeInspector();
      this.nodesLayer.innerHTML = '';
      while (this.svgLayer.childNodes.length > 1) {
        this.svgLayer.removeChild(this.svgLayer.lastChild);
      }
      this.nodes = [];
      this.nodeMap.clear();
      this.edges = [];
    }

    getWorkflowData() {
      if (!this.workflowData) return null;
      const updated = JSON.parse(JSON.stringify(this.workflowData));
      updated.nodes = updated.nodes.map(n => {
        const live = this.nodeMap.get(n.id) || this.nodeMap.get(n.name);
        if (live) {
          n.position = [live.x, live.y];
        }
        return n;
      });
      return updated;
    }

    destroy() {
      this.clear();
      this.container.removeEventListener('wheel', this.onWheel);
      this.container.removeEventListener('pointerdown', this.onContainerPointerDown);
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerup', this.onPointerUp);
      window.removeEventListener('pointercancel', this.onPointerUp);
      window.removeEventListener('keydown', this.onKeyDown);
      this.container.innerHTML = '';
    }
  }

  // Export to global window namespace
  global.WorkflowCanvas = WorkflowCanvas;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkflowCanvas;
  }
})(typeof window !== 'undefined' ? window : this);
