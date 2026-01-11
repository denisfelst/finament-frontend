# Finament Frontend

Personal finance management application built with Angular 19.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test
```

If `ng *` doens't work, try with `npx ng *`

The app runs at `http://localhost:4200/`.

## Tech Stack

- Angular 19 (standalone components)
- Tailwind CSS 4
- Angular Signals for state management
- OpenAPI-generated API services

## Project Structure

```
src/app/
├── core/           # Auth, layout, API services
├── features/       # Pages (login, expenses, categories, etc.)
└── shared/         # Reusable components, stores, pipes
```

## Features

- Expense tracking with category assignment
- Category management with monthly limits
- Multi-currency support
- JWT authentication

## Documentation

See [docs/main.md](docs/main.md) for detailed documentation.
