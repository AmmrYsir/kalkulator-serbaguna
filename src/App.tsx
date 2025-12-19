import { Component, createSignal, Show } from 'solid-js';
import CarLoanCalculator from './components/CarLoanCalculator';
import HomeLoanCalculator from './components/HomeLoanCalculator';

type TabType = 'car' | 'home';

const App: Component = () => {
  const [activeTab, setActiveTab] = createSignal<TabType>('car');

  const tabStyle = (isActive: boolean) => ({
    padding: '12px 24px',
    'font-size': '16px',
    'font-weight': isActive ? 'bold' : 'normal',
    color: isActive ? '#3498db' : '#7f8c8d',
    background: isActive ? 'white' : 'transparent',
    border: 'none',
    'border-bottom': isActive ? '3px solid #3498db' : '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  });

  return (
    <div style={{
      'min-height': '100vh',
      background: '#ecf0f1',
      padding: '20px 0',
    }}>
      {/* Tab Navigation */}
      <div style={{
        'max-width': '600px',
        margin: '0 auto 20px',
        background: 'white',
        'border-radius': '8px 8px 0 0',
        'box-shadow': '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          display: 'flex',
          'border-bottom': '1px solid #e0e0e0',
        }}>
          <button
            onClick={() => setActiveTab('car')}
            style={tabStyle(activeTab() === 'car')}
          >
            🚗 Car Loan
          </button>
          <button
            onClick={() => setActiveTab('home')}
            style={tabStyle(activeTab() === 'home')}
          >
            🏠 Home Loan
          </button>
        </div>
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
