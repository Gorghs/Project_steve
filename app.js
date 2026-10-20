// Project Steve frontend interactions (CSP-safe)
(() => {
  const generateBtn = document.getElementById('generate-btn');
  const resultPanel = document.getElementById('result-panel');
  const workflowJsonEl = document.getElementById('workflow-json');
  const copyJsonBtn = document.getElementById('copy-json-btn');
  const statusText = document.getElementById('status-text');

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

  async function generateWorkflow() {
    const requirementsInput = document.getElementById('requirements');
    const requirements = requirementsInput ? requirementsInput.value : '';
    if (!requirements.trim()) {
      alert('Please describe what you want to automate.');
      return;
    }

    setButtonLoading(true);
    setStatus('Running triad...');

    try {
      const response = await fetch('/api/generate-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'default-api-key-change-in-production'
        },
        body: JSON.stringify({ requirements })
      });

      console.log('Response status:', response.status);
      
      const text = await response.text();
      console.log('Raw response:', text.substring(0, 200));
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON. Raw text:', text);
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || `HTTP ${response.status}`);
      }

      // Express returns workflowId, FastAPI returns workflow_id - support both
      const workflowId = data.workflowId || data.workflow_id;
      setStatus('Completed. Downloading...', true);

      if (workflowJsonEl && resultPanel) {
        workflowJsonEl.value = JSON.stringify(data.workflow, null, 2);
        resultPanel.classList.remove('hidden');
      }

      // Download the workflow file
      try {
        const exportResponse = await fetch(`/api/workflow/${workflowId}/export`, {
          headers: { 'X-API-Key': 'default-api-key-change-in-production' }
        });
        const blob = await exportResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workflow_${workflowId}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (downloadErr) {
        console.error('Download error:', downloadErr);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed. See alert.', false);
      alert(`Error: ${error.message}`);
    } finally {
      setButtonLoading(false);
      if (statusText && statusText.textContent === 'Running triad...') {
        setStatus('');
      }
    }
  }

  if (generateBtn) generateBtn.addEventListener('click', generateWorkflow);

  if (copyJsonBtn && workflowJsonEl) {
    copyJsonBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(workflowJsonEl.value || '');
        copyJsonBtn.textContent = 'Copied!';
        setTimeout(() => { copyJsonBtn.textContent = 'Copy'; }, 1200);
      } catch (err) {
        alert('Copy failed. Please copy manually.');
      }
    });
  }
})();

// ---------------------------------------------------------------------------
// Placeholder marquee + example chips (CSP-safe, no dependencies, no globals)
// ---------------------------------------------------------------------------
// New class hooks for the stylesheet:
//   textarea.is-typing  -> the placeholder is currently being typed out
//   button.is-active    -> the example chip whose prompt is loaded
// (aria-pressed="true"/"false" is mirrored on every .example-chip)
// ---------------------------------------------------------------------------
(() => {
  const textarea = document.getElementById('requirements');
  if (!textarea) return;

  const PROMPTS = [
    'Sync Stripe payments to Postgres',
    'Email me a daily sales digest',
    'Log API errors to Slack'
  ];

  const TYPE_DELAY = [45, 60];     // ms per typed character
  const DELETE_DELAY = [20, 30];   // ms per deleted character
  const HOLD_DELAY = [1800, 2400]; // ms a finished prompt stays on screen
  const GAP_DELAY = [250, 500];    // ms pause between prompts

  const TYPING_CLASS = 'is-typing';
  const ACTIVE_CLASS = 'is-active';
  const FALLBACK_PLACEHOLDER = 'Describe the workflow you want to automate.';

  const rand = (range) => range[0] + Math.random() * (range[1] - range[0]);

  const motionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const reducedMotion = () => Boolean(motionQuery && motionQuery.matches);

  const originalPlaceholder = textarea.getAttribute('placeholder') || '';

  let phase = 'type'; // type | hold | delete | gap
  let promptIndex = 0;
  let typed = '';
  let timer = null;
  let started = false;
  let stopped = false;

  const setPlaceholder = (value) => {
    textarea.setAttribute('placeholder', value);
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

  // Single state machine: one character per tick, phase transitions below.
  const tick = () => {
    timer = null;
    if (stopped) return;
    if (document.hidden) return; // paused while the tab is hidden

    const prompt = PROMPTS[promptIndex];

    if (phase === 'type') {
      if (typed.length < prompt.length) {
        typed += prompt.charAt(typed.length);
        setPlaceholder(typed);
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
        setPlaceholder(typed);
        schedule(rand(DELETE_DELAY));
        return;
      }
      phase = 'gap';
      promptIndex = (promptIndex + 1) % PROMPTS.length;
      schedule(rand(GAP_DELAY));
      return;
    }

    phase = 'type'; // gap -> next prompt
    schedule(0);
  };

  // Stops the marquee for good and restores a sensible static hint.
  const stopAnimation = () => {
    if (stopped) return;
    stopped = true;
    clearTimer();
    if (started) {
      textarea.classList.remove(TYPING_CLASS);
      setPlaceholder(originalPlaceholder || FALLBACK_PLACEHOLDER);
    }
  };

  const startAnimation = () => {
    if (started || stopped) return;
    if (reducedMotion()) {
      setPlaceholder(PROMPTS[0]);
      return;
    }
    started = true;
    textarea.classList.add(TYPING_CLASS);
    phase = 'type';
    promptIndex = 0;
    typed = '';
    schedule(0);
  };

  // --- example chips -------------------------------------------------------
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

  // Delegated so chips added later still work. Buttons fire `click` for both
  // Enter and Space, and type="button" keeps them from submitting anything.
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== 'function') return;
    const chip = target.closest('.example-chip');
    if (!chip) return;

    const prompt = chip.getAttribute('data-prompt');
    if (typeof prompt !== 'string' || prompt.length === 0) return;

    event.preventDefault();
    stopAnimation();
    textarea.value = prompt;
    try {
      textarea.focus();
      textarea.setSelectionRange(prompt.length, prompt.length);
    } catch (err) {
      /* selection is best effort */
    }
    setActiveChip(chip);
  });

  // --- stop conditions -----------------------------------------------------
  textarea.addEventListener('focus', stopAnimation);
  textarea.addEventListener('input', () => {
    stopAnimation();
    setActiveChip(null);
  });

  const generateBtn = document.getElementById('generate-btn');
  if (generateBtn) generateBtn.addEventListener('click', stopAnimation);
  document.addEventListener('submit', stopAnimation);

  // --- environment ---------------------------------------------------------
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
      setPlaceholder(PROMPTS[0]);
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
    setPlaceholder(PROMPTS[0]);
  } else {
    startAnimation();
  }
})();

// ---------------------------------------------------------------------------
// Animated Subtitle with Typing Effect & Rotating Typography
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
    'style-1',  // Clean modern sans-serif with medium weight
    'style-2',  // Bold geometric sans-serif
    'style-3',  // Subtle italic typography
    'style-4',  // Monospaced developer-style typography
    'style-5'   // Refined font with slightly wider letter spacing
  ];

  const TYPE_DELAY = [45, 75];      // ms per typed character
  const DELETE_DELAY = [25, 45];    // ms per deleted character
  const HOLD_DELAY = [900, 1400];   // ms a finished message stays on screen
  const GAP_DELAY = [150, 300];     // ms pause between messages

  const motionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const reducedMotion = () => Boolean(motionQuery && motionQuery.matches);

  let phase = 'type';        // type | hold | delete | gap
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

  // Environment handling
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
