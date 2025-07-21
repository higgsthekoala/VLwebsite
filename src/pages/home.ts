
/*
 * Page | Home
 */

// CORRECTED VERSION:
import { IModule } from "@sygnal/sse";
import React from 'react';
import ReactDOM from 'react-dom/client';
import HomeContent from './home-content'; // 

export class HomePage implements IModule {
  private root: ReactDOM.Root | null = null;

  setup() {
    // Create container for home page
    const container = document.createElement('div');
    container.id = 'home-page-container';
    container.setAttribute('data-sse-page', '/');
    document.body.appendChild(container);
    this.root = ReactDOM.createRoot(container);
  }

  exec() {
    if (this.root) {
      this.root.render(<HomeContent />); 
    }
  }
}