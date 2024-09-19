<script>
  import { goto } from "$app/navigation";
	import Banner from "$lib/components/cancer-research/banner.svelte";
	import LatestInCancer from "$lib/components/cancer-research/latest-in-cancer.svelte";
	import NotFound from "$lib/components/cancer-research/not-found.svelte";
	import Research from "$lib/components/cancer-research/research.svelte";
	import Nav from "$lib/components/nav.svelte";
	import NewsFooter from "$lib/components/news-footer.svelte";
  import RightArrow from "$lib/svg/right-arrow.svelte";
  import Search from "$lib/svg/search.svelte";

  let homeBreadCrum="Home"
  let cancerBreadCrum="Cancer Research"
  let title="Discover The latest In Cancer Science"
  let subDes="All of the information has been summarized by Jururat Care from PubMed so that it is easy to use. Further links to the full article are provided."
  let advice ="Advicory Board"
  let support="Seek Support"
  let help ="Help"

  // Array of items
  

  

  $: searchInput = "";
  let isSearchReady=false
  function handleSearch(){
    isSearchReady=true
    
  }
  $:if(searchInput===""){
    isSearchReady=false
  }

  // Pagination variables
  

  // Functions to handle pagination
 
 
  function handleClick(item) {
  // Navigate to the dynamic route with the item name as a parameter
  goto(`/cancer-research/${encodeURIComponent(item.title)}`);
}
  
</script>

<style>
  .bg-grad{
     background: linear-gradient(180deg, #ECF1F8 0%, #D1F1FB 100%);
  }
  .text-gradient {
    background: linear-gradient(179.1deg, #132442 0.77%, #0155BD 125%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
 .border-grad {
  border: 1px solid; /* Set a solid border to apply the gradient on */
  border-image-source: linear-gradient(2.73deg, #00C8F4 -55.63%, #24D0F5 20.89%, #D6B7FF 104.25%, #FFFFFF 161.36%);
  border-image-slice: 1; /* Ensures the gradient covers the entire border */
  border-radius: 1rem; /* Apply rounded corners */
}


</style>
<Nav />
<div class="relative bg-grad flex flex-col items-center gap-[2.5rem] md:pb-12">
  <!-- Gradient background using pseudo-element -->


  <div class="absolute top-20 left-20 md:flex hidden gap-4">
    <h1 class="text-[1.25rem] font-[400] z-30">{homeBreadCrum}</h1>
    <p class="my-auto"><RightArrow /></p>
    <h1 class="text-[1.25rem] font-[400] z-30 text-[#0155BD]">{cancerBreadCrum}</h1>
  </div>

  {#if searchInput !=='' && isSearchReady===true}
   

   <div class=" hidden lg:grid grid-cols-4 pl-20 pr-12 gap-8">
   <div class="md:mt-[12rem] col-span-1  md:w-full mt-[8rem] max-w-[65rem]  ">
    <h1 class="md:text-[2rem]  sm:text-[1.5rem]  sm:mx-0 sm:w-full font-bold text-gradient">
       {title}
    </h1>
  </div>

  <div class=" md:mt-[12rem] col-span-2 relative max-w-[35rem] w-full  bg-opacity-[35%] bg-transparent  rounded-[0.6rem] flex items-center justify-center gap-[0.5rem] ">
    <input bind:value={searchInput}
      type="text"
      placeholder="Search Your Query"
      class=" w-11/12 p-4 rounded-tl-[0.5rem] rounded-bl-[0.5rem] rounded-br-[0rem] rounded-tr-[0rem] border border-gray-300"
    >
    <p on:click={handleSearch} class="absolute right-[15%] top-1/2 transform -translate-y-1/2">
      <Search />
    </p>
  </div>
  <div  class="col-span-1 mt-[12rem] flex justify-center items-center gap-4">
    <p class="text-[12px] font-[700] text-[#24272A]">{support}</p>
    <p class="text-[12px] font-[700] text-[#24272A]">{advice}</p>
    <p class="text-[12px] font-[700] text-[#24272A]">{help}</p>

  </div>
  </div>
  <div class="md:mt-[12rem] w-[50vw] md:w-full mt-[8rem] max-w-[65rem] flex lg:hidden flex-col gap-[10px] text-center items-center">
    <h1 class="md:text-[3.5rem] sm:text-[2.25rem] text-[1.5rem]  md:w-2/3 mx-auto sm:mx-0 sm:w-full font-bold text-gradient">
       {title}
    </h1>
  </div>

  <div class=" lg:hidden border-white relative max-w-[35rem] w-full  bg-[rgb(222,242,272)] p-8 rounded-[0.6rem] flex items-center justify-center gap-[1.25rem] ">
    <input bind:value={searchInput}
      type="text"
      placeholder="Search Your Query"
      class=" w-11/12 p-4 rounded-tl-[0.5rem] rounded-bl-[0.5rem] rounded-br-[0rem] rounded-tr-[0rem] border border-gray-300"
    >
    <p on:click={handleSearch} class="absolute right-[15%] top-1/2 transform -translate-y-1/2">
      <Search />
    </p>
  </div> 
  {:else}
   <div class="md:mt-[12rem] w-[50vw] md:w-full mt-[8rem] max-w-[65rem] flex flex-col gap-[10px] text-center items-center">
    <h1 class="md:text-[3.5rem] sm:text-[2.25rem] text-[1.5rem]  md:w-2/3 mx-auto sm:mx-0 sm:w-full font-bold text-gradient">
       {title}
    </h1>
  </div>

  <div class="  border-white relative max-w-[35rem] w-full  bg-[rgb(222,242,272)] p-8 rounded-[0.6rem] flex items-center justify-center gap-[1.25rem] ">
    <input bind:value={searchInput}
      type="text"
      placeholder="Search Your Query"
      class=" w-11/12 p-4 rounded-tl-[0.5rem] rounded-bl-[0.5rem] rounded-br-[0rem] rounded-tr-[0rem] border border-gray-300"
    >
    <p on:click={handleSearch} class="absolute right-[15%] top-1/2 transform -translate-y-1/2">
      <Search />
    </p>
  </div> 
  {/if}
   
   
</div>
<p class="text-center bg-[#FDE3A7] text-[1rem] text-[#A15819]">{subDes}</p>
{#if searchInput!=="" && isSearchReady}
<NotFound searchInput={searchInput} />
<Research />
{:else}
<LatestInCancer /> 
{/if}


<Banner />
<NewsFooter />



    