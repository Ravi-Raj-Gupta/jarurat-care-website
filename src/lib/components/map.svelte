<script type="module" lang="ts">
	import { Map } from "mapbox-gl";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css"

	import Crosshair from "./svg/crosshair.svelte";
const accessToken = 'pk.eyJ1IjoidGhpc2lzYWJkdXMiLCJhIjoiY2pqd2VkaWkzMWNncTNwbzYyN3VyZHg0YyJ9.xtByAUjci7tw_H6SuVkaQA';

let map;
let mapContainer;
let lng, lat, zoom;

lng = -71.224518;
lat = 42.213995;
zoom = 9;

  mapboxgl.accessToken = accessToken;

	const mobileZoom = 3.1;
	const desktopZoom = 4.5;

	const map = new Map({ 
		container: 'map', // container ID 
		center: [81.9629, 22.5937], // starting position [lng, lat] 
		zoom: desktopZoom, // starting zoom 
		minZoom: window.innerWidth <= 700 ? mobileZoom : desktopZoom,
		style: 'mapbox://styles/mapbox/light-v11',
	});

	map.addControl(new mapboxgl.NavigationControl());

	window.map = map;

	const handleResize = () => {
		if (window.innerWidth <= 700) {
			map.flyTo({ zoom: mobileZoom });
		} else {
			map.flyTo({ zoom: desktopZoom });
		}
	}

	handleResize();
	window.addEventListener('resize', () => handleResize);

	const locationSearchBoxEl = document.querySelector('#location-search-box');
	const searchSuggestionsContainer = document.querySelector('.map-search-suggestions');

	locationSearchBoxEl.addEventListener('input', debounce(async (ev) => {
		const value = ev.target.value;
		const resp = await getPlaceSuggestions(value);
		const suggestions = resp.suggestions;

		if (suggestions && suggestions.length) {
			searchSuggestionsContainer.innerHTML = "";

			suggestions.forEach(suggestion => {

				const container = document.createElement('div');
				const title = document.createElement('div');
				const subTitle = document.createElement('div');

				container.classList.add('search-suggestions-row');
				title.classList.add('search-suggestions-title');
				subTitle.classList.add('search-suggestions-subtitle');

				title.textContent = suggestion.name;
				subTitle.textContent = suggestion.place_formatted;

				container.appendChild(title);
				container.appendChild(subTitle);

				searchSuggestionsContainer.appendChild(container);

				container.addEventListener('click', async () => {
					const mboxId = suggestion.mapbox_id;
					const place = await retrievePlace(mboxId);
					const features = place.features;

					if (Array.isArray(features)) {
						const first = features.shift();

						if (first) {
							const coords = first.geometry.coordinates;

							map.flyTo({
								zoom: 10,
								center: coords,
								essential: true,
							});

							searchSuggestionsContainer.innerHTML = "";
						}
					}
				})
			});
		}
	}));

	const locationAutoDetectBtn = document.querySelector(`#location-locate-auto`);

	locationAutoDetectBtn?.addEventListener('click', () => {
		handleLocationAutoDetect();
	})

	async function handleLocationAutoDetect() {
		try {
			const resp = await getGeoCoords();
			const longLat = [resp.coords.longitude, resp.coords.latitude];

			map.flyTo({
				zoom: 10,
				center: longLat,
				essential: true,
			});
		} catch(err) {
			const permission = await navigator.permissions.query({ name: "geolocation" });

			if (permission && permission.state === 'denied') {
				alert("Failed to get Coordinates. Please allow Location Access.")
			}
		}
	}

	function getGeoCoords() {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(resolve, reject);
		})
	}

	function debounce(func, timeout = 500){
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => { func.apply(this, args); }, timeout);
		};
	}

	async function getPlaceSuggestions(query = "") {
		try {
			const raw = await fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}&language=en&session_token=05dd455b-57f8-4e21-88d5-e986a3b0a79c&access_token=${accessToken}`);
			const json = await raw.json();

			return json;
		} catch (err) {
			console.error(err);
		}
	}

	async function retrievePlace(placeId = "") {
		try {
			const raw = await fetch(`https://api.mapbox.com/search/searchbox/v1/retrieve/${placeId}?session_token=05dd455b-57f8-4e21-88d5-e986a3b0a79c&access_token=${accessToken}`);
			const json = await raw.json();

			return json;
		} catch (err) {
			console.error(err);
		}
	}

	async function getHospitals() {
		const baseURL = `https://chat-backend-e7nr.onrender.com`;
		{{!-- const baseURL = `http://localhost:3000`; --}}
		const response = await fetch(`${baseURL}/hospitals`);
		const hospitals = await response.json();
		return hospitals;
	}

	function genMarkerCard(opts) {
		console.log(opts);

		const title = document.createElement('strong');
		const container = document.createElement('div');
		const button = document.createElement('button');
		const reviewContainer = document.createElement('div');
		const review = document.createElement('div');
		const totalReview = document.createElement('div');
		const closeButton = document.createElement('button');

		title.textContent = opts.name;
		title.classList.add('marker-card-title');

		button.innerHTML = `{{> svg/position }}` + ' Get Direction';
		button.classList.add('marker-card-button');
		button.addEventListener('click', () => {
			const url = `http://maps.google.com?q=${opts.latitude},${opts.longitude}`;
			window.open(url);
		});

		const ratingRounded = Math.round(opts.rating);

		review.textContent = '★'.repeat(ratingRounded);
		review.classList.add('marker-card-review');

		totalReview.textContent = '★'.repeat(5 - (ratingRounded));
		totalReview.classList.add('marker-card-total-review');

		reviewContainer.appendChild(review);
		reviewContainer.appendChild(totalReview);
		reviewContainer.classList.add('marker-card-review-container');

		closeButton.textContent = 'X';
		closeButton.classList.add('marker-card-close-button');

		container.classList.add('marker-card-container');
		container.appendChild(closeButton);
		container.appendChild(title);
		ratingRounded && container.appendChild(reviewContainer);
		container.appendChild(button);

		closeButton.addEventListener('click', () => container.remove());

		return container;
	}

	getHospitals().then(hospitals => {
		for (let i = 0; i < hospitals.length; i++) {
			const el = document.createElement('div');
			const hospital = hospitals[i];

			el.className = 'marker';
			el.title = hospital.name;

			el.addEventListener('click', (ev) => {
				const markerCardEl = genMarkerCard(hospital);
				const markerCard = new mapboxgl.Marker(markerCardEl)
					.setLngLat([hospital.longitude, hospital.latitude])
					.addTo(map);
			});

			const marker = new mapboxgl.Marker(el)
				.setLngLat([hospital.longitude, hospital.latitude])
				.addTo(map);
		}
	});
</script>

<link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />

<svelte:head>
	<script src="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.js"></script>
</svelte:head>

<div class="map-wrapper">
	<div class="gh-inner map-title">
		<h2 class="section-heading">Finding Hope, One Location at a Time</h2>
		<p class="section-subheading">Locate Cancer Hospitals Near You</p>
	</div>

	<div class="gh-inner" style="max-width: 100rem; margin: auto; padding: 0 1rem">
		<div class="map-location">
			<form>
				<input type="text" placeholder="Search location..." id="location-search-box" />
				<button type="button" id="location-locate-auto">
					<Crosshair />
				</button>
			</form>

			<div class="map-search-suggestions"></div>
		</div>

		<div
			id="map"
			style="width: 100%; max-width: 110rem; aspect-ratio: 1; margin: auto;position: relative;z-index: 0;"
		></div>
	</div>
</div>
