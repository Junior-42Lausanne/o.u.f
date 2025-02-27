import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, params }) => {
	const { data: project, error } = await supabase
		.from('projects')
		.select(
			'*, users:project_users(*, profile:profiles!inner(*)), invites:project_invites(*), owner:profiles!inner(*)'
		)
		.eq('id', parseInt(params.id))
		.single();
	if (error) throw error;
	if (!project) redirect(302, '/dashboard');

	return { project };
};
