import { Component, createSignal, Show } from 'solid-js';

interface TipResult {
  tipAmount: number;
  totalAmount: number;
  perPerson: number;
}

const TipCalculator: Component = () => {
  const [billAmount, setBillAmount] = createSignal('');
  const [tipPercent, setTipPercent] = createSignal(10);
  const [splitCount, setSplitCount] = createSignal(1);
  const [result, setResult] = createSignal<TipResult | null>(null);

  const calculate = () => {
    const bill = parseFloat(billAmount().replace(/,/g, '')) || 0;
    const tip = bill * (tipPercent() / 100);
    const total = bill + tip;
    const perPerson = splitCount() > 0 ? total / splitCount() : total;
    
    setResult({
      tipAmount: Math.round(tip * 100) / 100,
      totalAmount: Math.round(total * 100) / 100,
      perPerson: Math.round(perPerson * 100) / 100,
    });
  };

  const presetTips = [5, 10, 15, 20, 25];

  return (
    <div class="max-w-md mx-auto">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-1">
          Kalkulator Tip
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Kira tip dan bahagi antara rakan-rakan
        </p>
      </div>

      <div class="card space-y-5">
        {/* Bill Amount */}
        <div>
          <label class="input-label" for="bill-amount">
            Jumlah Bil
          </label>
          <div class="relative">
            <span class="input-prefix">RM</span>
            <input
              id="bill-amount"
              type="text"
              placeholder="100.00"
              value={billAmount()}
              onInput={(e) => setBillAmount(e.currentTarget.value)}
              class="input-field has-prefix"
            />
          </div>
        </div>

        {/* Tip Percentage */}
        <div>
          <label class="input-label">
            Peratus Tip
          </label>
          <div class="flex gap-2 mb-3">
            {presetTips.map((percent) => (
              <button
                onClick={() => setTipPercent(percent)}
                class={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  tipPercent() === percent
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {percent}%
              </button>
            ))}
          </div>
          <div class="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="50"
              value={tipPercent()}
              onInput={(e) => setTipPercent(parseInt(e.currentTarget.value))}
              class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span class="text-sm font-medium w-12 text-right">{tipPercent()}%</span>
          </div>
        </div>

        {/* Split Count */}
        <div>
          <label class="input-label" for="split-count">
            Bilangan Orang
          </label>
          <div class="flex items-center gap-3">
            <button
              onClick={() => setSplitCount(Math.max(1, splitCount() - 1))}
              class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <input
              id="split-count"
              type="number"
              min="1"
              value={splitCount()}
              onInput={(e) => setSplitCount(Math.max(1, parseInt(e.currentTarget.value) || 1))}
              class="input-field text-center"
            />
            <button
              onClick={() => setSplitCount(splitCount() + 1)}
              class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        <button onClick={calculate} class="btn btn-primary w-full mt-2">
          Kira Tip
        </button>
      </div>

      <Show when={result()}>
        <div class="mt-6 animate-fade-in">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Keputusan
          </h3>
          <div class="card border-indigo-200 dark:border-indigo-800">
            <div class="result-highlight rounded-lg mb-4">
              <span class="result-label">Setiap Orang</span>
              <span class="result-value">
                RM {result()!.perPerson.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div class="space-y-0">
              <div class="result-item">
                <span class="text-sm text-slate-600 dark:text-slate-400">Jumlah Tip</span>
                <span class="text-sm font-medium tabular-nums">
                  RM {result()!.tipAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div class="result-item">
                <span class="text-sm text-slate-600 dark:text-slate-400">Jumlah Keseluruhan</span>
                <span class="text-sm font-medium tabular-nums">
                  RM {result()!.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default TipCalculator;
