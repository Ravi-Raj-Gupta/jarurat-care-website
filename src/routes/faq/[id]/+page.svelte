<script>
  import { page } from '$app/stores';
  import Nav from '$lib/components/nav.svelte';
	import DownArrow from '$lib/svg/down-arrow.svelte';
	import DropDownArrow from '$lib/svg/drop-down-arrow.svelte';
  import RightArrow from '$lib/svg/right-arrow.svelte';
  import { goto } from "$app/navigation";

  // Reactive statement to get the `id` from the page parameters
  $: id = $page.params.id;
  const arr=["How is gallbladder cancer detected?"," What are the most common symptoms of gallbladder cancer?","Do I have gallbladder cancer?","What stage is my cancer, and what does that mean in my case?"]
  let homeBreadCrum="Home"
  let faqBreadCrum="Faqs"
  let pageDes="Understanding Your Diagnosis"
</script>


<style>
  .bg-gradient-background {
    background: linear-gradient(2.73deg, #00C8F4 -55.63%, #24D0F5 20.89%, #D6B7FF 104.25%, #FFFFFF 161.36%);
  }
  
</style>

<Nav />

<div class="relative flex flex-col  gap-[2.5rem]  py-8">
  <!-- Gradient background using pseudo-element -->
  <div class="absolute inset-0 z-[-1] bg-gradient-background opacity-30"></div>
  
  <div class="absolute top-20 left-20 md:flex hidden gap-[0.5rem] text-[#24272A] ">
    <h1 class="text-[1.25rem] font-[400] z-30">{homeBreadCrum}</h1>
    <p class="my-auto"><RightArrow /></p>
    <h1 on:click={() => goto("/faq")} class="text-[1.25rem] font-[400] z-30 text-[#24272A]">{faqBreadCrum}</h1>
    <p class="my-auto"><RightArrow /></p>
    <h1 class="text-[1.25rem] font-[400] z-30 text-[#0155BD]">{id}</h1>
    
  </div>
  <div class="md:mt-[18rem] mt-[7rem] md:ml-20 mx-auto  flex flex-col gap-[0.5rem]">
    <h1 class="md:text-[3rem] sm:text-[2rem] md:w-[70%]    sm:mx-0 w-full font-bold text-[#0D2460]">
      {id}
    </h1>
     <p class="text-[1.25rem] text-[#24272A] font-medium hidden md:block">{pageDes}</p>
  </div>
</div>
 <div class="grid grid-cols-1 gap-[1.25rem] md:m-20  sm:m-8 m-4 mb-48 ">
    
     
       {#each arr as item }
         <div  class=" h-[5.5rem] rounded-[0.5rem] text-[1.25rem] border-2 border-[#0155BD,25%] md:border-spacing-0 md:bg-[#F4F8FF] flex md:p-4 p-2 justify-between  items-center cursor-pointer">
        <p class="text-[#24272A] text-[1rem] md:font-[1.25rem]">{item}</p>
         <p class="block text-[#24272A]"><DownArrow /></p>
 
      </div>
       {/each}

  </div>




