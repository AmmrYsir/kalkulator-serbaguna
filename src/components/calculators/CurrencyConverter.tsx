import { Component, createSignal, For, createEffect } from 'solid-js';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate to USD
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.72 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 16250 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 35.5 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.5 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.1 },
];

const CoinsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-600 dark:text-orange-400">
    <circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18.06"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);

const CurrencyConverter: Component = () => {
  const [fromCurrency, setFromCurrency] = createSignal<Currency>(currencies[0]);
  const [toCurrency, setToCurrency] = createSignal<Currency>(currencies[3]);
  const [amount, setAmount] = createSignal('');
  const [result, setResult] = createSignal('');

  const convert = () => {
    const value = parseFloat(amount());
    if (isNaN(value) || value === 0) {
      setResult('');
      return;
    }

    // Convert from source to USD, then USD to target
    const usdValue = value / fromCurrency().rate;
    const targetValue = usdValue * toCurrency().rate;
    
    setResult(targetValue.toLocaleString('en-MY', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }));
  };

  createEffect(() => {
    amount();
    fromCurrency();
    toCurrency();
    convert();
  });

  const swapCurrencies = () => {
    const temp = fromCurrency();
    setFromCurrency(toCurrency());
    setToCurrency(temp);
  };

  return (
    <div class="max-w-xl mx-auto">
      <div class="mb-8 flex items-center gap-4">
        <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl">
          <CoinsIcon />
        </div>
        <div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono uppercase">
            MATA WANG
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            Tukar mata wang dengan kadar rujukan tetap.
          </p>
        </div>
      </div>

      <div class="card space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* From */}
          <div class="space-y-3">
            <label class="input-label">Dari</label>
            <div class="flex flex-col gap-2">
              <input
                type="number"
                placeholder="0.00"
                value={amount()}
                onInput={(e) => setAmount(e.currentTarget.value)}
                class="input-field text-xl font-bold font-mono"
              />
              <select
                value={fromCurrency().code}
                onChange={(e) => {
                  const curr = currencies.find(c => c.code === e.currentTarget.value);
                  if (curr) setFromCurrency(curr);
                }}
                class="input-field bg-white dark:bg-slate-800 font-semibold"
              >
                <For each={currencies}>
                  {(currency) => (
                    <option value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  )}
                </For>
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div class="flex justify-center md:pt-8">
            <button
              onClick={swapCurrencies}
              class="p-4 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all duration-200 active:scale-90 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>
              </svg>
            </button>
          </div>

          {/* To */}
          <div class="space-y-3">
            <label class="input-label">Kepada</label>
            <div class="flex flex-col gap-2">
              <div class="input-field flex items-center bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30">
                <span class="text-xl font-black font-mono text-orange-600 dark:text-orange-400 tabular-nums">
                  {toCurrency().symbol} {result() || '0.00'}
                </span>
              </div>
              <select
                value={toCurrency().code}
                onChange={(e) => {
                  const curr = currencies.find(c => c.code === e.currentTarget.value);
                  if (curr) setToCurrency(curr);
                }}
                class="input-field bg-white dark:bg-slate-800 font-semibold"
              >
                <For each={currencies}>
                  {(currency) => (
                    <option value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  )}
                </For>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border-2 border-dashed border-orange-100 dark:border-orange-900/30">
        <p class="text-sm text-orange-700 dark:text-orange-400 leading-relaxed italic">
          <strong>Nota:</strong> Kadar pertukaran adalah kadar tetap rujukan dan mungkin tidak mencerminkan kadar pasaran semasa yang sentiasa berubah.
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
