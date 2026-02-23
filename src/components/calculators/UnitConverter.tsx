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
    <div class="max-w-md mx-auto">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-1">
          Penukar Unit
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Tukar antara pelbagai unit ukuran
        </p>
      </div>

      {/* Unit Type Selector */}
      <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
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
              class={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                unitType() === type.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {type.name}
            </button>
          )}
        </For>
      </div>

      <div class="card space-y-4">
        {/* From */}
        <div>
          <label class="input-label">Dari</label>
          <div class="flex gap-2">
            <input
              type="number"
              placeholder="0"
              value={inputValue()}
              onInput={(e) => setInputValue(e.currentTarget.value)}
              class="input-field flex-1"
            />
            <select
              value={fromUnit()}
              onChange={(e) => setFromUnit(e.currentTarget.value)}
              class="input-field w-28"
            >
              <For each={unitData[unitType()]}>
                {(unit) => <option value={unit.id}>{unit.symbol}</option>}
              </For>
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div class="flex justify-center">
          <button
            onClick={swapUnits}
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
                {result() || '0'}
              </span>
            </div>
            <select
              value={toUnit()}
              onChange={(e) => setToUnit(e.currentTarget.value)}
              class="input-field w-28"
            >
              <For each={unitData[unitType()]}>
                {(unit) => <option value={unit.id}>{unit.symbol}</option>}
              </For>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
