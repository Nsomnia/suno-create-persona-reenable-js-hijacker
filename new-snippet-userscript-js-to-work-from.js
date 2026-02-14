// ==UserScript==
// @name         Suno - Unlock Persona Creator (Uploads Supported)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enables the "Make Persona" button for all tracks, including uploads, by patching React properties.
// @author       github.com/Nsomnia
// @match        *://suno.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    /**
     * This function finds the React internal properties (Fiber) attached to a DOM node.
     * This allows us to modify the 'disabled' or 'isDisabled' props directly in React's logic.
     */
    function getReactProps(element) {
        const key = Object.keys(element).find(k => k.startsWith('__reactProps') || k.startsWith('__reactInternalInstance'));
        return element[key];
    }

    function unlockPersonaButtons() {
        // 1. Target buttons via Aria Label or Text Content
        const buttons = document.querySelectorAll('button, [role="button"]');

        buttons.forEach(btn => {
            const label = btn.getAttribute('aria-label');
            const text = btn.innerText;

            // Check if this is the "Create Persona" or "Make Persona" button
            if (
                (label && label.includes("Create Persona")) || 
                (text && text.includes("Make Persona"))
            ) {
                // Remove HTML-level disabled state
                btn.disabled = false;
                btn.removeAttribute('disabled');
                
                // Remove CSS classes that prevent clicking (like Tailwind's pointer-events-none)
                btn.classList.remove('pointer-events-none', 'opacity-50');

                // Access React internals to force the logic change
                const props = getReactProps(btn);
                if (props) {
                    if (props.disabled !== undefined) props.disabled = false;
                    if (props.isDisabled !== undefined) props.isDisabled = false;
                    
                    // If there's a tooltip/wrapper preventing interaction, we force it here
                    if (props.children && props.children.props) {
                        props.children.props.isDisabled = false;
                        props.children.props.disabled = false;
                    }
                }
            }
        });

        // 2. Target the tooltip/wrapper mentioned in the snippet
        // Suno uses Radix UI or similar for tooltips that block uploads.
        const overlays = document.querySelectorAll('[data-state]');
        overlays.forEach(over => {
             const props = getReactProps(over);
             if (props && props.label && props.label.includes("uploads")) {
                 props.isDisabled = false;
             }
        });
    }

    // Run the unlocker every 1 second to catch buttons in modals or menus
    const observer = new MutationObserver(() => {
        unlockPersonaButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    unlockPersonaButtons();

    console.log("Suno Persona Unlocker Active: 'Make Persona' logic patched.");
})();