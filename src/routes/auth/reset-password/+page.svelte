<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { addToast } from '$lib/toaster.svelte.js';
	import { Input, Label, Helper, Button, Checkbox, A } from 'flowbite-svelte';

	const { data } = $props();
	const { supabase } = data;

	let password = $state('');
	let password2 = $state('');

	async function handleFormSubmit(event: Event) {
		event.preventDefault();

		try {
			if (password != password2) {
				addToast({ message: 'Passwords do not match', type: 'error' });
			}
			const { data, error } = await supabase.auth.updateUser({
				password
			});

			if (error) {
				addToast({
					message: 'An error occurred while trying to change the password',
					type: 'error'
				});
				console.error(error);
				return;
			}

			await supabase.auth.signOut();
			invalidate('supabase:auth');

			addToast({
				message:
					'Your password has been changed successfully, you can now login with your new password',
				type: 'success',
				timeout: 2000
			});
			setTimeout(() => {
				window.location.href = '/auth';
			}, 2000);
		} catch (err) {
			addToast({ message: 'An error occurred while trying to change the password', type: 'error' });
			console.error(err);
		}
	}
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="text-4xl font-bold">Reset password</h1>
	<form action="#" onsubmit={handleFormSubmit} class="mt-6 w-full max-w-sm">
		<div class="mb-6">
			<Label for="password" class="mb-2">New password</Label>
			<Input
				type="password"
				id="password"
				placeholder="asjdhasjdasd"
				required
				bind:value={password}
			/>
		</div>
		<div class="mb-6">
			<Label for="password2" class="mb-2">Confirm new password</Label>
			<Input
				type="password"
				id="password2"
				placeholder="asjdhasjdasd"
				required
				bind:value={password2}
			/>
		</div>
		<Button type="submit" class="w-full">Change my password</Button>
	</form>
</div>
