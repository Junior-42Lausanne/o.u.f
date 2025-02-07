<script lang="ts">
	import { invalidate } from '$app/navigation';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider
	} from 'flowbite-svelte';
	import i18n from '$lib/i18n';

	const { data, children } = $props();
	const { supabase, profile } = data;

	async function signOut() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error($i18n.t('dashboard.layout.sign_out_error', { error }));
			return;
		}
		invalidate('supabase:auth');

		window.location.href = '/';
	}
</script>

<div class="flex h-screen flex-col">
	<Navbar class="border-b border-gray-200">
		<NavBrand href="/">
			<img src="/logo.svg" class="h-12 sm:h-9" alt="Flowbite Logo" />
			<!-- <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span> -->
		</NavBrand>
		<NavUl class="hidden md:flex">
			<NavLi>
				<a href={'/dashboard'} class="hover:text-gray-900 dark:hover:text-white">
					{$i18n.t('dashboard.layout.navbar_home_link')}
				</a>
			</NavLi>
		</NavUl>
		<div class="flex items-center md:order-3">
			<Avatar
				id="avatar-menu"
				alt="Profile picture"
				src={profile.avatar || undefined}
				class="hover:cursor-pointer"
			/>
			<NavHamburger class="w-full md:order-1 md:w-auto" />
		</div>
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownHeader>
				<span class="block text-sm">{profile.first_name} {profile.last_name}</span>
				<span class="block truncate text-sm font-medium">{profile.email}</span>
			</DropdownHeader>
			<DropdownItem href="/dashboard/settings"
				>{$i18n.t('dashboard.layout.navbar_settings_link')}</DropdownItem
			>
			<DropdownDivider />
			<DropdownItem onclick={signOut}
				>{$i18n.t('dashboard.layout.navbar_sign_out_link')}</DropdownItem
			>
		</Dropdown>
	</Navbar>

	<div class="m-8">
		{@render children()}
	</div>
</div>
