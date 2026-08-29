alter table public.review_events
add column review_stage integer,
add column next_review_at timestamptz;

update public.review_events
set
  review_stage = 0,
  next_review_at = reviewed_at;

alter table public.review_events
alter column review_stage set not null,
alter column next_review_at set not null,
add constraint review_events_stage_range
  check (review_stage between 0 and 6),
add constraint review_events_next_review_not_before_review
  check (next_review_at >= reviewed_at);

drop index public.review_events_card_reviewed_idx;

create index review_events_card_reviewed_idx
on public.review_events (card_id, reviewed_at desc, id desc);
