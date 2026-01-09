-- Add is_permanent column to models table
-- This column marks models that should not be deleted (like the default just_body model)

ALTER TABLE public.models 
ADD COLUMN IF NOT EXISTS is_permanent BOOLEAN DEFAULT false;

-- Update to set just_body as permanent instead of man_with_shirt
UPDATE public.models 
SET is_permanent = true 
WHERE name = 'just_body';

-- Add comment to explain the column
COMMENT ON COLUMN public.models.is_permanent IS 'Marks models that cannot be deleted or renamed (e.g., default models)';
