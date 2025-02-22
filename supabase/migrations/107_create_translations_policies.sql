CREATE POLICY "Allow read translations" ON public.translations FOR
SELECT
	USING (true);

CREATE POLICY "Allow create translations" ON public.translations FOR INSERT USING (
	public.is_superadmin ()
	OR (
		public.is_member_of_project (project_id)
		AND project_id IS NOT NULL
	)
);

CREATE POLICY "Allow update translations" ON public.translations FOR
UPDATE USING (
	public.is_superadmin ()
	OR (
		public.is_member_of_project (project_id)
		AND project_id IS NOT NULL
	)
);

CREATE POLICY "Allow delete translations" ON public.translations FOR DELETE USING (
	public.is_superadmin ()
	OR (
		public.is_member_of_project (project_id)
		AND project_id IS NOT NULL
	)
);