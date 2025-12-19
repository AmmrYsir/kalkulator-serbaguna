/**
 * View: Home Loan Calculator (Coming Soon)
 * 
 * Placeholder for future home loan calculator feature
 */

import { Component } from 'solid-js';

const HomeLoanCalculator: Component = () => {
  return (
    <div style={{
      'max-width': '600px',
      margin: '0 auto',
      padding: '20px',
      'font-family': 'system-ui, -apple-system, sans-serif',
    }}>
      <h1 style={{ 'text-align': 'center', color: '#2c3e50' }}>
        Home Loan Calculator
      </h1>
      
      <div style={{
        background: '#f8f9fa',
        padding: '60px 40px',
        'border-radius': '8px',
        'text-align': 'center',
        'margin-top': '40px',
      }}>
        <div style={{
          'font-size': '48px',
          'margin-bottom': '20px',
        }}>
          🏠
        </div>
        <h2 style={{ color: '#7f8c8d', 'font-weight': 'normal' }}>
          Coming Soon
        </h2>
        <p style={{ color: '#95a5a6', 'font-size': '16px', 'margin-top': '10px' }}>
          Home loan calculator will be available in a future update
        </p>
      </div>
    </div>
  );
};

export default HomeLoanCalculator;
