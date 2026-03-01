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

  async function generateWorkflow() {
    const requirementsInput = document.getElementById('requirements');
    const requirements = requirementsInput ? requirementsInput.value : '';
    if (!requirements.trim()) {
      alert('Please describe what you want to automate.');
      return;
    }

    const originalText = generateBtn.textContent;
    generateBtn.textContent = 'Processing... Build → QA → Security';
    generateBtn.disabled = true;
    setStatus('Running triad...');

    try {
      const response = await fetch('/api/generate-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirements })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || `HTTP ${response.status}`);
      }

      const workflowId = data.workflowId;
      setStatus('Completed. Downloading...', true);

      if (workflowJsonEl && resultPanel) {
        workflowJsonEl.value = JSON.stringify(data.workflow, null, 2);
        resultPanel.classList.remove('hidden');
      }

      window.location.href = `/api/workflow/${workflowId}/export`;
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed. See alert.', false);
      alert(`Error: ${error.message}`);
    } finally {
      generateBtn.textContent = originalText;
      generateBtn.disabled = false;
      if (statusText && statusText.textContent === 'Running triad...') {
        setStatus('Ready.');
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
