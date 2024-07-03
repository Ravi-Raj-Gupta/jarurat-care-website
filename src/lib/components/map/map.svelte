<script type="module" lang="ts">
	import mapbox, { type LngLatLike } from 'mapbox-gl';
	import { onMount } from 'svelte';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import Crosshair from '../svg/crosshair.svelte';
	import Heading from '../homepage/heading.svelte';
	import LogoImage from '../../../assets/images/logo-transparent.webp';

	const MarkerImage = 'https://i.ibb.co/JvxqXsV/logo-head.webp';

	let map: mapbox.Map;
	let hospitals: any[] = [];
	let mapContainer: HTMLDivElement;
	const { Map, NavigationControl, Marker } = mapbox;

	const accessToken =
		'pk.eyJ1IjoidGhpc2lzYWJkdXMiLCJhIjoiY2pqd2VkaWkzMWNncTNwbzYyN3VyZHg0YyJ9.xtByAUjci7tw_H6SuVkaQA';

	onMount(() => {
		const mobileZoom = 3.1;
		const desktopZoom = 4.5;

		map = new Map({
			accessToken: accessToken,
			container: mapContainer,
			center: [81.9629, 22.5937], // starting position [lng, lat]
			zoom: desktopZoom, // starting zoom
			minZoom: window.innerWidth <= 700 ? mobileZoom : desktopZoom,
			style: 'mapbox://styles/mapbox/light-v11',
			projection: { name: 'mercator' }
		});

		map.addControl(new NavigationControl());

		const handleResize = () => {
			if (window.innerWidth <= 700) {
				map.flyTo({ zoom: mobileZoom });
			} else {
				map.flyTo({ zoom: desktopZoom });
			}
		};

		handleResize();
		window.addEventListener('resize', () => handleResize);

		const locationSearchBoxEl = document.querySelector('#location-search-box');
		const searchSuggestionsContainer = document.querySelector('.map-search-suggestions');

		locationSearchBoxEl?.addEventListener(
			'input',
			debounce(async (ev: any) => {
				const value = ev.target.value;
				const resp = await getPlaceSuggestions(value);
				const suggestions = resp.suggestions;

				if (suggestions && suggestions.length && searchSuggestionsContainer) {
					searchSuggestionsContainer.innerHTML = '';

					suggestions.forEach((suggestion: any) => {
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
										essential: true
									});

									searchSuggestionsContainer.innerHTML = '';
								}
							}
						});
					});
				}
			})
		);

		const locationAutoDetectBtn = document.querySelector(`#location-locate-auto`);

		locationAutoDetectBtn?.addEventListener('click', () => {
			handleLocationAutoDetect();
		});

		async function handleLocationAutoDetect() {
			try {
				const resp: any = await getGeoCoords();
				const longLat: LngLatLike = [resp.coords.longitude, resp.coords.latitude];

				map.flyTo({
					zoom: 10,
					center: longLat,
					essential: true
				});
			} catch (err) {
				const permission = await navigator.permissions.query({ name: 'geolocation' });

				if (permission && permission.state === 'denied') {
					alert('Failed to get Coordinates. Please allow Location Access.');
				}
			}
		}

		function getGeoCoords() {
			return new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject);
			});
		}

		function debounce(func: Function, timeout = 500) {
			let timer: ReturnType<typeof setTimeout>;
			return (...args: any[]) => {
				clearTimeout(timer);
				timer = setTimeout(() => {
					func.apply(null, args);
				}, timeout);
			};
		}

		async function getPlaceSuggestions(query = '') {
			try {
				const raw = await fetch(
					`https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}&language=en&session_token=05dd455b-57f8-4e21-88d5-e986a3b0a79c&access_token=${accessToken}`
				);
				const json = await raw.json();

				return json;
			} catch (err) {
				console.error(err);
			}
		}

		async function retrievePlace(placeId = '') {
			try {
				const raw = await fetch(
					`https://api.mapbox.com/search/searchbox/v1/retrieve/${placeId}?session_token=05dd455b-57f8-4e21-88d5-e986a3b0a79c&access_token=${accessToken}`
				);
				const json = await raw.json();

				return json;
			} catch (err) {
				console.error(err);
			}
		}

		async function getHospitals() {
			const baseURL = `https://chat-backend-e7nr.onrender.com`;
			const response = await fetch(`${baseURL}/hospitals`);
			const hospitals = await response.json();
			return hospitals;
		}

		function genMarkerCard(opts: any) {
			const title = document.createElement('strong');
			const container = document.createElement('div');
			const button = document.createElement('button');
			const reviewContainer = document.createElement('div');
			const review = document.createElement('div');
			const totalReview = document.createElement('div');
			const closeButton = document.createElement('button');

			title.textContent = opts.name;
			title.classList.add('marker-card-title');

			button.innerHTML = /* `{{> svg/position }}` + */ ' Get Direction';
			button.classList.add('marker-card-button');
			button.addEventListener('click', () => {
				const url = `http://maps.google.com?q=${opts.latitude},${opts.longitude}`;
				window.open(url);
			});

			const ratingRounded = Math.round(opts.rating);

			review.textContent = '★'.repeat(ratingRounded);
			review.classList.add('marker-card-review');

			totalReview.textContent = '★'.repeat(5 - ratingRounded);
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

		getHospitals().then((items) => {
			hospitals = items;

			for (let i = 0; i < items.length; i++) {
				const el = document.createElement('div');
				const hospital = items[i];

				el.className = 'marker';
				el.title = hospital.name;
				el.style.background = `url('${MarkerImage}') #fff`;
				el.style.backgroundSize = `cover`;

				el.addEventListener('click', (ev) => {
					const markerCardEl = genMarkerCard(hospital);
					const markerCard = new Marker(markerCardEl)
						.setLngLat([hospital.longitude, hospital.latitude])
						.addTo(map);
				});

				const marker = new Marker(el).setLngLat([hospital.longitude, hospital.latitude]).addTo(map);
			}
		});
	});
