CREATE POLICY "Allow reading categories" ON public.categories FOR
SELECT
	USING (TRUE);

CREATE POLICY "Allow creating categories" ON public.categories FOR insert
WITH
	CHECK (public.is_superadmin ());

CREATE POLICY "Allow updating categories" ON public.categories
FOR UPDATE
	USING (public.is_superadmin ());

CREATE POLICY "Allow deleting categories" ON public.categories FOR delete USING (public.is_superadmin ());
