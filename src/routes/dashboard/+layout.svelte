<script lang="ts">
	import { invalidate } from '$app/navigation';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';

	const { data, children } = $props();
	const { supabase, profile } = data;

	async function signOut() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('An error occurred while trying to sign out');
			return;
		}
		invalidate('supabase:auth');

		window.location.href = '/';
	}

	const menus: {name: string, href: string}[] = [
		{ name: 'Home', href: '/' },
	]
</script>

<div class="h-screen flex flex-col">
	<Navbar class="border-b border-gray-200">
		<NavBrand href="/">
			<img src="/logo.svg" class="h-12 sm:h-9" alt="Flowbite Logo" />
			<!-- <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span> -->
		</NavBrand>
		<div class="flex items-center md:order-2">
			<Avatar id="avatar-menu" alt="Profile picture" src={profile.avatar || undefined} class="hover:cursor-pointer" />
			<NavHamburger class="w-full md:w-auto md:order-1" />
		</div>
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownHeader>
				<span class="block text-sm">{profile.first_name} {profile.last_name}</span>
				<span class="block truncate text-sm font-medium">{profile.email}</span>
			</DropdownHeader>
			<DropdownItem href="/dashboard/settings">Settings</DropdownItem>
			<DropdownDivider />
			<DropdownItem onclick={signOut}>Sign out</DropdownItem>
		</Dropdown>
	</Navbar>

	{@render children()}
</div>