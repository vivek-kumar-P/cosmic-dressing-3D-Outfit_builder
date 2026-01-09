-- Create table for storing 3D models
-- Run this script in your Supabase SQL Editor to set up the database

CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  is_permanent BOOLEAN DEFAULT false,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_models_created_at ON public.models(created_at DESC);

-- Added index for category filtering
CREATE INDEX IF NOT EXISTS idx_models_category ON public.models(category);

-- Added index for is_permanent filtering
CREATE INDEX IF NOT EXISTS idx_models_is_permanent ON public.models(is_permanent);

-- Enable Row Level Security
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated and anonymous users
CREATE POLICY IF NOT EXISTS "Allow all operations on models" 
ON public.models
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Grant permissions to anon and authenticated roles
GRANT ALL ON public.models TO anon;
GRANT ALL ON public.models TO authenticated;

-- Add comment to explain the is_permanent column
COMMENT ON COLUMN public.models.is_permanent IS 'Marks models that cannot be deleted or renamed (e.g., default models)';

-- Added comment for category column
COMMENT ON COLUMN public.models.category IS 'Category of the model: character, shirt, shoes, pants, tshirt, accessories';

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Success message
SELECT 'Database setup complete! The models table is ready to use.' AS message;
