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
    <div class="calculator-container">
      <header class="calculator-header">
        <h1>Car Loan Calculator</h1>
        <p class="subtitle">Flat-rate interest calculation for Malaysian car financing</p>
      </header>

      {/* Input Section */}
      <div class="card">
        {/* Loan Amount Input */}
        <div class="input-group">
          <label class="input-label" for="car-loan-amount">Loan Amount</label>
          <div class="input-wrapper">
            <span class="input-prefix">RM</span>
            <input
              id="car-loan-amount"
              type="number"
              placeholder="70,000"
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
          <label class="input-label" for="car-interest-rate">Annual Interest Rate</label>
          <div class="input-wrapper">
            <input
              id="car-interest-rate"
              type="number"
              step="0.1"
              placeholder="3.5"
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

        {/* Loan Period Input */}
        <div class="input-group">
          <label class="input-label" for="car-loan-period">Loan Period</label>
          <div class="input-wrapper">
            <input
              id="car-loan-period"
              type="number"
              placeholder="5"
              value={presenter.loanPeriod()}
              onInput={(e) => presenter.setLoanPeriod(e.currentTarget.value)}
              class={`input-field has-suffix ${presenter.errors().loanPeriod ? 'error' : ''}`}
            />
            <span class="input-suffix">years</span>
          </div>
          <Show when={presenter.errors().loanPeriod}>
            <span class="error-msg">{presenter.errors().loanPeriod}</span>
          </Show>
        </div>

        {/* Calculate Button */}
        <button
          onClick={() => presenter.handleCalculate()}
          class="btn btn-primary"
        >
          Calculate
        </button>
      </div>

      {/* Results Section */}
      <Show when={presenter.result()}>
        <section class="results-section">
          <h2 class="results-header">Results</h2>
          <div class="result-card">
            <div class="result-highlight">
              <span class="result-label">Monthly Installment</span>
              <span class="result-value">{presenter.result()?.monthlyInstallment}</span>
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

      {/* Example Note */}
      <div class="disclaimer">
        <strong>Example:</strong> RM 70,000 loan at 3.5% p.a. for 5 years = RM 12,250 total interest, RM 1,370.83/month
      </div>
    </div>
  );
};

export default CarLoanCalculator;
