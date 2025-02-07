<script lang="ts">
	import Settings from './Settings.svelte';
	import Users from './Users.svelte';
	import Images from './Images.svelte';
	import i18n from '$lib/i18n';

	const { data } = $props();
	const { project, profile, supabase, home_image_exists, logo_exists } = data;

	let is_supperadmin = profile.is_admin;
	let is_project_admin =
		project.owner_id == profile.id ||
		project.users.some((u) => u.user_id == profile.id && u.is_admin);
	let can_edit = is_supperadmin || is_project_admin;
</script>

<div class="mx-auto w-full md:w-2/4">
	<Settings {supabase} {project} {can_edit} />

	<Users {supabase} {project} {is_project_admin} {is_supperadmin} {profile} />

	<Images {supabase} {project} {home_image_exists} {logo_exists} />
</div>
