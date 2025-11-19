# Database Setup Instructions

If the admin dashboard shows "No user profiles found" but the app is running, it's likely because the `profiles` table doesn't exist in Supabase.

## Quick Fix

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Open `/sql/init-tables.sql` in this repository
6. Copy the entire SQL script
7. Paste it into the Supabase SQL Editor
8. Click **Run**

## What This Creates

- `profiles` table - stores user profile data
- `investments` table - stores user investments
- `transactions` table - stores deposit/withdrawal transactions
- Row Level Security (RLS) policies for data access control
- Indexes for query performance

## Schema

### profiles
```sql
- id (BIGSERIAL PRIMARY KEY)
- user_id (UUID, UNIQUE, FOREIGN KEY to auth.users)
- email (TEXT)
- fullname (TEXT)
- nickname (TEXT)
- phone (TEXT)
- country (TEXT)
- balance (TEXT, default '0')
- is_approved (BOOLEAN, default FALSE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### investments
```sql
- id (BIGSERIAL PRIMARY KEY)
- user_id (UUID, FOREIGN KEY to auth.users)
- name (TEXT)
- amount (NUMERIC)
- status (TEXT, default 'active')
- created_at (TIMESTAMP)
```

### transactions
```sql
- id (BIGSERIAL PRIMARY KEY)
- user_id (UUID, FOREIGN KEY to auth.users)
- type (TEXT)
- amount (NUMERIC)
- status (TEXT, default 'pending')
- created_at (TIMESTAMP)
```

## Troubleshooting

If you see "Error: relation 'public.profiles' does not exist", the table setup didn't complete. Try running the SQL script again.

If you see RLS policy errors, the policies may need adjustment based on your admin authentication method. The current setup allows service role full access.
