CREATE TABLE IF NOT EXISTS public.translations (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	project_id BIGINT,
	key TEXT NOT NULL,
	en TEXT,
	fr TEXT,

	FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT unique_key_project_id_key UNIQUE (project_id, key)
);

ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select translations" ON public.translations FOR SELECT
USING (
		project_id IS NULL OR public.is_member_of_project(translations.project_id) OR public.is_superadmin() OR public.is_project_owner(translations.project_id)
);

CREATE POLICY "Insert translations" ON public.translations FOR INSERT
WITH CHECK (
		(project_id IS NULL AND public.is_superadmin()) OR (project_id IS NOT NULL AND (public.is_member_of_project_and_admin(translations.project_id) OR public.is_project_owner(translations.project_id)))
);

CREATE POLICY "Update translations" ON public.translations FOR UPDATE
USING (
	(project_id IS NULL AND public.is_superadmin()) OR (project_id IS NOT NULL AND (public.is_member_of_project_and_admin(translations.project_id) OR public.is_project_owner(translations.project_id)))
)
WITH CHECK (
	(project_id IS NULL AND public.is_superadmin()) OR (project_id IS NOT NULL AND (public.is_member_of_project_and_admin(translations.project_id) OR public.is_project_owner(translations.project_id)))
);

CREATE POLICY "Delete translations" ON public.translations FOR DELETE
USING (
	(project_id IS NULL AND public.is_superadmin()) OR (project_id IS NOT NULL AND (public.is_member_of_project_and_admin(translations.project_id) OR public.is_project_owner(translations.project_id)))
);