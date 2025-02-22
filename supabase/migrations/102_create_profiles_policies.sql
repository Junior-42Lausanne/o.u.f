CREATE POLICY "Allow reading profiles" ON public.profiles FOR
SELECT
	USING (
		public.is_superadmin ()
		OR (
			SELECT
				auth.uid () = id
		)
		OR EXISTS ( -- Current user is project member in the same project
			SELECT
				1
			FROM
				public.projects p
				LEFT JOIN public.project_users pu_current ON p.id = pu_current.project_id
				LEFT JOIN public.project_users pu_target ON p.id = pu_target.project_id
			WHERE
				pu_current.user_id = (
					SELECT
						auth.uid ()
				)
				AND pu_target.user_id = profiles.id
		)
	);

CREATE POLICY "Allow creating profiles" ON public.profiles FOR INSERT
WITH
	CHECK (
		public.is_superadmin ()
		OR (
			SELECT
				auth.uid ()
		) = id
	);

CREATE POLICY "Allow updating profiles" ON public.profiles FOR
UPDATE USING (
	public.is_superadmin ()
	OR (
		SELECT
			auth.uid ()
	) = id
)
WITH
	CHECK (
		public.is_superadmin ()
		OR (
			SELECT
				auth.uid ()
		) = id
	);

CREATE OR REPLACE FUNCTION public.prevent_superadmin_update () returns trigger language plpgsql security definer AS $$
BEGIN
    -- If the user is not a superadmin and is trying to change is_admin, raise an error
    IF NOT public.is_superadmin() AND OLD.is_super_admin IS DISTINCT FROM NEW.is_super_admin THEN
        RAISE EXCEPTION 'Only a superadmin can change the is_super_admin field.'
            USING ERRCODE = '42501'; -- Insufficient Privilege error code
    END IF;
    -- Otherwise, allow the update
    RETURN NEW;
END;
$$;
-- Attach the trigger to the profiles table
CREATE TRIGGER prevent_superadmin_update_trigger before
UPDATE ON public.profiles FOR each ROW
EXECUTE function public.prevent_superadmin_update ();