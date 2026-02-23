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
			<div class="mb-6">
				<h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-1">
					Kalkulator
				</h2>
				<p class="text-sm text-slate-500 dark:text-slate-400">
					Kira nombor dengan pantas
				</p>
			</div>

			<div class="card p-4">
				{/* Display */}
				<div class="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 mb-4 min-h-[100px] flex flex-col justify-end">
					<Show when={expression()}>
						<div class="text-sm text-slate-400 opacity-80 mb-1 truncate">
							{expression()}
						</div>
					</Show>
					<div class="text-4xl font-semibold text-white text-right tabular-nums">
						{display()}
					</div>
				</div>

				{/* Buttons */}
				<div class="grid grid-cols-4 gap-2">
					{/* Row 1 */}
					<button onClick={handleClear} class="calc-btn calc-btn-fn">
						AC
					</button>
					<button onClick={handlePlusMinus} class="calc-btn calc-btn-fn">
						+/−
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
						class="calc-btn calc-btn-equals"
					>
						=
					</button>
				</div>
			</div>
		</div>
	);
};

export default QuickCalculator;
