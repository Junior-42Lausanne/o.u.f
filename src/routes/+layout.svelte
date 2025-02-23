<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Progressbar, Toast } from 'flowbite-svelte';
	import { addToast, removeToast, toasts, typeToColor, type ToastObj } from '$lib/toaster.svelte';
	import {
		CheckCircleSolid,
		CloseCircleSolid,
		ExclamationCircleSolid
	} from 'flowbite-svelte-icons';
	import { slide } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	const toast_list = $derived($toasts);

	$inspect(toast_list);
</script>

{@render children()}

<div class="pointer-events-none absolute left-0 top-0 h-screen w-screen">
	{#each toast_list as toast}
		<Toast
			class="pointer-events-auto"
			on:close={() => removeToast(toast)}
			color={typeToColor(toast.type)}
			dismissable={toast.dismissable}
			position="bottom-right"
			transition={slide}
		>
			<svelte:fragment slot="icon">
				{#if toast.type == 'success'}<CheckCircleSolid class="h-6 w-6" />{/if}
				{#if toast.type == 'error'}<CloseCircleSolid class="h-6 w-6" />{/if}
				{#if toast.type == 'warning'}<ExclamationCircleSolid class="h-6 w-6" />{/if}
				{#if toast.type == 'info'}<ExclamationCircleSolid class="h-6 w-6" />{/if}
			</svelte:fragment>

			{toast.message}

			{#if toast.auto_dismiss}
				<Progressbar
					size="h-1"
					animate
					tweenDuration={1000}
					easing={linear}
					class="mt-2"
					color={typeToColor(toast.type)}
					progress={100 - (toast.timeout / toast.initial_timeout) * 100}
				/>
			{/if}
		</Toast>
	{/each}
</div>
