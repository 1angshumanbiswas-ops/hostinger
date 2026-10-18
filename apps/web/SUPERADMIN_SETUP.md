# Superadmin Configuration Guide

This project includes a built-in superadmin configuration to bypass standard authentication and subscription/paywall barriers.

## 1. Configured Superadmin Email
The designated superadmin email is:
**`1angshuman.biswas@gmail.com`**

## 2. Auto-Login functionality
When the superadmin email is entered into any standard authentication dialog (like the one in `AuthDialog.jsx`), the system will:
- Detect the email match automatically.
- Instantly bypass the password requirement.
- Authenticate the user by injecting a secure mock session locally (`superadmin_bypass` in localStorage).
- Automatically log the user into the system without requiring real Supabase Auth validation.

## 3. Global App Access
The superadmin status grants immediate and complete access to all protected applications:
- **ERP Dashboard:** Bypasses role-based constraints.
- **Student Education Platform:** Grants access to all materials.
- **Custom Trading Engine:** Bypasses the local trading auth requirements.

## 4. Payment and Subscription Bypass
Using the `isSuperAdminUser` helper or the `<SuperadminAccessBypass />` component, developers can wrap premium features. The superadmin account automatically resolves these checks to `true`, granting full access to paid tiers or hidden SaaS features.

## 5. How to Test Superadmin Access
1. Open the application.
2. Navigate to any component that triggers the login modal.
3. In the email field, paste: `1angshuman.biswas@gmail.com`
4. The UI will instantly indicate "Superadmin Mode Detected" and auto-login within 500ms.
5. Verify you have access to protected routes without a password.

## 6. How to Add Additional Superadmins
To add more superadmin emails in the future:
1. Open `src/utils/superAdminHelper.js`.
2. Update the `isSuperAdminUser` function to accept an array of emails instead of a single string, e.g.: