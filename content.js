(function() {
  'use strict';

  console.log('[Suno Persona Unlocker] Content script loaded');

  const originalFetch = window.fetch;
  let replacementCount = 0;

  const DISABLED_PATTERN = /"aria-label":"Create Persona",disabled:E,/g;
  const ISDISABLED_PATTERN = /isDisabled:![a-z],label:"Personas cannot be created from audio uploads."/g;

  window.fetch = async function(...args) {
    const url = args[0];
    const response = await originalFetch.apply(this, args);
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('javascript') && !url.toString().includes('.js')) {
      return response;
    }

    const urlStr = url.toString();
    if (!urlStr.includes('suno.com')) {
      return response;
    }

    try {
      const clonedResponse = response.clone();
      const text = await clonedResponse.text();
      
      const hasCreatePersona = text.includes('Create Persona');
      const hasDisabledE = text.includes('disabled:E');
      const hasPersonaUploadMessage = text.includes('Personas cannot be created from audio uploads');
      
      if (hasCreatePersona && (hasDisabledE || hasPersonaUploadMessage)) {
        console.log('[Suno Persona Unlocker] Found target JS file:', urlStr);
        
        let modifiedText = text;
        let fileReplacements = 0;
        
        if (hasDisabledE) {
          modifiedText = modifiedText.replace(DISABLED_PATTERN, () => {
            fileReplacements++;
            return '"aria-label":"Create Persona",disabled:false,';
          });
        }
        
        if (hasPersonaUploadMessage) {
          modifiedText = modifiedText.replace(ISDISABLED_PATTERN, () => {
            fileReplacements++;
            return 'isDisabled:false,label:"Personas cannot be created from audio uploads."';
          });
        }

        replacementCount += fileReplacements;

        if (fileReplacements > 0) {
          console.log(`[Suno Persona Unlocker] Made ${fileReplacements} replacements in:`, urlStr);
          
          const newResponse = new Response(modifiedText, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
          
          return newResponse;
        }
      }
    } catch (error) {
      console.error('[Suno Persona Unlocker] Error processing response:', error);
    }

    return response;
  };

  window.__sunoPersonaUnlocker = {
    active: true,
    replacements: () => replacementCount,
    lastUrl: null
  };

  console.log('[Suno Persona Unlocker] Fetch interceptor installed');
})();
