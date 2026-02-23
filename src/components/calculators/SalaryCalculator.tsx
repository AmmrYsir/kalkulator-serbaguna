import { Component, createSignal, Show } from 'solid-js';

interface SalaryResult {
  monthlyGross: number;
  monthlyNet: number;
  epf: number;
  socso: number;
  tax: number;
}

const SalaryCalculator: Component = () => {
  const [annualSalary, setAnnualSalary] = createSignal('');
  const [result, setResult] = createSignal<SalaryResult | null>(null);
  const [errors, setErrors] = createSignal('');

  const calculate = () => {
    const salary = parseFloat(annualSalary().replace(/,/g, ''));
    
    if (!annualSalary() || isNaN(salary) || salary <= 0) {
      setErrors('Sila masukkan salary yang valid');
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
    <div class="max-w-md mx-auto">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-1">
          Kalkulator Gaji
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Anggaran gaji bulanan selepas potongan
        </p>
      </div>

      <div class="card space-y-4">
        <div>
          <label class="input-label" for="annual-salary">
            Gaji Tahunan Kasar
          </label>
          <div class="relative">
            <span class="input-prefix">RM</span>
            <input
              id="annual-salary"
              type="text"
              placeholder="60,000"
              value={annualSalary()}
              onInput={(e) => setAnnualSalary(e.currentTarget.value)}
              class="input-field has-prefix"
            />
          </div>
          <Show when={errors()}>
            <p class="text-xs text-red-500 mt-1">{errors()}</p>
          </Show>
          <p class="text-xs text-slate-500 mt-1">
            Atau masukkan gaji bulanan ÷ 12
          </p>
        </div>

        <button onClick={calculate} class="btn btn-primary w-full mt-2">
          Kira
        </button>
      </div>

      <Show when={result()}>
        <div class="mt-6 animate-fade-in">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Anggaran Bulanan
          </h3>
          <div class="card border-indigo-200 dark:border-indigo-800">
            <div class="result-highlight rounded-lg mb-4">
              <span class="result-label">Gaji Bersih</span>
              <span class="result-value">
                RM {result()!.monthlyNet.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div class="space-y-0">
              <div class="result-item">
                <span class="text-sm text-slate-600 dark:text-slate-400">Gaji Kasar</span>
                <span class="text-sm font-medium tabular-nums">
                  RM {result()!.monthlyGross.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div class="result-item">
                <span class="text-sm text-slate-600 dark:text-slate-400">EPF (11%)</span>
                <span class="text-sm font-medium tabular-nums text-red-500">
                  - RM {result()!.epf.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div class="result-item">
                <span class="text-sm text-slate-600 dark:text-slate-400">SOCSO</span>
                <span class="text-sm font-medium tabular-nums text-red-500">
                  - RM {result()!.socso.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div class="result-item">
                <span class="text-sm text-slate-600 dark:text-slate-400">Cukai</span>
                <span class="text-sm font-medium tabular-nums text-red-500">
                  - RM {result()!.tax.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="text-xs text-slate-600 dark:text-slate-400">
          <strong>Nota:</strong> Pengiraan adalah anggaran sahaja. 
          Potongan sebenar mungkin berbeza bergantung pada layak kuasa, 
          caruman KWSP, dan lain-lain.
        </p>
      </div>
    </div>
  );
};

export default SalaryCalculator;
