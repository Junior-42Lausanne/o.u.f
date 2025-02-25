CREATE POLICY "Allow reading tags" ON public.tags FOR
SELECT
	USING (TRUE);

CREATE POLICY "Allow creating tags" ON public.tags FOR insert
WITH
	CHECK (public.is_superadmin ());

CREATE POLICY "Allow updating tags" ON public.tags
FOR UPDATE
	USING (public.is_superadmin ());

CREATE POLICY "Allow deleting tags" ON public.tags FOR delete USING (public.is_superadmin ());
