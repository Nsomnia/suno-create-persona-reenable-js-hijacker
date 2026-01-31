chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Suno Persona Unlocker] Extension installed/updated:', details.reason);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_STATUS') {
    chrome.storage.local.get(['enabled', 'replacements'], (result) => {
      sendResponse({
        enabled: result.enabled !== false,
        replacements: result.replacements || 0
      });
    });
    return true;
  }
  
  if (request.type === 'UPDATE_REPLACEMENTS') {
    chrome.storage.local.set({ replacements: request.count });
  }
  
  if (request.type === 'TOGGLE') {
    chrome.storage.local.set({ enabled: request.enabled }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

console.log('[Suno Persona Unlocker] Background service worker loaded');
