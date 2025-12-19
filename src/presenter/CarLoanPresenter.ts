/**
 * Presenter: Car Loan Calculator Coordinator
 * 
 * Handles coordination between Model and View:
 * - Receives user actions (calculate button press)
 * - Validates inputs (positive values, non-empty)
 * - Delegates calculations to Model
 * - Formats results in Malaysian Ringgit
 * - Updates View through SolidJS signals
 */

import { createSignal } from 'solid-js';
import { calculateFlatRateLoan, type LoanData, type LoanResult } from '../model/CarLoanModel';

export interface ValidationError {
  loanAmount?: string;
  interestRate?: string;
  loanPeriod?: string;
}

export interface FormattedResult {
  totalInterest: string;
  totalRepayment: string;
  monthlyInstallment: string;
}

/**
 * Car Loan Calculator Presenter
 * 
 * Provides reactive state management and business coordination
 * using SolidJS signals (not React hooks).
 */
export function createCarLoanPresenter() {
  // Input state
  const [loanAmount, setLoanAmount] = createSignal<string>('');
  const [interestRate, setInterestRate] = createSignal<string>('');
  const [loanPeriod, setLoanPeriod] = createSignal<string>('');

  // Output state
  const [result, setResult] = createSignal<FormattedResult | null>(null);
  const [errors, setErrors] = createSignal<ValidationError>({});

  /**
   * Validate user inputs
   * Returns true if all inputs are valid, false otherwise
   */
  function validateInputs(): boolean {
    const validationErrors: ValidationError = {};

    const amount = parseFloat(loanAmount());
    const rate = parseFloat(interestRate());
    const period = parseFloat(loanPeriod());

    if (!loanAmount() || isNaN(amount) || amount <= 0) {
      validationErrors.loanAmount = 'Please enter a valid loan amount (RM)';
    }

    if (!interestRate() || isNaN(rate) || rate <= 0) {
      validationErrors.interestRate = 'Please enter a valid interest rate (%)';
    }

    if (!loanPeriod() || isNaN(period) || period <= 0) {
      validationErrors.loanPeriod = 'Please enter a valid loan period (years)';
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

    // Prepare data for Model
    const loanData: LoanData = {
      loanAmount: parseFloat(loanAmount()),
      interestRate: parseFloat(interestRate()),
      loanPeriod: parseFloat(loanPeriod()),
    };

    // Calculate using Model
    const calculation: LoanResult = calculateFlatRateLoan(loanData);

    // Format results for View
    const formattedResult: FormattedResult = {
      totalInterest: formatRM(calculation.totalInterest),
      totalRepayment: formatRM(calculation.totalRepayment),
      monthlyInstallment: formatRM(calculation.monthlyInstallment),
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
    loanPeriod,
    setLoanPeriod,
    // Output signals
    result,
    errors,
    // Actions
    handleCalculate,
  };
}
