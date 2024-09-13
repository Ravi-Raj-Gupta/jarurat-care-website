<script>
export let image ;
export let name;
export let about;
</script>
<div class=" w-[280px]  bg-red-500">
    <div class="img">
    <img class="w-[280px] h-[330px] rounded-t-2xl" src={image} alt="prinka">
    </div>
    <div class="about text-center py-5 bg-white rounded-b-2xl">
        <div class="name text-[#0D2460] font-bold">{name}</div>
        <div class="text-primaryBlue text-sm">{about}</div>
    </div>
</div>