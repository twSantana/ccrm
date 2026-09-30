alter table public.influencers
add column if not exists tags bigint[] not null default '{}'::bigint[];
