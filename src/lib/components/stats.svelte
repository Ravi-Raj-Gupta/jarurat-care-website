<!-- <script lang="ts">
	import mapbox from 'mapbox-gl';
	import { onMount } from 'svelte';

	let map: mapbox.Map;
	let mapContainer: HTMLDivElement;

	const mobileZoom = 3.1;
	const desktopZoom = 1.2;
	const accessToken = `pk.eyJ1IjoidGhpc2lzYWJkdXMiLCJhIjoiY2pqd2VkaWkzMWNncTNwbzYyN3VyZHg0YyJ9.xtByAUjci7tw_H6SuVkaQA`;

	onMount(() => {
		map = new mapbox.Map({
			accessToken: accessToken,
			container: mapContainer,
			center: [81.9629, 22.5937], // starting position [lng, lat]
			zoom: desktopZoom, // starting zoom
			minZoom: window.innerWidth <= 700 ? mobileZoom : desktopZoom,
			style: 'mapbox://styles/thisisabdus/clw299cbt01av01pcfgy20s0m',
			projection: { name: 'mercator' }
		});
	});
</script>

<div bind:this={mapContainer}  class="w-full my-[3rem] max-w-[70rem] mx-auto aspect-video rounded-md"/> -->
