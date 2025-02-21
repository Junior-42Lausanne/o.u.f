CREATE TABLE IF NOT EXISTS public.project_languages (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	language_id SMALLINT NOT NULL,
	project_id BIGINT NOT NULL,
	FOREIGN key (language_id) REFERENCES public.languages (id),
	FOREIGN key (project_id) REFERENCES public.projects (id)
);
