import { Component, createSignal, Show, onMount } from 'solid-js';

import { DarkModeProvider } from './context/DarkModeContext';
import Header from './components/layout/Header';
import Sidebar, { CalculatorType } from './components/layout/Sidebar';
import PageTransition from './components/ui/PageTransition';

import CarLoanCalculator from './components/calculators/CarLoanCalculator';
import HomeLoanCalculator from './components/calculators/HomeLoanCalculator';
import TipCalculator from './components/calculators/TipCalculator';
import SalaryCalculator from './components/calculators/SalaryCalculator';
import BMICalculator from './components/calculators/BMICalculator';
import BMRCalculator from './components/calculators/BMRCalculator';
import UnitConverter from './components/calculators/UnitConverter';
import CurrencyConverter from './components/calculators/CurrencyConverter';
import QuickCalculator from './components/calculators/QuickCalculator';

const App: Component = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [activeCalculator, setActiveCalculator] = createSignal<CalculatorType>('quick');
  const [touchStart, setTouchStart] = createSignal<number | null>(null);

  onMount(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
  });

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const start = touchStart();
    if (start === null) return;
    
    const end = e.changedTouches[0].clientX;
    const diff = start - end;
    
    if (diff < -50 && !sidebarOpen()) {
      setSidebarOpen(true);
    } else if (diff > 50 && sidebarOpen()) {
      setSidebarOpen(false);
    }
    
    setTouchStart(null);
  };

  const renderCalculator = () => {
    switch (activeCalculator()) {
      case 'car-loan':
        return <CarLoanCalculator />;
      case 'home-loan':
        return <HomeLoanCalculator />;
      case 'tip':
        return <TipCalculator />;
      case 'salary':
        return <SalaryCalculator />;
      case 'bmi':
        return <BMICalculator />;
      case 'bmr':
        return <BMRCalculator />;
      case 'unit':
        return <UnitConverter />;
      case 'currency':
        return <CurrencyConverter />;
      case 'quick':
        return <QuickCalculator />;
      default:
        return <QuickCalculator />;
    }
  };

  return (
    <DarkModeProvider>
      <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen())} />
        
        <Sidebar
          isOpen={sidebarOpen()}
          onClose={() => setSidebarOpen(false)}
          activeCalculator={activeCalculator()}
          onSelect={(type) => setActiveCalculator(type)}
        />
        
        <main class="pt-24 pb-12 px-4 lg:pl-[300px] lg:pr-8">
          <div class="max-w-xl mx-auto">
            <div class="animate-slide-up">
              {renderCalculator()}
            </div>
          </div>
        </main>
      </div>
    </DarkModeProvider>
  );
};

export default App;
