// Project Steve frontend interactions (moved out of inline script to satisfy CSP)
(() => {
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const generateBtn = document.getElementById('generate-btn');
  const startBuildingBtn = document.getElementById('start-building-btn');
  const viewDocsBtn = document.getElementById('view-docs-btn');

  const closeModal = () => modal.classList.remove('show');
  const showDocs = () => modal.classList.add('show');
  const scrollToBuilder = () => {
    const target = document.getElementById('builder');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  async function generateWorkflow() {
    const requirementsInput = document.getElementById('requirements');
    const requirements = requirementsInput ? requirementsInput.value : '';
    if (!requirements.trim()) {
      alert('Please describe what you want to automate!');
      return;
    }

    const originalText = generateBtn.textContent;
    generateBtn.textContent = '⏳ Processing... (Build → QA → Security)';
    generateBtn.disabled = true;

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
      const message = `✅ Workflow Generated Successfully!\n\n🎯 Workflow ID: ${workflowId}\n\n📋 Phases Completed:\n✓ Build Captain - Architecture generated\n✓ QA Compliance - Validated\n✓ Security Architect - Hardened\n\n💾 Your workflow JSON is ready!`;
      alert(message);

      window.location.href = `/api/workflow/${workflowId}/export`;
    } catch (error) {
      console.error('Error:', error);
      alert(`❌ Error: ${error.message}\n\nPlease try again or check the console for details.`);
    } finally {
      generateBtn.textContent = originalText;
      generateBtn.disabled = false;
    }
  }

  document.addEventListener('click', (evt) => {
    if (evt.target === modal) {
      closeModal();
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (viewDocsBtn) viewDocsBtn.addEventListener('click', showDocs);
  if (startBuildingBtn) startBuildingBtn.addEventListener('click', scrollToBuilder);
  if (generateBtn) generateBtn.addEventListener('click', generateWorkflow);
})();
