CREATE TABLE IF NOT EXISTS public.project_invites (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	invited_by uuid NOT NULL,
	email TEXT NOT NULL,
	project_id BIGINT NOT NULL,
	token TEXT NOT NULL UNIQUE,
	admin_level project_admin_level NOT NULL DEFAULT 'admin',
	FOREIGN key (project_id) REFERENCES public.projects (id) ON DELETE cascade ON UPDATE cascade,
	FOREIGN key (invited_by) REFERENCES public.profiles (id) ON DELETE cascade ON UPDATE cascade,
	UNIQUE (project_id, email)
);

ALTER TABLE public.project_invites enable ROW level security;

CREATE INDEX idx_project_invites_combo ON public.project_invites (project_id, email);
