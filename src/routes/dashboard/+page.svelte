<script lang="ts">
	import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import i18n from '$lib/i18n';

	const { data } = $props();
	const { supabase, profile, projects } = data;

	console.log(profile);

</script>

<div class="flex flex-col">
	<Table>
		<TableHead>
			<TableHeadCell>{$i18n.t('dashboard.project_name')}</TableHeadCell>
			<TableHeadCell>{$i18n.t('dashboard.url_prefix')}</TableHeadCell>
			<TableHeadCell>{$i18n.t('dashboard.users')}</TableHeadCell>
			<TableHeadCell>{$i18n.t('dashboard.actions')}</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each projects as project}
				<TableBodyRow>
					<TableBodyCell>{project.name}</TableBodyCell>
					<TableBodyCell>{project.url_prefix}</TableBodyCell>
					<TableBodyCell class="whitespace-pre-line">
						{project.owner.email} ({$i18n.t('dashboard.owner')})
						{project.users.map(u => `${u.profile.email} ${u.is_admin ? `(${$i18n.t('dashboard.admin')})` : ''}`).join('\n')}
					</TableBodyCell>
					<TableBodyCell>
						<Button size="xs" href="/dashboard/project/{project.id}">{$i18n.t('dashboard.manage_project_button')}</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
	<Button class="mx-8 my-4">{$i18n.t('dashboard.create_project_button')}</Button>
</div>