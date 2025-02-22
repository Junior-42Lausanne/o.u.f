CREATE POLICY "Allow reading project_languages" ON public.project_languages FOR
SELECT
	USING (true);

CREATE POLICY "Allow creating project_languages" ON public.project_languages FOR INSERT USING (
	public.is_superadmin ()
	OR public.is_member_of_project (project_id)
);

CREATE POLICY "Allow updating project_languages" ON public.project_languages FOR
UPDATE USING (
	public.is_superadmin ()
	OR public.is_member_of_project (project_id)
);

CREATE POLICY "Allow deleting project_languages" ON public.project_languages FOR DELETE USING (
	public.is_superadmin ()
	OR public.is_member_of_project (project_id)
);