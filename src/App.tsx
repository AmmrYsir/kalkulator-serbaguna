import { Component, createSignal, Show } from 'solid-js';
import CarLoanCalculator from './components/CarLoanCalculator';
import HomeLoanCalculator from './components/HomeLoanCalculator';

type TabType = 'car' | 'home';

const App: Component = () => {
  const [activeTab, setActiveTab] = createSignal<TabType>('car');

  return (
    <div class="app-container">
      {/* Tab Navigation */}
      <div class="tabs-container">
        <button
          onClick={() => setActiveTab('car')}
          class={`tab-btn ${activeTab() === 'car' ? 'active' : ''}`}
        >
          🚗 Car Loan
        </button>
        <button
          onClick={() => setActiveTab('home')}
          class={`tab-btn home ${activeTab() === 'home' ? 'active' : ''}`}
        >
          🏠 Home Loan
        </button>
      </div>

      {/* Tab Content */}
      <Show when={activeTab() === 'car'}>
        <CarLoanCalculator />
      </Show>
      <Show when={activeTab() === 'home'}>
        <HomeLoanCalculator />
      </Show>
    </div>
  );
};

export default App;
