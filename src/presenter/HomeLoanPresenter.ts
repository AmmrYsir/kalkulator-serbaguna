/**
 * Presenter: Home Loan Calculator Coordinator
 * 
 * Handles coordination between Model and View:
 * - Receives user actions (calculate button press)
 * - Validates inputs (positive values, non-empty)
 * - Delegates calculations to Model
 * - Formats results in Malaysian Ringgit
 * - Updates View through SolidJS signals
 */

import { createSignal } from 'solid-js';
import { calculateHomeLoanEMI, type HomeLoanData, type HomeLoanResult } from '../model/HomeLoanModel';

export interface ValidationError {
  loanAmount?: string;
  interestRate?: string;
  loanTenure?: string;
}

export interface FormattedHomeLoanResult {
  monthlyRepayment: string;
  totalRepayment: string;
  totalInterest: string;
}

/**
 * Format number with thousand separators
 * Example: 1000 → "1,000" or 400000 → "400,000"
 */
function formatNumberInput(value: string): string {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');
  
  if (!digitsOnly) return '';
  
  // Add thousand separators
  return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Remove formatting from display value
 * Example: "1,000" → "1000"
 */
function unformatNumberInput(value: string): string {
  return value.replace(/,/g, '');
}

/**
 * Home Loan Calculator Presenter
 * 
 * Provides reactive state management and business coordination
 * using SolidJS signals (not React hooks).
 */
export function createHomeLoanPresenter() {
  // Input state (stored as formatted display strings)
  const [loanAmount, setLoanAmountRaw] = createSignal<string>('');
  const [interestRate, setInterestRateRaw] = createSignal<string>('');
  const [loanTenure, setLoanTenureRaw] = createSignal<string>('');

  // Output state
  const [result, setResult] = createSignal<FormattedHomeLoanResult | null>(null);
  const [errors, setErrors] = createSignal<ValidationError>({});

  /**
   * Set loan amount with auto-formatting
   */
  function setLoanAmount(value: string) {
    const formatted = formatNumberInput(value);
    setLoanAmountRaw(formatted);
  }

  /**
   * Set interest rate (decimal input, no formatting needed)
   */
  function setInterestRate(value: string) {
    setInterestRateRaw(value);
  }

  /**
   * Set loan tenure (integer input, no formatting needed)
   */
  function setLoanTenure(value: string) {
    setLoanTenureRaw(value);
  }

  /**
   * Validate user inputs
   * Returns true if all inputs are valid, false otherwise
   */
  function validateInputs(): boolean {
    const validationErrors: ValidationError = {};

    const amount = parseFloat(unformatNumberInput(loanAmount()));
    const rate = parseFloat(interestRate());
    const tenure = parseFloat(loanTenure());

    if (!loanAmount() || isNaN(amount) || amount <= 0) {
      validationErrors.loanAmount = 'Please enter a valid loan amount (RM)';
    }

    if (!interestRate() || isNaN(rate) || rate < 0) {
      validationErrors.interestRate = 'Please enter a valid interest rate (%)';
    }

    if (!loanTenure() || isNaN(tenure) || tenure <= 0) {
      validationErrors.loanTenure = 'Please enter a valid loan tenure (years)';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }

  /**
   * Format number as Malaysian Ringgit
   * Example: 1234.56 → "RM 1,234.56"
   */
  function formatRM(value: number): string {
    return `RM ${value.toLocaleString('en-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  /**
   * Handle calculate action from View
   * Validates inputs, calculates using Model, formats and updates results
   */
  function handleCalculate() {
    // Clear previous results
    setResult(null);

    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    // Prepare data for Model (unformat the loan amount)
    const loanData: HomeLoanData = {
      loanAmount: parseFloat(unformatNumberInput(loanAmount())),
      interestRate: parseFloat(interestRate()),
      loanTenure: parseFloat(loanTenure()),
    };

    // Calculate using Model
    const calculation: HomeLoanResult = calculateHomeLoanEMI(loanData);

    // Format results for View
    const formattedResult: FormattedHomeLoanResult = {
      monthlyRepayment: formatRM(calculation.monthlyRepayment),
      totalRepayment: formatRM(calculation.totalRepayment),
      totalInterest: formatRM(calculation.totalInterest),
    };

    // Update View
    setResult(formattedResult);
  }

  return {
    // Input signals
    loanAmount,
    setLoanAmount,
    interestRate,
    setInterestRate,
    loanTenure,
    setLoanTenure,
    // Output signals
    result,
    errors,
    // Actions
    handleCalculate,
  };
}
