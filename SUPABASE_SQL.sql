-- ============================================================
-- JYOO STUDY TRACKER — COMPLETE SUPABASE SQL SETUP
-- Run ALL of this in Supabase → SQL Editor
-- Safe to re-run — uses IF NOT EXISTS and DROP IF EXISTS
-- ============================================================

-- ─── 1. TABLES ────────────────────────────────────────────────
create table if not exists users (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  email text,
  tasks jsonb default '[]',
  avatar text default '🦊',
  theme text default 'dark',
  total_mins integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  created_at timestamp default now()
);
alter table users add column if not exists avatar text default '🦊';
alter table users add column if not exists theme text default 'dark';

create table if not exists sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  date text not null,
  start_time text,
  end_time text,
  duration integer not null,
  category text,
  created_at timestamp default now()
);

create table if not exists daily_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  date text not null,
  checked jsonb default '{}',
  unique(user_id, date)
);

create table if not exists admin_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  username text,
  email text,
  action text,
  data jsonb,
  created_at timestamp default now()
);

create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  message text not null,
  created_at timestamp default now()
);

-- ─── 2. ENABLE RLS ────────────────────────────────────────────
alter table users enable row level security;
alter table sessions enable row level security;
alter table daily_tasks enable row level security;
alter table admin_logs enable row level security;
alter table notifications enable row level security;

-- ─── 3. DROP ALL OLD POLICIES (clean slate) ──────────────────
drop policy if exists "Users can read own record" on users;
drop policy if exists "Admin read all users" on users;
drop policy if exists "Users can update own record" on users;
drop policy if exists "Users can insert own record" on users;
drop policy if exists "Users can insert own sessions" on sessions;
drop policy if exists "Users can read own sessions" on sessions;
drop policy if exists "Admin read all sessions" on sessions;
drop policy if exists "Users can manage own daily tasks" on daily_tasks;
drop policy if exists "Anyone can read logs" on admin_logs;
drop policy if exists "Anyone can insert logs" on admin_logs;
drop policy if exists "Anyone can read notifications" on notifications;
drop policy if exists "Anyone can insert notifications" on notifications;

-- ─── 4. USERS POLICIES ────────────────────────────────────────
-- Any authenticated user can read any user row (needed for leaderboard + admin)
create policy "users_select_all"
  on users for select using (auth.role() = 'authenticated');

-- Users can insert their own row (signup) OR upsert it (session save)
-- CRITICAL: must allow INSERT for the upsert in handleComplete to work
create policy "users_insert_own"
  on users for insert with check (auth.uid() = id);

-- Users can update their own row
create policy "users_update_own"
  on users for update using (auth.uid() = id) with check (auth.uid() = id);

-- ─── 5. SESSIONS POLICIES ─────────────────────────────────────
-- Any authenticated user can insert their own sessions
create policy "sessions_insert_own"
  on sessions for insert with check (auth.uid() = user_id);

-- Any authenticated user can read all sessions (needed for admin panel + leaderboard)
create policy "sessions_select_all"
  on sessions for select using (auth.role() = 'authenticated');

-- ─── 6. DAILY TASKS POLICIES ──────────────────────────────────
create policy "daily_tasks_own"
  on daily_tasks for all using (auth.uid() = user_id);

-- ─── 7. ADMIN LOGS POLICIES ───────────────────────────────────
create policy "admin_logs_select"
  on admin_logs for select using (auth.role() = 'authenticated');

create policy "admin_logs_insert"
  on admin_logs for insert with check (auth.role() = 'authenticated');

-- ─── 8. NOTIFICATIONS POLICIES ────────────────────────────────
create policy "notifications_select"
  on notifications for select using (true);

create policy "notifications_insert"
  on notifications for insert with check (auth.role() = 'authenticated');

-- ─── 9. REALTIME ──────────────────────────────────────────────
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table sessions;

-- ─── 10. FIX ADMIN ACCOUNT — run this if your admin account's  ─
--         users row is missing (likely cause of the session bug) ─
-- Replace the values below with your actual admin user UUID.
-- Find your UUID in Supabase → Authentication → Users → copy the UUID
--
-- INSERT INTO users (id, username, email, tasks, avatar, theme, total_mins, current_streak, longest_streak)
-- VALUES (
--   'YOUR-UUID-HERE',
--   'Jyoo',
--   'jyothsnarbi@gmail.com',
--   '[]',
--   '🦊',
--   'dark',
--   0, 0, 0
-- )
-- ON CONFLICT (id) DO NOTHING;

-- ─── DONE! ────────────────────────────────────────────────────
