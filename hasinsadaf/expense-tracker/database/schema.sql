-- =============================================
-- EXPENSE TRACKER — DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Profiles
create table profiles (
  id uuid references auth.users primary key,
  name text,
  email text unique,
  monthly_income numeric default 0,
  created_at timestamp default now()
);

-- Categories
create table categories (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  color text default '#6366f1'
);

-- Budgets
create table budgets (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  category_id int references categories(id) on delete cascade,
  monthly_limit numeric not null,
  month text,
  is_default boolean default true,
  constraint budgets_user_category_month_unique
    unique (user_id, category_id, month)
);

-- Expenses
create table expenses (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  category_id int references categories(id) on delete set null,
  amount numeric not null,
  description text,
  date date not null,
  created_at timestamp default now(),
  constraint unique_expense
    unique (user_id, amount, description, date, category_id)
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table profiles enable row level security;
alter table expenses enable row level security;
alter table categories enable row level security;
alter table budgets enable row level security;

-- Profiles policies
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);
create policy "service_role_all_profiles" on profiles
  for all using (auth.role() = 'service_role');

-- Expenses policies
create policy "expenses_select_own" on expenses
  for select using (auth.uid() = user_id);
create policy "expenses_insert_own" on expenses
  for insert with check (auth.uid() = user_id);
create policy "expenses_update_own" on expenses
  for update using (auth.uid() = user_id);
create policy "expenses_delete_own" on expenses
  for delete using (auth.uid() = user_id);
create policy "service_role_all_expenses" on expenses
  for all using (auth.role() = 'service_role');

-- Categories policies
create policy "categories_select_own" on categories
  for select using (auth.uid() = user_id);
create policy "categories_insert_own" on categories
  for insert with check (auth.uid() = user_id);
create policy "categories_update_own" on categories
  for update using (auth.uid() = user_id);
create policy "categories_delete_own" on categories
  for delete using (auth.uid() = user_id);
create policy "service_role_all_categories" on categories
  for all using (auth.role() = 'service_role');

-- Budgets policies
create policy "budgets_select_own" on budgets
  for select using (auth.uid() = user_id);
create policy "budgets_insert_own" on budgets
  for insert with check (auth.uid() = user_id);
create policy "budgets_update_own" on budgets
  for update using (auth.uid() = user_id);
create policy "budgets_delete_own" on budgets
  for delete using (auth.uid() = user_id);
create policy "service_role_all_budgets" on budgets
  for all using (auth.role() = 'service_role');