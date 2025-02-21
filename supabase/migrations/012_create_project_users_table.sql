CREATE TYPE project_admin_level AS ENUM('owner', 'admin');

CREATE TABLE IF NOT EXISTS public.project_users (
	id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	admin_level project_admin_level NOT NULL DEFAULT 'admin',
	project_id BIGINT NOT NULL,
	user_id uuid NOT NULL,
	FOREIGN key (project_id) REFERENCES public.projects (id) ON UPDATE cascade ON DELETE cascade,
	FOREIGN key (user_id) REFERENCES public.profiles (id) ON UPDATE cascade ON DELETE cascade
);

ALTER TABLE public.project_users enable ROW level security;

CREATE INDEX idx_project_users_combo ON public.project_users (project_id, user_id);

CREATE INDEX idx_project_users_admin_level ON public.project_users (project_id, admin_level);

CREATE INDEX idx_project_users_reverse ON public.project_users (user_id, project_id);

-- For cross-project membership checks in profile policy
CREATE INDEX idx_project_users_covering ON public.project_users (project_id, user_id, admin_level);
