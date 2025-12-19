# Kalkulator Serbaguna — Malaysian Loan Calculators (SolidJS)

A lightweight SolidJS app that provides two calculators:
- Car Loan (Flat-Rate)
- Home Loan (EMI estimate)

Built with Vite + TypeScript for instant dev server and fast builds.

## Prerequisites
- Node.js 18+ (or 20+ recommended)
- Any package manager works (npm/yarn/pnpm). A `pnpm-lock.yaml` exists, but you can use npm without changes.

## Quick Start
```bash
# install dependencies
npm install

# start dev server (http://localhost:3000)
npm run dev
```

## Build & Preview
```bash
# production build to dist/
npm run build

# preview the production build
npm run serve
```

## How To Use

### 1) Car Loan Calculator (Flat-Rate)
Use this to estimate Malaysian flat-rate car loans.

Inputs:
- Loan Amount (RM)
- Annual Interest Rate (% p.a.)
- Loan Period (years)

Displays:
- Total Interest
- Total Repayment
- Monthly Installment

Formula:
- Total Interest = (Rate / 100) × Principal × Period (years)
- Monthly = (Principal + Total Interest) / (Period × 12)

Example:
- RM 70,000 at 3.5% for 5 years → Total Interest RM 12,250.00; Monthly RM 1,370.83

### 2) Home Loan Calculator (EMI — Basic Estimate)
Provides a quick EMI-style estimate for Malaysian home loans.

Inputs:
- Loan Amount (RM)
- Annual Interest Rate (% p.a.)
- Loan Tenure (years)

Displays:
- Monthly Repayment (EMI)
- Total Interest
- Total Repayment

Formula:
- r = annual rate / 12 / 100, n = tenure × 12
- M = P [ r(1+r)^n ] / [ (1+r)^n – 1 ]

Example:
- RM 400,000 at 4.5% for 30 years → Monthly ≈ RM 2,026.74

Disclaimer:
- This is a simplified estimate. Actual Malaysian mortgages use reducing balance with Base Rate (BR) + margin, which can change. This MVP does not model BR fluctuations, monthly re-calculation, DSR checks, or bank-specific rules.

## Project Structure
```
src/
├── model/              # Pure calculation logic (no UI/formatting)
├── presenter/          # SolidJS signals: validation + formatting
├── components/         # View-only components (UI, no business logic)
├── App.tsx             # Tabs (Car vs Home)
└── index.tsx           # App bootstrap
```

## Architecture (MVP)
- Model: math only (no validation/UI). Examples: `CarLoanModel.ts`, `HomeLoanModel.ts`.
- Presenter: validates inputs, calls Model, formats RM values, exposes SolidJS signals.
- View: renders inputs/results and triggers presenter actions (no business logic).

## Development Notes
- Dev server runs on port 3000 (see `vite.config.ts`).
- Hot reload is enabled; save files to see changes instantly.
- Modern CSS lives in `src/index.css` (mobile-first, responsive styles).

## Add Another Calculator (Guideline)
1. Create Model in `src/model/` with pure calculations.
2. Create Presenter in `src/presenter/` using `createSignal()` and formatting.
3. Create View in `src/components/` that wires inputs to the presenter.
4. Add the new component to the tabs in `src/App.tsx`.

## Deployment
Any static host works. Build and deploy the `dist/` folder.

```bash
npm run build
# then upload dist/ to Netlify, Vercel, GitHub Pages, etc.
```

## Troubleshooting
- Port already in use → change `server.port` in `vite.config.ts`.
- Blank page → ensure `index.html` has <div id="root"></div>.
- Type errors → restart the dev server after large refactors.
