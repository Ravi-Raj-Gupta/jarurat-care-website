<script>
import RightArrow from "$lib/svg/right-arrow.svelte";
import Search from "$lib/svg/search.svelte";
let title ="Glossary of Cancer Terms"
let des=" Find All You Need to Know About Cancer, Jarurat Care, and How We Can Support You."
let home="Home"
let faq="FAQs"
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

<div class=" relative md:py-16   bg-gradient-to-b from-[#FEFFF8] via-[#F6EFFF] to-[#D6B7FF] flex flex-col items-center gap-[2.5rem] ">
<div class="absolute top-20 left-20 md:flex hidden gap-[0.5rem]">
    <h1 class=" text-[1.25rem] font-[400] z-30 text-[#0D2460] ">{home}</h1>
   <p class="my-auto"> <RightArrow /></p>
    <h1 class=" text-[1.25rem] font-[400] z-30 text-[#0155BD] ">{faq}</h1>
</div>
  <div class="  mt-[5rem]  max-w-[65rem] flex flex-col gap-[0.5rem] text-center">
    <h1 class="md:text-[3.5rem] mt-8 md:mt-0 sm:text-[1.75rem] font-bold  text-[#310F71]">
     {title}
    </h1>
<p class="text-[1.25rem] text-[#24272A] font-medium hidden md:block"> 
     {des}
    </p>
  </div>

  <div class="border-2 relative max-w-[35rem] w-full  bg-[#E5D7F7] p-[2rem]  rounded-[10px] flex items-center justify-center gap-[20px] mx-auto">
    <input 
        type="text" 
        placeholder="Search Your Query" 
        class=" w-11/12 p-[1rem] rounded-tl-[6px] rounded-bl-[6px] rounded-br-[0px] rounded-tr-[0px] border border-gray-300"
    >
    <p class="absolute right-[15%] top-1/2 transform -translate-y-1/2">
        <!-- Adjusted to vertically center the Search component -->
        <Search />
    </p>
</div>

</div>
