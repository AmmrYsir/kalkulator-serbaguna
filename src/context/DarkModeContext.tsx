import { createContext, useContext, ParentComponent, createSignal, createEffect, onMount } from 'solid-js';

interface DarkModeContextValue {
  isDark: () => boolean;
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue>();

export const DarkModeProvider: ParentComponent = (props) => {
  const [isDark, setIsDark] = createSignal(false);
  const [initialized, setInitialized] = createSignal(false);

  onMount(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      setIsDark(stored === 'true');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    setInitialized(true);
  });

  createEffect(() => {
    if (!initialized()) return;

    const dark = isDark();
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('darkMode', String(dark));
  });

  const toggle = () => setIsDark((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      {props.children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};
