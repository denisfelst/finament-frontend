# Finament Frontend

A personal finance management web application built with Angular 19.

## Technology Stack

- **Framework:** Angular 19.2.0 (standalone components)
- **Styling:** SCSS + Tailwind CSS 4
- **State Management:** Angular Signals
- **API Generation:** OpenAPI/Swagger code generation
- **Build Tool:** Vite

## Project Structure

```
src/app/
├── core/                   # Core infrastructure
│   ├── auth/               # Guards & interceptors
│   ├── layout/             # App container & bottom nav
│   └── swagger/            # Generated API services
├── features/               # Feature pages
│   ├── login/              # Authentication
│   ├── dashboard/          # Dashboard (beta)
│   ├── add-expense/        # Create expense
│   ├── expenses/           # Manage expenses
│   ├── categories/         # Manage categories
│   ├── profile/            # User profile
│   └── settings/           # App settings
└── shared/                 # Reusable components
    ├── store/              # Signal-based stores
    ├── elements/           # UI elements (button)
    ├── modal/              # Modal components
    ├── toast/              # Toast notifications
    └── pipes/              # Custom pipes
```

## Features

### Authentication
- JWT token-based authentication
- Route guards protect authenticated routes
- HTTP interceptor adds Bearer token to requests
- Token stored in localStorage

### Expense Management
- Create, edit, delete expenses
- Link expenses to categories
- Optional tags support
- Sorted by date (newest first)

### Category Management
- CRUD operations with color coding
- Monthly spending limits
- Expense count tracking per category
- Over-limit warning (red text)

### User Profile
- View and edit user info
- Logout functionality

### Settings
- Multi-currency support (EUR, GBP, USD, etc.)
- Currency formatting via custom pipe

## State Management

Uses Angular Signals in dedicated store services:

```typescript
@Injectable({ providedIn: 'root' })
export class FeatureStore {
  items = signal<T[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  message = signal<string | null>(null);
}
```

**Stores:** AuthStore, ExpenseStore, CategoryStore, UserStore, SettingStore

## Routing

```
/login              → Public login page
/                   → Protected routes (authGuard)
  ├── /add-expense  → Default route
  ├── /expenses     → Expense list
  ├── /categories   → Category list
  ├── /dashboard    → Dashboard (beta)
  ├── /settings     → Settings
  └── /profile      → User profile
```

## API Integration

- Services auto-generated from OpenAPI spec
- Located in `src/app/core/swagger/services/`
- AuthService, ExpenseService, CategoryService, UserService, SettingService

## Shared Components

| Component | Description |
|-----------|-------------|
| `app-button` | Configurable button (Primary/Secondary/Tertiary) |
| `app-full-modal` | Full-screen modal |
| `app-confirmation-modal` | Delete confirmation dialog |
| `app-toast-state-group` | Toast notifications (message/error/loading) |
| `appCurrency` pipe | Currency formatting based on user settings |

## Environment Configuration

- **Development:** `https://localhost:7001`
- **Production:** Azure-hosted backend

## Development

```bash
# Install dependencies
npm install

# Start dev server
ng serve

# Build for production
ng build
```

## Data Models

```typescript
interface IExpense {
  id: number;
  categoryId: number;
  amount: number;
  date: string;
  tag: string | null;
}

interface ICategory {
  id: number;
  name: string;
  monthlyLimit: number;
  color: string;
  expenseCount: number;
  totalSpent: number;
}

interface ISetting {
  currency: string;
}
```
