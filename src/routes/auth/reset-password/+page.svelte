<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Input, Label, Helper, Button, Checkbox, A } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	const { data } = $props();
	const { supabase } = data;

	let password = $state('');
	let password2 = $state('');
	let errorMessage = $state('');
	let successMessage = $state('');

	async function handleFormSubmit(event: Event) {
		event.preventDefault();

		try {
			if (password != password2) {
				errorMessage = 'Passwords do not match';
			}
			const {data, error} = await supabase.auth.updateUser({
				password
			});

			if (error) {
				errorMessage = 'An error occurred while trying to change the password';
				console.error(error);
				return;
			}

			await supabase.auth.signOut();
			invalidate('supabase:auth');

			successMessage = 'Your password has been changed successfully, you can now login with your new password';
			errorMessage = '';
			setTimeout(() => {
				window.location.href = '/auth';
			}, 2000);
		} catch (err) {
			errorMessage = 'An error occurred while trying to change the password';
			console.error(err);
		}
	}
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="text-4xl font-bold">Reset password</h1>
	<form action="#" onsubmit={handleFormSubmit} class="mt-6 w-full max-w-sm">
		{#if errorMessage}
			<p class="text-red-500 mb-4">{errorMessage}</p>
		{/if}
		{#if successMessage}
			<p class="text-green-500 mb-4">{successMessage}</p>
		{/if}
		<div class="mb-6">
			<Label for="password" class="mb-2">New password</Label>
			<Input type="password" id="password" placeholder="asjdhasjdasd" required bind:value={password} />
		</div>
		<div class="mb-6">
			<Label for="password2" class="mb-2">Confirm new password</Label>
			<Input type="password" id="password2" placeholder="asjdhasjdasd" required bind:value={password2} />
		</div>
		<Button type="submit" class="w-full">Change my password</Button>
	</form>
</div>