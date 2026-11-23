-- Supabase SQL Editor에서 한 번 실행하세요.
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('world','character','canon','extra')),
  type text not null default '',
  title text not null,
  body text not null default '',
  image_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
-- 브라우저는 DB에 직접 접근하지 않습니다. Vercel API가 service role key로만 접근합니다.
-- Storage에서 'enfpath-media'라는 Public bucket을 생성하세요.
