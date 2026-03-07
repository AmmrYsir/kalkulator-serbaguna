import { Component, createSignal, Show, onMount } from 'solid-js';

import { DarkModeProvider } from './context/DarkModeContext';
import Topbar from './components/layout/Topbar';

import CarLoanCalculator from './components/calculators/CarLoanCalculator';
import HomeLoanCalculator from './components/calculators/HomeLoanCalculator';
import TipCalculator from './components/calculators/TipCalculator';
import SalaryCalculator from './components/calculators/SalaryCalculator';
import BMICalculator from './components/calculators/BMICalculator';
import BMRCalculator from './components/calculators/BMRCalculator';
import UnitConverter from './components/calculators/UnitConverter';
import CurrencyConverter from './components/calculators/CurrencyConverter';
import QuickCalculator from './components/calculators/QuickCalculator';

export type CalculatorType =
	| 'car-loan' | 'home-loan' | 'tip' | 'salary'
	| 'bmi' | 'bmr'
	| 'unit' | 'currency'
	| 'quick';

const App: Component = () => {
	const [activeCalculator, setActiveCalculator] = createSignal<CalculatorType>('quick');

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
				<Topbar
					activeCalculator={activeCalculator()}
					onSelect={(type) => setActiveCalculator(type)}
				/>

				<main class="pt-24 pb-12 px-4 lg:px-8">
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
