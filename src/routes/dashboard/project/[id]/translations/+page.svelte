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

	const { data } = $props();
	const { translations: translationsSource, supabase, project, profile } = data;

	let loading = $state(false);
	const languages = ['en', 'fr'];
	let changes: Partial<Tables<'translations'>>[] = [];
	let unsaved_changes = $state(false); // Prevent leaving page without saving
	let translation_modal = $state(false);
	let new_translation: Partial<Tables<'translations'>> = $state({ project_id: project.id });
	let is_supperadmin = profile.is_admin;
	let translations = $state([...translationsSource]);
	let is_project_admin =
		project.owner_id == profile.id ||
		project.users.some((u) => u.user_id == profile.id && u.is_admin);

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

		// TODO: Change to batch update and remove dupplicates from changes;
		for (const change of changes) {
			const { id, ...rest } = change;
			if (id) {
				const { error } = await supabase
					.from('translations')
					.update(rest)
					.eq('id', id)
					.select();
				if (error) {
					alert('An error occured while saving changes');
					console.error(error);
					break;
				}
			} else {
				const { data, error } = await supabase
					.from('translations')
					.insert(rest)
					.select();
				if (error) {
					alert('An error occured while saving changes');
					console.error(error);
					break;
				}
			}
		}
		changes = [];

		loading = false;
		unsaved_changes = false;
	}

	async function handleInput(e: Event & { currentTarget: HTMLDivElement }, trans_index: number) {
		const translation = translations[trans_index];
		const language = e.currentTarget.dataset.language!;
		translation[language as 'fr' | 'en'] = e.currentTarget.innerText;

		changes = [...changes.filter((c) => c.id != translation.id), translation];
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
			// location.reload();
			translations = [...translations, data];
			new_translation = { project_id: project.id };
			translation_modal = false;
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
		{#each translations as translation, i}
			{@const editable = is_supperadmin || is_project_admin}
			<TableBodyRow>
				<TableBodyCell>{translation.key}</TableBodyCell>
				{#each languages as language}
					<TableBodyCell>
						{#if editable}
							<div
								contenteditable="true"
								oninput={(e) => handleInput(e, i)}
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
