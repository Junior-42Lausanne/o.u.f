<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Input, Label, Helper, Button, Checkbox, A } from 'flowbite-svelte';
	import { z } from 'zod';

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
				email: z.string().email('Invalid email address'),
				password: z.string().min(8, 'Password must be at least 8 characters'),
				password2: z
					.string()
					.min(8)
					.refine((data) => data === password, {
						message: 'Passwords do not match'
					}),
				cgu: z
					.boolean()
					.refine((data) => data === true, {
						message: 'You must agree to the terms and conditions'
					}),
				first_name: z.string().min(2, 'First name must be at least 2 characters'),
				last_name: z.string().min(2, 'Last name must be at least 2 characters'),
				activity: z.string().min(2, 'Activity must be at least 2 characters'),
				work_link: z.string().url('Invalid URL').optional()
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
				errorMessage = 'An error occurred while trying to sign up';
				console.error(signUpError);
				return;
			}

			successMessage = 'You have successfully signed up, redirecting...';
			errorMessage = '';
			setTimeout(() => {
				window.location.href = '/';
			}, 1000);
		} catch (err) {
			errorMessage = 'An error occurred while trying to sign up';
			console.error(err);
		}
	}
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="text-4xl font-bold">Register</h1>
	<form action="#" onsubmit={handleFormSubmit} class="mt-6 w-full max-w-sm">
		{#if errorMessage}
			<p class="mb-4 text-red-500">{errorMessage}</p>
		{/if}
		{#if successMessage}
			<p class="mb-4 text-green-500">{successMessage}</p>
		{/if}
		<div class="mb-6">
			<Label for="first_name" class="mb-2">First name <span class="text-red-500">*</span></Label>
			<Input type="text" id="first_name" placeholder="John" required bind:value={first_name} />
		</div>
		<div class="mb-6">
			<Label for="last_name" class="mb-2">Last name <span class="text-red-500">*</span></Label>
			<Input type="text" id="last_name" placeholder="Doe" required bind:value={last_name} />
		</div>
		<div class="mb-6">
			<Label for="activity" class="mb-2">Activity <span class="text-red-500">*</span></Label>
			<Input type="text" id="activity" placeholder="" required bind:value={activity} />
		</div>
		<div class="mb-6">
			<Label for="work_link" class="mb-2">Work link (linkedin, website, ...)</Label>
			<Input type="text" id="work_link" placeholder="https://..." bind:value={work_link} />
		</div>
		<div class="mb-6">
			<Label for="email" class="mb-2">Email address <span class="text-red-500">*</span></Label>
			<Input
				type="email"
				id="email"
				placeholder="john.doe@company.com"
				required
				bind:value={email}
			/>
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2">Password <span class="text-red-500">*</span></Label>
			<Input class="placeholder:text-gray-400" type="password" id="password" placeholder="•••••••••" required bind:value={password} />
		</div>
		<div class="mb-6">
			<Label for="password" class="mb-2">Confirm password <span class="text-red-500">*</span></Label
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
			Join the <A href="#" class="text-primary-500 dark:text-primary-600 hover:underline">7 Billion Urbanists Network</A
			>
		</Checkbox>
		<Checkbox class="mb-2 space-x-1 rtl:space-x-reverse" required bind:checked={cgu}>
			I agree with the <A href="/cgu" class="text-primary-500 dark:text-primary-600 hover:underline"
				>terms and conditions</A
			> <span class="text-red-500">*</span>
		</Checkbox>
		<Button type="submit" class="bg-primary-500 w-full">Register</Button>
		<A href="/auth" class="text-primary-500 dark:text-primary-600 block text-center hover:underline"
			>Already have an account ?</A
		>
	</form>
</div>
