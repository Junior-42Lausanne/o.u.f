CREATE POLICY "Select translations" ON public.translations FOR
SELECT
	USING (
		project_id IS NULL
		OR public.is_member_of_project (translations.project_id)
		OR public.is_superadmin ()
		OR public.is_owner_of_project (translations.project_id)
	);

CREATE POLICY "Insert translations" ON public.translations FOR insert
WITH
	CHECK (
		(
			project_id IS NULL
			AND public.is_superadmin ()
		)
		OR (
			project_id IS NOT NULL
			AND public.is_owner_of_project (translations.project_id)
		)
	);

CREATE POLICY "Update translations" ON public.translations
FOR UPDATE
	USING (
		(
			project_id IS NULL
			AND public.is_superadmin ()
		)
		OR (
			project_id IS NOT NULL
			AND public.is_owner_of_project (translations.project_id)
		)
	)
WITH
	CHECK (
		(
			project_id IS NULL
			AND public.is_superadmin ()
		)
		OR (
			project_id IS NOT NULL
			AND public.is_owner_of_project (translations.project_id)
		)
	);

CREATE POLICY "Delete translations" ON public.translations FOR delete USING (
	(
		project_id IS NULL
		AND public.is_superadmin ()
	)
	OR (
		project_id IS NOT NULL
		AND public.is_owner_of_project (translations.project_id)
	)
);
