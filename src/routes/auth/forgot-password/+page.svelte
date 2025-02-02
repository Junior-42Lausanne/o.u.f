<script lang="ts">
	import { Input, Label, Helper, Button, Checkbox, A } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import i18n from '$lib/i18n';

	const { data } = $props();
	const { supabase } = data;

	let email = $state('');
	let errorMessage = $state('');
	let successMessage = $state('');

	async function handleFormSubmit(event: Event) {
		event.preventDefault();

		try {
			const { data: forgotPasswordData, error: forgotPasswordError } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: window.location.origin + '/auth/reset-password',
			});

			if (forgotPasswordError) {
				errorMessage = forgotPasswordError.message;
				return;
			}

			successMessage = $i18n.t('auth.forgot-password.success_message');
			errorMessage = '';
		} catch (err) {
			errorMessage = $i18n.t('auth.forgot-password.error_message');
			console.error(err);
		}
	}
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="text-4xl font-bold">{$i18n.t('auth.forgot-password.title')}</h1>
	<form action="#" onsubmit={handleFormSubmit} class="mt-6 w-full max-w-sm">
		{#if errorMessage}
			<p class="text-red-500 mb-4">{errorMessage}</p>
		{/if}
		{#if successMessage}
			<p class="text-green-500 mb-4">{successMessage}</p>
		{/if}
		<div class="mb-6">
			<Label for="email" class="mb-2">{$i18n.t('auth.forgot-password.email_label')}</Label>
			<Input type="email" id="email" placeholder={$i18n.t('auth.forgot-password.email_placeholder')} required bind:value={email} />
		</div>
		<Button type="submit" class="w-full">{$i18n.t('auth.forgot-password.recover_password_button')}</Button>
		<A href="/auth" class="hover:underline text-center block">{$i18n.t('auth.forgot-password.login_page_link')}</A>
	</form>
</div>

<svelte:head>
	<title>{$i18n.t('auth.forgot-password.tab-title')}</title>
</svelte:head>