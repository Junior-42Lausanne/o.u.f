CREATE TABLE IF NOT EXISTS public.projects (
	id BIGINT NOT NULL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
	name TEXT NOT NULL,
	url_prefix TEXT NOT NULL,
	restricted_premix_mode BOOLEAN NOT NULL DEFAULT false,
	languages TEXT [] NOT NULL DEFAULT '{"en"}',
	owner_id UUID NOT NULL,
	FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS public.project_users (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	is_admin BOOLEAN NOT NULL DEFAULT FALSE,
	project_id BIGINT NOT NULL,
	user_id UUID NOT NULL,
	FOREIGN KEY (project_id) REFERENCES public.projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.project_invites (
	id UUID NOT NULL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	invited_by UUID NOT NULL,
	email TEXT NOT NULL,
	project_id BIGINT NOT NULL,
	FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (invited_by) REFERENCES public.profiles(id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_invites ENABLE ROW LEVEL SECURITY;

-- Function to check if the current user is a member of a project
CREATE OR REPLACE FUNCTION public.is_member_of_project(project_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.project_users
        WHERE project_users.project_id = is_member_of_project.project_id
        AND project_users.user_id = (select auth.uid())
    );
END;
$$;

-- Function to check if the current user is an admin of a project
CREATE OR REPLACE FUNCTION public.is_member_of_project_and_admin(project_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.project_users
        WHERE project_users.project_id = is_member_of_project_and_admin.project_id
        AND project_users.user_id = (select auth.uid())
        AND project_users.is_admin = TRUE
    );
END;
$$;

-- Function to check if the current user is the owner of a project
CREATE OR REPLACE FUNCTION public.is_project_owner(project_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.projects
        WHERE projects.id = is_project_owner.project_id
        AND projects.owner_id = (select auth.uid())
    );
END;
$$;

-- Policies for SELECT (read)
CREATE POLICY "Select projects for project members" ON public.projects
FOR SELECT
USING (
		public.is_member_of_project(id) OR public.is_project_owner(id) OR public.is_superadmin()
);

CREATE POLICY "Select project_users for project members" ON public.project_users
FOR SELECT
USING (
		public.is_member_of_project(project_id) OR public.is_project_owner(project_id) OR public.is_superadmin()
);

CREATE POLICY "Select project_invites for project members" ON public.project_invites
FOR SELECT
USING (
		public.is_member_of_project(project_id) OR public.is_project_owner(project_id) OR public.is_superadmin()
);

-- Policies for INSERT
CREATE POLICY "Insert projects only for owners"
ON public.projects
FOR INSERT
WITH CHECK (
    owner_id = (select auth.uid()) OR
    public.is_superadmin()
);

CREATE POLICY "Insert project_users only if invited"
ON public.project_users
FOR INSERT
WITH CHECK (
	public.is_superadmin() OR (
		EXISTS (
			SELECT 1
			FROM public.project_invites
			WHERE project_invites.project_id = project_users.project_id
			AND project_invites.email = (select auth.email())
		)
	)
);

CREATE POLICY "Insert project_invites only for owners"
ON public.project_invites
FOR INSERT
WITH CHECK (
		public.is_project_owner(project_id) OR
		public.is_superadmin()
);

-- Policies for UPDATE
CREATE POLICY "Update projects only for project admins"
ON public.projects
FOR UPDATE
USING (
		public.is_project_owner(id) OR public.is_superadmin() OR public.is_member_of_project_and_admin(id)
)
WITH CHECK (
		public.is_project_owner(id) OR public.is_superadmin() OR public.is_member_of_project_and_admin(id)
);

CREATE POLICY "Update project_users only for project admins"
ON public.project_users
FOR UPDATE
USING (
		public.is_project_owner(project_id) OR public.is_superadmin() OR public.is_member_of_project_and_admin(project_id)
)
WITH CHECK (
		public.is_project_owner(project_id) OR public.is_superadmin() OR public.is_member_of_project_and_admin(project_id)
);

CREATE POLICY "Update project_invites only for owner"
ON public.project_invites
FOR UPDATE
USING (
		public.is_project_owner(project_id) OR public.is_superadmin()
);

-- Policies for DELETE
CREATE POLICY "Delete projects only for owners"
ON public.projects
FOR DELETE
USING (
		public.is_project_owner(id) OR public.is_superadmin()
);

CREATE POLICY "Delete project_users only for project admins"
ON public.project_users
FOR DELETE
USING (
		public.is_project_owner(project_id) OR public.is_superadmin() OR public.is_member_of_project_and_admin(project_id)
);

CREATE POLICY "Delete project_invites only for owner"
ON public.project_invites
FOR DELETE
USING (
		public.is_project_owner(project_id) OR public.is_superadmin()
);

CREATE OR REPLACE FUNCTION public.prevent_non_admin_is_admin_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
		IF NOT public.is_project_owner(NEW.project_id) THEN
				RAISE EXCEPTION 'Only project owners can update project admin status';
		END IF;
		RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_non_admin_is_admin_update
BEFORE UPDATE OF is_admin ON public.project_users
FOR EACH ROW
EXECUTE FUNCTION public.prevent_non_admin_is_admin_update();

CREATE OR REPLACE FUNCTION public.prevent_non_owner_is_owner_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
		IF NOT public.is_project_owner(NEW.project_id) THEN
				RAISE EXCEPTION 'Only project owners can update project owner status';
		END IF;
		RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_non_owner_is_owner_update
BEFORE UPDATE OF owner_id ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.prevent_non_owner_is_owner_update();

CREATE OR REPLACE VIEW public.user_projects AS
SELECT
    p.*
FROM
    public.projects p
WHERE
    p.owner_id = (select auth.uid()) -- User is the owner
UNION ALL
SELECT
    p.*
FROM
    public.projects p
    JOIN public.project_users pu ON p.id = pu.project_id
WHERE
    pu.user_id = (select auth.uid()); -- User is a member