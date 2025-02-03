<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import i18n from '$lib/i18n';

	const { data } = $props();
	const { supabase, project } = data;

	const link_base = `/dashboard/project/${project.id}`;
	const links = [
		{ name: $i18n.t('dashboard.project.[id].project_settings_link'), href: `${link_base}/settings` },
		{ name: $i18n.t('dashboard.project.[id].project_translations_link'), href: `${link_base}/translations` },
		{ name: $i18n.t('dashboard.project.[id].project_library_link'), href: `${link_base}/library` },
		// { name: $i18n.t('dashboard.project.[id].project_settings_link'), href: `${link_base}/settings` },
	]
</script>

<div class="grid grid-cols-3">
	{#each links as link}
		<Card href={link.href} class="m-4">
			{link.name}
		</Card>
	{/each}
</div>