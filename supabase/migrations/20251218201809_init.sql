-- Create the 'users' table
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    baseline_sleep_hours INTEGER,
    baseline_social_frequency INTEGER,
    baseline_energy INTEGER,
    check_in_reminder_time TIME,
    alert_threshold_sleep_days INTEGER DEFAULT 3,
    alert_threshold_social_days INTEGER DEFAULT 5
);

-- Enable Row Level Security (RLS) for the 'users' table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy for 'users' table: Users can view their own user row
CREATE POLICY "Users can view their own user row"
ON public.users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Policy for 'users' table: Users can insert their own user row
CREATE POLICY "Users can insert their own user row"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Policy for 'users' table: Users can update their own user row
CREATE POLICY "Users can update their own user row"
ON public.users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- inserts a row into public.users when a new auth user is created
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger the function every time a user is created in auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create the 'check_ins' table
-- Define ENUM types for sleep_quality and social_interaction
CREATE TYPE public.sleep_quality_enum AS ENUM ('well_rested', 'okay', 'restless', 'poorly', 'did_not_sleep');
CREATE TYPE public.social_interaction_enum AS ENUM ('meaningful_connection', 'brief_interaction', 'no_interaction', 'avoided_people');

CREATE TABLE public.check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    sleep_quality public.sleep_quality_enum NOT NULL,
    social_interaction public.social_interaction_enum NOT NULL,
    energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the 'check_ins' table
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- Policy for 'check_ins' table: Users can view their own check-ins
CREATE POLICY "Users can view their own check_ins"
ON public.check_ins
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy for 'check_ins' table: Users can insert their own check-ins
CREATE POLICY "Users can insert their own check_ins"
ON public.check_ins
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy for 'check_ins' table: Users can update their own check-ins
CREATE POLICY "Users can update their own check_ins"
ON public.check_ins
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create the 'trusted_contacts' table
-- Define ENUM type for notification_method
CREATE TYPE public.notification_method_enum AS ENUM ('email', 'sms', 'both');

CREATE TABLE public.trusted_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    relationship TEXT,
    can_see_details BOOLEAN DEFAULT FALSE,
    notification_method public.notification_method_enum DEFAULT 'email',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the 'trusted_contacts' table
ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;

-- Policy for 'trusted_contacts' table: Users can view their own trusted contacts
CREATE POLICY "Users can view their own trusted_contacts"
ON public.trusted_contacts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy for 'trusted_contacts' table: Users can insert their own trusted contacts
CREATE POLICY "Users can insert their own trusted_contacts"
ON public.trusted_contacts
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy for 'trusted_contacts' table: Users can update their own trusted contacts
ON public.trusted_contacts
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy for 'trusted_contacts' table: Users can delete their own trusted contacts
CREATE POLICY "Users can delete their own trusted_contacts"
ON public.trusted_contacts
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Create the 'alerts_sent' table
CREATE TABLE public.alerts_sent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES public.trusted_contacts(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL, -- e.g., 'sleep_disrupted', 'social_reduced'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_initiated BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security (RLS) for the 'alerts_sent' table
ALTER TABLE public.alerts_sent ENABLE ROW LEVEL SECURITY;

-- Policy for 'alerts_sent' table: Users can view their own alerts sent
CREATE POLICY "Users can view their own alerts_sent"
ON public.alerts_sent
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy for 'alerts_sent' table: Users can insert their own alerts sent
CREATE POLICY "Users can insert their own alerts_sent"
ON public.alerts_sent
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());