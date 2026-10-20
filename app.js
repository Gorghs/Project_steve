// Project Steve frontend interactions (CSP-safe)
(() => {
  const generateBtn = document.getElementById('generate-btn');
  const resultPanel = document.getElementById('result-panel');
  const workflowJsonEl = document.getElementById('workflow-json');
  const copyJsonBtn = document.getElementById('copy-json-btn');
  const downloadJsonBtn = document.getElementById('download-json-btn');
  const statusText = document.getElementById('status-text');
  const tabCanvasBtn = document.getElementById('tab-canvas-btn');
  const tabJsonBtn = document.getElementById('tab-json-btn');
  const canvasView = document.getElementById('canvas-view');
  const jsonView = document.getElementById('json-view');
  const canvasMount = document.getElementById('workflow-canvas-container');

  let canvasInstance = null;
  let activeWorkflowData = null;

  const setStatus = (msg, isSuccess = false) => {
    if (statusText) {
      statusText.innerHTML = isSuccess ? `<strong>${msg}</strong>` : msg;
    }
  };

  const setButtonLoading = (isLoading) => {
    if (!generateBtn) return;
    if (isLoading) {
      generateBtn.disabled = true;
      generateBtn.setAttribute('aria-busy', 'true');
    } else {
      generateBtn.disabled = false;
      generateBtn.removeAttribute('aria-busy');
    }
  };

  // Switch between Interactive Canvas and Raw JSON view tabs
  const switchTab = (mode) => {
    if (mode === 'canvas') {
      if (tabCanvasBtn) {
        tabCanvasBtn.classList.add('is-active');
        tabCanvasBtn.setAttribute('aria-selected', 'true');
      }
      if (tabJsonBtn) {
        tabJsonBtn.classList.remove('is-active');
        tabJsonBtn.setAttribute('aria-selected', 'false');
      }
      if (canvasView) canvasView.classList.remove('hidden');
      if (jsonView) jsonView.classList.add('hidden');
      if (canvasInstance) {
        setTimeout(() => { canvasInstance.fitToView(60); }, 50);
      }
    } else {
      if (tabJsonBtn) {
        tabJsonBtn.classList.add('is-active');
        tabJsonBtn.setAttribute('aria-selected', 'true');
      }
      if (tabCanvasBtn) {
        tabCanvasBtn.classList.remove('is-active');
        tabCanvasBtn.setAttribute('aria-selected', 'false');
      }
      if (jsonView) jsonView.classList.remove('hidden');
      if (canvasView) canvasView.classList.add('hidden');
    }
  };

  if (tabCanvasBtn) tabCanvasBtn.addEventListener('click', () => switchTab('canvas'));
  if (tabJsonBtn) tabJsonBtn.addEventListener('click', () => switchTab('json'));

  // Initialize or get the visual canvas instance
  function getCanvasInstance() {
    if (!canvasInstance && canvasMount && typeof window.WorkflowCanvas === 'function') {
      canvasInstance = new window.WorkflowCanvas(canvasMount, {
        minZoom: 0.4,
        maxZoom: 2.0,
        autoFitOnRender: true
      });
    }
    return canvasInstance;
  }

  // Generate workflow both visually and via backend
  async function generateWorkflow() {
    const requirementsInput = document.getElementById('requirements');
    const requirements = requirementsInput ? requirementsInput.value : '';
    if (!requirements.trim()) {
      alert('Please describe what you want to automate.');
      return;
    }

    setButtonLoading(true);
    setStatus('Synthesizing workflow...');

    // 1. Instantly synthesize prompt-relevant n8n workflow for visual canvas
    let synthesizedWorkflow = null;
    if (typeof window.generateWorkflowFromPrompt === 'function') {
      const parsedGraph = window.generateWorkflowFromPrompt(requirements);
      if (window.WorkflowGenerator && typeof window.WorkflowGenerator.convertToN8nJSON === 'function') {
        synthesizedWorkflow = window.WorkflowGenerator.convertToN8nJSON(parsedGraph);
      } else {
        synthesizedWorkflow = parsedGraph;
      }
    }

    // Render the visual preview immediately so the user sees their nodes appear
    if (synthesizedWorkflow) {
      document.body.classList.add('workflow-active');
      activeWorkflowData = synthesizedWorkflow;
      const canvas = getCanvasInstance();
      if (canvas) {
        canvas.render(synthesizedWorkflow);
      }
      if (workflowJsonEl) {
        workflowJsonEl.value = JSON.stringify(synthesizedWorkflow, null, 2);
      }
      if (resultPanel) {
        resultPanel.classList.remove('hidden');
        switchTab('canvas');
        setTimeout(() => {
          resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 120);
      }
    }

    // 2. Call backend API for verification and file storage
    let workflowId = Date.now().toString();
    try {
      const response = await fetch('/api/generate-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'default-api-key-change-in-production'
        },
        body: JSON.stringify({ requirements })
      });

      if (response.ok) {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          workflowId = data.workflowId || data.workflow_id || workflowId;
          // If we didn't have synthesized workflow, fallback to backend's workflow
          if (!synthesizedWorkflow && data.workflow) {
            activeWorkflowData = data.workflow;
            const canvas = getCanvasInstance();
            if (canvas) canvas.render(data.workflow);
            if (workflowJsonEl) workflowJsonEl.value = JSON.stringify(data.workflow, null, 2);
            if (resultPanel) resultPanel.classList.remove('hidden');
          }
        } catch (parseErr) {
          console.warn('API JSON parse warning:', parseErr);
        }
      }
      setStatus('Ready', true);
    } catch (error) {
      console.warn('Backend API notification:', error);
      setStatus('Preview ready', true);
    } finally {
      setButtonLoading(false);
      setTimeout(() => {
        if (statusText && statusText.textContent.includes('Ready')) {
          setStatus('');
        }
      }, 2500);
    }
  }

  if (generateBtn) generateBtn.addEventListener('click', generateWorkflow);

  // Download workflow as .json file
  function downloadCurrentWorkflow() {
    const jsonContent = workflowJsonEl ? workflowJsonEl.value : (activeWorkflowData ? JSON.stringify(activeWorkflowData, null, 2) : '');
    if (!jsonContent) return;

    try {
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workflow_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  }

  if (downloadJsonBtn) downloadJsonBtn.addEventListener('click', downloadCurrentWorkflow);

  // Copy JSON to clipboard
  if (copyJsonBtn && workflowJsonEl) {
    copyJsonBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(workflowJsonEl.value || '');
        const originalText = copyJsonBtn.textContent;
        copyJsonBtn.textContent = 'Copied!';
        setTimeout(() => { copyJsonBtn.textContent = originalText; }, 1400);
      } catch (err) {
        alert('Copy failed. Please copy manually from the JSON tab.');
      }
    });
  }
})();

