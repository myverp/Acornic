create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create type public.language_preference_kind as enum ('known', 'learning');
create type public.review_rating as enum ('again', 'hard', 'good', 'easy');

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) between 1 and 80),
  interface_language_code text not null default 'en'
    check (interface_language_code ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_languages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  language_code text not null
    check (language_code ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
  preference public.language_preference_kind not null,
  created_at timestamptz not null default now(),
  constraint user_languages_user_language_unique unique (user_id, language_code)
);

create table public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  source_language_code text not null
    check (source_language_code ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
  target_language_code text not null
    check (target_language_code ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint decks_distinct_languages check (source_language_code <> target_language_code)
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks (id) on delete cascade,
  source_text text not null check (char_length(trim(source_text)) between 1 and 500),
  translation text not null check (char_length(trim(translation)) between 1 and 500),
  example_sentence text check (
    example_sentence is null or char_length(example_sentence) <= 1000
  ),
  notes text check (notes is null or char_length(notes) <= 2000),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.review_events (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  rating public.review_rating not null,
  reviewed_at timestamptz not null default now()
);

create index user_languages_user_id_idx on public.user_languages (user_id);
create index decks_user_updated_idx on public.decks (user_id, updated_at desc);
create index cards_deck_position_idx on public.cards (deck_id, position, created_at);
create index review_events_user_reviewed_idx
  on public.review_events (user_id, reviewed_at desc);
create index review_events_card_reviewed_idx
  on public.review_events (card_id, reviewed_at desc);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger decks_set_updated_at
before update on public.decks
for each row execute function private.set_updated_at();

create trigger cards_set_updated_at
before update on public.cards
for each row execute function private.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_languages enable row level security;
alter table public.decks enable row level security;
alter table public.cards enable row level security;
alter table public.review_events enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "profiles_delete_own"
on public.profiles for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "user_languages_select_own"
on public.user_languages for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "user_languages_insert_own"
on public.user_languages for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "user_languages_update_own"
on public.user_languages for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "user_languages_delete_own"
on public.user_languages for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "decks_select_own"
on public.decks for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "decks_insert_own"
on public.decks for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "decks_update_own"
on public.decks for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "decks_delete_own"
on public.decks for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "cards_select_through_owned_deck"
on public.cards for select
to authenticated
using (
  exists (
    select 1
    from public.decks
    where decks.id = cards.deck_id
      and decks.user_id = (select auth.uid())
  )
);

create policy "cards_insert_through_owned_deck"
on public.cards for insert
to authenticated
with check (
  exists (
    select 1
    from public.decks
    where decks.id = cards.deck_id
      and decks.user_id = (select auth.uid())
  )
);

create policy "cards_update_through_owned_deck"
on public.cards for update
to authenticated
using (
  exists (
    select 1
    from public.decks
    where decks.id = cards.deck_id
      and decks.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.decks
    where decks.id = cards.deck_id
      and decks.user_id = (select auth.uid())
  )
);

create policy "cards_delete_through_owned_deck"
on public.cards for delete
to authenticated
using (
  exists (
    select 1
    from public.decks
    where decks.id = cards.deck_id
      and decks.user_id = (select auth.uid())
  )
);

create policy "review_events_select_own"
on public.review_events for select
to authenticated
using (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.cards
    join public.decks on decks.id = cards.deck_id
    where cards.id = review_events.card_id
      and decks.user_id = (select auth.uid())
  )
);

create policy "review_events_insert_own"
on public.review_events for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.cards
    join public.decks on decks.id = cards.deck_id
    where cards.id = review_events.card_id
      and decks.user_id = (select auth.uid())
  )
);

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.user_languages from anon, authenticated;
revoke all on table public.decks from anon, authenticated;
revoke all on table public.cards from anon, authenticated;
revoke all on table public.review_events from anon, authenticated;

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.user_languages to authenticated;
grant select, insert, update, delete on table public.decks to authenticated;
grant select, insert, update, delete on table public.cards to authenticated;
grant select, insert on table public.review_events to authenticated;
grant usage on type public.language_preference_kind to authenticated;
grant usage on type public.review_rating to authenticated;
