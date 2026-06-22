-- Create Profiles table
CREATE TABLE public.profiles (
    id text PRIMARY KEY, -- Clerk User ID (e.g. user_2P...)
    first_name text,
    last_name text,
    email text UNIQUE NOT NULL,
    image_url text,
    tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'admin')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow authenticated users to read all profiles" 
    ON public.profiles FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow users to update their own profile" 
    ON public.profiles FOR UPDATE 
    TO authenticated 
    USING ((auth.jwt() ->> 'sub') = id)
    WITH CHECK ((auth.jwt() ->> 'sub') = id);

CREATE POLICY "Allow system webhook to insert/manage profiles"
    ON public.profiles FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);


-- Create Prompts table
CREATE TABLE public.prompts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    model text NOT NULL,
    category text NOT NULL,
    body text NOT NULL,
    likes_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Prompts
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Prompts Policies
CREATE POLICY "Allow authenticated users to read all prompts" 
    ON public.prompts FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow users to insert their own prompts" 
    ON public.prompts FOR INSERT 
    TO authenticated 
    WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Allow users to update their own prompts" 
    ON public.prompts FOR UPDATE 
    TO authenticated 
    USING ((auth.jwt() ->> 'sub') = user_id)
    WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Allow users to delete their own prompts" 
    ON public.prompts FOR DELETE 
    TO authenticated 
    USING ((auth.jwt() ->> 'sub') = user_id);


-- Create Saved Prompts (bookmarks) join table
CREATE TABLE public.saved_prompts (
    user_id text REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    prompt_id uuid REFERENCES public.prompts(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, prompt_id)
);

-- Enable RLS for Saved Prompts
ALTER TABLE public.saved_prompts ENABLE ROW LEVEL SECURITY;

-- Saved Prompts Policies
CREATE POLICY "Allow users to view their own saved prompts" 
    ON public.saved_prompts FOR SELECT 
    TO authenticated 
    USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Allow users to save a prompt for themselves" 
    ON public.saved_prompts FOR INSERT 
    TO authenticated 
    WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Allow users to remove their own saved prompts" 
    ON public.saved_prompts FOR DELETE 
    TO authenticated 
    USING ((auth.jwt() ->> 'sub') = user_id);


-- Functions for automagic updating of timestamps
CREATE OR REPLACE FUNCTION public.handle_update_timestamp()
RETURNS trigger AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  return new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for automatic updated_at updates
CREATE TRIGGER set_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();
CREATE TRIGGER set_prompts_timestamp BEFORE UPDATE ON public.prompts FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();
