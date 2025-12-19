# Copilot Instructions: Kalkulator Serbaguna

## Project Overview
SolidJS application built with Vite, TypeScript, and pnpm implementing a Malaysian car loan calculator. Project name "kalkulator serbaguna" means "versatile calculator" in Indonesian, designed for future expansion to multiple calculator types.

## Tech Stack & Architecture
- **Framework**: SolidJS 1.9.5 with fine-grained reactivity (not React - different mental model)
- **Build Tool**: Vite 7.1.4 with `vite-plugin-solid`
- **Language**: TypeScript (strict mode, ESNext target)
- **Package Manager**: pnpm (lockfile present, but any package manager works)
- **Dev Tools**: solid-devtools enabled in dev mode

## SolidJS-Specific Patterns

### Component Style
- Use functional components with TypeScript `Component` type from `solid-js`
- Default exports are acceptable (see [Comp.tsx](src/Comp.tsx))
- Arrow functions for simple components, typed functions for complex ones

### JSX Configuration
- `jsxImportSource: "solid-js"` - components auto-import from SolidJS
- `jsx: "preserve"` - JSX handled by Vite plugin, not TypeScript compiler
- No React imports needed; SolidJS handles JSX differently

### Reactivity Pattern
SolidJS uses signals, not virtual DOM. Key differences from React:
- Use `createSignal()` for reactive state, not `useState`
- Use `createEffect()` not `useEffect`  
- No dependency arrays - reactivity is automatic
- Components run once, not on every render

## Development Workflow

### Commands (npm/pnpm/yarn)
- `npm start` or `npm run dev` → Dev server at http://localhost:3000 (configured in [vite.config.ts](vite.config.ts#L6-L8))
- `npm run build` → Production build to `dist/` folder
- `npm run serve` → Preview production build

### Entry Points
- HTML: [index.html](index.html) - Vite entry point with `<div id="root">`
- TS: [src/index.tsx](src/index.tsx) - App bootstrap with `render()` from `solid-js/web`
- Root Component: [src/App.tsx](src/App.tsx)

### Hot Module Replacement
- `/* @refresh reload */` comment in [src/index.tsx](src/index.tsx#L1) ensures full page reload on updates
- `solid-devtools` import enables debugging in browser DevTools

## Code Conventions

### TypeScript
- Strict mode enabled - all type safety features on
- `isolatedModules: true` - each file must be independently compilable
- Use `import.meta.env` for environment variables (Vite convention)

### Project Structure
```
src/
├── model/              # Pure business logic (calculations only)
├── presenter/          # Coordination logic using SolidJS signals
├── components/         # View components (UI only, no business logic)
├── App.tsx            # Root component
└── index.tsx          # Bootstrap with solid-js/web render
```

## MVP (Model-View-Presenter) Architecture

### Car Loan Calculator (Flat-Rate)

#### Model Layer ([src/model/CarLoanModel.ts](src/model/CarLoanModel.ts))
- **Pure calculation logic** - no UI, no validation, no formatting
- Malaysian flat-rate formula: Total Interest = (Rate / 100) × Principal × Period
- Returns raw numbers - Presenter handles formatting
- Example: `calculateFlatRateLoan({ loanAmount: 70000, interestRate: 3.5, loanPeriod: 5 })`

#### Presenter Layer ([src/presenter/CarLoanPresenter.ts](src/presenter/CarLoanPresenter.ts))
- **Coordination using SolidJS signals** - connects Model and View
- Input validation (positive numbers, non-empty fields)
- Calls Model for calculations
- Formats results in Malaysian Ringgit using `toLocaleString('en-MY')`
- Returns signals for View to consume
- Pattern: `createCarLoanPresenter()` returns reactive state + actions

#### View Layer ([src/components/CarLoanCalculator.tsx](src/components/CarLoanCalculator.tsx))
- **Zero business logic** - only renders UI and forwards user actions
- Uses Presenter signals for reactive updates
- Input fields: loan amount (RM), interest rate (% p.a.), loan period (years)
- Displays: total interest, total repayment, monthly installment
- Inline styles (no CSS framework) - simple and self-contained

### Home Loan Calculator (EMI)

#### Model Layer ([src/model/HomeLoanModel.ts](src/model/HomeLoanModel.ts))
- **Pure EMI calculation** using formula: M = P [ r(1+r)^n ] / [ (1+r)^n – 1 ]
- r = monthly rate (annual / 12 / 100), n = tenure × 12
- Handles edge case: 0% interest rate
- Returns monthly repayment, total repayment, total interest
- Note: Simplified estimate - actual Malaysian loans use reducing balance with BR fluctuations

#### Presenter Layer ([src/presenter/HomeLoanPresenter.ts](src/presenter/HomeLoanPresenter.ts))
- Same pattern as car loan: validation → calculation → formatting
- Allows 0% interest rate (unlike car loan which requires positive)
- Malaysian Ringgit formatting for all monetary values

#### View Layer ([src/components/HomeLoanCalculator.tsx](src/components/HomeLoanCalculator.tsx))
- Input fields: loan amount, interest rate, loan tenure (years)
- Displays: monthly EMI (highlighted), total interest, total repayment
- Disclaimer about BR changes and actual reducing balance calculations
- Green color scheme (vs blue for car loan)

## Adding New Calculator Features
New calculator types should follow the same MVP pattern:
1. Create Model in `src/model/` with pure calculation logic
2. Create Presenter in `src/presenter/` using `createSignal()` for state
3. Create View in `src/components/` consuming Presenter signals
4. Import into [App.tsx](src/App.tsx) - future: add routing for multiple calculators

### Dependencies
Use pnpm commands if maintaining lockfile, but npm/yarn work too (README note about removing pnpm-lock.yaml if switching).

## Build Configuration

### Vite Settings
- Server port: 3000 (not Vite's default 5173)
- Build target: `esnext` - assumes modern browsers
- Plugins order: devtools before solidPlugin ([vite.config.ts](vite.config.ts#L5))

### TypeScript Module Resolution
- `moduleResolution: "bundler"` - modern Vite-aware resolution
- `noEmit: true` - TypeScript only checks, doesn't compile (Vite handles that)
