import { Component, For, Show } from 'solid-js';

export type CalculatorType = 
  | 'car-loan' | 'home-loan' | 'tip' | 'salary'
  | 'bmi' | 'bmr'
  | 'unit' | 'currency'
  | 'quick';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  items: { id: CalculatorType; name: string; nameMs: string }[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeCalculator: CalculatorType;
  onSelect: (type: CalculatorType) => void;
}

const categories: Category[] = [
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    color: 'indigo',
    items: [
      { id: 'car-loan', name: 'Car Loan', nameMs: 'Pinjaman Kereta' },
      { id: 'home-loan', name: 'Home Loan', nameMs: 'Pinjaman Rumah' },
      { id: 'tip', name: 'Tip Calculator', nameMs: 'Kalkulator Tip' },
      { id: 'salary', name: 'Salary', nameMs: 'Gaji' },
    ],
  },
  {
    id: 'health',
    name: 'Health',
    icon: '⚖️',
    color: 'emerald',
    items: [
      { id: 'bmi', name: 'BMI', nameMs: 'BMI' },
      { id: 'bmr', name: 'BMR', nameMs: 'BMR' },
    ],
  },
  {
    id: 'converter',
    name: 'Converter',
    icon: '📐',
    color: 'amber',
    items: [
      { id: 'unit', name: 'Unit Converter', nameMs: 'Penukar Unit' },
      { id: 'currency', name: 'Currency', nameMs: 'Mata Wang' },
    ],
  },
  {
    id: 'quick',
    name: 'Quick',
    icon: '🔢',
    color: 'slate',
    items: [
      { id: 'quick', name: 'Calculator', nameMs: 'Kalkulator' },
    ],
  },
];

const CalculatorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="16" y1="14" x2="16" y2="18"/>
    <path d="M16 10h.01"/>
    <path d="M12 10h.01"/>
    <path d="M8 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M8 14h.01"/>
    <path d="M8 18h.01"/>
    <path d="M12 18h.01"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const Sidebar: Component<SidebarProps> = (props) => {
  return (
    <>
      {/* Mobile Overlay */}
      <Show when={props.isOpen}>
        <div 
          class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200"
          onClick={props.onClose}
        />
      </Show>

      {/* Sidebar */}
      <aside
        class={`fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 lg:z-30 lg:top-16 lg:h-[calc(100vh-4rem)] transition-transform duration-300 ease-out ${
          props.isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 lg:hidden">
          <span class="font-semibold text-slate-900 dark:text-white">Menu</span>
          <button
            onClick={props.onClose}
            class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav class="p-3 space-y-6 overflow-y-auto lg:py-4">
          <For each={categories}>
            {(category) => (
              <div>
                <div class="flex items-center gap-2 px-3 mb-2">
                  <span class="text-base">{category.icon}</span>
                  <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {category.name}
                  </span>
                </div>
                <div class="space-y-1">
                  <For each={category.items}>
                    {(item) => (
                      <button
                        onClick={() => {
                          props.onSelect(item.id);
                          props.onClose();
                        }}
                        class={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                          props.activeCalculator === item.id
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <CalculatorIcon />
                        <span class="text-sm">{item.name}</span>
                      </button>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
