CREATE POLICY "Full control for project admin 1iiiika_0" ON storage.objects FOR
INSERT
	TO public WITH CHECK (
		bucket_id = 'projects'
		AND (
			public.is_member_of_project_and_admin((storage.foldername(name)) [1] :: bigint)
			OR public.is_superadmin()
			OR public.is_project_owner((storage.foldername(name)) [1] :: bigint)
		)
	);

CREATE POLICY "Full control for project admin 1iiiika_1" ON storage.objects FOR
UPDATE
	TO public USING (
		bucket_id = 'projects'
		AND (
			public.is_member_of_project_and_admin((storage.foldername(name)) [1] :: bigint)
			OR public.is_superadmin()
			OR public.is_project_owner((storage.foldername(name)) [1] :: bigint)
		)
	);

CREATE POLICY "Full control for project admin 1iiiika_2" ON storage.objects FOR DELETE TO public USING (
	bucket_id = 'projects'
	AND (
		public.is_member_of_project_and_admin((storage.foldername(name)) [1] :: bigint)
		OR public.is_superadmin()
		OR public.is_project_owner((storage.foldername(name)) [1] :: bigint)
	)
);

CREATE POLICY "Select uhkab2_0" ON storage.objects FOR
SELECT
	TO public USING (bucket_id = 'network');

CREATE POLICY "Network uhkab2_0" ON storage.objects FOR
UPDATE
	TO public USING (
		bucket_id = 'network'
		AND (
			owner_id :: uuid = (
				select
					auth.uid()
			)
			OR public.is_superadmin()
		)
	);

CREATE POLICY "Network uhkab2_1" ON storage.objects FOR
INSERT
	TO public WITH CHECK (
		bucket_id = 'network'
		AND (
			owner_id :: uuid = (
				select
					auth.uid()
			)
			OR public.is_superadmin()
		)
	);

CREATE POLICY "Network uhkab2_2" ON storage.objects FOR DELETE TO public USING (
	bucket_id = 'network'
	AND (
		owner_id :: uuid = (
			select
				auth.uid()
		)
		OR public.is_superadmin()
	)
);