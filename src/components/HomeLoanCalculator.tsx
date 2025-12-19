/**
 * View: Home Loan Calculator UI
 * 
 * Simple user interface with NO business logic.
 * Only responsible for:
 * - Rendering input fields and labels
 * - Displaying calculation results
 * - Forwarding user actions to Presenter
 */

import { Component, Show } from 'solid-js';
import { createHomeLoanPresenter } from '../presenter/HomeLoanPresenter';

const HomeLoanCalculator: Component = () => {
  const presenter = createHomeLoanPresenter();

  return (
    <div style={{
      'max-width': '600px',
      margin: '0 auto',
      padding: '20px',
      'font-family': 'system-ui, -apple-system, sans-serif',
    }}>
      <h1 style={{ 'text-align': 'center', color: '#2c3e50' }}>
        Malaysian Home Loan Calculator
      </h1>
      <p style={{ 'text-align': 'center', color: '#7f8c8d', 'margin-bottom': '30px' }}>
        EMI Calculation (Basic Estimate)
      </p>

      {/* Input Section */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        'border-radius': '8px',
        'margin-bottom': '20px',
      }}>
        {/* Loan Amount Input */}
        <div style={{ 'margin-bottom': '15px' }}>
          <label style={{ display: 'block', 'font-weight': 'bold', 'margin-bottom': '5px' }}>
            Loan Amount (RM)
          </label>
          <input
            type="number"
            placeholder="e.g., 400000"
            value={presenter.loanAmount()}
            onInput={(e) => presenter.setLoanAmount(e.currentTarget.value)}
            style={{
              width: '100%',
              padding: '10px',
              'font-size': '16px',
              border: presenter.errors().loanAmount ? '2px solid #e74c3c' : '1px solid #ddd',
              'border-radius': '4px',
              'box-sizing': 'border-box',
            }}
          />
          <Show when={presenter.errors().loanAmount}>
            <span style={{ color: '#e74c3c', 'font-size': '14px' }}>
              {presenter.errors().loanAmount}
            </span>
          </Show>
        </div>

        {/* Interest Rate Input */}
        <div style={{ 'margin-bottom': '15px' }}>
          <label style={{ display: 'block', 'font-weight': 'bold', 'margin-bottom': '5px' }}>
            Annual Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g., 4.5"
            value={presenter.interestRate()}
            onInput={(e) => presenter.setInterestRate(e.currentTarget.value)}
            style={{
              width: '100%',
              padding: '10px',
              'font-size': '16px',
              border: presenter.errors().interestRate ? '2px solid #e74c3c' : '1px solid #ddd',
              'border-radius': '4px',
              'box-sizing': 'border-box',
            }}
          />
          <Show when={presenter.errors().interestRate}>
            <span style={{ color: '#e74c3c', 'font-size': '14px' }}>
              {presenter.errors().interestRate}
            </span>
          </Show>
        </div>

        {/* Loan Tenure Input */}
        <div style={{ 'margin-bottom': '15px' }}>
          <label style={{ display: 'block', 'font-weight': 'bold', 'margin-bottom': '5px' }}>
            Loan Tenure (years)
          </label>
          <input
            type="number"
            placeholder="e.g., 30"
            value={presenter.loanTenure()}
            onInput={(e) => presenter.setLoanTenure(e.currentTarget.value)}
            style={{
              width: '100%',
              padding: '10px',
              'font-size': '16px',
              border: presenter.errors().loanTenure ? '2px solid #e74c3c' : '1px solid #ddd',
              'border-radius': '4px',
              'box-sizing': 'border-box',
            }}
          />
          <Show when={presenter.errors().loanTenure}>
            <span style={{ color: '#e74c3c', 'font-size': '14px' }}>
              {presenter.errors().loanTenure}
            </span>
          </Show>
        </div>

        {/* Calculate Button */}
        <button
          onClick={() => presenter.handleCalculate()}
          style={{
            width: '100%',
            padding: '12px',
            'font-size': '16px',
            'font-weight': 'bold',
            color: 'white',
            background: '#27ae60',
            border: 'none',
            'border-radius': '4px',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#229954')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#27ae60')}
        >
          Calculate
        </button>
      </div>

      {/* Results Section */}
      <Show when={presenter.result()}>
        <div style={{
          background: '#e8f8f5',
          padding: '20px',
          'border-radius': '8px',
          border: '2px solid #27ae60',
        }}>
          <h2 style={{ 'margin-top': '0', color: '#2c3e50' }}>Calculation Results</h2>

          <div style={{
            'margin-bottom': '20px',
            'padding-bottom': '20px',
            'border-bottom': '2px solid #27ae60',
          }}>
            <div style={{ color: '#7f8c8d', 'font-size': '14px' }}>Monthly Repayment (EMI)</div>
            <div style={{ 'font-size': '28px', 'font-weight': 'bold', color: '#27ae60' }}>
              {presenter.result()?.monthlyRepayment}
            </div>
          </div>

          <div style={{ 'margin-bottom': '12px' }}>
            <div style={{ color: '#7f8c8d', 'font-size': '14px' }}>Total Interest</div>
            <div style={{ 'font-size': '20px', 'font-weight': 'bold', color: '#2c3e50' }}>
              {presenter.result()?.totalInterest}
            </div>
          </div>

          <div style={{ 'margin-bottom': '12px' }}>
            <div style={{ color: '#7f8c8d', 'font-size': '14px' }}>Total Repayment Amount</div>
            <div style={{ 'font-size': '20px', 'font-weight': 'bold', color: '#2c3e50' }}>
              {presenter.result()?.totalRepayment}
            </div>
          </div>
        </div>
      </Show>

      {/* Disclaimer */}
      <div style={{
        'margin-top': '20px',
        padding: '15px',
        background: '#fff3cd',
        'border-radius': '4px',
        'font-size': '13px',
        color: '#856404',
        'line-height': '1.6',
      }}>
        <strong>📌 Disclaimer:</strong> This is a basic EMI estimate for planning purposes only. 
        Actual Malaysian home loans use reducing balance with Base Rate (BR) + margin, which can 
        fluctuate over time. This calculator does not account for BR changes, monthly interest 
        recalculation, DSR requirements, or bank-specific rules.
        <br /><br />
        <strong>Example:</strong> RM 400,000 at 4.5% p.a. for 30 years ≈ RM 2,027/month
      </div>
    </div>
  );
};

export default HomeLoanCalculator;
