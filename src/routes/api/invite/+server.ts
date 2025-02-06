import { sendMail } from '$lib/mail';
import Invite from '$lib/mailTemplates/invite';
import type { RequestHandler } from '@sveltejs/kit';
import * as crypto from 'node:crypto';

/**
 * @param project_id
 * @param email
 * @param is_admin
 */
export const POST: RequestHandler = async ({ locals: { supabase, safeGetSession }, request }) => {
	const { user } = await safeGetSession();
	if (!user) return new Response('Unauthorized', { status: 401 });

	const body = (await request.json()) as { project_id: number; email: string; is_admin: boolean };
	const { project_id, email, is_admin } = body;

	if (!project_id || !email || typeof is_admin !== 'boolean')
		return new Response(JSON.stringify({ error: 'Malformed request' }), { status: 400 });

	const { data: project, error: projectError } = await supabase
		.from('projects')
		.select()
		.eq('id', project_id)
		.single();
	if (projectError || !project)
		return new Response(JSON.stringify({ projectError }), { status: 500 });

	const token = crypto.randomBytes(20).toString('hex');

	const { data: invite, error: inviteError } = await supabase
		.from('project_invites')
		.insert({
			project_id,
			email,
			token,
			invited_by: user!.id,
			admin: is_admin
		})
		.select()
		.single();

	if (inviteError || !invite)
		return new Response(JSON.stringify({ error: inviteError }), { status: 500 });

	const mjml = Invite(invite, project);
	await sendMail(mjml, email);
	return new Response('Success', { status: 200 });
};
