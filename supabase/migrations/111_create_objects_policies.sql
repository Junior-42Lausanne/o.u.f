CREATE POLICY "Allow reading objects" ON public.objects FOR
SELECT
	USING (TRUE);

CREATE POLICY "Allow creating objects" ON public.objects FOR insert
WITH
	CHECK (
		public.is_superadmin ()
		OR public.is_member_of_project (project_id)
	);

CREATE POLICY "Allow updating objects" ON public.objects
FOR UPDATE
	USING (
		public.is_superadmin ()
		OR public.is_member_of_project (project_id)
	)
WITH
	CHECK (
		public.is_superadmin ()
		OR public.is_member_of_project (project_id)
	);

CREATE POLICY "Allow deleting objects" ON public.objects FOR delete USING (
	public.is_superadmin ()
	OR public.is_member_of_project (project_id)
);