// ---------------------------------------------------------------------------
// Example chips & textarea placeholder (Static, no typing animation)
// ---------------------------------------------------------------------------
(() => {
  const textarea = document.getElementById('requirements');
  if (!textarea) return;

  const STATIC_PLACEHOLDER =
    'Describe the workflow you want to automate, e.g., Sync Stripe payments to Postgres...';
  textarea.setAttribute('placeholder', STATIC_PLACEHOLDER);

  // --- example chips -------------------------------------------------------
  const ACTIVE_CLASS = 'is-active';
  const getChips = () =>
    Array.prototype.slice.call(document.querySelectorAll('.example-chip'));

  const setActiveChip = (chip) => {
    getChips().forEach((el) => {
      const active = el === chip;
      el.classList.toggle(ACTIVE_CLASS, active);
      el.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  getChips().forEach((chip) => {
    if (!chip.hasAttribute('aria-pressed')) chip.setAttribute('aria-pressed', 'false');
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== 'function') return;
    const chip = target.closest('.example-chip');
    if (!chip) return;

    const prompt = chip.getAttribute('data-prompt');
    if (typeof prompt !== 'string' || prompt.length === 0) return;

    event.preventDefault();
    textarea.value = prompt;
    try {
      textarea.focus();
      textarea.setSelectionRange(prompt.length, prompt.length);
    } catch (err) {
      /* selection is best effort */
    }
    setActiveChip(chip);
  });

  textarea.addEventListener('input', () => {
    setActiveChip(null);
  });
})();

// ---------------------------------------------------------------------------
// Animated Subtitle with Typing Effect & Rotating Typography (Preserved)
// ---------------------------------------------------------------------------
(() => {
  const animatedEl = document.querySelector('.quote-animated');
  if (!animatedEl) return;

  const MESSAGES = [
    'production-ready workflows.',
    'intelligent AI agents.',
    'automated developer tools.',
    'powerful integrations.',
    'your next big idea.'
  ];

  const STYLES = [
    'style-1',
    'style-2',
    'style-3',
    'style-4',
    'style-5'
  ];

  const TYPE_DELAY = [45, 75];
  const DELETE_DELAY = [25, 45];
  const HOLD_DELAY = [900, 1400];
  const GAP_DELAY = [150, 300];

  const motionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const reducedMotion = () => Boolean(motionQuery && motionQuery.matches);

  let phase = 'type';
  let messageIndex = 0;
  let styleIndex = 0;
  let typed = '';
  let timer = null;
  let started = false;
  let stopped = false;

  const rand = (range) => range[0] + Math.random() * (range[1] - range[0]);

  const applyStyle = (index) => {
    STYLES.forEach((s, i) => animatedEl.classList.toggle(s, i === index));
  };

  const setText = (value) => {
    animatedEl.textContent = value;
  };

  const clearTimer = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const schedule = (delay) => {
    clearTimer();
    timer = setTimeout(tick, delay);
  };

  const tick = () => {
    timer = null;
    if (stopped) return;
    if (document.hidden) return;

    const message = MESSAGES[messageIndex];

    if (phase === 'type') {
      if (typed.length < message.length) {
        typed += message.charAt(typed.length);
        setText(typed);
        schedule(rand(TYPE_DELAY));
        return;
      }
      phase = 'hold';
      schedule(rand(HOLD_DELAY));
      return;
    }

    if (phase === 'hold') {
      phase = 'delete';
      schedule(rand(DELETE_DELAY));
      return;
    }

    if (phase === 'delete') {
      if (typed.length > 0) {
        typed = typed.slice(0, -1);
        setText(typed);
        schedule(rand(DELETE_DELAY));
        return;
      }
      phase = 'gap';
      messageIndex = (messageIndex + 1) % MESSAGES.length;
      styleIndex = (styleIndex + 1) % STYLES.length;
      applyStyle(styleIndex);
      schedule(rand(GAP_DELAY));
      return;
    }

    phase = 'type';
    schedule(0);
  };

  const stopAnimation = () => {
    if (stopped) return;
    stopped = true;
    clearTimer();
    if (started) {
      animatedEl.textContent = '';
      animatedEl.style.animation = 'none';
    }
  };

  const startAnimation = () => {
    if (started || stopped) return;
    if (reducedMotion()) {
      setText(MESSAGES[0]);
      applyStyle(0);
      return;
    }
    started = true;
    applyStyle(styleIndex);
    phase = 'type';
    messageIndex = 0;
    styleIndex = 0;
    typed = '';
    schedule(0);
  };

  document.addEventListener('visibilitychange', () => {
    if (stopped) return;
    if (document.hidden) {
      clearTimer();
    } else if (started && timer === null) {
      schedule(0);
    }
  });

  const onMotionChange = () => {
    if (reducedMotion()) {
      stopAnimation();
      setText(MESSAGES[0]);
      applyStyle(0);
    }
  };
  if (motionQuery) {
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', onMotionChange);
    } else if (typeof motionQuery.addListener === 'function') {
      motionQuery.addListener(onMotionChange);
    }
  }

  if (reducedMotion()) {
    stopped = true;
    setText(MESSAGES[0]);
    applyStyle(0);
  } else {
    startAnimation();
  }
})();

// ---------------------------------------------------------------------------
// Sticker Cursor Proximity Scatter & Snap-back Physics
// ---------------------------------------------------------------------------
(() => {
  const stickers = Array.from(document.querySelectorAll('.sticker-field .sticker'));
  if (stickers.length === 0) return;

  const REPEL_RADIUS = 165;       // Distance within which cursor scatters stickers
  const MAX_DISPLACEMENT = 80;    // Maximum scatter offset in px
  const SPRING_SPEED = 0.16;      // Smooth return spring factor

  const motionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  if (motionQuery && motionQuery.matches) return;

  // Initialize state tracking for each sticker
  const items = stickers.map(el => {
    const img = el.querySelector('.sticker-img');
    return {
      el,
      img,
      currX: 0,
      currY: 0,
      targetX: 0,
      targetY: 0,
      currRot: 0,
      targetRot: 0,
      active: false
    };
  });

  let mouseX = -9999;
  let mouseY = -9999;
  let isTicking = false;

  function updatePhysics() {
    let hasMotion = false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // When workflow is active, top stickers fade out
      if (item.el.classList.contains('sticker-top') && document.body.classList.contains('workflow-active')) {
        continue;
      }

      const rect = item.el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = centerX - mouseX;
      const dy = centerY - mouseY;
      const dist = Math.hypot(dx, dy);

      if (dist < REPEL_RADIUS && dist > 0.001) {
        // Cursor is near: calculate repulsion vector
        const normX = dx / dist;
        const normY = dy / dist;
        const proximity = 1 - (dist / REPEL_RADIUS);
        const force = Math.pow(proximity, 1.3) * MAX_DISPLACEMENT;

        item.targetX = normX * force;
        item.targetY = normY * force;
        item.targetRot = normX * 18 * proximity;
        item.active = true;
      } else {
        // Cursor moved away: return target to home (0, 0)
        item.targetX = 0;
        item.targetY = 0;
        item.targetRot = 0;
      }

      // Spring towards target position
      const diffX = item.targetX - item.currX;
      const diffY = item.targetY - item.currY;
      const diffRot = item.targetRot - item.currRot;

      if (Math.abs(diffX) > 0.08 || Math.abs(diffY) > 0.08 || Math.abs(diffRot) > 0.08) {
        item.currX += diffX * SPRING_SPEED;
        item.currY += diffY * SPRING_SPEED;
        item.currRot += diffRot * SPRING_SPEED;
        hasMotion = true;

        if (item.img) {
          item.img.style.transform = `translate3d(${item.currX.toFixed(2)}px, ${item.currY.toFixed(2)}px, 0) rotate(${item.currRot.toFixed(2)}deg) scale(1.06)`;
        }
      } else if (item.active && Math.abs(item.currX) < 0.15 && Math.abs(item.currY) < 0.15) {
        // Fully returned to resting position
        item.currX = 0;
        item.currY = 0;
        item.currRot = 0;
        item.active = false;
        if (item.img) {
          item.img.style.transform = '';
        }
      }
    }

    if (hasMotion) {
      requestAnimationFrame(updatePhysics);
    } else {
      isTicking = false;
    }
  }

  function onPointerMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(updatePhysics);
    }
  }

  function onPointerLeave() {
    mouseX = -9999;
    mouseY = -9999;
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(updatePhysics);
    }
  }

  function onTouchMove(e) {
    if (e.touches && e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updatePhysics);
      }
    }
  }

  function onTouchEnd() {
    mouseX = -9999;
    mouseY = -9999;
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(updatePhysics);
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  document.addEventListener('mouseleave', onPointerLeave);
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });
})();
