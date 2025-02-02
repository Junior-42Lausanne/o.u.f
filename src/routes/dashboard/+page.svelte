<script lang="ts">
	import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

	const { data } = $props();
	const { supabase, profile } = data;

	console.log(profile);

</script>

<Table>
	<TableHead>
		<TableHeadCell>Project name</TableHeadCell>
		<TableHeadCell>URL Prefix</TableHeadCell>
		<TableHeadCell>Users</TableHeadCell>
		<TableHeadCell></TableHeadCell>
	</TableHead>
	<TableBody>
		{#each profile.projects as project}
			<TableBodyRow>
				<TableBodyCell>{project.name}</TableBodyCell>
				<TableBodyCell>{project.url_prefix}</TableBodyCell>
				<TableBodyCell>
					{project.owner.email} (owner)
					{project.users.map(u => `${u.profile.email} ${u.is_admin ? `(admin)` : ''}`).join('\n')}
				</TableBodyCell>
				<TableBodyCell>
					<Button size="xs">Manage</Button>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>