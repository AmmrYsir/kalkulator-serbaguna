import { Component, createSignal, Show, createMemo } from 'solid-js';

type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

interface BMIResult {
  bmi: number;
  category: BMICategory;
  categoryMs: string;
  color: string;
}

const BMICalculator: Component = () => {
  const [weight, setWeight] = createSignal('');
  const [height, setHeight] = createSignal('');
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [result, setResult] = createSignal<BMIResult | null>(null);

  const getCategoryInfo = (bmi: number): { category: BMICategory; categoryMs: string; color: string } => {
    if (bmi < 18.5) {
      return { category: 'underweight', categoryMs: 'Kurang Berat Badan', color: 'amber' };
    } else if (bmi < 25) {
      return { category: 'normal', categoryMs: 'Normal', color: 'emerald' };
    } else if (bmi < 30) {
      return { category: 'overweight', categoryMs: 'Berat Badan Berlebihan', color: 'amber' };
    } else {
      return { category: 'obese', categoryMs: 'Obes', color: 'red' };
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const w = parseFloat(weight());
    if (!weight() || isNaN(w) || w <= 0 || w > 500) {
      newErrors.weight = 'Invalid';
    }
    
    const h = parseFloat(height());
    if (!height() || isNaN(h) || h <= 0 || h > 300) {
      newErrors.height = 'Invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validate()) return;
    
    const w = parseFloat(weight());
    const h = parseFloat(height()) / 100; // cm to m
    
    const bmi = w / (h * h);
    const categoryInfo = getCategoryInfo(bmi);
    
    setResult({
      bmi: Math.round(bmi * 10) / 10,
      ...categoryInfo,
    });
  };

  const bmiScale = createMemo(() => {
    const ranges = [
      { max: 18.5, label: 'Kurang', color: 'bg-amber-400' },
      { max: 25, label: 'Normal', color: 'bg-emerald-500' },
      { max: 30, label: 'Lebih', color: 'bg-amber-500' },
      { max: 100, label: 'Obes', color: 'bg-red-500' },
    ];
    return ranges;
  });

  return (
    <div class="max-w-md mx-auto">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-1">
          Kalkulator BMI
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Kira Index Jisim Badan (Body Mass Index)
        </p>
      </div>

      <div class="card space-y-4">
        <div>
          <label class="input-label" for="bmi-weight">
            Berat
          </label>
          <div class="relative">
            <input
              id="bmi-weight"
              type="number"
              step="0.1"
              placeholder="70"
              value={weight()}
              onInput={(e) => setWeight(e.currentTarget.value)}
              class="input-field has-suffix"
            />
            <span class="input-suffix">kg</span>
          </div>
          <Show when={errors().weight}>
            <p class="text-xs text-red-500 mt-1">Sila masukkan berat yang valid</p>
          </Show>
        </div>

        <div>
          <label class="input-label" for="bmi-height">
            Tinggi
          </label>
          <div class="relative">
            <input
              id="bmi-height"
              type="number"
              step="0.1"
              placeholder="170"
              value={height()}
              onInput={(e) => setHeight(e.currentTarget.value)}
              class="input-field has-suffix"
            />
            <span class="input-suffix">cm</span>
          </div>
          <Show when={errors().height}>
            <p class="text-xs text-red-500 mt-1">Sila masukkan tinggi yang valid</p>
          </Show>
        </div>

        <button onClick={calculate} class="btn btn-primary w-full mt-2">
          Kira BMI
        </button>
      </div>

      <Show when={result()}>
        <div class="mt-6 animate-fade-in">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Keputusan
          </h3>
          <div class="card border-emerald-200 dark:border-emerald-800">
            <div class={`result-highlight rounded-lg mb-4 bg-${result()!.color}-600`}>
              <span class="result-label">BMI Anda</span>
              <span class="result-value">{result()!.bmi}</span>
            </div>
            
            <div class="mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                {result()!.categoryMs}
              </span>
            </div>

            {/* BMI Scale */}
            <div class="mt-4">
              <div class="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div class="absolute inset-0 flex">
                  <div class="h-full bg-amber-400" style={{ width: '37%' }} />
                  <div class="h-full bg-emerald-500" style={{ width: '13%' }} />
                  <div class="h-full bg-amber-500" style={{ width: '10%' }} />
                  <div class="h-full bg-red-500 flex-1" />
                </div>
                <div
                  class="absolute top-0 w-1 h-full bg-white shadow-lg"
                  style={{ left: `${Math.min(Math.max((result()!.bmi / 40) * 100, 0), 100)}%`, transform: 'translateX(-50%)' }}
                />
              </div>
              <div class="flex justify-between mt-1 text-xs text-slate-500">
                <span>0</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40+</span>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="text-xs text-slate-600 dark:text-slate-400">
          <strong>Kategori BMI:</strong><br/>
          • Kurang Berat Badan: &lt; 18.5<br/>
          • Normal: 18.5 - 24.9<br/>
          • Berat Badan Berlebihan: 25 - 29.9<br/>
          • Obes: 30+
        </p>
      </div>
    </div>
  );
};

export default BMICalculator;
