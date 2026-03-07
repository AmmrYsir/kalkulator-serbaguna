import { Component, createSignal, Show } from 'solid-js';

interface CarLoanResult {
  monthlyInstallment: number;
  totalInterest: number;
  totalRepayment: number;
}

const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 dark:text-blue-400">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
  </svg>
);

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
    <div class="max-w-xl mx-auto">
      <div class="mb-8 flex items-center gap-4">
        <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
          <CarIcon />
        </div>
        <div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono uppercase">
            PINJAMAN KERETA
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            Kira ansuran bulanan untuk pinjaman kereta anda.
          </p>
        </div>
      </div>

      <div class="card space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="input-label" for="car-loan-amount">
              Jumlah Pinjaman
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">RM</span>
              <input
                id="car-loan-amount"
                type="text"
                placeholder="70,000"
                value={loanAmount()}
                onInput={(e) => setLoanAmount(e.currentTarget.value)}
                class="input-field pl-12"
              />
            </div>
            <Show when={errors().loanAmount}>
              <p class="text-xs font-bold text-red-500 mt-2 ml-1">{errors().loanAmount}</p>
            </Show>
          </div>

          <div>
            <label class="input-label" for="car-interest-rate">
              Kadar Faedah Setahun
            </label>
            <div class="relative">
              <input
                id="car-interest-rate"
                type="number"
                step="0.1"
                placeholder="3.5"
                value={interestRate()}
                onInput={(e) => setInterestRate(e.currentTarget.value)}
                class="input-field pr-10"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">%</span>
            </div>
            <Show when={errors().interestRate}>
              <p class="text-xs font-bold text-red-500 mt-2 ml-1">{errors().interestRate}</p>
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
                class="input-field pr-16"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-widest">tahun</span>
            </div>
            <Show when={errors().loanPeriod}>
              <p class="text-xs font-bold text-red-500 mt-2 ml-1">{errors().loanPeriod}</p>
            </Show>
          </div>
        </div>

        <button onClick={calculate} class="btn btn-primary w-full py-4 text-lg shadow-lg shadow-blue-500/20">
          Kira Sekarang
        </button>
      </div>

      <Show when={result()}>
        <div class="mt-8 animate-slide-up">
          <div class="card bg-blue-600 dark:bg-blue-700 border-none overflow-hidden relative">
            <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <CarIcon />
            </div>
            <div class="relative z-10">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60 block mb-2">
                ANGGARAN ANSURAN BULANAN
              </span>
              <div class="text-5xl font-black text-white font-mono tracking-tighter mb-6">
                RM {result()!.monthlyInstallment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </div>
              
              <div class="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60 block mb-1">
                    JUMLAH FAEDAH
                  </span>
                  <span class="text-lg font-bold text-white font-mono">
                    RM {result()!.totalInterest.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60 block mb-1">
                    JUMLAH BAYARAN
                  </span>
                  <span class="text-lg font-bold text-white font-mono">
                    RM {result()!.totalRepayment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class="mt-8 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
          <strong>Tip:</strong> Pastikan anda menyemak dengan bank untuk kadar faedah terkini. Pengiraan ini adalah anggaran berdasarkan kaedah kadar tetap.
        </p>
      </div>
    </div>
  );
};

export default CarLoanCalculator;
