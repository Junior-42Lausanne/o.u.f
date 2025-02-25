CREATE POLICY "Allow reading projects" ON public.projects FOR
SELECT
	USING (TRUE);

CREATE POLICY "Allow creating projects" ON public.projects FOR insert TO authenticated
WITH
	CHECK (TRUE);

CREATE POLICY "Allow updating projects" ON public.projects
FOR UPDATE
	USING (
		public.is_superadmin ()
		OR public.is_owner_of_project (id)
	)
WITH
	CHECK (
		public.is_superadmin ()
		OR public.is_owner_of_project (id)
	);

CREATE POLICY "Allow deleting projects" ON public.projects FOR delete USING (
	public.is_superadmin ()
	OR public.is_owner_of_project (id)
);
