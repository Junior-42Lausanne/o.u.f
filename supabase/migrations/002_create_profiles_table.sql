CREATE TABLE IF NOT EXISTS public.profiles (
	id uuid NOT NULL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
	is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
	email TEXT NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	avatar TEXT,
	join_network BOOLEAN NOT NULL DEFAULT TRUE, -- default true ?
	language_id SMALLINT,
	activity TEXT, -- nom + explicit (genre profesionnal activity...)
	work_link TEXT,
	FOREIGN key (id) REFERENCES auth.users (id) ON UPDATE cascade ON DELETE cascade,
	FOREIGN key (language_id) REFERENCES public.languages (id) ON UPDATE cascade ON DELETE SET NULL
);

ALTER TABLE public.profiles enable ROW level security;

-- For admin checks (used in is_superadmin() function)
CREATE INDEX idx_profiles_super_admin ON public.profiles (is_super_admin)
WHERE
	is_super_admin = TRUE;

-- use the raw_user_meta_data from supabase create user to fill a profiles new entry
CREATE OR REPLACE FUNCTION public.handle_new_user () returns trigger language plpgsql security definer
SET
	search_path = '' AS $$
begin
  insert into public.profiles (id, first_name, last_name, email, activity, work_link, join_network)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.email,
			new.raw_user_meta_data ->> 'activity', new.raw_user_meta_data ->> 'work_link', (new.raw_user_meta_data ->> 'join_network')::boolean);
  return new;
end;
$$;

-- trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
AFTER insert ON auth.users FOR each ROW
EXECUTE procedure public.handle_new_user ();
