import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	const { token } = params;
	if (!token) return new Response('Unauthorized', { status: 401 });

	const { user } = await safeGetSession();
	if (!user)
		// Redirect to login page
		redirect(303, '/auth');

	const { data: invite, error: inviteError } = await supabase
		.from('project_invites')
		.select()
		.eq('token', token)
		.single();
	if (inviteError || !invite) redirect(303, '/error');

	// Add the user to the project_users
	const { data: projectUser, error: projectUserError } = await supabase
		.from('project_users')
		.insert({
			project_id: invite.project_id,
			user_id: user.id,
			is_admin: invite.admin
		})
		.select()
		.single();
	if (projectUserError || !projectUser) redirect(303, '/error');

	// Delete the invite
	const { error: deleteError } = await supabase
		.from('project_invites')
		.delete()
		.eq('id', invite.id);

	redirect(303, `/dashboard/project/${invite.project_id}`);
};
