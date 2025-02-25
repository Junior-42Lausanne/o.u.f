CREATE POLICY "Allow reading object_tags" ON public.object_tags FOR
SELECT
	USING (TRUE);

CREATE POLICY "Allow creating object_tags" ON public.object_tags FOR insert
WITH
	CHECK (
		public.is_superadmin ()
		OR (
			public.is_member_of_project (
				(
					SELECT
						project_id
					FROM
						public.objects
					WHERE
						id = object_id
				)
			)
		)
	);

CREATE POLICY "Allow updating object_tags" ON public.object_tags
FOR UPDATE
	USING (
		public.is_superadmin ()
		OR (
			public.is_member_of_project (
				(
					SELECT
						project_id
					FROM
						public.objects
					WHERE
						id = object_id
				)
			)
		)
	)
WITH
	CHECK (
		public.is_superadmin ()
		OR (
			public.is_member_of_project (
				(
					SELECT
						project_id
					FROM
						public.objects
					WHERE
						id = object_id
				)
			)
		)
	);

CREATE POLICY "Allow deleting object_tags" ON public.object_tags FOR delete USING (
	public.is_superadmin ()
	OR (
		public.is_member_of_project (
			(
				SELECT
					project_id
				FROM
					public.objects
				WHERE
					id = object_id
			)
		)
	)
);
