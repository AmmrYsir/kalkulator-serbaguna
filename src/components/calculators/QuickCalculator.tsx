import { Component, createSignal, Show } from 'solid-js';

const QuickCalculator: Component = () => {
	const [display, setDisplay] = createSignal('0');
	const [expression, setExpression] = createSignal('');
	const [previousValue, setPreviousValue] = createSignal<number | null>(null);
	const [operation, setOperation] = createSignal<string | null>(null);
	const [newNumber, setNewNumber] = createSignal(true);

	const handleNumber = (num: string) => {
		if (newNumber()) {
			setDisplay(num);
			setNewNumber(false);
		} else {
			setDisplay((prev) => (prev === '0' ? num : prev + num));
		}
	};

	const handleDecimal = () => {
		if (newNumber()) {
			setDisplay('0.');
			setNewNumber(false);
		} else if (!display().includes('.')) {
			setDisplay((prev) => prev + '.');
		}
	};

	const handleOperation = (op: string) => {
		const currentValue = parseFloat(display());
		const displayOp = op === '*' ? '×' : op === '/' ? '÷' : op;

		if (previousValue() !== null && !newNumber() && operation()) {
			const previous = previousValue()!;
			const currentOp = operation()!;

			let result = 0;
			switch (currentOp) {
				case '+': result = previous + currentValue; break;
				case '-': result = previous - currentValue; break;
				case '*': result = previous * currentValue; break;
				case '/': result = currentValue !== 0 ? previous / currentValue : 0; break;
			}

			const formatted = result % 1 === 0 ? result.toString() : result.toFixed(10).replace(/\.?0+$/, '');
			setDisplay(formatted);
			setPreviousValue(result);
			setExpression(`${formatted} ${displayOp}`);
		} else {
			setPreviousValue(currentValue);
			setExpression(`${display()} ${displayOp}`);
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
			case '+': result = previous + current; break;
			case '-': result = previous - current; break;
			case '*': result = previous * current; break;
			case '/': result = current !== 0 ? previous / current : 0; break;
		}

		const formatted = result % 1 === 0 ? result.toString() : result.toFixed(10).replace(/\.?0+$/, '');
		setExpression(`${expression()} ${display()} =`);
		setDisplay(formatted);
		setPreviousValue(null);
		setOperation(null);
		setNewNumber(true);
	};

	const handleClear = () => {
		setDisplay('0');
		setExpression('');
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

	const handlePercent = () => {
		const current = parseFloat(display());
		setDisplay((current / 100).toString());
	};

	const handlePlusMinus = () => {
		const current = parseFloat(display());
		setDisplay((-current).toString());
	};

	return (
		<div class="max-w-md mx-auto">
			<div class="mb-8">
				<h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight font-mono uppercase">
					KALKULATOR
				</h2>
				<p class="text-slate-500 dark:text-slate-400 font-medium">
					Kira nombor dengan pantas dan tepat.
				</p>
			</div>

			<div class="card p-6 bg-slate-50/50 dark:bg-slate-800/50 border-2">
				{/* Display */}
				<div class="bg-white dark:bg-slate-950 rounded-2xl p-6 mb-6 min-h-[120px] flex flex-col justify-end border-2 border-slate-200 dark:border-slate-800 shadow-inner">
					<Show when={expression()}>
						<div class="text-xs font-bold font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 opacity-80 truncate">
							{expression()}
						</div>
					</Show>
					<div class="text-5xl font-black text-slate-900 dark:text-white text-right tabular-nums font-mono tracking-tighter">
						{display()}
					</div>
				</div>

				{/* Buttons */}
				<div class="grid grid-cols-4 gap-3">
					{/* Row 1 */}
					<button onClick={handleClear} class="calc-btn calc-btn-fn">
						AC
					</button>
					<button onClick={handlePlusMinus} class="calc-btn calc-btn-fn">
						±
					</button>
					<button onClick={handlePercent} class="calc-btn calc-btn-fn">
						%
					</button>
					<button onClick={() => handleOperation('/')} class="calc-btn calc-btn-operator">
						÷
					</button>

					{/* Row 2 */}
					<button onClick={() => handleNumber('7')} class="calc-btn">7</button>
					<button onClick={() => handleNumber('8')} class="calc-btn">8</button>
					<button onClick={() => handleNumber('9')} class="calc-btn">9</button>
					<button onClick={() => handleOperation('*')} class="calc-btn calc-btn-operator">×</button>

					{/* Row 3 */}
					<button onClick={() => handleNumber('4')} class="calc-btn">4</button>
					<button onClick={() => handleNumber('5')} class="calc-btn">5</button>
					<button onClick={() => handleNumber('6')} class="calc-btn">6</button>
					<button onClick={() => handleOperation('-')} class="calc-btn calc-btn-operator">−</button>

					{/* Row 4 */}
					<button onClick={() => handleNumber('1')} class="calc-btn">1</button>
					<button onClick={() => handleNumber('2')} class="calc-btn">2</button>
					<button onClick={() => handleNumber('3')} class="calc-btn">3</button>
					<button onClick={() => handleOperation('+')} class="calc-btn calc-btn-operator">+</button>

					{/* Row 5 */}
					<button onClick={() => handleNumber('0')} class="calc-btn col-span-2">0</button>
					<button onClick={handleDecimal} class="calc-btn">.</button>
					<button
						onClick={handleEquals}
						class="calc-btn calc-btn-equals shadow-lg shadow-orange-500/20"
					>
						=
					</button>
				</div>
			</div>
		</div>
	);
};

export default QuickCalculator;
