import { Component, createSignal, Show, For } from 'solid-js';

interface TipResult {
  tipAmount: number;
  totalAmount: number;
  perPerson: number;
}

const UtensilsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 dark:text-blue-400">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
  </svg>
);

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
    <div class="max-w-xl mx-auto">
      <div class="mb-8 flex items-center gap-4">
        <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
          <UtensilsIcon />
        </div>
        <div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono uppercase">
            KIRA TIP
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            Kira tip dan bahagi bayaran dengan rakan-rakan.
          </p>
        </div>
      </div>

      <div class="card space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bill Amount */}
          <div class="md:col-span-2">
            <label class="input-label" for="bill-amount">
              Jumlah Bil
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">RM</span>
              <input
                id="bill-amount"
                type="text"
                placeholder="100.00"
                value={billAmount()}
                onInput={(e) => {
                  setBillAmount(e.currentTarget.value);
                  calculate();
                }}
                class="input-field pl-12 text-xl font-bold font-mono"
              />
            </div>
          </div>

          {/* Tip Percentage */}
          <div class="space-y-4">
            <label class="input-label">
              Peratus Tip ({tipPercent()}%)
            </label>
            <div class="grid grid-cols-5 gap-2">
              <For each={presetTips}>
                {(percent: number) => (
                  <button
                    onClick={() => {
                      setTipPercent(percent);
                      calculate();
                    }}
                    class={`py-2 rounded-xl text-xs font-black font-mono transition-all duration-200 ${
                      tipPercent() === percent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {percent}%
                  </button>
                )}
              </For>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={tipPercent()}
              onInput={(e) => {
                setTipPercent(parseInt(e.currentTarget.value));
                calculate();
              }}
              class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Split Count */}
          <div class="space-y-4">
            <label class="input-label" for="split-count">
              Bilangan Orang
            </label>
            <div class="flex items-center gap-3">
              <button
                onClick={() => {
                  setSplitCount(Math.max(1, splitCount() - 1));
                  calculate();
                }}
                class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all flex items-center justify-center font-black active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <input
                id="split-count"
                type="number"
                min="1"
                value={splitCount()}
                onInput={(e) => {
                  setSplitCount(Math.max(1, parseInt(e.currentTarget.value) || 1));
                  calculate();
                }}
                class="input-field text-center text-xl font-bold font-mono"
              />
              <button
                onClick={() => {
                  setSplitCount(splitCount() + 1);
                  calculate();
                }}
                class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all flex items-center justify-center font-black active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Show when={result()}>
        <div class="mt-8 animate-slide-up">
          <div class="card bg-blue-600 dark:bg-blue-700 border-none overflow-hidden relative">
            <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-white">
              <UtensilsIcon />
            </div>
            <div class="relative z-10">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60 block mb-2">
                JUMLAH SETIAP ORANG
              </span>
              <div class="text-5xl font-black text-white font-mono tracking-tighter mb-6">
                RM {result()!.perPerson.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </div>
              
              <div class="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60 block mb-1">
                    JUMLAH TIP
                  </span>
                  <span class="text-lg font-bold text-white font-mono">
                    RM {result()!.tipAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60 block mb-1">
                    TOTAL KESELURUHAN
                  </span>
                  <span class="text-lg font-bold text-white font-mono">
                    RM {result()!.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default TipCalculator;
