<script>
	export let icon;
	export let title;
	export let about;
</script>

<div class="text-white w-[18rem] h-[18rem]  bg-gradient-to-br from-[#0155BD80] to-[#065AC080] rounded-3xl p-6">
	<div class="flex justify-around items-center" >
        <div class="title font-extrabold" >{title}</div>
        <div class="icon" ><svelte:component this={icon} /></div>
    </div>
    <div class="pb-6">{about}</div>
</div>
