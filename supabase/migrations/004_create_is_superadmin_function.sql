CREATE OR REPLACE FUNCTION public.is_superadmin () returns BOOLEAN language plpgsql security definer AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = (select auth.uid())
        AND profiles.is_super_admin = TRUE
    );
END;
$$;
