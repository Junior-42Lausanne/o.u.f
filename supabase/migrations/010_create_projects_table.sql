CREATE TABLE IF NOT EXISTS public.projects (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
	name TEXT NOT NULL,
	fqdn TEXT NOT NULL,
	restricted_premix_mode BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE public.projects enable ROW level security;
