<script lang="ts">
	import i18n from '$lib/i18n';
	import { addToast } from '$lib/toaster.svelte';
	import { languages } from '$lib/translation';
	import { Button, Checkbox, Input, Label, MultiSelect, Spinner } from 'flowbite-svelte';

	const { project, can_edit, supabase } = $props();

	let project_changed = $state(false);
	let project_saving = $state(false);
	let project_langs = $state(project.languages || []);

	async function handleProjectSave() {
		project_saving = true;
		const { id, name, url_prefix, restricted_premix_mode, ...rest } = project;
		const { data, error } = await supabase
			.from('projects')
			.update({ name, url_prefix, restricted_premix_mode, languages: project_langs })
			.eq('id', id);
		if (error) {
			console.error('error', error);
			addToast({ message: 'Error saving project', type: 'error' });
		} else {
			project_changed = false;
		}
		project_saving = false;
	}
</script>

<div class="mb-6">
	<h2 class="mb-6 text-center text-xl">Project settings</h2>

	<form onsubmit={handleProjectSave} class="grid-cols-2 gap-4 md:grid">
		<div class="mb-4">
			<Label for="project_name">Project name</Label>
			<Input
				disabled={!can_edit || project_saving}
				type="text"
				id="project_name"
				placeholder="My super project"
				bind:value={project.name}
				oninput={() => (project_changed = true)}
			/>
		</div>
		<div class="mb-4">
			<Label for="project_url_prefix">Project URL Prefix</Label>
			<Input
				disabled={!can_edit || project_saving}
				type="text"
				id="project_url_prefix"
				placeholder="super_prefix"
				bind:value={project.url_prefix}
				oninput={() => (project_changed = true)}
			/>
		</div>
		<div class="mb-4">
			<Label for="restricted_premix_mode">Restricted premix mode</Label>
			<Checkbox
				bind:checked={project.restricted_premix_mode}
				oninput={() => (project_changed = true)}
			/>
		</div>
		<div class="mb-4">
			<Label for="languages">Project languages</Label>
			<MultiSelect
				id="languages"
				bind:value={project_langs}
				on:click={() => (project_changed = true)}
				items={languages.map((lang) => ({ value: lang, name: $i18n.t(`global.lang.${lang}`) }))}
			/>
		</div>
		<Button disabled={!can_edit || !project_changed} type="submit" class="md:col-span-2">
			{#if project_saving}
				<Spinner class="h-6 w-6" />
			{:else}
				Save
			{/if}
		</Button>
	</form>
</div>
