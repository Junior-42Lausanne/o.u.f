CREATE OR REPLACE FUNCTION public.auto_update_at () returns trigger language plpgsql AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$;

comment ON function public.auto_update_at IS 'Automatically updates the updated_at column when a row is updated';
