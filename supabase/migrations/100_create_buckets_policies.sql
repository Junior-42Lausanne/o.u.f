CREATE POLICY "Full control for project admin 1iiiika_0" ON storage.objects FOR insert TO public
WITH
	CHECK (
		bucket_id = 'projects'
		AND (
			public.is_superadmin ()
			OR public.is_owner_of_project ((storage.foldername (name)) [1]::BIGINT)
		)
	);

CREATE POLICY "Full control for project admin 1iiiika_1" ON storage.objects
FOR UPDATE
	TO public USING (
		bucket_id = 'projects'
		AND (
			public.is_superadmin ()
			OR public.is_owner_of_project ((storage.foldername (name)) [1]::BIGINT)
		)
	);

CREATE POLICY "Full control for project admin 1iiiika_2" ON storage.objects FOR delete TO public USING (
	bucket_id = 'projects'
	AND (
		public.is_superadmin ()
		OR public.is_owner_of_project ((storage.foldername (name)) [1]::BIGINT)
	)
);

CREATE POLICY "Select uhkab2_0" ON storage.objects FOR
SELECT
	TO public USING (bucket_id = 'network');

CREATE POLICY "Network uhkab2_0" ON storage.objects
FOR UPDATE
	TO public USING (
		bucket_id = 'network'
		AND (
			owner_id::uuid = (
				SELECT
					auth.uid ()
			)
			OR public.is_superadmin ()
		)
	);

CREATE POLICY "Network uhkab2_1" ON storage.objects FOR insert TO public
WITH
	CHECK (
		bucket_id = 'network'
		AND (
			owner_id::uuid = (
				SELECT
					auth.uid ()
			)
			OR public.is_superadmin ()
		)
	);

CREATE POLICY "Network uhkab2_2" ON storage.objects FOR delete TO public USING (
	bucket_id = 'network'
	AND (
		owner_id::uuid = (
			SELECT
				auth.uid ()
		)
		OR public.is_superadmin ()
	)
);
