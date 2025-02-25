-- Function to check if the current user is an owner of a given project
CREATE OR REPLACE FUNCTION public.is_owner_of_project (project_id BIGINT) returns BOOLEAN language plpgsql security definer AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.project_users
        WHERE project_id IS NOT NULL
				AND project_users.project_id = is_owner_of_project.project_id
        AND project_users.user_id = (select auth.uid())
        AND project_users.admin_level = 'owner'
    );
END;
$$;
