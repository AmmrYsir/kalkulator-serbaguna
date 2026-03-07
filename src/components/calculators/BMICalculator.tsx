import { Component, createSignal, Show, createMemo } from 'solid-js';

type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

interface BMIResult {
  bmi: number;
  category: BMICategory;
  categoryMs: string;
  color: string;
}

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600 dark:text-emerald-400">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

const BMICalculator: Component = () => {
  const [weight, setWeight] = createSignal('');
  const [height, setHeight] = createSignal('');
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [result, setResult] = createSignal<BMIResult | null>(null);

  const getCategoryInfo = (bmi: number): { category: BMICategory; categoryMs: string; color: string } => {
    if (bmi < 18.5) {
      return { category: 'underweight', categoryMs: 'Kurang Berat Badan', color: 'orange' };
    } else if (bmi < 25) {
      return { category: 'normal', categoryMs: 'Normal', color: 'emerald' };
    } else if (bmi < 30) {
      return { category: 'overweight', categoryMs: 'Berat Badan Berlebihan', color: 'orange' };
    } else {
      return { category: 'obese', categoryMs: 'Obesiti', color: 'red' };
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

  return (
    <div class="max-w-xl mx-auto">
      <div class="mb-8 flex items-center gap-4">
        <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
          <ActivityIcon />
        </div>
        <div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono uppercase">
            KALKULATOR BMI
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            Index Jisim Badan untuk kesihatan optimum.
          </p>
        </div>
      </div>

      <div class="card space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="input-label" for="bmi-weight">
              Berat Badan
            </label>
            <div class="relative">
              <input
                id="bmi-weight"
                type="number"
                step="0.1"
                placeholder="70"
                value={weight()}
                onInput={(e) => setWeight(e.currentTarget.value)}
                class="input-field pr-12"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">kg</span>
            </div>
            <Show when={errors().weight}>
              <p class="text-xs font-bold text-red-500 mt-2 ml-1">Sila masukkan berat yang valid</p>
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
                class="input-field pr-12"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">cm</span>
            </div>
            <Show when={errors().height}>
              <p class="text-xs font-bold text-red-500 mt-2 ml-1">Sila masukkan tinggi yang valid</p>
            </Show>
          </div>
        </div>

        <button onClick={calculate} class="btn bg-emerald-600 hover:bg-emerald-700 text-white w-full py-4 text-lg shadow-lg shadow-emerald-500/20">
          Kira BMI Anda
        </button>
      </div>

      <Show when={result()}>
        <div class="mt-8 animate-slide-up">
          <div class={`card bg-${result()!.color === 'orange' ? 'orange-500' : result()!.color === 'emerald' ? 'emerald-600' : 'red-600'} border-none overflow-hidden relative`}>
            <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-white">
              <ActivityIcon />
            </div>
            <div class="relative z-10">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 block mb-2">
                BMI ANDA
              </span>
              <div class="text-6xl font-black text-white font-mono tracking-tighter mb-4">
                {result()!.bmi}
              </div>
              
              <div class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-black bg-white/20 text-white backdrop-blur-md uppercase tracking-widest border border-white/20">
                {result()!.categoryMs}
              </div>

              {/* BMI Scale */}
              <div class="mt-10">
                <div class="relative h-4 bg-black/20 rounded-full overflow-hidden border border-white/10">
                  <div class="absolute inset-0 flex">
                    <div class="h-full bg-orange-400" style={{ width: '37%' }} />
                    <div class="h-full bg-emerald-400" style={{ width: '13%' }} />
                    <div class="h-full bg-orange-500" style={{ width: '10%' }} />
                    <div class="h-full bg-red-500 flex-1" />
                  </div>
                  <div
                    class="absolute top-0 w-2 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] z-20"
                    style={{ left: `${Math.min(Math.max((result()!.bmi / 40) * 100, 0), 100)}%`, transform: 'translateX(-50%)' }}
                  />
                </div>
                <div class="flex justify-between mt-3 text-[10px] font-black text-white/60 font-mono tracking-tighter">
                  <span>18.5</span>
                  <span>25.0</span>
                  <span>30.0</span>
                  <span>40.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kurang</span>
          <span class="text-xs font-bold text-orange-500">&lt; 18.5</span>
        </div>
        <div class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Normal</span>
          <span class="text-xs font-bold text-emerald-500">18.5-25</span>
        </div>
        <div class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lebih</span>
          <span class="text-xs font-bold text-orange-500">25-30</span>
        </div>
        <div class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Obes</span>
          <span class="text-xs font-bold text-red-500">30+</span>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
