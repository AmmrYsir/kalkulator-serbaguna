import { Component, createSignal, Show } from 'solid-js';

interface HomeLoanResult {
  monthlyInstallment: number;
  totalInterest: number;
  totalRepayment: number;
}

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600 dark:text-emerald-400">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

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
    <div class="max-w-xl mx-auto">
      <div class="mb-8 flex items-center gap-4">
        <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
          <HomeIcon />
        </div>
        <div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono uppercase">
            PINJAMAN RUMAH
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            Kira ansuran bulanan untuk kediaman impian anda.
          </p>
        </div>
      </div>

      <div class="card space-y-6 border-emerald-100 dark:border-emerald-900/30">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="input-label" for="home-loan-amount">
              Harga Hartanah / Jumlah Pinjaman
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">RM</span>
              <input
                id="home-loan-amount"
                type="text"
                placeholder="300,000"
                value={loanAmount()}
                onInput={(e) => setLoanAmount(e.currentTarget.value)}
                class="input-field pl-12 focus:ring-emerald-500"
              />
            </div>
            <Show when={errors().loanAmount}>
              <p class="text-xs font-bold text-red-500 mt-2 ml-1">{errors().loanAmount}</p>
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
                class="input-field pr-10 focus:ring-emerald-500"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">%</span>
            </div>
            <Show when={errors().interestRate}>
              <p class="text-xs font-bold text-red-500 mt-2 ml-1">{errors().interestRate}</p>
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
                class="input-field pr-16 focus:ring-emerald-500"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-widest">tahun</span>
            </div>
            <Show when={errors().loanPeriod}>
              <p class="text-xs font-bold text-red-500 mt-2 ml-1">{errors().loanPeriod}</p>
            </Show>
          </div>
        </div>

        <button onClick={calculate} class="btn bg-emerald-600 hover:bg-emerald-700 text-white w-full py-4 text-lg shadow-lg shadow-emerald-500/20">
          Kira Sekarang
        </button>
      </div>

      <Show when={result()}>
        <div class="mt-8 animate-slide-up">
          <div class="card bg-emerald-600 dark:bg-emerald-700 border-none overflow-hidden relative">
            <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-white">
              <HomeIcon />
            </div>
            <div class="relative z-10">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/60 block mb-2">
                ANGGARAN ANSURAN BULANAN
              </span>
              <div class="text-5xl font-black text-white font-mono tracking-tighter mb-6">
                RM {result()!.monthlyInstallment.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </div>
              
              <div class="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/60 block mb-1">
                    JUMLAH FAEDAH
                  </span>
                  <span class="text-lg font-bold text-white font-mono">
                    RM {result()!.totalInterest.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/60 block mb-1">
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
          <strong>Nota:</strong> Pengiraan berdasarkan kaedah baki berkurangan (reducing balance). Ansuran sebenar mungkin berbeza bergantung kepada terma dan syarat bank.
        </p>
      </div>
    </div>
  );
};

export default HomeLoanCalculator;
