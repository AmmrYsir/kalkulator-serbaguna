import { Component, createSignal, Show } from 'solid-js';

interface BMRResult {
  bmr: number;
  calories: number;
}

const BMRCalculator: Component = () => {
  const [gender, setGender] = createSignal<'male' | 'female'>('male');
  const [age, setAge] = createSignal('');
  const [weight, setWeight] = createSignal('');
  const [height, setHeight] = createSignal('');
  const [activity, setActivity] = createSignal(1.2);
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [result, setResult] = createSignal<BMRResult | null>(null);

  const activityLevels = [
    { value: 1.2, label: 'Tidak Aktif', desc: 'Sedentari' },
    { value: 1.375, label: 'Ringan', desc: 'Senam 1-3x/minggu' },
    { value: 1.55, label: 'Sederhana', desc: 'Senam 3-5x/minggu' },
    { value: 1.725, label: 'Aktif', desc: 'Senam 6-7x/minggu' },
    { value: 1.9, label: 'Sangat Aktif', desc: 'Olahraga berat' },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const a = parseInt(age());
    if (!age() || isNaN(a) || a < 15 || a > 120) {
      newErrors.age = 'Invalid';
    }
    
    const w = parseFloat(weight());
    if (!weight() || isNaN(w) || w <= 0 || w > 300) {
      newErrors.weight = 'Invalid';
    }
    
    const h = parseFloat(height());
    if (!height() || isNaN(h) || h <= 0 || h > 250) {
      newErrors.height = 'Invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculate = () => {
    if (!validate()) return;
    
    const a = parseInt(age());
    const w = parseFloat(weight());
    const h = parseFloat(height());
    
    // Harris-Benedict Equation
    let bmr: number;
    if (gender() === 'male') {
      bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
    } else {
      bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    }
    
    const calories = bmr * activity();
    
    setResult({
      bmr: Math.round(bmr),
      calories: Math.round(calories),
    });
  };

  return (
    <div class="max-w-md mx-auto">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-1">
          Kalkulator BMR
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Kira kadar metabolik basal dan keperluan kalori harian
        </p>
      </div>

      <div class="card space-y-4">
        {/* Gender */}
        <div>
          <label class="input-label">Jantina</label>
          <div class="flex gap-2">
            <button
              onClick={() => setGender('male')}
              class={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                gender() === 'male'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Lelaki
            </button>
            <button
              onClick={() => setGender('female')}
              class={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                gender() === 'female'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Perempuan
            </button>
          </div>
        </div>

        {/* Age */}
        <div>
          <label class="input-label" for="bmr-age">
            Umur
          </label>
          <div class="relative">
            <input
              id="bmr-age"
              type="number"
              placeholder="30"
              value={age()}
              onInput={(e) => setAge(e.currentTarget.value)}
              class="input-field has-suffix"
            />
            <span class="input-suffix">tahun</span>
          </div>
          <Show when={errors().age}>
            <p class="text-xs text-red-500 mt-1">Sila masukkan umur yang valid (15-120)</p>
          </Show>
        </div>

        {/* Weight */}
        <div>
          <label class="input-label" for="bmr-weight">
            Berat
          </label>
          <div class="relative">
            <input
              id="bmr-weight"
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

        {/* Height */}
        <div>
          <label class="input-label" for="bmr-height">
            Tinggi
          </label>
          <div class="relative">
            <input
              id="bmr-height"
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

        {/* Activity Level */}
        <div>
          <label class="input-label">Tahap Aktiviti</label>
          <select
            value={activity()}
            onChange={(e) => setActivity(parseFloat(e.currentTarget.value))}
            class="input-field"
          >
            {activityLevels.map((level) => (
              <option value={level.value}>
                {level.label} - {level.desc}
              </option>
            ))}
          </select>
        </div>

        <button onClick={calculate} class="btn btn-primary w-full mt-2">
          Kira BMR
        </button>
      </div>

      <Show when={result()}>
        <div class="mt-6 animate-fade-in">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Keputusan
          </h3>
          <div class="card border-emerald-200 dark:border-emerald-800">
            <div class="result-highlight bg-emerald-600 dark:bg-emerald-700 rounded-lg mb-4">
              <span class="result-label">Kalori Harian</span>
              <span class="result-value">
                {result()!.calories.toLocaleString()} kcal
              </span>
            </div>
            <div class="space-y-0">
              <div class="result-item">
                <span class="text-sm text-slate-600 dark:text-slate-400">BMR (Kadar Metabolik)</span>
                <span class="text-sm font-medium tabular-nums">
                  {result()!.bmr.toLocaleString()} kcal
                </span>
              </div>
              <div class="result-item">
                <span class="text-sm text-slate-600 dark:text-slate-400">untuk mengekalkan berat badan</span>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p class="text-xs text-slate-600 dark:text-slate-400">
          <strong>Formula:</strong> Persamaan Harris-Benedict.<br/>
          BMR = Tenaga yang dibakar pada rehat sepenuhnya.
        </p>
      </div>
    </div>
  );
};

export default BMRCalculator;
