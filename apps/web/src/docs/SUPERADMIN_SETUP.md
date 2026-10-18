# Superadmin Manual Setup Guide

If the automated Edge Functions approach fails or is unavailable, you can manually create the superadmin user using the Supabase Dashboard and SQL Editor.

## 1. Create User via SQL with Bcrypt Hash

You can directly insert the user into the `auth.users` table and generate a valid bcrypt password hash using the `pgcrypto` extension that is built into Supabase.

1. Go to the **SQL Editor** in your Supabase Dashboard.
2. Click **New Query**.
3. Paste and run the following SQL command: