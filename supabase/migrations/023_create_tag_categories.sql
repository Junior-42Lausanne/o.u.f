CREATE TABLE IF NOT EXISTS public.tag_categories (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	tag_id BIGINT NOT NULL,
	category_id BIGINT NOT NULL,
	FOREIGN key (tag_id) REFERENCES public.tags (id) ON DELETE cascade ON UPDATE cascade,
	FOREIGN key (category_id) REFERENCES public.categories (id) ON DELETE cascade ON UPDATE cascade
);

ALTER TABLE public.tag_categories enable ROW level security;
