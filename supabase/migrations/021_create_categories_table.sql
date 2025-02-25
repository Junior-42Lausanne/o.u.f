CREATE TABLE IF NOT EXISTS public.categories (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	translation_id BIGINT NOT NULL,
	FOREIGN key (translation_id) REFERENCES public.translations (id) ON DELETE cascade ON UPDATE cascade
);

ALTER TABLE public.categories enable ROW level security;
