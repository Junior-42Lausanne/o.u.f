CREATE POLICY "Allow reading project_users" ON public.project_users FOR
SELECT
	USING (
		public.is_superadmin ()
		OR public.is_member_of_project (project_id)
	);

CREATE POLICY "Allow creating project_users" ON public.project_users FOR insert
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

CREATE POLICY "Allow updating project_users" ON public.project_users
FOR UPDATE
	USING (
		public.is_superadmin ()
		OR public.is_member_of_project (project_id)
	);

CREATE POLICY "Allow deleting project_users" ON public.project_users FOR delete USING (
	public.is_superadmin ()
	OR public.is_member_of_project (project_id)
);

CREATE OR REPLACE FUNCTION public.prevent_self_promotion () returns trigger AS $$
BEGIN
	IF OLD.user_id = NEW.user_id THEN
		RAISE EXCEPTION 'Cannot promote or demote yourself';
	END IF;
	RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER prevent_self_promotion_trigger before
UPDATE of role ON public.project_users FOR each ROW
EXECUTE function public.prevent_self_promotion ();
