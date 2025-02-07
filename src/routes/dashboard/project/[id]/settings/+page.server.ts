import type { PageServerLoad } from '../translations/$types';

export const load: PageServerLoad = async ({ params, parent, locals: { supabase } }) => {
	// const { project } = await parent();
	const { id } = params;

	const { data: home_image_exists } = await supabase.storage
		.from('projects')
		.exists(`${id}/home.png`); // We assume PNG maybe change that later ?

	const { data: logo_exists } = await supabase.storage.from('projects').exists(`${id}/logo.png`); // We assume PNG maybe change that later ?

	return { home_image_exists, logo_exists };
};
