<script lang="ts">
	import P5 from 'p5-svelte';
	import type p5 from 'p5';
	import { isBrowser } from '@supabase/ssr';

	type Object = {
		id: number;
		name: string;
		src: string;
	};

	type SketchObject = {
		obj: Object;
		position: { x: number; y: number };
		width: number;
		height: number;
		image?: p5.Image;
	};

	let objects = Array.from({ length: 20 }, (_, i) => {
		return { id: i, name: `Object ${i}`, src: 'https://placehold.co/600x400' };
	});

	let sketch_objects = $state<SketchObject[]>([]);

	const sketch = (p: p5) => {
		p.setup = () => {
			p.createCanvas(820, 620);
		};

		p.draw = () => {
			p.background(0);
			p.translate(p.width / 2, p.height / 2);

			sketch_objects.forEach((obj) => {
				if (!obj.image) {
					obj.image = p.loadImage(obj.obj.src);
				}
				p.image(
					obj.image,
					obj.position.x,
					obj.position.y,
					obj.image.width * obj.width,
					obj.image.height * obj.height
				);
			});
		};
	};
</script>

{#if isBrowser()}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<P5 {sketch} />
		<div class="flex w-full flex-row gap-1 overflow-x-auto">
			{#each objects as obj}
				<button
					onclick={() =>
						(sketch_objects = [
							...sketch_objects,
							{ obj, position: { x: 0, y: 0 }, width: 1, height: 1 }
						])}
					class="shrink-0"
				>
					<!-- <h2>{obj.name}</h2> -->
					<img src={obj.src} alt={obj.name} class="h-20" />
				</button>
			{/each}
		</div>
	</div>
{/if}
