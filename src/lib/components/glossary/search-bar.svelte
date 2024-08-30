<script>
	import RightArrow from "$lib/svg/right-arrow.svelte";
import Search from "$lib/svg/search.svelte";
</script>

<!-- <div  class="relative h-[35rem] z-10 bg-gradient-to-b from-[#FEFFF8] via-[#F6EFFF] to-[#D6B7FF] flex flex-col items-center justify-center p-4 text-center">
    <div class=" absolute top-[196px]
    w-[783px] h-[127px] flex flex-col items-center gap-[10px] opacity-100">
        <h1 class="text-[56px] font-bold leading-[89.6px] text-center text-[#310F71]">
            Glossary of Cancer Terms
        </h1>
        <p class="text-[20px] font-medium leading-[27.32px] text-left">
            Find All You Need to Know About Cancer, Jarurat Care, and How We Can Support You.
        </p> -->
        <!-- New div with specified styles -->
        <!-- <div class=" relative w-[680px] mt-[40px] p-[40px] h-[144px] bg-[#E5D7F7] pt-[40px] gap-[10px] rounded-tl-[8px] rounded-bl-[8px] rounded-br-[0px] rounded-tr-[0px] flex  items-center justify-center mx-auto">
            <input type="text" placeholder="Search Your Query" class="w-[600px] h-[64px] px-[8px] py-[8px] rounded-tl-[6px] rounded-bl-[6px] rounded-br-[0px] rounded-tr-[0px] border border-gray-300">
            <p class=" absolute right-16" ><Search /></p>
        </div>
    </div>
</div> -->

<div class="md:h-[590px] h-[242px] relative   bg-gradient-to-b from-[#FEFFF8] via-[#F6EFFF] to-[#D6B7FF] flex flex-col items-center gap-[40px] ">
<div class="absolute top-20 left-20 flex gap-[8px]">
    <h1 class=" text-[20px] font-[400] z-30 text-[#0D2460] ">Home</h1>
   <p class="my-auto"> <RightArrow /></p>
    <h1 class=" text-[20px] font-[400] z-30 text-[#0155BD] ">FAQs</h1>
</div>
  <div class="md:mt-[197px] w-[222px] md:w-full mt-[62px]  max-w-[65rem] flex flex-col gap-[10px] text-center">
    <h1 class="md:text-[56px] sm:text-[28px] font-bold  text-[#310F71]">
      Glossary of Cancer Terms
    </h1>
<p class="text-[20px] text-[#24272A] font-medium hidden md:block"> 
      Find All You Need to Know About Cancer, Jarurat Care, and How We Can Support You.
    </p>
  </div>

  <div class="border-2 relative max-w-[65rem] md:w-[680px] w-full md:h-[144px] h-[84px] bg-[#E5D7F7] md:p-[40px] sm:p-[20px] rounded-[10px] flex items-center justify-center gap-[20px] mx-auto">
    <input 
        type="text" 
        placeholder="Search Your Query" 
        class="md:w-[600px] w-11/12 p-[8px] rounded-tl-[6px] rounded-bl-[6px] rounded-br-[0px] rounded-tr-[0px] border border-gray-300"
    >
    <p class="absolute right-16 top-1/2 transform -translate-y-1/2">
        <!-- Adjusted to vertically center the Search component -->
        <Search />
    </p>
</div>

</div>
