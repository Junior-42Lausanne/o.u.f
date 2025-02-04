<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import type { Tables } from '$lib/supabase.js';
	import {
		Button,
		Input,
		Label,
		Modal,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toast
	} from 'flowbite-svelte';
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';

	const { data } = $props();
	const { translations: translationsSource, supabase, project, profile } = data;

	let loading = $state(false);
	const languages = ['en', 'fr'];
	let unsaved_changes = $state(false); // Prevent leaving page without saving
	let translation_modal = $state(false);
	let new_translation: Partial<Tables<'translations'>> = $state({ project_id: project.id });
	let is_supperadmin = profile.is_admin;
	let is_project_admin =
		project.owner_id == profile.id ||
		project.users.some((u) => u.user_id == profile.id && u.is_admin);

	let translationsMap = new SvelteMap<string, Tables<'translations'>>();

	onMount(async () => {
		translationsSource.forEach((t) => {
			if (translationsMap.has(t.key) && t.project_id == null) return;
			translationsMap.set(t.key, t);
		});
	});

	beforeNavigate(({ cancel }) => {
		if (unsaved_changes) {
			if (
				!confirm(
					'You have unsaved changes ! If you leave this page without saving all your changes will be lost.'
				)
			) {
				cancel();
			}
		}
	});

	async function save() {
		loading = true;

		const translations = Array.from(translationsMap.values());
		for (const translation of translations) {
			const { id, ...rest } = translation;
			let error;
			if (translation.id == -1)
				// We insert the translation
				({ error } = await supabase.from('translations').insert(rest)); // We update the translation
			else ({ error } = await supabase.from('translations').update(rest).eq('id', translation.id));

			if (error || !data) {
				alert('An error occured while saving the translations');
				console.error(error);
				loading = false;
				return;
			}
		}

		loading = false;
		unsaved_changes = false;
	}

	async function handleInput(e: Event & { currentTarget: HTMLDivElement }, key: string) {
		const translation = translationsMap.get(key);
		if (!translation) return;
		if (translation.project_id == null && !is_supperadmin) {
			translation.id = -1;
			translation.project_id = project.id;
		}

		unsaved_changes = true;
	}

	async function handleCreateTranslation() {
		if (new_translation.key === undefined || new_translation.key === '') {
			alert('Key is required');
			return;
		}

		const { id, key, ...rest } = new_translation;
		const { data, error } = await supabase
			.from('translations')
			.insert({
				key,
				...rest
			})
			.select()
			.single();
		if (error || !data) {
			alert('An error occured while creating the translation');
			console.error(error);
		} else {
			// Add the translation to the map
			translationsMap.set(data.key, data);
			translation_modal = false;
			new_translation = { project_id: project.id };
		}
	}
</script>

<Table>
	<TableHead>
		<TableHeadCell>Key</TableHeadCell>
		{#each languages as language}
			<TableHeadCell>{language}</TableHeadCell>
		{/each}
	</TableHead>
	<TableBody>
		{#each [...translationsMap] as [key, translation]}
			{@const editable = is_supperadmin || is_project_admin}
			<TableBodyRow>
				<TableBodyCell>{translation.key}</TableBodyCell>
				{#each languages as language}
					<TableBodyCell>
						{#if editable}
							<div
								contenteditable="true"
								oninput={(e) => handleInput(e, key)}
								data-language={language}
								class={editable ? 'border border-gray-200 dark:border-gray-700' : ''}
								bind:innerText={translation[language as 'fr' | 'en']}
							></div>
						{:else}
							{translation[language as 'fr' | 'en']}
						{/if}
					</TableBodyCell>
				{/each}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Button onclick={() => (translation_modal = true)}>Create a new entry</Button>

<Toast
	bind:toastStatus={unsaved_changes}
	dismissable={false}
	color="red"
	class="absolute bottom-0 right-0 m-4"
>
	<ExclamationCircleSolid slot="icon" class="h-6 w-6" />
	<span class="font-semibold text-gray-900 dark:text-white">Unsaved changes</span>
	<div class="mt-3">
		<div class="mb-2 text-sm font-normal">
			You have unsaved changes ! If you leave this page without saving all your changes will be
			lost.
		</div>
		<div class="">
			<Button size="xs" class="w-full" onclick={save}>
				{#if loading}
					<Spinner size="4" class="me-3" />
				{:else}
					Save
				{/if}
			</Button>
		</div>
	</div>
</Toast>

<Modal bind:open={translation_modal} title="Create a new translation entry">
	<form onsubmit={handleCreateTranslation}>
		<div class="mb-4">
			<Label for="key">Key</Label>
			<Input type="text" id="key" bind:value={new_translation.key} />
		</div>
		{#each languages as language}
			<div class="mb-4">
				<Label for={language}>{language}</Label>
				<Input type="text" id={language} bind:value={new_translation[language as 'fr' | 'en']} />
			</div>
		{/each}
		<Button type="submit">Create</Button>
	</form>
</Modal>
