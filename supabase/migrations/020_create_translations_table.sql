CREATE TABLE IF NOT EXISTS public.translations (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	key TEXT NOT NULL,
	value TEXT NOT NULL,
	project_id BIGINT,
	language_id BIGINT NOT NULL,
	FOREIGN key (project_id) REFERENCES public.projects (id) ON DELETE cascade ON UPDATE cascade,
	FOREIGN key (language_id) REFERENCES public.languages (id) ON DELETE cascade ON UPDATE cascade,
	CONSTRAINT unique_key_language_project UNIQUE (project_id, key, language_id)
);

ALTER TABLE public.translations enable ROW level security;

CREATE INDEX idx_translations_get_by_key ON public.translations (key ASC, language_id, project_id NULLS FIRST);

CREATE INDEX idx_translations_get_by_project ON public.translations (project_id);
