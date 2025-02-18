<script lang="ts">
	import type { Tables } from '$lib/supabase';
	import { addToast } from '$lib/toaster.svelte';
	import {
		Button,
		ButtonGroup,
		Checkbox,
		Input,
		Label,
		Modal,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	const { project, is_project_admin, is_supperadmin, profile, supabase } = $props();

	let edit_user_modal = $state(false);
	let edit_user: (Tables<'project_users'> & { profile: Tables<'profiles'> }) | undefined = $state();

	let invite_email = $state('');
	let invite_is_admin = $state('');

	function openEditUserModal(user: Tables<'project_users'> & { profile: Tables<'profiles'> }) {
		edit_user = user;
		edit_user_modal = true;
	}

	async function saveUserPermission() {
		if (!edit_user) return;
		const { error } = await supabase
			.from('project_users')
			.update({ is_admin: edit_user.is_admin })
			.eq('id', edit_user.id);

		if (error) {
			console.error('error', error);
			addToast({ message: 'Error saving user', type: 'error' });
		} else {
			edit_user_modal = false;
			location.reload();
		}
	}

	async function removeUser(user: Tables<'project_users'> & { profile: Tables<'profiles'> }) {
		if (!confirm('Are you sure you want to remove this user?')) return;
		const { error } = await supabase.from('project_users').delete().eq('id', user.id);
		if (error) {
			console.error('error', error);
			addToast({ message: 'Error removing user', type: 'error' });
		} else {
			location.reload();
		}
	}

	async function handleInvite(e: Event) {
		e.preventDefault();
		// Call /api/invite POST
		const res = await fetch('/api/invite', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: invite_email,
				project_id: project.id,
				is_admin: invite_is_admin == 'true'
			})
		});

		if (res.ok) {
			addToast({ message: 'User invited', type: 'success' });
		} else {
			addToast({ message: 'Error inviting user', type: 'error' });
			console.error(await res.json());
		}
	}
</script>

<div class="mb-6">
	<h2 class="mb-6 text-center text-xl">Project users</h2>
	<form onsubmit={handleInvite}>
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
				<TableBodyRow>
					<TableBodyCell>
						<!-- <Label for="invite_email">Invite new user</Label> -->
						<Input
							type="email"
							id="invite_email"
							bind:value={invite_email}
							placeholder="john.doe@example.com"
							required
						/>
					</TableBodyCell>
					<TableBodyCell>
						<!-- <Label for="invite_is_admin">Level</Label> -->
						<Select id="invite_is_admin" bind:value={invite_is_admin} required>
							<option value="true">Admin</option>
							<option value="false">Readonly</option>
						</Select>
					</TableBodyCell>
					<TableBodyCell class=""><Button type="submit">Invite</Button></TableBodyCell>
				</TableBodyRow>
			</TableBody>
		</Table>
	</form>
</div>

<Modal bind:open={edit_user_modal} title="Edit user role">
	{#if edit_user}
		<div class="mb-4">
			<Label for="is_admin">User permissions on this project</Label>
			<Checkbox bind:checked={edit_user.is_admin}>Admin</Checkbox>
		</div>
		<Button onclick={saveUserPermission}>Save</Button>
	{/if}
</Modal>
