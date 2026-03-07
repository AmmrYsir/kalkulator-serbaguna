import { Component, createSignal, Show } from 'solid-js';

interface SalaryResult {
  monthlyGross: number;
  monthlyNet: number;
  epf: number;
  socso: number;
  tax: number;
}

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 dark:text-blue-400">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

const SalaryCalculator: Component = () => {
  const [annualSalary, setAnnualSalary] = createSignal('');
  const [result, setResult] = createSignal<SalaryResult | null>(null);
  const [errors, setErrors] = createSignal('');

  const calculate = () => {
    const salary = parseFloat(annualSalary().replace(/,/g, ''));
    
    if (!annualSalary() || isNaN(salary) || salary <= 0) {
      setErrors('Sila masukkan jumlah gaji yang valid');
      return;
    }
    
    setErrors('');
    
    const monthlyGross = salary / 12;
    
    // EPF calculation (assuming 11% employee contribution, capped at RM500/month)
    const epf = Math.min(monthlyGross * 0.11, 500);
    
    // SOCSO (approximate rates)
    let socso = 0;
    if (monthlyGross < 3000) {
      socso = monthlyGross * 0.005; // 0.5%
    } else if (monthlyGross < 4000) {
      socso = 15 + (monthlyGross - 3000) * 0.0035; // RM15 + 0.35%
    } else {
      socso = 20; // Max
    }
    
    // Estimated tax (progressive rates - simplified)
    const annualTaxable = salary - (epf * 12) - 9000; // EPF deduction + personal relief
    let annualTax = 0;
    if (annualTaxable > 0) {
      if (annualTaxable <= 5000) {
        annualTax = 0;
      } else if (annualTaxable <= 20000) {
        annualTax = (annualTaxable - 5000) * 0.01;
      } else if (annualTaxable <= 35000) {
        annualTax = 150 + (annualTaxable - 20000) * 0.06;
      } else if (annualTaxable <= 50000) {
        annualTax = 1050 + (annualTaxable - 35000) * 0.11;
      } else if (annualTaxable <= 70000) {
        annualTax = 2700 + (annualTaxable - 50000) * 0.19;
      } else if (annualTaxable <= 100000) {
        annualTax = 6500 + (annualTaxable - 70000) * 0.25;
      } else {
        annualTax = 14000 + (annualTaxable - 100000) * 0.28;
      }
    }
    
    const monthlyTax = annualTax / 12;
    const monthlyNet = monthlyGross - epf - socso - monthlyTax;
    
    setResult({
      monthlyGross: Math.round(monthlyGross * 100) / 100,
      monthlyNet: Math.round(monthlyNet * 100) / 100,
      epf: Math.round(epf * 100) / 100,
      socso: Math.round(socso * 100) / 100,
      tax: Math.round(monthlyTax * 100) / 100,
    });
  };

  return (
    <div class="max-w-xl mx-auto">
      <div class="mb-8 flex items-center gap-4">
        <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
          <WalletIcon />
        </div>
        <div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono uppercase">
            GAJI BERSIH
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            Anggaran gaji bawa pulang selepas potongan wajib.
          </p>
        </div>
      </div>

      <div class="card space-y-6">
        <div>
          <label class="input-label" for="annual-salary">
            Gaji Tahunan Kasar
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">RM</span>
            <input
              id="annual-salary"
              type="text"
              placeholder="60,000"
              value={annualSalary()}
              onInput={(e) => setAnnualSalary(e.currentTarget.value)}
              class="input-field pl-12"
            />
          </div>
          <Show when={errors()}>
            <p class="text-xs font-bold text-red-500 mt-2 ml-1">{errors()}</p>
          </Show>
          <p class="text-xs text-slate-400 mt-2 ml-1 italic font-medium">
            Masukkan gaji tahunan atau (gaji bulanan × 12)
          </p>
        </div>

        <button onClick={calculate} class="btn btn-primary w-full py-4 text-lg shadow-lg shadow-blue-500/20">
          Kira Gaji
        </button>
      </div>

      <Show when={result()}>
        <div class="mt-8 animate-slide-up">
          <div class="card bg-blue-600 dark:bg-blue-700 border-none overflow-hidden relative">
            <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-white">
              <WalletIcon />
            </div>
            <div class="relative z-10">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60 block mb-2">
                ANGGARAN GAJI BERSIH (BULANAN)
              </span>
              <div class="text-5xl font-black text-white font-mono tracking-tighter mb-6">
                RM {result()!.monthlyNet.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </div>
              
              <div class="grid grid-cols-2 gap-y-4 gap-x-8 pt-6 border-t border-white/10">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60 block mb-1">
                    GAJI KASAR
                  </span>
                  <span class="text-lg font-bold text-white font-mono">
                    RM {result()!.monthlyGross.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60 block mb-1">
                    POTONGAN EPF
                  </span>
                  <span class="text-lg font-bold text-white/80 font-mono">
                    - RM {result()!.epf.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60 block mb-1">
                    SOCSO
                  </span>
                  <span class="text-lg font-bold text-white/80 font-mono">
                    - RM {result()!.socso.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60 block mb-1">
                    CUKAI (PCB)
                  </span>
                  <span class="text-lg font-bold text-white/80 font-mono">
                    - RM {result()!.tax.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class="mt-8 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
          <strong>Peringatan:</strong> Pengiraan ini hanyalah anggaran kasar. Potongan sebenar bergantung kepada status perkahwinan, jumlah tanggungan, dan pelepasan cukai lain.
        </p>
      </div>
    </div>
  );
};

export default SalaryCalculator;
