document.addEventListener('DOMContentLoaded', () => {
  const statusIndicator = document.getElementById('status-indicator');
  const replacementCount = document.getElementById('replacement-count');
  const toggleBtn = document.getElementById('toggle-btn');
  
  let enabled = true;
  
  chrome.storage.local.get(['enabled', 'replacements'], (result) => {
    enabled = result.enabled !== false;
    updateUI(enabled, result.replacements || 0);
  });
  
  toggleBtn.addEventListener('click', () => {
    enabled = !enabled;
    chrome.storage.local.set({ enabled });
    updateUI(enabled, parseInt(replacementCount.textContent));
    
    chrome.runtime.sendMessage({ type: 'TOGGLE', enabled });
  });
  
  function updateUI(isEnabled, count) {
    if (isEnabled) {
      statusIndicator.textContent = '● Active';
      statusIndicator.className = 'enabled';
      toggleBtn.textContent = 'Disable';
    } else {
      statusIndicator.textContent = '○ Disabled';
      statusIndicator.className = '';
      statusIndicator.style.color = '#f87171';
      toggleBtn.textContent = 'Enable';
    }
    replacementCount.textContent = count;
  }
  
  setInterval(() => {
    chrome.storage.local.get(['replacements'], (result) => {
      const currentCount = parseInt(replacementCount.textContent);
      if (result.replacements !== currentCount) {
        replacementCount.textContent = result.replacements || 0;
      }
    });
  }, 1000);
});
