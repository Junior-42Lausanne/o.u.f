-- Create updated policy with project membership check
CREATE POLICY "Select profiles for superadmin, owner, and project members" ON public.profiles FOR
SELECT
	USING (
		is_superadmin ()
		OR (
			SELECT
				auth.uid ()
		) = id
		OR EXISTS (
			SELECT
				1
			FROM
				public.projects p
				LEFT JOIN public.project_users pu_current ON p.id = pu_current.project_id
				LEFT JOIN public.project_users pu_target ON p.id = pu_target.project_id
			WHERE
				-- Current user is project owner or member
				(
					p.owner_id = (
						SELECT
							auth.uid ()
					)
					OR pu_current.user_id = (
						SELECT
							auth.uid ()
					)
				)
				AND
				-- Target user is project owner or member
				(
					p.owner_id = profiles.id
					OR pu_target.user_id = profiles.id
				)
		)
	);

-- Policy for INSERT
CREATE POLICY "Insert for superadmin and owner" ON public.profiles FOR insert
WITH
	CHECK (
		is_superadmin ()
		OR (
			SELECT
				auth.uid ()
		) = id
	);

-- Policy for UPDATE
CREATE POLICY "Update for superadmin and owner" ON public.profiles
FOR UPDATE
	USING (
		is_superadmin ()
		OR (
			SELECT
				auth.uid ()
		) = id
	)
WITH
	CHECK (
		is_superadmin ()
		OR (
			SELECT
				auth.uid ()
		) = id
	);

-- Policy for DELETE
CREATE POLICY "Delete for superadmin and owner" ON public.profiles FOR delete USING (
	is_superadmin ()
	OR (
		SELECT
			auth.uid ()
	) = id
);

-- -- y'a aussi dans projet -> je crois que celle-la ne sert a rien...
-- -- Create a trigger function to enforce the rule
-- CREATE OR REPLACE FUNCTION public.prevent_non_admin_is_admin_update () returns trigger language plpgsql security definer AS $$
-- BEGIN
--     -- If the user is not a superadmin and is trying to change is_admin, raise an error
--     IF NOT is_superadmin() AND OLD.admin_level IS DISTINCT FROM NEW.admin_level THEN
--         RAISE EXCEPTION 'Only a superadmin can change the admin_level field.'
--             USING ERRCODE = '42501'; -- Insufficient Privilege error code
--     END IF;
--     -- Otherwise, allow the update
--     RETURN NEW;
-- END;
-- $$;
-- -- Attach the trigger to the profiles table
-- CREATE TRIGGER prevent_non_admin_is_admin_update_trigger before
-- UPDATE ON public.profiles FOR each ROW
-- EXECUTE function public.prevent_non_admin_is_admin_update ();
--
