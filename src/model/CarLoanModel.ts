/**
 * Model: Car Loan Calculation Logic (Malaysian Flat-Rate)
 * 
 * Contains only essential loan data structure and calculation formulas.
 * No UI logic, validation, or formatting - pure business calculations.
 */

export interface LoanData {
  loanAmount: number;      // Principal amount in RM
  interestRate: number;    // Annual interest rate in % p.a.
  loanPeriod: number;      // Loan period in years
}

export interface LoanResult {
  totalInterest: number;    // Total interest charged
  totalRepayment: number;   // Total amount to repay
  monthlyInstallment: number; // Monthly payment amount
}

/**
 * Calculate flat-rate car loan using Malaysian standard formula
 * 
 * Formula:
 * - Total Interest = (Interest Rate / 100) × Loan Amount × Loan Period (years)
 * - Monthly Installment = (Loan Amount + Total Interest) / (Loan Period × 12)
 * 
 * Example: RM70,000 at 3.5% p.a. for 5 years
 * - Total Interest = (3.5 / 100) × 70000 × 5 = RM12,250
 * - Monthly Installment = (70000 + 12250) / (5 × 12) = RM1,370.83
 */
export function calculateFlatRateLoan(data: LoanData): LoanResult {
  const { loanAmount, interestRate, loanPeriod } = data;

  // Total Interest = (Interest Rate / 100) × Loan Amount × Loan Period
  const totalInterest = (interestRate / 100) * loanAmount * loanPeriod;

  // Total Repayment = Loan Amount + Total Interest
  const totalRepayment = loanAmount + totalInterest;

  // Monthly Installment = Total Repayment / (Loan Period × 12)
  const monthlyInstallment = totalRepayment / (loanPeriod * 12);

  return {
    totalInterest,
    totalRepayment,
    monthlyInstallment,
  };
}
