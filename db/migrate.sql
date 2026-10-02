-- Better Auth core tables (default Postgres schema, camelCase columns)

create table if not exists "user" (
  "id" text not null primary key,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" boolean not null default false,
  "image" text,
  "createdAt" timestamp not null default now(),
  "updatedAt" timestamp not null default now()
);

create table if not exists "session" (
  "id" text not null primary key,
  "expiresAt" timestamp not null,
  "token" text not null unique,
  "createdAt" timestamp not null default now(),
  "updatedAt" timestamp not null default now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references "user" ("id") on delete cascade
);

create table if not exists "account" (
  "id" text not null primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references "user" ("id") on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp,
  "refreshTokenExpiresAt" timestamp,
  "scope" text,
  "password" text,
  "createdAt" timestamp not null default now(),
  "updatedAt" timestamp not null default now()
);

create table if not exists "verification" (
  "id" text not null primary key,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" timestamp not null,
  "createdAt" timestamp default now(),
  "updatedAt" timestamp default now()
);

-- App tables

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  paddle_transaction_id text not null unique,
  product_id text not null,
  product_name text,
  amount_cents integer,
  currency text,
  status text not null default 'completed',
  customer_email text,
  user_id text references "user" ("id") on delete cascade,
  created_at timestamptz not null default now()
);

-- License keys are user-scoped CLI credentials, independent from purchases
create table if not exists licenses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  license_key text not null unique,
  user_id text not null references "user" ("id") on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  purchase_id uuid not null references purchases (id) on delete cascade,
  owner_user_id text references "user" ("id") on delete cascade,
  owner_email text,
  created_at timestamptz not null default now()
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams (id) on delete cascade,
  email text not null,
  user_id text references "user" ("id") on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique (team_id, email)
);

create index if not exists idx_purchases_email on purchases (customer_email);
create index if not exists idx_purchases_user on purchases (user_id);
create index if not exists idx_team_members_email on team_members (email);

-- A user can belong to only one team at a time. Cross-team duplicates from
-- before this rule are removed first (the earliest membership wins).
delete from team_members tm
using team_members other
where tm.email = other.email
  and tm.id <> other.id
  and (other.created_at < tm.created_at
    or (other.created_at = tm.created_at and other.id < tm.id));
create unique index if not exists idx_team_members_unique_email on team_members (email);

create table if not exists github_access (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references purchases (id) on delete cascade,
  user_id text references "user" ("id") on delete cascade,
  github_username text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (purchase_id, user_id)
);
