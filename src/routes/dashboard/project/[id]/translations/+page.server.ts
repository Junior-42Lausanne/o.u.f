import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals: {supabase}, params}) => {
	const { id } = params;

	const { data: translations, error } = await supabase.from('translations').select('*').or(`project_id.eq.${id},project_id.is.null`);
	if (error) {
		throw error;
	}

	return { translations };
};