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
    <div class="calculator-container">
      <h1>Malaysian Home Loan Calculator</h1>
      <p class="subtitle">EMI Calculation (Basic Estimate)</p>

      {/* Input Section */}
      <div class="card">
        {/* Loan Amount Input */}
        <div class="input-group">
          <label class="input-label">Loan Amount (RM)</label>
          <input
            type="number"
            placeholder="e.g., 400000"
            value={presenter.loanAmount()}
            onInput={(e) => presenter.setLoanAmount(e.currentTarget.value)}
            class={`input-field ${presenter.errors().loanAmount ? 'error' : ''}`}
          />
          <Show when={presenter.errors().loanAmount}>
            <span class="error-msg">{presenter.errors().loanAmount}</span>
          </Show>
        </div>

        {/* Interest Rate Input */}
        <div class="input-group">
          <label class="input-label">Annual Interest Rate (% p.a.)</label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g., 4.5"
            value={presenter.interestRate()}
            onInput={(e) => presenter.setInterestRate(e.currentTarget.value)}
            class={`input-field ${presenter.errors().interestRate ? 'error' : ''}`}
          />
          <Show when={presenter.errors().interestRate}>
            <span class="error-msg">{presenter.errors().interestRate}</span>
          </Show>
        </div>

        {/* Loan Tenure Input */}
        <div class="input-group">
          <label class="input-label">Loan Tenure (years)</label>
          <input
            type="number"
            placeholder="e.g., 30"
            value={presenter.loanTenure()}
            onInput={(e) => presenter.setLoanTenure(e.currentTarget.value)}
            class={`input-field ${presenter.errors().loanTenure ? 'error' : ''}`}
          />
          <Show when={presenter.errors().loanTenure}>
            <span class="error-msg">{presenter.errors().loanTenure}</span>
          </Show>
        </div>

        {/* Calculate Button */}
        <button
          onClick={() => presenter.handleCalculate()}
          class="btn btn-secondary"
        >
          Calculate Repayment
        </button>
      </div>

      {/* Results Section */}
      <Show when={presenter.result()}>
        <div class="result-card home-loan">
          <div class="result-highlight">
            <span class="result-label">Monthly Repayment (EMI)</span>
            <span class="result-value">{presenter.result()?.monthlyRepayment}</span>
          </div>

          <div class="result-item">
            <span class="result-label">Total Interest</span>
            <span class="result-value">{presenter.result()?.totalInterest}</span>
          </div>

          <div class="result-item">
            <span class="result-label">Total Repayment</span>
            <span class="result-value">{presenter.result()?.totalRepayment}</span>
          </div>
        </div>
      </Show>

      {/* Disclaimer */}
      <div class="disclaimer">
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
