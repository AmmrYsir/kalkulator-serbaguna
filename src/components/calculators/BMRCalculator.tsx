import { Component, createSignal, Show } from 'solid-js';

interface BMRResult {
  bmr: number;
  calories: number;
}

const FlameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600 dark:text-emerald-400">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

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
    <div class="max-w-xl mx-auto">
      <div class="mb-8 flex items-center gap-4">
        <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
          <FlameIcon />
        </div>
        <div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono uppercase">
            KALKULATOR BMR
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            Kadar metabolik basal dan keperluan kalori harian.
          </p>
        </div>
      </div>

      <div class="card space-y-6 border-emerald-100 dark:border-emerald-900/30">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender */}
          <div class="md:col-span-2">
            <label class="input-label">Jantina</label>
            <div class="flex gap-3">
              <button
                onClick={() => setGender('male')}
                class={`flex-1 py-3 px-4 rounded-xl text-sm font-black font-mono tracking-widest uppercase transition-all duration-200 ${
                  gender() === 'male'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Lelaki
              </button>
              <button
                onClick={() => setGender('female')}
                class={`flex-1 py-3 px-4 rounded-xl text-sm font-black font-mono tracking-widest uppercase transition-all duration-200 ${
                  gender() === 'female'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
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
                class="input-field pr-16 focus:ring-emerald-500"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">tahun</span>
            </div>
            <Show when={errors().age}>
              <p class="text-xs font-bold text-red-500 mt-2 ml-1">Sila masukkan umur yang valid</p>
            </Show>
          </div>

          {/* Weight */}
          <div>
            <label class="input-label" for="bmr-weight">
              Berat Badan
            </label>
            <div class="relative">
              <input
                id="bmr-weight"
                type="number"
                step="0.1"
                placeholder="70"
                value={weight()}
                onInput={(e) => setWeight(e.currentTarget.value)}
                class="input-field pr-12 focus:ring-emerald-500"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">kg</span>
            </div>
            <Show when={errors().weight}>
              <p class="text-xs font-bold text-red-500 mt-2 ml-1">Sila masukkan berat yang valid</p>
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
                class="input-field pr-12 focus:ring-emerald-500"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">cm</span>
            </div>
            <Show when={errors().height}>
              <p class="text-xs font-bold text-red-500 mt-2 ml-1">Sila masukkan tinggi yang valid</p>
            </Show>
          </div>

          {/* Activity Level */}
          <div>
            <label class="input-label">Tahap Aktiviti</label>
            <select
              value={activity()}
              onChange={(e) => setActivity(parseFloat(e.currentTarget.value))}
              class="input-field focus:ring-emerald-500 font-semibold"
            >
              {activityLevels.map((level) => (
                <option value={level.value}>
                  {level.label} - {level.desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={calculate} class="btn bg-emerald-600 hover:bg-emerald-700 text-white w-full py-4 text-lg shadow-lg shadow-emerald-500/20">
          Kira Kalori Harian
        </button>
      </div>

      <Show when={result()}>
        <div class="mt-8 animate-slide-up">
          <div class="card bg-emerald-600 dark:bg-emerald-700 border-none overflow-hidden relative">
            <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-white">
              <FlameIcon />
            </div>
            <div class="relative z-10">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/60 block mb-2">
                KEPERLUAN TENAGA HARIAN
              </span>
              <div class="text-5xl font-black text-white font-mono tracking-tighter mb-6">
                {result()!.calories.toLocaleString()} <span class="text-2xl opacity-60">kcal</span>
              </div>
              
              <div class="grid grid-cols-1 gap-4 pt-6 border-t border-white/10">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/60 block mb-1">
                    BMR (BASAL METABOLIC RATE)
                  </span>
                  <span class="text-xl font-bold text-white font-mono">
                    {result()!.bmr.toLocaleString()} kcal/hari
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class="mt-8 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
        <p>
          <strong>Formula:</strong> Menggunakan Persamaan Harris-Benedict. BMR mewakili jumlah tenaga yang dibakar oleh badan anda pada waktu rehat sepenuhnya. Keperluan kalori harian diselaraskan berdasarkan tahap aktiviti anda.
        </p>
      </div>
    </div>
  );
};

export default BMRCalculator;
