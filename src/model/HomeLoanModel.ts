/**
 * Model: Home Loan Calculation Logic (Malaysian EMI Formula)
 * 
 * Contains only essential loan data structure and EMI calculation formula.
 * No UI logic, validation, or formatting - pure business calculations.
 */

export interface HomeLoanData {
  loanAmount: number;      // Principal amount in RM
  interestRate: number;    // Annual interest rate in % p.a.
  loanTenure: number;      // Loan tenure in years
}

export interface HomeLoanResult {
  monthlyRepayment: number;  // Fixed monthly repayment amount (EMI)
  totalRepayment: number;    // Total amount to repay over loan tenure
  totalInterest: number;     // Total interest paid over loan tenure
}

/**
 * Calculate home loan EMI using standard formula
 * 
 * Formula:
 * - Monthly Interest Rate (r) = Annual Rate / 12 / 100
 * - Number of Months (n) = Loan Tenure (years) × 12
 * - EMI (M) = P [ r(1+r)^n ] / [ (1+r)^n – 1 ]
 * 
 * Example: RM400,000 at 4.5% p.a. for 30 years
 * - r = 4.5 / 12 / 100 = 0.00375
 * - n = 30 × 12 = 360
 * - M = 400000 [ 0.00375(1.00375)^360 ] / [ (1.00375)^360 – 1 ] ≈ RM2,027
 * 
 * Note: This is a simplified EMI calculation. Actual Malaysian home loans use
 * reducing balance with Base Rate (BR) + margin, which can fluctuate over time.
 * This MVP provides a basic estimate for planning purposes only.
 */
export function calculateHomeLoanEMI(data: HomeLoanData): HomeLoanResult {
  const { loanAmount, interestRate, loanTenure } = data;

  // Convert annual interest rate to monthly rate (r)
  const monthlyRate = interestRate / 12 / 100;

  // Convert years to months (n)
  const numberOfMonths = loanTenure * 12;

  // Calculate EMI using formula: M = P [ r(1+r)^n ] / [ (1+r)^n – 1 ]
  let monthlyRepayment: number;

  if (monthlyRate === 0) {
    // If interest rate is 0%, EMI is simply principal divided by months
    monthlyRepayment = loanAmount / numberOfMonths;
  } else {
    const onePlusR = 1 + monthlyRate;
    const onePlusRPowerN = Math.pow(onePlusR, numberOfMonths);
    
    monthlyRepayment = loanAmount * 
      (monthlyRate * onePlusRPowerN) / 
      (onePlusRPowerN - 1);
  }

  // Calculate total repayment and total interest
  const totalRepayment = monthlyRepayment * numberOfMonths;
  const totalInterest = totalRepayment - loanAmount;

  return {
    monthlyRepayment,
    totalRepayment,
    totalInterest,
  };
}
