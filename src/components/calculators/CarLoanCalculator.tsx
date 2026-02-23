import { Component, createSignal, Show } from 'solid-js';

interface CarLoanResult {
  monthlyInstallment: number;
  totalInterest: number;
  totalRepayment: number;
}

const CarLoanCalculator: Component = () => {
  const [loanAmount, setLoanAmount] = createSignal('');
  const [interestRate, setInterestRate] = createSignal('');
  const [loanPeriod, setLoanPeriod] = createSignal('');
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [result, setResult] = createSignal<CarLoanResult | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const amount = parseFloat(loanAmount().replace(/,/g, ''));
    if (!loanAmount() || isNaN(amount) || amount <= 0) {
      newErrors.loanAmount = 'Sila masukkan jumlah pinjaman yang valid';
    }
    
    const rate = parseFloat(interestRate());
    if (!interestRate() || isNaN(rate) || rate <= 0 || rate > 100) {
      newErrors.interestRate = 'Sila masukkan kadar faedah yang valid (0-100%)';
    }
    
    const period = parseInt(loanPeriod());
    if (!loanPeriod() || isNaN(period) || period <= 0 || period > 30) {
      newErrors.loanPeriod = 'Sila masukkan tempoh yang valid (1-30 tahun)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validate()) return;
    
    const principal = parseFloat(loanAmount().replace(/,/g, ''));
    const annualRate = parseFloat(interestRate()) / 100;
    const years = parseInt(loanPeriod());
    
    // Flat-rate interest calculation (common in Malaysia)
    const totalInterest = principal * annualRate * years;
    const totalRepayment = principal + totalInterest;
    const months = years * 12;
    const monthlyInstallment = totalRepayment / months;
    
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
          Pinjaman Kereta
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Kira ansuran bulanan untuk pinjaman kereta
        </p>
      </div>

      <div class="card space-y-4">
        <div>
          <label class="input-label" for="car-loan-amount">
            Jumlah Pinjaman
          </label>
          <div class="relative">
            <span class="input-prefix">RM</span>
            <input
              id="car-loan-amount"
              type="text"
              placeholder="70,000"
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
          <label class="input-label" for="car-interest-rate">
            Kadar Faedah Tahunan
          </label>
          <div class="relative">
            <input
              id="car-interest-rate"
              type="number"
              step="0.1"
              placeholder="3.5"
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
          <label class="input-label" for="car-loan-period">
            Tempoh Pinjaman
          </label>
          <div class="relative">
            <input
              id="car-loan-period"
              type="number"
              placeholder="5"
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
          <div class="card border-indigo-200 dark:border-indigo-800">
            <div class="result-highlight rounded-lg mb-4">
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
          <strong>Contoh:</strong> Pinjaman RM 70,000 pada 3.5% p.a. untuk 5 tahun = 
          RM 12,250 jumlah faedah, RM 1,370.83/bulan
        </p>
      </div>
    </div>
  );
};

export default CarLoanCalculator;
