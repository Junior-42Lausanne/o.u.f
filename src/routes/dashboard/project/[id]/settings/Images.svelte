<script lang="ts">
	import { addToast } from '$lib/toaster.svelte';
	import { Button, Fileupload, Helper, Label } from 'flowbite-svelte';

	const { project, supabase, home_image_exists, logo_exists } = $props();

	let home_image_file = $state<FileList>();
	let logo_file = $state<FileList>();

	async function handleImages(e: Event) {
		e.preventDefault();
		if (home_image_file) {
			const file = home_image_file[0];
			const { data, error } = await supabase.storage
				.from('projects')
				.upload(`${project.id}/home.png`, file, {
					upsert: true
				});
			if (error) {
				console.error('error', error);
				addToast({ message: 'Error uploading image', type: 'error' });
			}
		}
		if (logo_file) {
			const file = logo_file[0];
			const { data, error } = await supabase.storage
				.from('projects')
				.upload(`${project.id}/logo.png`, file, {
					upsert: true
				});
			if (error) {
				console.error('error', error);
				addToast({ message: 'Error uploading image', type: 'error' });
			}
		}

		location.reload();
	}
</script>

<div class="mb-6">
	<h2 class="text-center text-xl">Home page</h2>
	<form onsubmit={handleImages}>
		{#if home_image_exists}
			<img
				src={supabase.storage.from('projects').getPublicUrl(`${project.id}/home.png`).data
					.publicUrl}
				alt="Home background"
				class="mx-auto mb-2 h-20"
			/>
		{/if}
		<div class="mb-4">
			<Label for="home_image">Upload a home image</Label>
			<Fileupload id="home_image" bind:files={home_image_file} accept="image/png" />
			<Helper>PNG (Max 2Mb)</Helper>
		</div>
		{#if logo_exists}
			<img
				src={supabase.storage.from('projects').getPublicUrl(`${project.id}/logo.png`).data
					.publicUrl}
				alt="Logo"
				class="mx-auto mb-2 h-20"
			/>
		{/if}
		<div class="mb-4">
			<Label for="logo">Upload a logo</Label>
			<Fileupload id="logo" bind:files={logo_file} accept="image/png" />
			<Helper>PNG (Max 2Mb)</Helper>
		</div>
		<Button type="submit">Save</Button>
	</form>
</div>
