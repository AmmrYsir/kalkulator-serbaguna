import { Component, createSignal, For, createEffect } from 'solid-js';

type UnitType = 'length' | 'weight' | 'temperature' | 'area';

interface Unit {
  id: string;
  name: string;
  symbol: string;
}

const unitData: Record<UnitType, Unit[]> = {
  length: [
    { id: 'km', name: 'Kilometer', symbol: 'km' },
    { id: 'm', name: 'Meter', symbol: 'm' },
    { id: 'cm', name: 'Sentimeter', symbol: 'cm' },
    { id: 'mm', name: 'Milimeter', symbol: 'mm' },
    { id: 'mile', name: 'Mil', symbol: 'mi' },
    { id: 'yard', name: 'Yard', symbol: 'yd' },
    { id: 'foot', name: 'Kaki', symbol: 'ft' },
    { id: 'inch', name: 'Inci', symbol: 'in' },
  ],
  weight: [
    { id: 'kg', name: 'Kilogram', symbol: 'kg' },
    { id: 'g', name: 'Gram', symbol: 'g' },
    { id: 'mg', name: 'Miligram', symbol: 'mg' },
    { id: 'lb', name: 'Paun', symbol: 'lb' },
    { id: 'oz', name: 'Auns', symbol: 'oz' },
  ],
  temperature: [
    { id: 'celsius', name: 'Celsius', symbol: '°C' },
    { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F' },
    { id: 'kelvin', name: 'Kelvin', symbol: 'K' },
  ],
  area: [
    { id: 'sqm', name: 'Meter persegi', symbol: 'm²' },
    { id: 'sqkm', name: 'Kilometer persegi', symbol: 'km²' },
    { id: 'sqft', name: 'Kaki persegi', symbol: 'ft²' },
    { id: 'acre', name: 'Akar', symbol: 'ac' },
    { id: 'hectare', name: 'Hektar', symbol: 'ha' },
  ],
};

const RulerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-600 dark:text-orange-400">
    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 4.5 2 2"/><path d="m11.5 7.5 2 2"/><path d="m8.5 10.5 2 2"/><path d="m5.5 13.5 2 2"/>
  </svg>
);

const UnitConverter: Component = () => {
  const [unitType, setUnitType] = createSignal<UnitType>('length');
  const [fromUnit, setFromUnit] = createSignal('m');
  const [toUnit, setToUnit] = createSignal('cm');
  const [inputValue, setInputValue] = createSignal('');
  const [result, setResult] = createSignal('');

  const conversionFactors: Record<string, Record<string, number>> = {
    // Length (base: meter)
    length: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      mile: 1609.344,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254,
    },
    // Weight (base: kg)
    weight: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.453592,
      oz: 0.0283495,
    },
    // Area (base: sqm)
    area: {
      sqm: 1,
      sqkm: 1000000,
      sqft: 0.092903,
      acre: 4046.86,
      hectare: 10000,
    },
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Celsius first
    let celsius: number;
    switch (from) {
      case 'celsius': celsius = value; break;
      case 'fahrenheit': celsius = (value - 32) * 5/9; break;
      case 'kelvin': celsius = value - 273.15; break;
      default: celsius = value;
    }
    
    // Convert from Celsius to target
    switch (to) {
      case 'celsius': return celsius;
      case 'fahrenheit': return celsius * 9/5 + 32;
      case 'kelvin': return celsius + 273.15;
      default: return celsius;
    }
  };

  const convert = () => {
    const value = parseFloat(inputValue());
    if (isNaN(value)) {
      setResult('');
      return;
    }

    const type = unitType();
    
    if (type === 'temperature') {
      const res = convertTemperature(value, fromUnit(), toUnit());
      setResult(res.toLocaleString('en-MY', { maximumFractionDigits: 6 }));
    } else {
      const factors = conversionFactors[type];
      const baseValue = value * factors[fromUnit()];
      const resultValue = baseValue / factors[toUnit()];
      setResult(resultValue.toLocaleString('en-MY', { maximumFractionDigits: 6 }));
    }
  };

  createEffect(() => {
    // Auto-convert when inputs change
    inputValue();
    fromUnit();
    toUnit();
    unitType();
    convert();
  });

  const swapUnits = () => {
    const temp = fromUnit();
    setFromUnit(toUnit());
    setToUnit(temp);
  };

  const unitTypes: { id: UnitType; name: string }[] = [
    { id: 'length', name: 'Panjang' },
    { id: 'weight', name: 'Berat' },
    { id: 'temperature', name: 'Suhu' },
    { id: 'area', name: 'Luas' },
  ];

  return (
    <div class="max-w-xl mx-auto">
      <div class="mb-8 flex items-center gap-4">
        <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl">
          <RulerIcon />
        </div>
        <div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono uppercase">
            PENUKAR UNIT
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            Tukar pelbagai jenis unit ukuran dengan mudah.
          </p>
        </div>
      </div>

      {/* Unit Type Selector */}
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        <For each={unitTypes}>
          {(type) => (
            <button
              onClick={() => {
                setUnitType(type.id);
                const units = unitData[type.id];
                setFromUnit(units[0].id);
                setToUnit(units[1]?.id || units[0].id);
                setInputValue('');
                setResult('');
              }}
              class={`px-6 py-2.5 rounded-xl text-sm font-black font-mono tracking-widest uppercase transition-all duration-200 whitespace-nowrap ${
                unitType() === type.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {type.name}
            </button>
          )}
        </For>
      </div>

      <div class="card space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* From */}
          <div class="space-y-3">
            <label class="input-label">Dari</label>
            <div class="flex flex-col gap-2">
              <input
                type="number"
                placeholder="0"
                value={inputValue()}
                onInput={(e) => setInputValue(e.currentTarget.value)}
                class="input-field text-xl font-bold font-mono"
              />
              <select
                value={fromUnit()}
                onChange={(e) => setFromUnit(e.currentTarget.value)}
                class="input-field bg-white dark:bg-slate-800 font-semibold"
              >
                <For each={unitData[unitType()]}>
                  {(unit) => <option value={unit.id}>{unit.name} ({unit.symbol})</option>}
                </For>
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div class="flex justify-center md:pt-8">
            <button
              onClick={swapUnits}
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
                  {result() || '0'}
                </span>
              </div>
              <select
                value={toUnit()}
                onChange={(e) => setToUnit(e.currentTarget.value)}
                class="input-field bg-white dark:bg-slate-800 font-semibold"
              >
                <For each={unitData[unitType()]}>
                  {(unit) => <option value={unit.id}>{unit.name} ({unit.symbol})</option>}
                </For>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
