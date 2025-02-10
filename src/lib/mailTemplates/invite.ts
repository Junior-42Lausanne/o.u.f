import i18n from '$lib/i18n';
import { get } from 'svelte/store';
import mjml2html from 'mjml';
import { PUBLIC_URL } from '$env/static/public';
import type { Tables } from '$lib/supabase';

export default function Invite(invite: Tables<'project_invites'>, project: Tables<'projects'>) {
	const $i18n = get(i18n);

	const mjml = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-image width="100px" src="/assets/img/logo-small.png"></mj-image>

        <mj-divider border-color="#F45E43"></mj-divider>

        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">${$i18n.t('mail.invite.introduction_title')} ${project.name}</mj-text>

        <mj-text font-size="16px" color="#F45E43" font-family="helvetica">${$i18n.t('mail.invite.introduction_description')}</mj-text>

        <mj-button background-color="#F45E43"
                     href="${PUBLIC_URL}/api/invite/${invite.token}">${$i18n.t('mail.invite.join_button')}</mj-button>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

	return mjml2html(mjml, { minify: true });
}
