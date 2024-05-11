<script lang="ts">
	import mapbox from 'mapbox-gl';
	import { onMount } from 'svelte';
	import LogoImage from '../../../assets/images/logo-transparent.webp';

	export let map: mapbox.Map;
	export let lngLat: mapbox.LngLatLike;

	$: {
			console.log('marker', lngLat, map);
			const markerEl = document.createElement('div');
			const marker: mapbox.Marker = new mapbox.Marker({ element: markerEl });

			marker.setLngLat(lngLat).addTo(map);
			markerEl.style.background = `url('${LogoImage}') black`;
	}
</script>

<style>
	:global(.marker) {
		background-size: cover;
		background-position: center;
		width: 2em;
		aspect-ratio: 1;
		border-radius: 100%;
		cursor: pointer;
	}
</style>
