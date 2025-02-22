CREATE POLICY "Allow read translations" ON public.translations FOR
SELECT
	USING (TRUE);

CREATE POLICY "Allow create translations" ON public.translations FOR insert
WITH
	CHECK (
		public.is_superadmin ()
		OR (
			public.is_member_of_project (project_id)
			AND project_id IS NOT NULL
		)
	);

CREATE POLICY "Allow update translations" ON public.translations
FOR UPDATE
	USING (
		public.is_superadmin ()
		OR (
			public.is_member_of_project (project_id)
			AND project_id IS NOT NULL
		)
	);

CREATE POLICY "Allow delete translations" ON public.translations FOR delete USING (
	public.is_superadmin ()
	OR (
		public.is_member_of_project (project_id)
		AND project_id IS NOT NULL
	)
);
