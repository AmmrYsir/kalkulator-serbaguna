import { Component, Show } from 'solid-js';
import { useDarkMode } from '../../context/DarkModeContext';

interface HeaderProps {
	onMenuClick: () => void;
}

const SunIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<circle cx="12" cy="12" r="5" />
		<line x1="12" y1="1" x2="12" y2="3" />
		<line x1="12" y1="21" x2="12" y2="23" />
		<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
		<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
		<line x1="1" y1="12" x2="3" y2="12" />
		<line x1="21" y1="12" x2="23" y2="12" />
		<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
		<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
	</svg>
);

const MoonIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
	</svg>
);

const MenuIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<line x1="3" y1="12" x2="21" y2="12" />
		<line x1="3" y1="6" x2="21" y2="6" />
		<line x1="3" y1="18" x2="21" y2="18" />
	</svg>
);

const Header: Component<HeaderProps> = (props) => {
	const { isDark, toggle } = useDarkMode();

	return (
		<header class="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4 lg:px-8">
			<div class="flex items-center gap-4">
				<button
					onClick={props.onMenuClick}
					class="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
					aria-label="Open menu"
				>
					<MenuIcon />
				</button>

				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
						<span class="text-white font-black text-xl font-mono">K</span>
					</div>
					<div class="hidden sm:block">
						<h1 class="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-mono">
							KALKULATOR <span class="text-blue-600 dark:text-blue-400">SERBAGUNA</span>
						</h1>
					</div>
				</div>
			</div>

			<button
				onClick={toggle}
				class="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
				aria-label="Toggle dark mode"
			>
				<div class="transition-transform duration-300 dark:rotate-0 rotate-12 scale-100 active:scale-90">
					<Show when={isDark()} fallback={<MoonIcon />}>
						<SunIcon />
					</Show>
				</div>
			</button>
		</header>
	);
};

export default Header;

