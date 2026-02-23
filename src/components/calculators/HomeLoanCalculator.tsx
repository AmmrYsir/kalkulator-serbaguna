import { Component, createSignal, Show } from 'solid-js';

interface HomeLoanResult {
  monthlyInstallment: number;
  totalInterest: number;
  totalRepayment: number;
}

const HomeLoanCalculator: Component = () => {
  const [loanAmount, setLoanAmount] = createSignal('');
  const [interestRate, setInterestRate] = createSignal('');
  const [loanPeriod, setLoanPeriod] = createSignal('');
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [result, setResult] = createSignal<HomeLoanResult | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const amount = parseFloat(loanAmount().replace(/,/g, ''));
    if (!loanAmount() || isNaN(amount) || amount <= 0) {
      newErrors.loanAmount = 'Sila masukkan jumlah pinjaman yang valid';
    }
    
    const rate = parseFloat(interestRate());
    if (!interestRate() || isNaN(rate) || rate <= 0 || rate > 30) {
      newErrors.interestRate = 'Sila masukkan kadar faedah yang valid (0-30%)';
    }
    
    const period = parseInt(loanPeriod());
    if (!loanPeriod() || isNaN(period) || period <= 0 || period > 40) {
      newErrors.loanPeriod = 'Sila masukkan tempoh yang valid (1-40 tahun)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validate()) return;
    
    const principal = parseFloat(loanAmount().replace(/,/g, ''));
    const annualRate = parseFloat(interestRate()) / 100;
    const years = parseInt(loanPeriod());
    
    // Reducing balance (reducing balance) calculation
    const monthlyRate = annualRate / 12;
    const months = years * 12;
    
    // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    let monthlyInstallment: number;
    
    if (monthlyRate === 0) {
      monthlyInstallment = principal / months;
    } else {
      const factor = Math.pow(1 + monthlyRate, months);
      monthlyInstallment = principal * (monthlyRate * factor) / (factor - 1);
    }
    
    const totalRepayment = monthlyInstallment * months;
    const totalInterest = totalRepayment - principal;
    
    setResult({
      monthlyInstallment: Math.round(monthlyInstallment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalRepayment: Math.round(totalRepayment * 100) / 100,
    });
  };

  return (
    <div class="max-w-md mx-auto">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-1">
          Pinjaman Rumah
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Kira ansuran bulanan untuk pinjaman rumah (reducing balance)
        </p>
      </div>

      <div class="card space-y-4">
        <div>
          <label class="input-label" for="home-loan-amount">
            Harga Hartanah
          </label>
          <div class="relative">
            <span class="input-prefix">RM</span>
            <input
              id="home-loan-amount"
              type="text"
              placeholder="300,000"
              value={loanAmount()}
              onInput={(e) => setLoanAmount(e.currentTarget.value)}
              class="input-field has-prefix"
            />
          </div>
          <Show when={errors().loanAmount}>
            <p class="text-xs text-red-500 mt-1">{errors().loanAmount}</p>
          </Show>
        </div>

        <div>
          <label class="input-label" for="home-interest-rate">
            Kadar Faedah Tahunan
          </label>
          <div class="relative">
            <input
              id="home-interest-rate"
              type="number"
              step="0.1"
              placeholder="4.5"
              value={interestRate()}
              onInput={(e) => setInterestRate(e.currentTarget.value)}
              class="input-field has-suffix"
            />
            <span class="input-suffix">%</span>
          </div>
          <Show when={errors().interestRate}>
            <p class="text-xs text-red-500 mt-1">{errors().interestRate}</p>
          </Show>
        </div>

        <div>
          <label class="input-label" for="home-loan-period">
            Tempoh Pinjaman
          </label>
          <div class="relative">
            <input
              id="home-loan-period"
              type="number"
              placeholder="30"
              value={loanPeriod()}
              onInput={(e) => setLoanPeriod(e.currentTarget.value)}
              class="input-field has-suffix"
            />
            <span class="input-suffix">tahun</span>
          </div>
          <Show when={errors().loanPeriod}>
            <p class="text-xs text-red-500 mt-1">{errors().loanPeriod}</p>
          </Show>
        </div>

        <button onClick={calculate} class="btn btn-primary w-full mt-2">
          Kira
        </button>
      </div>

      <Show when={result()}>
        <div class="mt-6 animate-slide-up">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Keputusan
          </h3>
          <div class="card border-emerald-200 dark:border-emerald-800">
            <div class="result-highlight bg-emerald-600 dark:bg-emerald-700 rounded-lg mb-4">
              <span class="result-label">Ansuran Bulanan</span>
              <span class="result-value">
                RM {result()!.monthlyInstallment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div class="space-y-0">
              <div class="result-item">
                <span class="text-sm text-slate-600 dark:text-slate-400">Jumlah Faedah</span>
                <span class="text-sm font-medium tabular-nums">
                  RM {result()!.totalInterest.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div class="result-item">
                <span class="text-sm text-slate-600 dark:text-slate-400">Jumlah Pembayaran</span>
                <span class="text-sm font-medium tabular-nums">
                  RM {result()!.totalRepayment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="text-xs text-slate-600 dark:text-slate-400">
          <strong>Nota:</strong> Pengiraan berdasarkan kaedah reducing balance. 
          Ansuran sebenar mungkin berbeza bergantung pada terms bank.
        </p>
      </div>
    </div>
  );
};

export default HomeLoanCalculator;
