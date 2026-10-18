# App Pages and Routes Documentation

This document provides a comprehensive overview of all pages, application components, and routing structures within the project. It serves as a reference for navigation and architectural understanding.

## 1. Page Components (`src/pages/`)

The `src/pages/` directory contains top-level page components that map to specific routes or represent full-screen views.

| File Path | Component Name | Purpose / Description |
| :--- | :--- | :--- |
| `src/pages/AdminCredentialManager.jsx` | `AdminCredentialManager` | Manages credentials and API keys for admin integrations. |
| `src/pages/AuditLogsPage.jsx` | `AuditLogsPage` | Displays system-wide audit logs and administrative actions. |
| `src/pages/DashboardHome.jsx` | `DashboardHome` | A home or landing view for a generic dashboard interface. |
| `src/pages/DebugAuthPage.jsx` | `DebugAuthPage` | A utility page to debug authentication states and token issues. |
| `src/pages/HomePage.jsx` | `HomePage` | The main landing page showcasing the portfolio and tools. |
| `src/pages/InitSuperadminPage.jsx` | `InitSuperadminPage` | One-time setup page for initializing the superadmin account. |
| `src/pages/JobAssistantLandingPage.jsx` | `JobAssistantLandingPage` | Marketing/landing page for the AI Job Assistant application. |
| `src/pages/LandingPage.jsx` | `LandingPage` | Alternative generic landing page. |
| `src/pages/LoginPage.jsx` | `LoginPage` | Standard login page (currently largely bypassed by SimplifiedLoginPage). |
| `src/pages/ResetSuperadminPasswordPage.jsx` | `ResetSuperadminPasswordPage` | Utility to reset the superadmin password via edge functions. |
| `src/pages/RolesPermissionsPage.jsx` | `RolesPermissionsPage` | Interface to configure RBAC (Role-Based Access Control). |
| `src/pages/SettingsPage.jsx` | `SettingsPage` | Global user or system settings. |
| `src/pages/SetupAuthPage.jsx` | `SetupAuthPage` | Configuration for setting up external auth providers. |
| `src/pages/SignInPage.jsx` | `SignInPage` | General user sign-in page. |
| `src/pages/SignUpPage.jsx` | `SignUpPage` | Sign-up page (currently disabled, redirects to login). |
| `src/pages/SimplifiedLoginPage.jsx` | `SimplifiedLoginPage` | The **primary** active superadmin login page with dark green theme. |
| `src/pages/SuperAdminBypassLogin.jsx` | `SuperAdminBypassLogin` | Dev tool to bypass login for local testing. |
| `src/pages/SuperAdminSetup.jsx` | `SuperAdminSetup` | Setup instructions or process for the superadmin. |
| `src/pages/SuperadminDashboard.jsx` | `SuperadminDashboard` | The **primary** protected dashboard interface for superadmin. |
| `src/pages/SuperadminDebugPage.jsx` | `SuperadminDebugPage` | Debug dashboard for system logs and DB states. |
| `src/pages/TestSuperadminAuth.jsx` | `TestSuperadminAuth` | Testing tool for superadmin authentication edge cases. |
| `src/pages/UsersManagementPage.jsx` | `UsersManagementPage` | Dashboard view for managing platform users. |

---

## 2. App Components (`src/components/apps/`)

The `src/components/apps/` directory houses complex, specialized mini-applications and domain-specific modules.

### Top-Level App Modules
- **`AIProgramManager.jsx`**: Manages and coordinates AI scripts/programs.
- **`ATSCVOptimizer.jsx`**: Main UI for the ATS Resume Optimizer application.
- **`CRMDashboard.jsx`**: Customer Relationship Management interface.
- **`CricketAnalytics.jsx`**: Data visualization for cricket stats.
- **`EComAppWrapper.jsx` / `EComRevenuRecovery.jsx`**: E-commerce cart abandonment and recovery tools.
- **`ERPDashboard.jsx`**: Enterprise Resource Planning interface.
- **`HealthMonitor.jsx`**: Application or system health monitoring tool.
- **`JobApplicationAssistant.jsx`**: Job assistant wrapper.
- **`JobOpenings.jsx` / `TechJobFinderDashboard.jsx`**: Tools for scraping and finding jobs.
- **`MobileHub.jsx`**: Mobile device specific views.
- **`ProgramHealthDashboard.jsx`**: System metrics visualization.
- **`SEOApp.jsx`**: Comprehensive SEO and Social Media marketing tool.
- **`StockAnalyzer.jsx` / `WeatherForecaster.jsx`**: Data analysis apps.

