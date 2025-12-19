/**
 * View: Car Loan Calculator UI
 * 
 * Simple user interface with NO business logic.
 * Only responsible for:
 * - Rendering input fields and labels
 * - Displaying calculation results
 * - Forwarding user actions to Presenter
 */

import { Component, Show } from 'solid-js';
import { createCarLoanPresenter } from '../presenter/CarLoanPresenter';

const CarLoanCalculator: Component = () => {
  const presenter = createCarLoanPresenter();

  return (
    <div style={{
      'max-width': '600px',
      margin: '0 auto',
      padding: '20px',
      'font-family': 'system-ui, -apple-system, sans-serif',
    }}>
      <h1 style={{ 'text-align': 'center', color: '#2c3e50' }}>
        Malaysian Car Loan Calculator
      </h1>
      <p style={{ 'text-align': 'center', color: '#7f8c8d', 'margin-bottom': '30px' }}>
        Flat-Rate Interest Calculation
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
            placeholder="e.g., 70000"
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
            placeholder="e.g., 3.5"
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

        {/* Loan Period Input */}
        <div style={{ 'margin-bottom': '15px' }}>
          <label style={{ display: 'block', 'font-weight': 'bold', 'margin-bottom': '5px' }}>
            Loan Period (years)
          </label>
          <input
            type="number"
            placeholder="e.g., 5"
            value={presenter.loanPeriod()}
            onInput={(e) => presenter.setLoanPeriod(e.currentTarget.value)}
            style={{
              width: '100%',
              padding: '10px',
              'font-size': '16px',
              border: presenter.errors().loanPeriod ? '2px solid #e74c3c' : '1px solid #ddd',
              'border-radius': '4px',
              'box-sizing': 'border-box',
            }}
          />
          <Show when={presenter.errors().loanPeriod}>
            <span style={{ color: '#e74c3c', 'font-size': '14px' }}>
              {presenter.errors().loanPeriod}
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
            background: '#3498db',
            border: 'none',
            'border-radius': '4px',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#2980b9')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#3498db')}
        >
          Calculate
        </button>
      </div>

      {/* Results Section */}
      <Show when={presenter.result()}>
        <div style={{
          background: '#e8f5e9',
          padding: '20px',
          'border-radius': '8px',
          border: '2px solid #4caf50',
        }}>
          <h2 style={{ 'margin-top': '0', color: '#2c3e50' }}>Calculation Results</h2>

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

          <div style={{
            'margin-top': '20px',
            'padding-top': '20px',
            'border-top': '2px solid #4caf50',
          }}>
            <div style={{ color: '#7f8c8d', 'font-size': '14px' }}>Monthly Installment</div>
            <div style={{ 'font-size': '28px', 'font-weight': 'bold', color: '#27ae60' }}>
              {presenter.result()?.monthlyInstallment}
            </div>
          </div>
        </div>
      </Show>

      {/* Example Section */}
      <div style={{
        'margin-top': '30px',
        padding: '15px',
        background: '#fff3cd',
        'border-radius': '4px',
        'font-size': '14px',
        color: '#856404',
      }}>
        <strong>Example:</strong> RM 70,000 loan at 3.5% p.a. for 5 years<br />
        Total Interest: RM 12,250.00 | Monthly: RM 1,370.83
      </div>
    </div>
  );
};

export default CarLoanCalculator;
