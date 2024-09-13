<script>
import CardBakgound from "$lib/svg/card-bakgound.svelte";
export let icon ;
export let title;
export let about;
</script>


<div>
    <div class="background relative max-w-[340px] ">
        <div class="w-72 h-96 "><CardBakgound/></div>
        
        <div class="icon w-32 bg-white rounded-full  left-[30%] top-[-60px] absolute   z-10 "><svelte:component this={icon} /></div>
        <div class="absolute top-32 w-72 ">
            <div class="title text-2xl font-bold  text-center mb-5">{title}</div>
            <div class="title text-sm text-center">{about}</div>
        </div>
    </div>
</div>

