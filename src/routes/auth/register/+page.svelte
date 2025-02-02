<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Input, Label, Helper, Button, Checkbox, A } from 'flowbite-svelte';
	import { z } from 'zod';
  import i18n from '$lib/i18n';

	const { data } = $props();
	const { supabase } = data;

	let email = $state('');
	let password = $state('');
	let password2 = $state('');
	let first_name = $state('');
	let last_name = $state('');
	let activity = $state('');
	let work_link = $state<string>();
	let join_network = $state(true);
	let cgu = $state(false);

	let errorMessage = $state('');
	let successMessage = $state('');

	async function handleFormSubmit(event: Event) {
		event.preventDefault();

		const result = z
			.object({
				email: z.string().email($i18n.t('auth.register.error_email')),
				password: z.string().min(8, $i18n.t('auth.register.error_password_length')),
				password2: z
					.string()
					.min(8)
					.refine((data) => data === password, {
						message: $i18n.t('auth.register.error_password_match')
					}),
				cgu: z
					.boolean()
					.refine((data) => data === true, {
						message: $i18n.t('auth.register.error_cgu')
					}),
				first_name: z.string().min(2, $i18n.t('auth.register.error_first_name')),
				last_name: z.string().min(2, $i18n.t('auth.register.error_last_name')),
				activity: z.string().min(2, $i18n.t('auth.register.error_activity')),
				work_link: z.string().url($i18n.t('auth.register.error_invalid_worklink')).optional()
			})
			.safeParse({ email, password, password2, cgu, first_name, last_name, activity, work_link });

		if (!result.success) {
			errorMessage = result.error.issues[0].message;
			return;
		}

		try {
			const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						first_name,
						last_name,
						activity,
						work_link,
						join_network
					}
				}
			});

			if (signUpError) {
				errorMessage = $i18n.t('auth.register.error_sign_up');
				console.error(signUpError);
				return;
			}

			successMessage = $i18n.t('auth.register.success_sign_up');
			errorMessage = '';
			setTimeout(() => {
				window.location.href = '/';
			}, 1000);
		} catch (err) {
			errorMessage = $i18n.t('auth.register.error_sign_up');
			console.error(err);
		}
	}
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="text-4xl font-bold">{$i18n.t('auth.register.title')}</h1>
	<form action="#" onsubmit={handleFormSubmit} class="mt-6 w-full max-w-sm">
		{#if errorMessage}
			<p class="mb-4 text-red-500">{errorMessage}</p>
		{/if}
		{#if successMessage}
			<p class="mb-4 text-green-500">{successMessage}</p>
		{/if}
		<div class="mb-6">
			<Label for="first_name" class="mb-2">{$i18n.t('auth.register.first_name_label')} <span class="text-red-500">*</span></Label>
			<Input type="text" id="first_name" placeholder={$i18n.t('auth.register.first_name_placeholder')} required bind:value={first_name} />
		</div>
		<div class="mb-6">
			<Label for="last_name" class="mb-2">{$i18n.t('auth.register.last_name_label')} <span class="text-red-500">*</span></Label>
			<Input type="text" id="last_name" placeholder={$i18n.t('auth.register.last_name_placeholder')} required bind:value={last_name} />
		</div>
		<div class="mb-6">
			<Label for="activity" class="mb-2">{$i18n.t('auth.register.activity_label')} <span class="text-red-500">*</span></Label>
			<Input type="text" id="activity" placeholder={$i18n.t('auth.register.activity_placeholder')} required bind:value={activity} />
		</div>
		<div class="mb-6">
			<Label for="work_link" class="mb-2">{$i18n.t('auth.register.work_link_label')}</Label>
			<Input type="text" id="work_link" placeholder={$i18n.t('auth.register.work_link_placeholder')} bind:value={work_link} />
		</div>
		<div class="mb-6">
			<Label for="email" class="mb-2">{$i18n.t('auth.register.email_label')} <span class="text-red-500">*</span></Label>
			<Input
				type="email"
				id="email"
				placeholder={$i18n.t('auth.register.email_placeholder')}
				required
				bind:value={email}
			/>
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2">{$i18n.t('auth.register.password_label')} <span class="text-red-500">*</span></Label>
			<Input class="placeholder:text-gray-400" type="password" id="password" placeholder="•••••••••" required bind:value={password} />
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2">{$i18n.t('auth.register.confirm_password_label')} <span class="text-red-500">*</span></Label
			>
			<Input
				class="placeholder:text-gray-400"
				type="password"
				id="password2"
				placeholder="•••••••••"
				required
				bind:value={password2}
			/>
		</div>
		<Checkbox class="mb-6 space-x-1 rtl:space-x-reverse" required bind:checked={join_network}>
			{$i18n.t('auth.register.join_7_billion_urbanists_network')} <A href="#" class="hover:underline">7 Billion Urbanists Network</A
			>
		</Checkbox>
		<Checkbox class="mb-2 space-x-1 rtl:space-x-reverse" required bind:checked={cgu}>
			{$i18n.t('auth.register.agree_with_cgu')}<A href="/cgu" class="hover:underline"
				>{$i18n.t('auth.register.agree_with_cgu_link')}</A
			> <span class="text-red-500">*</span>
		</Checkbox>
		<Button type="submit" class="w-full">{$i18n.t('auth.register.register_button')}</Button>
		<A href="/auth" class="block text-center hover:underline"
			>{$i18n.t('auth.register.already_have_account_link')}</A
		>
	</form>
</div>

<svelte:head>
	<title>{$i18n.t('auth.register.tab_title')}</title>
</svelte:head>