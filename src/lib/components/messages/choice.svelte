<script lang="ts">
	
	type OnClick = () => void;
	export let onclick: undefined | OnClick;
</script>

<button
	on:click={() => {
		if (typeof onclick === 'function') onclick();
	}}
	class="self-end px-3 py-2 text-[0.9em] rounded-full bg-sky-100 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-colors duration-200 ease-in-out md:whitespace-nowrap"
>
	<slot />
</button>
