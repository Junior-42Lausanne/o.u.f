<script lang="ts">
	import { page } from '$app/state';
	let { children } = $props();

	const pathname = $derived(page.url.pathname);
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
			<div class="cursor-pointer px-2 text-base">
				<span class="">
					<img src="/flags/es.svg" alt="ES flag" class="inline h-4" />
					<span>Espagnol ▾</span>
					<span></span>
				</span>
			</div>
		</div>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer
	class="bg-footer fixed bottom-0 z-50 flex h-[35px] w-screen items-center justify-between text-sm text-white"
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
