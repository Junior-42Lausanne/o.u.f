-- Function to check if the current user is an admin of a project
CREATE OR REPLACE FUNCTION public.is_member_of_project (project_id BIGINT) returns BOOLEAN language plpgsql security definer AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.project_users
        WHERE project_users.project_id = is_owner_of_project.project_id
        AND project_users.user_id = (select auth.uid())
    );
END;
$$;
