<script lang="ts">
	import { Input, Label, Helper, Button, Checkbox, A } from 'flowbite-svelte';

	const { data } = $props();
	const { supabase } = data;

	let email = $state('');
	let password = $state('');
	let errorMessage = $state('');
	let successMessage = $state('');

	async function handleFormSubmit(event: Event) {
		event.preventDefault();

		try {
			const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (signInError) {
				errorMessage = signInError.message;
				return;
			}

			successMessage = 'You have successfully signed in, redirecting...';
			setTimeout(() => {
				window.location.href = '/dashboard';
			}, 1000);
		} catch (err) {
			errorMessage = 'An error occurred while trying to sign in';
			console.error(err);
		}
	}
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="text-4xl font-bold">Login</h1>
	<form action="#" onsubmit={handleFormSubmit} class="mt-6 w-full max-w-sm">
		{#if errorMessage}
			<p class="text-red-500 mb-4">{errorMessage}</p>
		{/if}
		{#if successMessage}
			<p class="text-green-500 mb-4">{successMessage}</p>
		{/if}
		<div class="mb-6">
			<Label for="email" class="mb-2">Email address</Label>
			<Input type="email" id="email" placeholder="john.doe@company.com" required bind:value={email} />
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2">Password</Label>
			<Input type="password" id="password" placeholder="•••••••••" required bind:value={password} />
		</div>
		<Button type="submit" class="w-full">Login</Button>
		<A href="/forgot-password" class="hover:underline text-center block">Forgot password?</A>
		<A href="/register" class="hover:underline text-center block">Create an account</A>
	</form>
</div>