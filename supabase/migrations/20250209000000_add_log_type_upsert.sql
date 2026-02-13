-- Add log_type to support one entry per day per log type (sleep, social, movement)
-- Allows upsert: same user can have at most one sleep, one social, one movement per day

ALTER TABLE public.check_ins ADD COLUMN IF NOT EXISTS log_type TEXT;

-- Backfill existing rows: infer from notes
UPDATE public.check_ins
SET log_type = CASE
  WHEN notes LIKE '%Interactions:%' THEN 'social'
  WHEN notes LIKE '%Movement:%' THEN 'movement'
  ELSE 'sleep'
END
WHERE log_type IS NULL;

-- Set default for any remaining nulls
UPDATE public.check_ins SET log_type = 'sleep' WHERE log_type IS NULL;

-- Remove duplicates: keep most recent per (user_id, check_in_date, log_type)
DELETE FROM public.check_ins a
USING public.check_ins b
WHERE a.user_id = b.user_id
  AND a.check_in_date = b.check_in_date
  AND a.log_type = b.log_type
  AND a.created_at < b.created_at;

-- Now enforce NOT NULL and add constraint
ALTER TABLE public.check_ins ALTER COLUMN log_type SET NOT NULL;
ALTER TABLE public.check_ins ALTER COLUMN log_type SET DEFAULT 'sleep';

-- Add check constraint for valid log types
ALTER TABLE public.check_ins
ADD CONSTRAINT check_ins_log_type_check
CHECK (log_type IN ('sleep', 'social', 'movement'));

-- Unique constraint: one entry per user per date per log type (for upsert)
ALTER TABLE public.check_ins
ADD CONSTRAINT check_ins_user_date_type_unique UNIQUE (user_id, check_in_date, log_type);
