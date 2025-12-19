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
      <h1>Malaysian Car Loan Calculator</h1>
      <p class="subtitle">Flat-Rate Interest Calculation</p>

      {/* Input Section */}
      <div class="card">
        {/* Loan Amount Input */}
        <div class="input-group">
          <label class="input-label">Loan Amount (RM)</label>
          <input
            type="number"
            placeholder="e.g., 70000"
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
            placeholder="e.g., 3.5"
            value={presenter.interestRate()}
            onInput={(e) => presenter.setInterestRate(e.currentTarget.value)}
            class={`input-field ${presenter.errors().interestRate ? 'error' : ''}`}
          />
          <Show when={presenter.errors().interestRate}>
            <span class="error-msg">{presenter.errors().interestRate}</span>
          </Show>
        </div>

        {/* Loan Period Input */}
        <div class="input-group">
          <label class="input-label">Loan Period (years)</label>
          <input
            type="number"
            placeholder="e.g., 5"
            value={presenter.loanPeriod()}
            onInput={(e) => presenter.setLoanPeriod(e.currentTarget.value)}
            class={`input-field ${presenter.errors().loanPeriod ? 'error' : ''}`}
          />
          <Show when={presenter.errors().loanPeriod}>
            <span class="error-msg">{presenter.errors().loanPeriod}</span>
          </Show>
        </div>

        {/* Calculate Button */}
        <button
          onClick={() => presenter.handleCalculate()}
          class="btn btn-primary"
        >
          Calculate Repayment
        </button>
      </div>

      {/* Results Section */}
      <Show when={presenter.result()}>
        <div class="result-card">
          <div class="result-item">
            <span class="result-label">Total Interest</span>
            <span class="result-value">{presenter.result()?.totalInterest}</span>
          </div>

          <div class="result-item">
            <span class="result-label">Total Repayment</span>
            <span class="result-value">{presenter.result()?.totalRepayment}</span>
          </div>

          <div class="result-highlight">
            <span class="result-label">Monthly Installment</span>
            <span class="result-value">{presenter.result()?.monthlyInstallment}</span>
          </div>
        </div>
      </Show>

      {/* Example Section */}
      <div class="disclaimer">
        <strong>Example:</strong> RM 70,000 loan at 3.5% p.a. for 5 years<br />
        Total Interest: RM 12,250.00 | Monthly: RM 1,370.83
      </div>
    </div>
  );
};

export default CarLoanCalculator;
