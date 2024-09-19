<script>
	import { page } from "$app/stores";
	import Download from "$lib/svg/download.svelte";
 let subDes="All of the information has been summarized by Jururat Care from PubMed so that it is easy to use. Further links to the full article are provided."
  $: id = $page.params.id;
	import RightArrow from "$lib/svg/right-arrow.svelte";
	import Save from "$lib/svg/save.svelte";
	import Share from "$lib/svg/share.svelte";
	import Research from "./research.svelte";
    let homeBreadCrum="Home"
    let cancerResearchBreadCrum="Read the Latest in Cancer Research"
</script>

    <div class="  md:ml-20 mx-8 mt-4  md:flex hidden gap-2 items-center">
    <h1 class="lg:text-[1rem] text-[0.6rem] font-[400] z-30">{homeBreadCrum}</h1>
    <p class="my-auto"><RightArrow /></p>
    <h1 class="lg:text-[1rem] text-[0.6rem] font-[400] z-30 text-[#0155BD]">{cancerResearchBreadCrum}</h1>
      <p class="my-auto"><RightArrow /></p>
    <h1 class="lg:text-[1rem] text-[0.6rem]  font-[400] z-30 text-[#0155BD]">{id}</h1>
  </div>
  <p class=" md:px-4 px-2 md:ml-20 md:mx-8 md:w-2/3 w-full md:my-4 bg-[#FDE3A7] md:text-[1rem] text-[0.7rem] text-[#A15819]">{subDes}</p>
   <div class="  flex justify-between items-center md:mr-20">
     <h1 class="md:ml-20 mx-8 mt-16 md:text-[2.5rem] sm:text-[1.75rem] text-[1rem] md:w-2/3 w-full ">Global Cancer incidence and mortality rate and trends - An update</h1>
     <div class=" relative hidden   lg:flex items-center mt-4">
     <button class="bg-[#CFD6DF] rounded-xl p-2  text-[#3B3E43] text-center inline-flex items-center space-x-2"> Save<Save /></button>
     <button class="ml-4"><Share /></button>
     </div>
    
   </div>
    <div class="absolute right-8 hidden lg:block" >
      <p>Full Citation Link</p>
      <div class="mt-4 flex flex-col gap-[0.5rem]">
          <button class="bg-[#0155BD]  rounded-xl p-2  text-white text-center">Read Full Citation</button>
  <button class="bg-[#0155BD] rounded-xl p-2 px-8  text-white text-center inline-flex items-center space-x-2">
  Download 
  <Download />
</button>
      </div>
    </div>

  <div class="grid md:grid-cols-4  grid-cols-3   my-4 md:ml-20 mx-8 md:w-2/3 ">
   <p class="text-[#0155BD]  text-[1rem] " >Lindsey A Torre</p>
   <p class="text-[#0155BD]  text-[1rem]">Rebecca l seigel</p>
   <p class="text-[#0155BD]  text-[1rem]">Elizabeth m ward</p>
   <p class="text-[#0155BD]  text-[1rem]">Aahmedin jemal</p>
  </div>
  <div class=" md:ml-20 mx-8 my-8 md:w-[60%]">
    <p class="bg-[#D5BDF5] p-4 w-28 text-[18px] "> Affiliations</p>
   <div class=" border-[1px] border-[#D5BDF5] h-[30vh]"></div>
  <!-- <div class="flex gap-[2rem] mt-2">
    <p>PMID : 2326386 </p>
   <span class="text-[#0155BD]">DOI : 2U39723479324923743242349</span>
  </div> -->
<div class="mt-12   ">
     <h1 class="text-[32px] my-4">Absract</h1>
     <p class="text-[#3B3E43]">The research paper on global cancer incidence and mortality rates provides a comprehensive analysis of cancer trends worldwide. It highlights the rising number of cancer cases, attributing this increase to factors such as aging populations, lifestyle changes, and environmental factors. The paper details variations in cancer incidence across different regions, with higher rates observed in high-income countries due to better detection and reporting mechanisms. Mortality rates,...</p>
     <p class="text-[#3B3E43] my-4">©2015 American Association for Cancer Research.</p>
     <p class="text-[#0155BD]" >Pubmed Disclaimer</p>
</div>
<div class="mt-4 md:block flex flex-col gap-[0.5rem]">
          <button class="bg-[#0155BD]  rounded-xl p-2  text-white text-center">Read Full Citation</button>
  <button class="bg-[#0155BD] rounded-xl p-2 md:px-4 px-20 text-white text-center inline-flex items-center space-x-2">
  Download 
  <Download />
</button>
      </div>
  </div>
  

