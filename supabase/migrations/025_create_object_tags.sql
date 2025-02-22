CREATE TABLE IF NOT EXISTS public.object_tags (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	object_id BIGINT NOT NULL,
	tag_id BIGINT NOT NULL,
	FOREIGN key (object_id) REFERENCES public.objects (id) ON DELETE cascade ON UPDATE cascade,
	FOREIGN key (tag_id) REFERENCES public.tags (id) ON DELETE cascade ON UPDATE cascade
);

ALTER TABLE public.object_tags enable ROW level security;
