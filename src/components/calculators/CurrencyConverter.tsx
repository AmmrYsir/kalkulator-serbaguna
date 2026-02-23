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
    <div class="max-w-md mx-auto">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-1">
          Penukar Mata Wang
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Tukar antara matawang (kadar tetap)
        </p>
      </div>

      <div class="card space-y-4">
        {/* From */}
        <div>
          <label class="input-label">Dari</label>
          <div class="flex gap-2">
            <input
              type="number"
              placeholder="0"
              value={amount()}
              onInput={(e) => setAmount(e.currentTarget.value)}
              class="input-field flex-1"
            />
            <select
              value={fromCurrency().code}
              onChange={(e) => {
                const curr = currencies.find(c => c.code === e.currentTarget.value);
                if (curr) setFromCurrency(curr);
              }}
              class="input-field w-36"
            >
              <For each={currencies}>
                {(currency) => (
                  <option value={currency.code}>
                    {currency.code} ({currency.symbol})
                  </option>
                )}
              </For>
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div class="flex justify-center">
          <button
            onClick={swapCurrencies}
            class="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 1 21 5 17 9"/>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
          </button>
        </div>

        {/* To */}
        <div>
          <label class="input-label">Kepada</label>
          <div class="flex gap-2">
            <div class="input-field flex-1 bg-slate-50 dark:bg-slate-900 flex items-center">
              <span class="text-slate-600 dark:text-slate-400 font-mono">
                {toCurrency().symbol} {result() || '0.00'}
              </span>
            </div>
            <select
              value={toCurrency().code}
              onChange={(e) => {
                const curr = currencies.find(c => c.code === e.currentTarget.value);
                if (curr) setToCurrency(curr);
              }}
              class="input-field w-36"
            >
              <For each={currencies}>
                {(currency) => (
                  <option value={currency.code}>
                    {currency.code} ({currency.symbol})
                  </option>
                )}
              </For>
            </select>
          </div>
        </div>
      </div>

      <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <p class="text-xs text-amber-700 dark:text-amber-400">
          <strong>Nota:</strong> Kadar pertukaran adalah kadar tetap dan mungkin tidak mencerminkan kadar semasa. 
          Gunakan sebagai rujukan sahaja.
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
