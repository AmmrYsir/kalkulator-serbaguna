/**
 * Sidebar Component with Embedded Calculator
 * Provides a quick calculator utility accessible via calculator icon button
 */

import { Component, createSignal, JSX, Show } from 'solid-js';

export const CalculatorIcon = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...props}
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="16" x2="16" y1="14" y2="18" />
    <path d="M16 10h.01" />
    <path d="M12 10h.01" />
    <path d="M8 10h.01" />
    <path d="M12 14h.01" />
    <path d="M8 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
  </svg>
);

export const CloseIcon = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export interface SidebarProps {
  sidebarOpen: () => boolean;
  setSidebarOpen: (value: boolean) => void;
}

const Sidebar: Component<SidebarProps> = (props) => {

  // Calculator state
  const [display, setDisplay] = createSignal('0');
  const [previousValue, setPreviousValue] = createSignal<number | null>(null);
  const [operation, setOperation] = createSignal<string | null>(null);
  const [newNumber, setNewNumber] = createSignal(true);

  const closeSidebar = () => props.setSidebarOpen(false);

  // Calculator functions
  const handleNumber = (num: string) => {
    setNewNumber(false);
    setDisplay((prev) => (prev === '0' ? num : prev + num));
  };

  const handleDecimal = () => {
    if (!display().includes('.')) {
      setDisplay((prev) => prev + '.');
      setNewNumber(false);
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display());

    if (previousValue() !== null && !newNumber() && operation()) {
      handleEquals();
    } else {
      setPreviousValue(currentValue);
    }

    setOperation(op);
    setNewNumber(true);
  };

  const handleEquals = () => {
    const current = parseFloat(display());
    const previous = previousValue();
    const op = operation();

    if (previous === null || op === null) return;

    let result = 0;
    switch (op) {
      case '+':
        result = previous + current;
        break;
      case '-':
        result = previous - current;
        break;
      case '*':
        result = previous * current;
        break;
      case '/':
        result = current !== 0 ? previous / current : 0;
        break;
    }

    const formatted =
      result % 1 === 0 ? result.toString() : result.toFixed(10).replace(/\.?0+$/, '');
    setDisplay(formatted);
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleBackspace = () => {
    const current = display();
    if (current.length === 1) {
      setDisplay('0');
      setNewNumber(true);
    } else {
      setDisplay(current.slice(0, -1));
    }
  };

  return (
    <>
      {/* Overlay */}
      <Show when={props.sidebarOpen()}>
        <div class="sidebar-overlay" onClick={closeSidebar} />
      </Show>

      {/* Sidebar with Embedded Calculator */}
      <aside class={`sidebar ${props.sidebarOpen() ? 'open' : ''}`}>
        <div class="sidebar-calculator">
          <h3 class="sidebar-calc-title">Quick Calculator</h3>

          {/* Display */}
          <div class="sidebar-calc-display">{display()}</div>

          {/* Buttons Grid */}
          <div class="sidebar-calc-grid">
            <button onClick={handleClear} class="calc-btn calc-btn-function" title="Clear">C</button>
            <button onClick={handleBackspace} class="calc-btn calc-btn-function" title="Backspace">←</button>
            <button onClick={() => handleOperation('/')} class="calc-btn calc-btn-operator" title="Divide">÷</button>
            <button onClick={() => handleOperation('*')} class="calc-btn calc-btn-operator" title="Multiply">×</button>

            <button onClick={() => handleNumber('7')} class="calc-btn">7</button>
            <button onClick={() => handleNumber('8')} class="calc-btn">8</button>
            <button onClick={() => handleNumber('9')} class="calc-btn">9</button>
            <button onClick={() => handleOperation('-')} class="calc-btn calc-btn-operator" title="Subtract">−</button>

            <button onClick={() => handleNumber('4')} class="calc-btn">4</button>
            <button onClick={() => handleNumber('5')} class="calc-btn">5</button>
            <button onClick={() => handleNumber('6')} class="calc-btn">6</button>
            <button onClick={() => handleOperation('+')} class="calc-btn calc-btn-operator" title="Add">+</button>

            <button onClick={() => handleNumber('1')} class="calc-btn">1</button>
            <button onClick={() => handleNumber('2')} class="calc-btn">2</button>
            <button onClick={() => handleNumber('3')} class="calc-btn">3</button>
            <button onClick={handleDecimal} class="calc-btn" title="Decimal">.</button>

            <button onClick={() => handleNumber('0')} class="calc-btn calc-btn-zero">0</button>
            <button onClick={handleEquals} class="calc-btn calc-btn-equals" title="Equals">=</button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
