CREATE TABLE IF NOT EXISTS public.objects (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	project_id BIGINT,
	title_translation_id BIGINT NOT NULL,
	description_translation_id BIGINT NOT NULL,
	is_texture BOOLEAN NOT NULL DEFAULT FALSE,
	is_public BOOLEAN NOT NULL,
	FOREIGN key (project_id) REFERENCES public.projects (id) ON DELETE cascade ON UPDATE cascade,
	FOREIGN key (title_translation_id) REFERENCES public.translations (id) ON DELETE cascade ON UPDATE cascade,
	FOREIGN key (description_translation_id) REFERENCES public.translations (id) ON DELETE cascade ON UPDATE cascade
);

ALTER TABLE public.objects enable ROW level security;
