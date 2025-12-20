import { Component, createSignal, Show, JSX } from 'solid-js';
import CarLoanCalculator from './components/CarLoanCalculator';
import HomeLoanCalculator from './components/HomeLoanCalculator';

type TabType = 'car' | 'home';

// Icon Components - Clean, minimal SVG icons
const CarIcon = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...props}
  >
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-3.4-4.9a2 2 0 0 0-1.6-.9H7a2 2 0 0 0-1.6.8L2 10l-1.5 1.1C.2 11.4 0 11.9 0 12.5V16c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const HomeIcon = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...props}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const App: Component = () => {
  const [activeTab, setActiveTab] = createSignal<TabType>('car');

  return (
    <div class="app-container">
      {/* Tab Navigation */}
      <nav class="tabs-container" role="tablist" aria-label="Calculator type">
        <button
          role="tab"
          aria-selected={activeTab() === 'car'}
          onClick={() => setActiveTab('car')}
          class={`tab-btn ${activeTab() === 'car' ? 'active' : ''}`}
        >
          <CarIcon aria-hidden="true" />
          Car Loan
        </button>
        <button
          role="tab"
          aria-selected={activeTab() === 'home'}
          onClick={() => setActiveTab('home')}
          class={`tab-btn ${activeTab() === 'home' ? 'active' : ''}`}
        >
          <HomeIcon aria-hidden="true" />
          Home Loan
        </button>
      </nav>

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
