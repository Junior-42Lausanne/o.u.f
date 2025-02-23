<script lang="ts">
	import { Input, Label, Helper, Button, Checkbox, A } from 'flowbite-svelte';
	import i18n from '$lib/i18n';
	import { addToast } from '$lib/toaster.svelte.js';

	const { data } = $props();
	const { supabase } = data;

	let email = $state('');

	async function handleFormSubmit(event: Event) {
		event.preventDefault();

		try {
			const { error: forgotPasswordError } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: window.location.origin + '/auth/reset-password'
			});

			if (forgotPasswordError) {
				addToast({ message: forgotPasswordError.message, type: 'error' });
				return;
			}

			addToast({ message: $i18n.t('auth.forgot-password.success_message'), type: 'success' });
		} catch (err) {
			addToast({ message: $i18n.t('auth.forgot-password.error_message'), type: 'error' });
			console.error(err);
		}
	}
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="text-4xl font-bold">{$i18n.t('auth.forgot-password.title')}</h1>
	<form action="#" onsubmit={handleFormSubmit} class="mt-6 w-full max-w-sm">
		<div class="mb-6">
			<Label for="email" class="mb-2">{$i18n.t('auth.forgot-password.email_label')}</Label>
			<Input
				type="email"
				id="email"
				placeholder={$i18n.t('auth.forgot-password.email_placeholder')}
				required
				bind:value={email}
			/>
		</div>
		<Button type="submit" class="w-full"
			>{$i18n.t('auth.forgot-password.recover_password_button')}</Button
		>
		<A href="/auth" class="block text-center hover:underline"
			>{$i18n.t('auth.forgot-password.login_page_link')}</A
		>
	</form>
</div>

<svelte:head>
	<title>{$i18n.t('auth.forgot-password.tab-title')}</title>
</svelte:head>
