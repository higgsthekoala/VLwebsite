/*
 * SITE  
 * Main entry point
 * 
 * https://engine.sygnal.com/
 * 
 * ENGINE MODE
 * ?engine.mode=dev
 * ?engine.mode=prod
 * 
 */

import { VERSION } from "./version";
import { routeDispatcher } from "./routes";
import { ComponentManager } from "./engine/component-manager";
import { Header } from './Header';
import './styles/globals.css';

interface SiteGlobalDataType {
    // Define properties and their types for SiteDataType
}

// Global vars
const SITE_NAME = 'Site';

declare global {
    interface Window {
        fsAttributes: [string, (filterInstances: any[]) => void][];
        Site: SiteGlobalDataType;
        Webflow: {
            require: (module: string) => {
                destroy: () => void; 
                init: () => void;
            };
          };
        sa5: any;
        componentManager: ComponentManager;
    }
}

window.componentManager = new ComponentManager();


// Navigation handler
function handleNavigation() {
  // Update visibility of all page containers
  document.querySelectorAll('[data-sse-page]').forEach(el => {
    const element = el as HTMLElement;
    const pagePath = element.getAttribute('data-sse-page');
    
    element.style.display = pagePath === window.location.pathname 
      ? 'block' 
      : 'none';
  });
  
  // Notify other parts of the application
  window.dispatchEvent(new CustomEvent('routechange', {
    detail: { 
      path: window.location.pathname,
      timestamp: Date.now() 
    }
  }));
}

function handleLinkClicks(e: MouseEvent) {
  const link = (e.target as HTMLElement).closest('a[href]');
  if (!link) return;
  
  const href = link.getAttribute('href');
  
  if (href?.startsWith('/')) {
    e.preventDefault();
    window.history.pushState({}, '', href);
    handleNavigation(); // This will trigger the event
  }
}

// Perform setup, sync
const setup = () => {
    console.log(`${SITE_NAME} package init v${VERSION}`);
    routeDispatcher().setupRoute(); 
}

// Perform exec, async
const exec = () => {
    routeDispatcher().execRoute(); 
    
    // Set up navigation
    window.addEventListener('popstate', handleNavigation);
    document.addEventListener('click', handleLinkClicks);
    handleNavigation();

    // Initialize components
    const components = document.querySelectorAll<HTMLElement>('[sse-component]');
    components.forEach(element => {
        const componentValue = element.getAttribute('sse-component');
         
        if (componentValue) {
            switch (componentValue) {
                case 'Header':
                    new Header().init(element);
                    break;
                default:
                    console.log('Unknown component:', componentValue);
                    break;
            }
        }
    });    

    console.log('SSE initialized');
}

/**
 * Initialize
 */
setup();

if (document.readyState !== 'loading') {
    exec();
} else {
    document.addEventListener("DOMContentLoaded", exec);
}

// Export for Webflow integration
(window as any).SygnalEngine = {
  init: () => console.log('Engine initialized via Webflow')
};