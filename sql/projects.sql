-- Function to check if the current user is a member of a project
-- Can be 'admin' or 'owner'
CREATE OR REPLACE FUNCTION public.is_member_of_project (project_id BIGINT) returns BOOLEAN language plpgsql security definer AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.project_users
        WHERE project_users.project_id = is_member_of_project.project_id
        AND project_users.user_id = (select auth.uid())
    );
END;
$$;

-- Policies for SELECT (read)
CREATE POLICY "Select projects for project members" ON public.projects FOR
SELECT
	USING (
		public.is_member_of_project (id)
		OR public.is_owner_of_project (id)
		OR public.is_superadmin ()
	);

CREATE POLICY "Select project_users for project members" ON public.project_users FOR
SELECT
	USING (
		public.is_member_of_project (project_id)
		OR public.is_owner_of_project (project_id)
		OR public.is_superadmin ()
	);

CREATE POLICY "Select project_invites for project members" ON public.project_invites FOR
SELECT
	USING (
		public.is_member_of_project (project_id)
		OR public.is_owner_of_project (project_id)
		OR public.is_superadmin ()
	);

-- Policies for INSERT
CREATE POLICY "Insert projects only for owners" ON public.projects FOR insert
WITH
	CHECK (
		owner_id = (
			SELECT
				auth.uid ()
		)
		OR public.is_superadmin ()
	);

CREATE POLICY "Insert project_users only if invited" ON public.project_users FOR insert
WITH
	CHECK (
		public.is_superadmin ()
		OR (
			EXISTS (
				SELECT
					1
				FROM
					public.project_invites
				WHERE
					project_invites.project_id = project_users.project_id
					AND project_invites.email = (
						SELECT
							auth.email ()
					)
			)
		)
	);

CREATE POLICY "Insert project_invites only for owners" ON public.project_invites FOR insert
WITH
	CHECK (
		public.is_owner_of_project (project_id)
		OR public.is_superadmin ()
	);

-- Policies for UPDATE
CREATE POLICY "Update projects only for project admins" ON public.projects
FOR UPDATE
	USING (
		public.is_owner_of_project (id)
		OR public.is_superadmin ()
	)
WITH
	CHECK (
		public.is_owner_of_project (id)
		OR public.is_superadmin ()
	);

CREATE POLICY "Update project_users only for project admins" ON public.project_users
FOR UPDATE
	USING (
		public.is_owner_of_project (project_id)
		OR public.is_superadmin ()
	)
WITH
	CHECK (
		public.is_owner_of_project (project_id)
		OR public.is_superadmin ()
	);

CREATE POLICY "Update project_invites only for owner" ON public.project_invites
FOR UPDATE
	USING (
		public.is_owner_of_project (project_id)
		OR public.is_superadmin ()
	);

-- Policies for DELETE
CREATE POLICY "Delete projects only for owners" ON public.projects FOR delete USING (
	public.is_owner_of_project (id)
	OR public.is_superadmin ()
	OR email = (
		SELECT
			auth.email ()
	)
);

CREATE POLICY "Delete project_users only for project admins" ON public.project_users FOR delete USING (
	public.is_owner_of_project (project_id)
	OR public.is_superadmin ()
);

CREATE POLICY "Delete project_invites only for owner" ON public.project_invites FOR delete USING (
	public.is_owner_of_project (project_id)
	OR public.is_superadmin ()
);

-- pas clair avec celui dans profiles
-- CREATE OR REPLACE FUNCTION public.prevent_non_admin_is_admin_update () returns trigger language plpgsql AS $$
-- BEGIN
-- 		IF NOT public.is_owner_of_project(NEW.project_id) THEN
-- 				RAISE EXCEPTION 'Only project owners can update project admin status';
-- 		END IF;
-- 		RETURN NEW;
-- END;
-- $$;
-- CREATE TRIGGER prevent_non_admin_is_admin_update before
-- UPDATE of is_admin ON public.project_users FOR each ROW
-- EXECUTE function public.prevent_non_admin_is_admin_update ();
--
CREATE OR REPLACE FUNCTION public.prevent_non_owner_is_owner_update () returns trigger language plpgsql AS $$
BEGIN
		IF NOT public.is_owner_of_project(NEW.project_id) THEN
				RAISE EXCEPTION 'Only project owners can update project owner status';
		END IF;
		RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_non_owner_is_owner_update before
UPDATE of owner_id ON public.projects FOR each ROW
EXECUTE function public.prevent_non_owner_is_owner_update ();

CREATE OR REPLACE VIEW public.user_projects AS
SELECT
	p.*
FROM
	public.projects p
WHERE
	p.owner_id = (
		SELECT
			auth.uid ()
	) -- User is the owner
UNION ALL
SELECT
	p.*
FROM
	public.projects p
	JOIN public.project_users pu ON p.id = pu.project_id
WHERE
	pu.user_id = (
		SELECT
			auth.uid ()
	);

-- User is a member
