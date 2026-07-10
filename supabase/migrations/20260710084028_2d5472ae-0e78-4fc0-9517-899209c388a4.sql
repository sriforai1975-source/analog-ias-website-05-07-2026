ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS long_description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sample_videos jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS lms_url text,
  ADD COLUMN IF NOT EXISTS price text;