</script>

<Heading title="Locate Cancer Hospitals Near You" subtitle="Finding Hope, One Location at a Time" />

<div class="map-wrapper" id="locate-hospitals">
	<div class="gh-inner" style="max-width: var(--max-width); margin: auto; padding: 0 1.5rem">
		<div class="map-location" style="max-width: var(--max-width); margin: auto;">
			<form class="my-2">
				<input
					type="text"
					placeholder="Search location..."
					id="location-search-box"
					class="border rounded-md"
				/>
				<button type="button" id="location-locate-auto" aria-label="Locate Automatically">
					<Crosshair className="w-[1rem] h-[1rem]" />
				</button>
				
			</form>

			<div class="map-search-suggestions"></div>
		</div>

		<div
			bind:this={mapContainer}
			style="width: 100%; max-width: var(--max-width); aspect-ratio: 1; margin: auto;position: relative;z-index: 0;"
		></div>
	</div>
</div>

<style>
	.map-wrapper {
		margin-top: 1rem;
		padding-top: 1rem;
		padding-bottom: 2rem;
		background-color: #f1f8fa;
	}

	.map-title {
		padding: 1rem;
		max-width: 100rem;
	}

	:global(.map-search-suggestions) {
		position: absolute;
		z-index: 10;
		background: white;
		box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.05);
	}

	:global(.search-suggestions-row) {
		cursor: pointer;
		padding: 0.5rem 1rem;
		border-bottom: 1px solid #f1f8fa;
	}

	:global(.search-suggestions-row:hover) {
		background: #d3d3d366;
	}

	:global(.search-suggestions-subtitle) {
		color: #aaa;
	}

	:global(.map-location form) {
		gap: 1rem;
		display: flex;
		align-items: stretch;
		padding-bottom: 1rem;
	}

	:global(.map-location form input),
	:global(.map-location form button) {
		outline: none;
		padding: 0.5rem 1rem;
	}

	:global(.map-location form button) {
		cursor: pointer;
		border: none;
		border-radius: 0.4rem;
		background-color: #92c7cf;
	}

	:global(#location-locate-auto svg) {
		width: 1.5em;
		aspect-ratio: 1;
	}

	:global(.marker) {
		background: url('../images/logo_head.webp') white;
		background-size: cover;
		background-position: center;
		width: 2em;
		aspect-ratio: 1;
		border-radius: 100%;
		cursor: pointer;
	}

	:global(.marker-card-container) {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		background: #f1f8fa;
		padding: 1rem;
		border-radius: 1rem;
		box-shadow:
			0.1px 1.4px 2.2px rgba(0, 0, 0, 0.02),
			0.3px 3.3px 5.3px rgba(0, 0, 0, 0.028),
			0.5px 6.1px 10px rgba(0, 0, 0, 0.035),
			0.9px 10.9px 17.9px rgba(0, 0, 0, 0.042),
			1.7px 20.5px 33.4px rgba(0, 0, 0, 0.05),
			4px 49px 80px rgba(0, 0, 0, 0.07);
	}

	:global(.marker-card-review-container) {
		display: flex;
		flex-wrap: no-wrap;
	}

	:global(.marker-card-review) {
		color: gold;
	}

	:global(.marker-card-total-review) {
		color: lightgray;
	}

	:global(.marker-card-button) {
		gap: 0.4rem;
		margin-top: 0.7rem;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		padding: 0.4rem 1rem;
		border-radius: 0.4rem;
		background-color: white;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-size: 0.9em;
		transition: 0.3s ease all;
		box-shadow:
			1.3px 1.6px 2.2px rgba(0, 0, 0, 0.014),
			3.2px 3.8px 5.3px rgba(0, 0, 0, 0.02),
			6px 7.1px 10px rgba(0, 0, 0, 0.025),
			10.7px 12.7px 17.9px rgba(0, 0, 0, 0.03),
			20.1px 23.8px 33.4px rgba(0, 0, 0, 0.036),
			48px 57px 80px rgba(0, 0, 0, 0.05);
	}

	:global(.marker-card-button:hover) {
		font-weight: bold;
		box-shadow:
			1.3px 1.6px 2.2px rgba(0, 0, 0, 0.031),
			3.2px 3.8px 5.3px rgba(0, 0, 0, 0.044),
			6px 7.1px 10px rgba(0, 0, 0, 0.055),
			10.7px 12.7px 17.9px rgba(0, 0, 0, 0.066),
			20.1px 23.8px 33.4px rgba(0, 0, 0, 0.079),
			48px 57px 80px rgba(0, 0, 0, 0.11);
	}

	:global(.marker-card-button svg) {
		width: 1.4em;
		aspect-ratio: 1;
	}

	:global(.marker-card-close-button) {
		border: none;
		width: 2rem;
		display: flex;
		aspect-ratio: 1;
		position: absolute;
		top: -0.5rem;
		right: -0.5rem;
		background: red;
		font-size: 0.8em;
		border-radius: 100%;
		justify-content: center;
		align-items: center;
		color: white;
		font-weight: bold;
		cursor: pointer;
	}
</style>
