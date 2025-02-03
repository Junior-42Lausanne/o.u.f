-- Projects Table
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_projects_updated_at ON public.projects(updated_at);

-- Project Users Table
CREATE INDEX idx_project_users_combo ON public.project_users(project_id, user_id);
CREATE INDEX idx_project_users_admin ON public.project_users(project_id, is_admin);
CREATE INDEX idx_project_users_reverse ON public.project_users(user_id, project_id);

-- Project Invites Table
CREATE INDEX idx_project_invites_combo ON public.project_invites(project_id, email);
CREATE INDEX idx_project_invites_email ON public.project_invites(email);

-- For profile visibility policy
CREATE INDEX idx_profiles_activity ON public.profiles(activity) 
WHERE activity IS NOT NULL;

-- For admin checks (used in is_superadmin() function)
CREATE INDEX idx_profiles_admin ON public.profiles(is_admin) 
WHERE is_admin = TRUE;

-- For cross-project membership checks in profile policy
CREATE INDEX idx_project_users_covering ON public.project_users
(project_id, user_id, is_admin);