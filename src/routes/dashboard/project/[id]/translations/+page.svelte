<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import type { Tables } from '$lib/supabase.js';
	import { generateTranslationsMap, languages } from '$lib/translation.js';
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
	import i18n from '$lib/i18n';
	import { addToast } from '$lib/toaster.svelte.js';

	const { data } = $props();
	const { translations: translationsSource, supabase, project, profile } = data;

	let loading = $state(false);
	let unsaved_changes = $state(false); // Prevent leaving page without saving
	let translation_modal = $state(false);

	let new_translation: Partial<Tables<'translations'>> = $state({ project_id: project.id });
	let translationsMap = generateTranslationsMap(translationsSource); // Is reactive since it's a SvelteMap

	let is_supperadmin = profile.is_admin;
	let is_project_admin =
		project.owner_id == profile.id ||
		project.users.some((u) => u.user_id == profile.id && u.is_admin);

	beforeNavigate(({ cancel }) => {
		if (unsaved_changes) {
			if (!confirm($i18n.t('dashboard.project.[id].translations.unsaved_changes_confirm'))) {
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
				({ error } = await supabase.from('translations').insert(rest)); // We update the translation
			else ({ error } = await supabase.from('translations').update(rest).eq('id', translation.id));

			if (error || !data) {
				addToast({
					message: $i18n.t('dashboard.project.[id].translations.error_saving'),
					type: 'error'
				});
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
			addToast({
				message: $i18n.t('dashboard.project.[id].translations.error_key_required'),
				type: 'error'
			});
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
			addToast({
				message: $i18n.t('dashboard.project.[id].translations.error_creating'),
				type: 'error'
			});
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
		<TableHeadCell>{$i18n.t('dashboard.project.[id].translations.key_column')}</TableHeadCell>
		{#each project.languages as language}
			<TableHeadCell>{$i18n.t(`global.lang.${language}`)}</TableHeadCell>
		{/each}
	</TableHead>
	<TableBody>
		{#each [...translationsMap] as [key, translation]}
			{@const editable = is_supperadmin || is_project_admin}
			<TableBodyRow>
				<TableBodyCell>{translation.key}</TableBodyCell>
				{#each project.languages as language}
					{@const lang = language as (typeof languages)[number]}
					<TableBodyCell>
						{#if editable}
							<div
								contenteditable="true"
								oninput={(e) => handleInput(e, key)}
								data-language={language}
								class={editable ? 'border border-gray-200 dark:border-gray-700' : ''}
								bind:innerText={translation[lang]}
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

<Button onclick={() => (translation_modal = true)}
	>{$i18n.t('dashboard.project.[id].translations.create_new_button')}</Button
>

<Toast
	bind:toastStatus={unsaved_changes}
	dismissable={false}
	color="red"
	class="absolute bottom-0 right-0 m-4"
>
	<ExclamationCircleSolid slot="icon" class="h-6 w-6" />
	<span class="font-semibold text-gray-900 dark:text-white"
		>{$i18n.t('dashboard.project.[id].translations.unsaved_changed_toast_title')}</span
	>
	<div class="mt-3">
		<div class="mb-2 text-sm font-normal">
			{$i18n.t('dashboard.project.[id].translations.unsaved_changed_toast_description')}
		</div>
		<div class="">
			<Button size="xs" class="w-full" onclick={save}>
				{#if loading}
					<Spinner size="4" class="me-3" />
				{:else}
					{$i18n.t('dashboard.project.[id].translations.unsaved_changed_toast_button')}
				{/if}
			</Button>
		</div>
	</div>
</Toast>

<Modal
	bind:open={translation_modal}
	title={$i18n.t('dashboard.project.[id].translations.create_new_modal_title')}
>
	<form onsubmit={handleCreateTranslation}>
		<div class="mb-4">
			<Label for="key">{$i18n.t('dashboard.project.[id].translations.key_column')}</Label>
			<Input type="text" id="key" bind:value={new_translation.key} />
		</div>
		{#each project.languages as language}
			<div class="mb-4">
				<Label for={language}>{$i18n.t(`global.lang.${language}`)}</Label>
				<Input
					type="text"
					id={language}
					bind:value={new_translation[language as (typeof languages)[number]]}
				/>
			</div>
		{/each}
		<Button type="submit"
			>{$i18n.t(`dashboard.project.[id].translations.create_new_modal_button`)}</Button
		>
	</form>
</Modal>

<svelte:head>
	<title>{$i18n.t(`dashboard.project.[id].translations.tab_title`)}</title>
</svelte:head>
