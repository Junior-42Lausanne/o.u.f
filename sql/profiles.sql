CREATE TABLE IF NOT EXISTS public.profiles (
	id UUID NOT NULL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	is_admin BOOLEAN NOT NULL DEFAULT FALSE,
	first_name text not null,
	avatar text null,
	last_name text not null,
	activity text null,
	work_link text,
	join_network boolean not null default true,
	email text not null,
	FOREIGN KEY (id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = (select auth.uid())
        AND profiles.is_admin = TRUE
    );
END;
$$;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT (read)
CREATE POLICY "Select profiles for superadmin and owner" ON public.profiles
FOR SELECT
USING (
    is_superadmin() OR (select auth.uid()) = id
); -- TODO: Add a conditions so users in the same projects can see each other

-- Policy for INSERT
CREATE POLICY "Insert for superadmin and owner" ON public.profiles
FOR INSERT
WITH CHECK (
    is_superadmin() OR (select auth.uid()) = id
);

-- Policy for UPDATE
CREATE POLICY "Update for superadmin and owner" ON public.profiles
FOR UPDATE
USING (
    is_superadmin() OR (select auth.uid()) = id
)
WITH CHECK (
    is_superadmin() OR (select auth.uid()) = id
);

-- Policy for DELETE
CREATE POLICY "Delete for superadmin and owner" ON public.profiles
FOR DELETE
USING (
    is_superadmin() OR (select auth.uid()) = id
);

-- Create a trigger function to enforce the rule
CREATE OR REPLACE FUNCTION public.prevent_non_admin_is_admin_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- If the user is not a superadmin and is trying to change is_admin, raise an error
    IF NOT is_superadmin() AND OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
        RAISE EXCEPTION 'Only a superadmin can change the is_admin field.'
            USING ERRCODE = '42501'; -- Insufficient Privilege error code
    END IF;

    -- Otherwise, allow the update
    RETURN NEW;
END;
$$;

-- Attach the trigger to the profiles table
CREATE TRIGGER prevent_non_admin_is_admin_update_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_non_admin_is_admin_update();

CREATE OR REPLACE FUNCTION public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, email, activity, work_link, join_network)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.email,
		new.raw_user_meta_data ->> 'activity', new.raw_user_meta_data ->> 'work_link', (new.raw_user_meta_data ->> 'join_network')::boolean);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();