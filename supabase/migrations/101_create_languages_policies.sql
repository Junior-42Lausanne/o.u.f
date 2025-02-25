CREATE POLICY "Allow reading languages" ON public.languages FOR
SELECT
	USING (TRUE);

CREATE POLICY "Allow creating languages" ON public.languages FOR insert
WITH
	CHECK (public.is_superadmin ());

CREATE POLICY "Allow updating languages" ON public.languages
FOR UPDATE
	USING (public.is_superadmin ());

CREATE POLICY "Allow deleting languages" ON public.languages FOR delete USING (public.is_superadmin ());
