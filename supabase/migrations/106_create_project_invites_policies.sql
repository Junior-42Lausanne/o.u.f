CREATE POLICY "Allow reading project_invites" ON public.project_invites FOR
SELECT
	USING (
		public.is_superadmin ()
		OR public.is_member_of_project (project_id)
	);

CREATE POLICY "Allow creating project_invites" ON public.project_invites FOR INSERT
WITH
	CHECK (
		public.is_superadmin ()
		OR public.is_owner_of_project (project_id)
		OR (
			public.is_member_of_project (project_id)
			AND admin_level = 'admin'
		)
	);

CREATE POLICY "Allow updating project_invites" ON public.project_invites FOR
UPDATE USING (
	public.is_superadmin ()
	OR public.is_owner_of_project (project_id)
	OR (
		public.is_member_of_project (project_id)
		AND admin_level = 'admin'
	)
);

CREATE POLICY "Allow deleting project_invites" ON public.project_invites FOR DELETE USING (
	public.is_superadmin ()
	OR public.is_owner_of_project (project_id)
	OR (
		public.is_member_of_project (project_id)
		AND admin_level = 'admin'
	)
);

CREATE OR REPLACE FUNCTION public.prevent_invite_member () RETURNS TRIGGER AS $$
BEGIN
	IF EXISTS (SELECT 1 IN project_users WHERE project_id = NEW.project_id AND user_id = NEW.user_id) THEN
		RAISE EXCEPTION 'Cannot invite a user that is already a member of the project';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_invite_member_trigger
BEFORE INSERT ON public.project_invites
FOR EACH ROW
EXECUTE FUNCTION public.prevent_invite_member ();