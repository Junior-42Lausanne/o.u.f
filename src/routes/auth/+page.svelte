<script lang="ts">
	import { Input, Label, Helper, Button, Checkbox, A } from 'flowbite-svelte';
	import i18n from '$lib/i18n';
	import { addToast } from '$lib/toaster.svelte';

	const { data } = $props();
	const { supabase } = data;

	let email = $state('');
	let password = $state('');

	async function handleFormSubmit(event: Event) {
		event.preventDefault();

		try {
			const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (signInError) {
				addToast({ message: signInError.message, type: 'error' });
				return;
			}

			window.location.href = '/dashboard';
		} catch (err) {
			addToast({ message: $i18n.t('auth.error_sign_in'), type: 'error' });
			console.error(err);
		}
	}
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="text-4xl font-bold">{$i18n.t('auth.title')}</h1>
	<form action="#" onsubmit={handleFormSubmit} class="mt-6 w-full max-w-sm">
		<div class="mb-6">
			<Label for="email" class="mb-2">{$i18n.t('auth.email_label')}</Label>
			<Input
				type="email"
				id="email"
				placeholder={$i18n.t('auth.email_placeholder')}
				required
				bind:value={email}
			/>
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2">{$i18n.t('auth.password_label')}</Label>
			<Input type="password" id="password" placeholder="•••••••••" required bind:value={password} />
		</div>
		<Button type="submit" class="w-full">{$i18n.t('auth.login_button')}</Button>
		<A href="/auth/forgot-password" class="block text-center hover:underline"
			>{$i18n.t('auth.forgot_password_link')}</A
		>
		<A href="/auth/register" class="block text-center hover:underline"
			>{$i18n.t('auth.create_an_account_link')}</A
		>
	</form>
</div>

<svelte:head>
	<title>{$i18n.t('auth.tab_title')}</title>
</svelte:head>
