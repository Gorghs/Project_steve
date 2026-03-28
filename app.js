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

      const workflowId = data.workflowId;
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
