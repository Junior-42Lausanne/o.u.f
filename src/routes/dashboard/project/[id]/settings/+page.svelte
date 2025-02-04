<script lang="ts">
	import type { Tables } from '$lib/supabase.js';
	import {
		Button,
		ButtonGroup,
		Input,
		Label,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	const { data } = $props();
	const { project, profile, supabase } = data;

	let is_supperadmin = profile.is_admin;
	let is_project_admin =
		project.owner_id == profile.id ||
		project.users.some((u) => u.user_id == profile.id && u.is_admin);
	let can_edit = is_supperadmin || is_project_admin;

	let project_changed = $state(false);
	let project_saving = $state(false);

	async function handleProjectSave() {
		project_saving = true;
		const { id, name, url_prefix, ...rest } = project;
		const { data, error } = await supabase
			.from('projects')
			.update({ name, url_prefix })
			.eq('id', id);
		if (error) {
			console.error('error', error);
			alert('Error saving project');
		} else {
			project_changed = false;
		}
		project_saving = false;
	}

	function openEditUserModal(user: Tables<'project_users'> & { profile: Tables<'profiles'> }) {
		console.log('openEditUserModal', user);
	}

	function removeUser(user: Tables<'project_users'> & { profile: Tables<'profiles'> }) {
		console.log('removeUser', user);
	}
</script>

<h2>Project settings</h2>

<form onsubmit={handleProjectSave}>
	<div class="mb-4">
		<Label for="project_name">Project name</Label>
		<Input
			disabled={!can_edit || project_saving}
			type="text"
			id="project_name"
			placeholder="My super project"
			bind:value={project.name}
			oninput={() => (project_changed = true)}
		/>
	</div>
	<div class="mb-4">
		<Label for="project_url_prefix">Project URL Prefix</Label>
		<Input
			disabled={!can_edit || project_saving}
			type="text"
			id="project_url_prefix"
			placeholder="super_prefix"
			bind:value={project.url_prefix}
			oninput={() => (project_changed = true)}
		/>
	</div>
	<Button disabled={!can_edit || !project_changed} type="submit">
		{#if project_saving}
			<Spinner class="h-6 w-6" />
		{:else}
			Save
		{/if}
	</Button>
</form>

<h3>Project users</h3>
<Table>
	<TableHead>
		<TableHeadCell>Email</TableHeadCell>
		<TableHeadCell>Level</TableHeadCell>
		<TableHeadCell></TableHeadCell>
	</TableHead>
	<TableBody>
		<TableBodyRow>
			<TableBodyCell>{project.owner.email}</TableBodyCell>
			<TableBodyCell>Owner</TableBodyCell>
			<TableBodyCell></TableBodyCell>
		</TableBodyRow>
		{#each project.users as user}
			<TableBodyRow>
				<TableBodyCell>{user.profile.email}</TableBodyCell>
				<TableBodyCell>{user.is_admin ? 'Admin' : 'Readonly'}</TableBodyCell>
				<TableBodyCell>
					<ButtonGroup>
						{#if (is_project_admin && !user.is_admin) || profile.id == project.owner_id || is_supperadmin}
							<Button onclick={() => openEditUserModal(user)}>Change</Button>
							<Button onclick={() => removeUser(user)}>Remove</Button>
						{/if}
					</ButtonGroup>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
