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
      <header class="calculator-header">
        <h1>Home Loan Calculator</h1>
        <p class="subtitle">EMI estimate for Malaysian property financing</p>
      </header>

      {/* Input Section */}
      <div class="card">
        {/* Loan Amount Input */}
        <div class="input-group">
          <label class="input-label" for="home-loan-amount">Loan Amount</label>
          <div class="input-wrapper">
            <span class="input-prefix">RM</span>
            <input
              id="home-loan-amount"
              type="number"
              placeholder="400,000"
              value={presenter.loanAmount()}
              onInput={(e) => presenter.setLoanAmount(e.currentTarget.value)}
              class={`input-field has-prefix ${presenter.errors().loanAmount ? 'error' : ''}`}
            />
          </div>
          <Show when={presenter.errors().loanAmount}>
            <span class="error-msg">{presenter.errors().loanAmount}</span>
          </Show>
        </div>

        {/* Interest Rate Input */}
        <div class="input-group">
          <label class="input-label" for="home-interest-rate">Annual Interest Rate</label>
          <div class="input-wrapper">
            <input
              id="home-interest-rate"
              type="number"
              step="0.1"
              placeholder="4.5"
              value={presenter.interestRate()}
              onInput={(e) => presenter.setInterestRate(e.currentTarget.value)}
              class={`input-field has-suffix ${presenter.errors().interestRate ? 'error' : ''}`}
            />
            <span class="input-suffix">% p.a.</span>
          </div>
          <Show when={presenter.errors().interestRate}>
            <span class="error-msg">{presenter.errors().interestRate}</span>
          </Show>
        </div>

        {/* Loan Tenure Input */}
        <div class="input-group">
          <label class="input-label" for="home-loan-tenure">Loan Tenure</label>
          <div class="input-wrapper">
            <input
              id="home-loan-tenure"
              type="number"
              placeholder="30"
              value={presenter.loanTenure()}
              onInput={(e) => presenter.setLoanTenure(e.currentTarget.value)}
              class={`input-field has-suffix ${presenter.errors().loanTenure ? 'error' : ''}`}
            />
            <span class="input-suffix">years</span>
          </div>
          <Show when={presenter.errors().loanTenure}>
            <span class="error-msg">{presenter.errors().loanTenure}</span>
          </Show>
        </div>

        {/* Calculate Button */}
        <button
          onClick={() => presenter.handleCalculate()}
          class="btn btn-secondary"
        >
          Calculate
        </button>
      </div>

      {/* Results Section */}
      <Show when={presenter.result()}>
        <section class="results-section">
          <h2 class="results-header">Results</h2>
          <div class="result-card home-loan">
            <div class="result-highlight">
              <span class="result-label">Monthly EMI</span>
              <span class="result-value">{presenter.result()?.monthlyRepayment}</span>
            </div>
            <div class="result-details">
              <div class="result-item">
                <span class="result-label">Total Interest</span>
                <span class="result-value">{presenter.result()?.totalInterest}</span>
              </div>
              <div class="result-item">
                <span class="result-label">Total Repayment</span>
                <span class="result-value">{presenter.result()?.totalRepayment}</span>
              </div>
            </div>
          </div>
        </section>
      </Show>

      {/* Disclaimer */}
      <div class="disclaimer">
        <strong>Note:</strong> This is a basic EMI estimate. Actual Malaysian home loans use reducing balance with Base Rate (BR) + margin, which can fluctuate. This does not account for BR changes, monthly interest recalculation, or DSR requirements.
        <br /><br />
        <strong>Example:</strong> RM 400,000 at 4.5% for 30 years ≈ RM 2,027/month
      </div>
    </div>
  );
};

export default HomeLoanCalculator;
