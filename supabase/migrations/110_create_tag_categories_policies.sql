CREATE POLICY "Allow reading tag_categories" ON public.tag_categories FOR
SELECT
	USING (TRUE);

CREATE POLICY "Allow creating tag_categories" ON public.tag_categories FOR insert
WITH
	CHECK (public.is_superadmin ());

CREATE POLICY "Allow updating tag_categories" ON public.tag_categories
FOR UPDATE
	USING (public.is_superadmin ());

CREATE POLICY "Allow deleting tag_categories" ON public.tag_categories FOR delete USING (public.is_superadmin ());
