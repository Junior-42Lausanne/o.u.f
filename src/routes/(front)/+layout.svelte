<script lang="ts">
	import { page } from '$app/state';
	let { children } = $props();
	import i18n from '$lib/i18n';
	import { languages } from '$lib/translation';
	import { onMount } from 'svelte';

	const pathname = $derived(page.url.pathname);
	let lang_selector_open = $state(false);

	function handleClickOutside(event: MouseEvent) {
		// if target id is not lang_selector, close lang_selector
		if (!(event.target as HTMLElement).closest('#lang_selector')) {
			lang_selector_open = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	const current_lang = $derived($i18n.resolvedLanguage);
</script>

<header
	class="fixed top-0 z-50 w-full min-w-[800px] bg-white text-center shadow-[0_0_20px_0_rgba(0,0,0,0.20)]"
>
	<nav class="flex min-h-[52px] flex-row items-center justify-center">
		<a
			class="absolute left-[15px] flex items-center {pathname == '/' ? 'opacity-70' : 'opacity-30'}"
			href="/"
		>
			<img src="/logo.svg" alt="Unlimited cities logo" />
			<span class="mx-[5px] inline-block bg-black p-[2px] italic text-white">BETA</span>
		</a>
		<ul>
			<li class="inline-block justify-center">
				<a
					href="/mix"
					class="inline-block w-36 justify-center border-gray-800 py-3 text-center text-2xl text-gray-800 {pathname ==
					'/mix'
						? 'border-b-4 font-bold'
						: 'font-extralight'}"
				>
					Mix
				</a>
			</li>
			<li class="inline-block justify-center">
				<a
					href="/map"
					class="inline-block w-36 justify-center border-gray-800 py-3 text-center text-2xl text-gray-800 {pathname ==
					'/map'
						? 'border-b-4 font-bold'
						: 'font-extralight'}"
				>
					Carte
				</a>
			</li>
			<li class="inline-block justify-center">
				<a
					href="/gallery"
					class="inline-block w-36 justify-center border-gray-800 py-3 text-center text-2xl text-gray-800 {pathname ==
					'/gallery'
						? 'border-b-4 font-bold'
						: 'font-extralight'}"
				>
					Galerie
				</a>
			</li>
		</ul>
		<div class="absolute right-0 text-left text-gray-800">
			{#if current_lang}
				<button
					class="cursor-pointer px-2 text-base"
					id="lang_selector"
					onclick={() => (lang_selector_open = !lang_selector_open)}
				>
					<span class="">
						<img
							src="/flags/{$i18n.language}.svg"
							alt={current_lang.toUpperCase()}
							class="inline h-4"
						/>
						<span>{$i18n.t(`global.lang.${current_lang}`)} ▾</span>
					</span>
				</button>
			{/if}
			<div
				class="absolute z-[999] mt-2 max-h-[160px] overflow-auto rounded border border-gray-300 bg-white py-2"
				hidden={!lang_selector_open}
			>
				{#each languages as lang}
					<button
						onclick={() => {
							$i18n.changeLanguage(lang);
							lang_selector_open = false;
						}}
						class="my-1 cursor-pointer whitespace-nowrap pb-[3px] pl-2 pr-[20px] hover:bg-gray-200"
					>
						<span class="">
							<img src="/flags/{lang}.svg" alt={lang.toUpperCase()} class="inline h-4" />
							<span>{$i18n.t(`global.lang.${lang}`)}</span>
						</span>
					</button>
				{/each}
			</div>
		</div>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer
	class="fixed bottom-0 z-50 flex h-[35px] w-screen items-center justify-between bg-footer text-sm text-white"
>
	<div class="px-4">Unlimited Cities distributed by Open Urbanism Foundation</div>
	<div class="ml-auto px-4">New software features developed for the Interlace project</div>
</footer>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>
