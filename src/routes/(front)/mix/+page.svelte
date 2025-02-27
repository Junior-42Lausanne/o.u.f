<script>
	import ToolsStage from '$lib/easeljs/stages/ToolsStage';
	import { isBrowser } from '@supabase/ssr';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!isBrowser) return;
		const stage = new ToolsStage('test', 0);
		stage.init();
	});
</script>

<canvas id="test"></canvas>

<svelte:head>
	<script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>
</svelte:head>
