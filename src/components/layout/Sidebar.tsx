import { Component, For, Show } from 'solid-js';

export type CalculatorType = 
  | 'car-loan' | 'home-loan' | 'tip' | 'salary'
  | 'bmi' | 'bmr'
  | 'unit' | 'currency'
  | 'quick';

interface Category {
  id: string;
  name: string;
  icon: (props: any) => any;
  color: string;
  items: { id: CalculatorType; name: string; nameMs: string; icon: (props: any) => any }[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeCalculator: CalculatorType;
  onSelect: (type: CalculatorType) => void;
}

const FinanceIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const HealthIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

const ConverterIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
    <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><polyline points="8 3 3 3 3 8"/><line x1="3" y1="3" x2="9" y2="9"/>
  </svg>
);

const QuickIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...props}>
    <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>
  </svg>
);

const categories: Category[] = [
  {
    id: 'finance',
    name: 'Finance',
    icon: FinanceIcon,
    color: 'blue',
    items: [
      { id: 'car-loan', name: 'Car Loan', nameMs: 'Pinjaman Kereta', icon: QuickIcon },
      { id: 'home-loan', name: 'Home Loan', nameMs: 'Pinjaman Rumah', icon: QuickIcon },
      { id: 'tip', name: 'Tip Calculator', nameMs: 'Kalkulator Tip', icon: QuickIcon },
      { id: 'salary', name: 'Salary', nameMs: 'Gaji', icon: QuickIcon },
    ],
  },
  {
    id: 'health',
    name: 'Health',
    icon: HealthIcon,
    color: 'emerald',
    items: [
      { id: 'bmi', name: 'BMI', nameMs: 'BMI', icon: QuickIcon },
      { id: 'bmr', name: 'BMR', nameMs: 'BMR', icon: QuickIcon },
    ],
  },
  {
    id: 'converter',
    name: 'Converter',
    icon: ConverterIcon,
    color: 'orange',
    items: [
      { id: 'unit', name: 'Unit Converter', nameMs: 'Penukar Unit', icon: QuickIcon },
      { id: 'currency', name: 'Currency', nameMs: 'Mata Wang', icon: QuickIcon },
    ],
  },
  {
    id: 'quick',
    name: 'Quick',
    icon: QuickIcon,
    color: 'slate',
    items: [
      { id: 'quick', name: 'Calculator', nameMs: 'Kalkulator', icon: QuickIcon },
    ],
  },
];

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
          class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={props.onClose}
        />
      </Show>

      {/* Sidebar */}
      <aside
        class={`fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 lg:z-30 lg:top-16 lg:h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
          props.isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 lg:hidden">
          <span class="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Navigation</span>
          <button
            onClick={props.onClose}
            class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav class="p-4 space-y-8 overflow-y-auto lg:py-6 h-full custom-scrollbar">
          <For each={categories}>
            {(category) => (
              <div>
                <div class="flex items-center gap-2 px-4 mb-3">
                  <category.icon class="text-blue-600 dark:text-blue-400" />
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
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
                        class={`w-full sidebar-link ${
                          props.activeCalculator === item.id ? 'active' : ''
                        }`}
                      >
                        <item.icon width="16" height="16" />
                        <span class="text-sm font-medium">{item.name}</span>
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

