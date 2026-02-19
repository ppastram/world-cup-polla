-- Migration 011: Admin prediction progress RPC
-- Exposes a helper to compute per-user match prediction completion percentage
-- for use in the admin UI.

create or replace function admin_match_prediction_progress()
returns table (
  user_id uuid,
  completed_matches int,
  total_matches int,
  progress numeric
)
language sql
security definer
set search_path = public
as $$
with total as (
  select count(*)::numeric as total
  from matches
)
select
  p.id as user_id,
  count(mp.*) as completed_matches,
  total.total as total_matches,
  case
    when total.total = 0 then 0
    else (count(mp.*)::numeric / total.total) * 100
  end as progress
from profiles p
cross join total
left join match_predictions mp
  on mp.user_id = p.id
group by p.id, total.total;
$$;