### Key Sub-Directories
- **`ats/`**: Contains CV upload and score breakdown components.
- **`custom-trading/`**: Full crypto/commodity/stock trading interface (`TradingDashboard`, `PortfolioPage`, `MarketExecution`).
- **`ecom/`**: E-commerce modules including abandoned cart recovery, AI generated messaging, and credential management.
- **`job-assistant/`**: AI fitment analysis, ATS scoring, and auto-apply components.
- **`jobs/`**: Job listings, filter panels, and detailed application modals.
- **`seo/`**: Social media scheduling, AI copy generation (Twitter, LinkedIn, Snapchat), and engagement tracking.
- **`stock-dashboard/`**: Market sentiment, technical indicators, SENSEX charting, and AI stock advising.
- **`trading/`**: Trading alerts, history, and real-time market data components.

---

## 3. Current Routes (Defined in `src/App.jsx`)

The routing is centralized in `src/App.jsx` utilizing `react-router-dom`. 

| Route Path | Component | Description | Protected? |
| :--- | :--- | :--- | :--- |
| `/` | `<Navigate to="/dashboard" />` | Root path automatically redirects to the dashboard. | N/A |
| `/login` | `<SimplifiedLoginPage />` | The primary, superadmin-only, email/password login screen. | No (Public) |
| `/signup` | `<Navigate to="/login" />` | Public registrations are disabled; redirects to login. | No (Public) |
| `/test-superadmin-auth` | `<TestSuperadminAuth />` | A debugging interface to test auth functions. | No (Public) |
| `/reset-superadmin-password`| `<ResetSuperadminPasswordPage />` | Tool to trigger a superadmin password reset. | No (Public) |
| `/dashboard` | `<SuperadminDashboard />` | The main administrative portal interface. | **Yes** |
| `*` (Fallback) | `<Navigate to="/dashboard" />` | Catch-all for undefined routes, returning to dashboard. | N/A |

---

## 4. Protected vs Public Routes

### Public Routes
These routes do not require authentication and are accessible to anyone.
- **`/login`**: Main entry point for administrators.
- **`/signup`**: Disabled, acts as a redirect.
- **`/test-superadmin-auth`**: Diagnostic tool.
- **`/reset-superadmin-password`**: Administrative recovery tool.

### Protected Routes
These routes are wrapped in the `<ProtectedRoute>` component. If a user is not authenticated (`isAuthenticated === false`), they are immediately redirected to `/login` with their intended destination saved in the state router.
- **`/dashboard`**: Requires valid superadmin credentials. Includes the sidebar, user metrics, and system status overview.

---

## 5. Summary Mapping Table

| Path | Associated Component | Role / Purpose | Access Level |
| :--- | :--- | :--- | :--- |
| `/` | Redirects to `/dashboard` | Root entry | - |
| `/login` | `SimplifiedLoginPage` | Superadmin authentication point | Public |
| `/signup` | Redirects to `/login` | Disabled feature placeholder | Public |
| `/dashboard` | `SuperadminDashboard` | Admin control panel & metrics | **Protected** |
| `/test-superadmin-auth` | `TestSuperadminAuth` | Edge-function diagnostic wrapper | Public |
| `/reset-superadmin-password`| `ResetSuperadminPasswordPage`| Account recovery | Public |
| `*` | Redirects to `/dashboard` | 404 handler | - |

> *Note: This reference documents the active routing in the current state of `App.jsx`. Many modular applications located in `src/components/apps/` are designed to be rendered within or accessible from the `SuperadminDashboard` or via expanded routing as the system evolves.*