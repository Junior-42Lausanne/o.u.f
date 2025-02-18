<script>
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';
</script>

<div
	class="relative flex h-screen min-h-[600px] w-screen flex-col items-center justify-center bg-cover bg-center text-center"
	style="background-image: url({PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/1/home.png)"
>
	<h1 class="p-[10px] text-[2.6rem] text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.50)]">
		Unlimited Cities para Interlace
	</h1>
	<h2
		class="mx-auto max-w-[400px] p-[10px] pb-5 text-[1.4rem] font-extralight text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.50)]"
	>
		Co-diseñar transformaciones urbanas con soluciones basadas en la naturaleza
	</h2>
	<p
		class="mx-auto max-w-[400px] pb-[20px] text-justify text-[0.9rem] text-white [line-height:1.4rem]"
	>
		<span
			>INTERLACE es un proyecto de cooperación internacional cuyo objetivo es potenciar la
			restauración de los ecosistemas urbanos en la Unión Europea y en América Latina. Desarrolla
			soluciones para restaurar, rehabilitar y (re)conectar espacios de naturaleza urbana que se
			experimentan en 6 ciudades en ambas regiones. INTERLACE promueve el marco
			"Naturaleza-Lugares-Personas", haciendo hincapié en la conectividad no sólo entre los
			ecosistemas, sino también entre dinámicas naturales y sociales.
			<br /><br />
			<a class="underline" href="https://www.interlace-project.eu/es"
				>https://www.interlace-project.eu/es</a
			>
		</span>
	</p>
	<br />
	<a href="#description" class="">
		<img src="/arrow-bottom.svg" alt="" class="animate-pulse" />
	</a>
	<div
		class="absolute bottom-[45px] flex w-full max-w-[1024px] flex-wrap items-center justify-center p-[10px]"
	>
		<div class="flex flex-wrap items-center justify-center p-[10px]">
			<img class="max-h-[45px] px-2" src="/yes.jpg" alt="" />
			<img class="max-h-[45px] px-2" src="/interlace.jpg" alt="" />
			<img class="max-h-[45px] px-2" src="/europe-flag.png" alt="" />
		</div>
	</div>
</div>
<div id="description"></div>
<div></div>
