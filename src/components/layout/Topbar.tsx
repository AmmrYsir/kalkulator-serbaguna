import { Component, For, Show, createSignal, onMount, onCleanup, createMemo } from 'solid-js';
import { useDarkMode } from '../../context/DarkModeContext';
import { CalculatorType } from '../../App';

interface TopbarProps {
  activeCalculator: CalculatorType;
  onSelect: (type: CalculatorType) => void;
}

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDownIcon = (props: { class?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class={props.class} aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FinanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const HealthIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const ConverterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><polyline points="8 3 3 3 3 8" /><line x1="3" y1="3" x2="9" y2="9" />
  </svg>
);

const QuickIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="14" x2="16" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" />
  </svg>
);

const categories = [
  {
    id: 'finance',
    name: 'Finance',
    icon: FinanceIcon,
    items: [
      { id: 'car-loan' as CalculatorType, name: 'Car Loan' },
      { id: 'home-loan' as CalculatorType, name: 'Home Loan' },
      { id: 'tip' as CalculatorType, name: 'Tip Calculator' },
      { id: 'salary' as CalculatorType, name: 'Salary Calculator' },
    ],
  },
  {
    id: 'health',
    name: 'Health',
    icon: HealthIcon,
    items: [
      { id: 'bmi' as CalculatorType, name: 'BMI Calculator' },
      { id: 'bmr' as CalculatorType, name: 'BMR Calculator' },
    ],
  },
  {
    id: 'converter',
    name: 'Converter',
    icon: ConverterIcon,
    items: [
      { id: 'unit' as CalculatorType, name: 'Unit Converter' },
      { id: 'currency' as CalculatorType, name: 'Currency Converter' },
    ],
  },
  {
    id: 'quick',
    name: 'Quick',
    icon: QuickIcon,
    items: [
      { id: 'quick' as CalculatorType, name: 'Standard Calculator' },
    ],
  },
];

const Topbar: Component<TopbarProps> = (props) => {
  const { isDark, toggle } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  const [activeDropdown, setActiveDropdown] = createSignal<string | null>(null);

  let dropdownContainerRef: HTMLDivElement | undefined;

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownContainerRef && !dropdownContainerRef.contains(e.target as Node)) {
      setActiveDropdown(null);
    }
  };

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });

  const handleSelect = (id: CalculatorType) => {
    props.onSelect(id);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const currentCategory = createMemo(() => 
    categories.find(cat => cat.items.some(item => item.id === props.activeCalculator))
  );

  return (
    <>
      <header class="fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4 lg:px-12 transition-all duration-300">
        <div class="flex items-center gap-8">
          {/* Logo */}
          <button 
            onClick={() => handleSelect('quick')}
            class="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-ring-blue-500 rounded-xl p-1"
            aria-label="Go to Home / Quick Calculator"
          >
            <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
              <span class="text-white font-black text-xl font-mono">K</span>
            </div>
            <h1 class="text-lg font-black tracking-tighter text-slate-900 dark:text-white font-mono hidden sm:block">
              KALKULATOR <span class="text-blue-600 dark:text-blue-400">SERBAGUNA</span>
            </h1>
          </button>

          {/* Desktop Navigation */}
          <nav class="hidden lg:flex items-center gap-1" ref={dropdownContainerRef} aria-label="Main Navigation">
            <For each={categories}>
              {(category) => {
                const isActive = createMemo(() => currentCategory()?.id === category.id);
                return (
                  <div class="relative group">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown() === category.id ? null : category.id)}
                      aria-expanded={activeDropdown() === category.id}
                      aria-haspopup="true"
                      class={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-ring-blue-500 ${
                        activeDropdown() === category.id || isActive()
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {category.name}
                      <ChevronDownIcon class={`transition-transform duration-300 ${activeDropdown() === category.id ? 'rotate-180' : ''}`} />
                      
                      {/* Active Indicator Underline */}
                      <Show when={isActive()}>
                        <div class="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                      </Show>
                    </button>

                    <Show when={activeDropdown() === category.id}>
                      <div class="absolute top-full left-0 mt-3 w-60 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-blue-900/10 dark:shadow-none p-2 animate-scale-in origin-top-left z-[60]">
                        <div class="px-3 py-2 mb-1">
                          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                            Pilih Jenis {category.name}
                          </span>
                        </div>
                        <For each={category.items}>
                          {(item) => (
                            <button
                              onClick={() => handleSelect(item.id as CalculatorType)}
                              class={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 group/item ${
                                props.activeCalculator === item.id
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                              }`}
                            >
                              <span class={`w-1.5 h-1.5 rounded-full mr-3 transition-all duration-200 ${props.activeCalculator === item.id ? 'bg-white scale-100' : 'bg-transparent scale-0 group-hover/item:bg-blue-400 group-hover/item:scale-100'}`} />
                              {item.name}
                            </button>
                          )}
                        </For>
                      </div>
                    </Show>
                  </div>
                );
              }}
            </For>
          </nav>
        </div>

        <div class="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            class="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 active:scale-90 focus:outline-none focus-visible:ring-2 focus-ring-blue-500"
            aria-label={`Switch to ${isDark() ? 'light' : 'dark'} mode`}
          >
            <div class="transition-transform duration-500 dark:rotate-[360deg]">
              <Show when={isDark()} fallback={<MoonIcon />}>
                <SunIcon />
              </Show>
            </div>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen())}
            class="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all duration-200 active:scale-90 focus:outline-none focus-visible:ring-2 focus-ring-blue-500"
            aria-label={mobileMenuOpen() ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen()}
          >
            <Show when={mobileMenuOpen()} fallback={<MenuIcon />}>
              <CloseIcon />
            </Show>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <Show when={mobileMenuOpen()}>
        <div 
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden animate-fade-in" 
          onClick={() => setMobileMenuOpen(false)} 
        />
        <div class="fixed inset-x-4 top-20 bottom-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] z-50 lg:hidden overflow-hidden flex flex-col shadow-2xl animate-slide-up">
          <div class="p-8 overflow-y-auto flex-1 custom-scrollbar">
            <div class="space-y-10">
              <For each={categories}>
                {(category) => (
                  <div>
                    <div class="flex items-center gap-3 px-2 mb-5">
                      <div class="w-1.5 h-6 bg-blue-600 dark:bg-blue-400 rounded-full" />
                      <span class="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                        {category.name}
                      </span>
                    </div>
                    <div class="grid grid-cols-1 gap-2.5">
                      <For each={category.items}>
                        {(item) => (
                          <button
                            onClick={() => handleSelect(item.id as CalculatorType)}
                            class={`w-full flex items-center px-6 py-4 rounded-2xl text-left transition-all duration-300 active:scale-[0.98] ${
                              props.activeCalculator === item.id
                                ? 'bg-blue-600 text-white font-black shadow-xl shadow-blue-500/30'
                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold border border-transparent hover:border-blue-200 dark:hover:border-blue-900'
                            }`}
                          >
                            <Show when={props.activeCalculator === item.id}>
                              <div class="w-2 h-2 bg-white rounded-full mr-4 animate-pulse" />
                            </Show>
                            {item.name}
                          </button>
                        )}
                      </For>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
          <div class="p-8 pt-0">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              class="w-full py-5 rounded-[1.5rem] bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black uppercase tracking-[0.2em] text-xs shadow-lg active:scale-95 transition-all"
            >
              Tutup Menu
            </button>
          </div>
        </div>
      </Show>
    </>
  );
};

export default Topbar;

