# Cinema Management System - Monorepo

A full-stack monorepo project using **Nx** for managing multiple applications and shared libraries.

## 📁 Project Structure

```text
.
├── apps/
│   ├── cinema/           # Next.js 16 - Customer-facing cinema booking app
│   └── dashboard/        # Vite + React - Admin/Staff management dashboard
├── libs/
│   ├── ui/              # Shared UI components (shadcn/ui + Tailwind)
│   └── shared/          # Shared types, services, mock data
├── nx.json              # Nx configuration
├── package.json         # Root dependencies (managed by npm only)
└── tsconfig.base.json   # Base TypeScript config
```

## 🎯 Applications

### Cinema App (`apps/cinema/`)

- **Framework**: Next.js 16 + React 19 + App Router
- **Styling**: Tailwind CSS (uses shared preset)
- **Features**:
  - User registration & login (username + password)
  - User logout
  - User settings (profile & password management)
  - Browse movies
  - Fake booking flow with seat selection
  - Bookings history

**Dev**: `npm run dev:cinema`

### Dashboard App (`apps/dashboard/`)

- **Framework**: Vite + React 19
- **Styling**: Tailwind CSS (uses shared preset)
- **Features** (role-based access):
  - Admin login/logout
  - First-login forced password change
  - User management (list & statistics)
  - Create cinema manager & staff accounts
  - Reset password for subordinates
  - Staff attendance tracking (staff-only write access)
  - All other pages hidden for staff

**Dev**: `npm run dev:dashboard`

## 📦 Shared Libraries

### UI Library (`libs/ui/`)

- Pre-built shadcn/ui components (Button, Input, Card, Dialog, etc.)
- Shared Tailwind preset with design tokens
- Global styles
- Utility functions (`cn`, `clsx`)
- **Exports**: `@cinema/ui`

### Shared Library (`libs/shared/`)

- **Types**: User, Role (SUPER_ADMIN, CINEMA_MANAGER, STAFF, CUSTOMER), Attendance
- **Mock Services**: Auth, User, Attendance (all mock data stored in memory)
- **Mock Database**: Pre-populated users & data
- **Exports**: `@cinema/shared`

## 🔧 Available Scripts

```bash
# Install dependencies (root only)
npm install

# Development servers
npm run dev              # Run all apps
npm run dev:cinema      # Cinema app only
npm run dev:dashboard   # Dashboard only

# Build
npm run build            # Build all apps
npm run build:cinema    # Cinema app only
npm run build:dashboard # Dashboard only

# Nx utilities
npm run nx -- list      # List all projects
npm run nx -- dep-graph # View dependency graph
```

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run development servers**:

   ```bash
   npm run dev
   ```

   This will start:
   - Cinema app: <http://localhost:3000>
   - Dashboard app: <http://localhost:5173>

3. **Test the apps**:
   - **Cinema**: Browse to the home page, register/login, try booking a movie
   - **Dashboard**:
     - Login as admin (demo creds in mock service)
     - Create new accounts
     - View user statistics
     - (Staff can only access attendance page)

## 🔐 Mock Authentication

All authentication is currently mocked in `@cinema/shared`. The system supports 4 roles:

| Role | Access |
| ------ | -------- |
| SUPER_ADMIN | All dashboard features |
| CINEMA_MANAGER | Create staff, reset passwords, view user list |
| STAFF | Attendance tracking only |
| CUSTOMER | Cinema app only |

**Test Credentials** (from mock-db.ts):

- Super Admin: `superadmin` / `Admin@123` (must change on first login)
- Cinema Manager: `manager1` / `manager123` (must change on first login)
- Staff: `staff1` / `staff123`
- Customer: `john_doe` / `password123`

## 📡 Backend Integration (Future)

When Spring Boot backend (v4.0.5) is ready:

1. Replace mock services in `@cinema/shared` with API calls
2. Update environment variables with backend URL
3. Keep service interfaces the same to minimize app changes
4. Implement proper JWT token handling

## 🎨 Design System

- **Color Palette**: Premium cinema theme (deep navy, gold accents, clean whites)
- **Typography**: Inter (sans) + system fonts
- **Components**: shadcn/ui built on Radix UI for accessibility
- **Tailwind Config**: Located in `libs/ui/tailwind-preset.js`

## 📝 Tech Stack

- **Monorepo**: Nx 19
- **Package Manager**: npm (no pnpm/yarn in commits)
- **Frontend**: React 19, Next.js 16, Vite 6
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI based)
- **TypeScript**: 5.7+
- **Routing**: Next.js App Router (cinema), React Router (dashboard)
- **State**: React Context (mock auth)
- **Forms**: React Hook Form (cinema), Controlled inputs (dashboard)

## 🤝 Contributing

- Keep all code in the monorepo
- Use shared libraries from `libs/`
- Follow TypeScript strict mode
- Components must use Tailwind only (no inline CSS)
- All mock data goes in `@cinema/shared/mock`

## 📋 Notes

- Only use npm for dependency management (no pnpm/yarn)
- Use `nx run` CLI for running tasks
- Import shared libs via path aliases: `@cinema/ui`, `@cinema/shared`
- Each app has its own `package.json` for clarity, but npm handles root
