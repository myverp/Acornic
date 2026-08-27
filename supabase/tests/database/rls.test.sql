begin;

create extension if not exists pgtap with schema extensions;

select plan(12);

insert into auth.users (id, email)
values
  ('11111111-1111-4111-8111-111111111111', 'learner-one@example.test'),
  ('22222222-2222-4222-8222-222222222222', 'learner-two@example.test');

insert into public.profiles (user_id, display_name)
values
  ('11111111-1111-4111-8111-111111111111', 'Learner One'),
  ('22222222-2222-4222-8222-222222222222', 'Learner Two');

insert into public.user_languages (user_id, language_code, preference)
values
  ('11111111-1111-4111-8111-111111111111', 'en', 'known'),
  ('22222222-2222-4222-8222-222222222222', 'uk', 'known');

insert into public.decks (id, user_id, title, source_language_code, target_language_code)
values
  (
    '11111111-1111-4111-8111-111111111110',
    '11111111-1111-4111-8111-111111111111',
    'English to Spanish',
    'en',
    'es'
  ),
  (
    '22222222-2222-4222-8222-222222222220',
    '22222222-2222-4222-8222-222222222222',
    'Ukrainian to French',
    'uk',
    'fr'
  );

insert into public.cards (id, deck_id, source_text, translation)
values
  (
    '11111111-1111-4111-8111-111111111100',
    '11111111-1111-4111-8111-111111111110',
    'acorn',
    'bellota'
  ),
  (
    '22222222-2222-4222-8222-222222222200',
    '22222222-2222-4222-8222-222222222220',
    'жолудь',
    'gland'
  );

insert into public.review_events (card_id, user_id, rating)
values
  (
    '11111111-1111-4111-8111-111111111100',
    '11111111-1111-4111-8111-111111111111',
    'good'
  ),
  (
    '22222222-2222-4222-8222-222222222200',
    '22222222-2222-4222-8222-222222222222',
    'easy'
  );

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';

select results_eq(
  'select count(*) from public.profiles',
  array[1::bigint],
  'a user sees only their own profile'
);

select results_eq(
  'select count(*) from public.user_languages',
  array[1::bigint],
  'a user sees only their own language preferences'
);

select results_eq(
  'select count(*) from public.decks',
  array[1::bigint],
  'a user sees only their own decks'
);

select results_eq(
  'select count(*) from public.cards',
  array[1::bigint],
  'a user sees only cards in their own decks'
);

select results_eq(
  'select count(*) from public.review_events',
  array[1::bigint],
  'a user sees only their own review events'
);

select lives_ok(
  $$
    insert into public.decks (
      user_id,
      title,
      source_language_code,
      target_language_code
    ) values (
      '11111111-1111-4111-8111-111111111111',
      'English to French',
      'en',
      'fr'
    )
  $$,
  'a user can create their own deck'
);

select is_empty(
  $$
    update public.decks
    set title = 'Changed by another user'
    where id = '22222222-2222-4222-8222-222222222220'
    returning id
  $$,
  'a user cannot update another user''s deck'
);

select throws_ok(
  $$
    insert into public.decks (
      user_id,
      title,
      source_language_code,
      target_language_code
    ) values (
      '22222222-2222-4222-8222-222222222222',
      'Unauthorized deck',
      'en',
      'de'
    )
  $$,
  '42501',
  null,
  'a user cannot create a deck for another user'
);

select throws_ok(
  $$
    insert into public.cards (deck_id, source_text, translation)
    values (
      '22222222-2222-4222-8222-222222222220',
      'unauthorized',
      'nicht autorisiert'
    )
  $$,
  '42501',
  null,
  'a user cannot add a card to another user''s deck'
);

select throws_ok(
  $$
    insert into public.review_events (card_id, user_id, rating)
    values (
      '22222222-2222-4222-8222-222222222200',
      '11111111-1111-4111-8111-111111111111',
      'again'
    )
  $$,
  '42501',
  null,
  'a user cannot review a card from another user''s deck'
);

set local request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';

select results_eq(
  'select title from public.decks order by title',
  array['Ukrainian to French'::text],
  'switching users exposes only the second user''s deck'
);

set local role anon;

select throws_ok(
  'select count(*) from public.profiles',
  '42501',
  null,
  'anonymous users cannot read profiles'
);

reset role;

select * from finish();
rollback;
