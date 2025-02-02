import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { user } = await safeGetSession();
	if (!user) redirect(302, '/');

	const { data: profile, error: profileError } = await supabase
		.from('profiles')
		.select('*, projects(*, users:project_users(*, profile:profiles!inner(*)), invites:project_invites(*), owner:profiles!inner(*))')
		.eq('id', user.id)
		.single();
	if (profileError) throw profileError;
	if (!profile) redirect(302, '/');

	return { profile };
};