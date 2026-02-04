# Database Migrations

## Creating New Migrations

1. Create migration file in `supabase/migrations/` (use `supabase migration new <migration-name>` to create a new migration)
2. Apply to remote and regenerate types:

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
pnpm generate-db-types
```

## Important

**Always run these commands yourself after creating or modifying migrations.** Do not ask the user to run them.

## Schema

### `users` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (matches auth.users.id) |
| email | TEXT | User's email |
| stripe_customer_id | TEXT | Stripe customer ID (nullable) |
| is_premium | BOOLEAN | Premium status flag |
| created_at | TIMESTAMPTZ | Record creation time |
| deleted_at | TIMESTAMPTZ | Soft delete timestamp (nullable) |

- **RLS Policies**: Users can only view and update their own row
- **Trigger**: `on_auth_user_created` automatically creates a user row when a new auth user signs up