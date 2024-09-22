<script>
	import Plus from "$lib/svg/plus.svelte";
import Faq from "../faqs/faq.svelte";
	import Header from "../ui/header.svelte";

   let bannerhead1='Shall we support your'
   let bannerhead2='cancer journey'
   let bannerhead3='together?'
   let bannerheadSmall1='Find a Mentor for Your '
   let bannerheadSmall2='cancer '
   let bannerheadSmall3='Journey'
   
   let des="We are here to help you navigate this challenging time by providing compassionate care and advice from our specialized support team.Let's start your support journey"
   let secondaryDes="Let's start your support journey"
   const arr=["What is Mentor ?","Who are eligible for support?","How can I volunteer or donate?","What is Mentor ?","What regions we operate in?","Are the services free?"]
</script>
<style>
   @media (min-width: 768px) {
.bg-image{
      background: url("./banner-lg.png");
      background-size: cover;
      background-position: center;
   }
}
  @media (max-width: 768px) {
.bg-image{
      background: url("./banner-sm.png");
      background-size: cover;
      background-position: center;
   }
}

   
</style>
<div class="   py-8 md:mx-8 my-16  flex items-center ">
     <div class=" w-full min-h-[30vh]  relative md:mx-16 mx-0 text-white bg-image rounded-2xl  md:pl-16   p-8">
      <h1 class=" break-words lg:text-[2.5rem] md:text-[2rem] sm:text-[1.5rem] hidden md:block  lg:w-[50%] md:w-[70%] text-white">{bannerhead1} <span class="text-[#FFBA41]">{bannerhead2} </span> {bannerhead3}  </h1>
      <h1 class="break-words text-[1.75rem] block md:hidden text-white">{bannerheadSmall1} <span class="text-[#FFBA41]">{bannerheadSmall2} </span> {bannerheadSmall3}  </h1>
      <p class=" break-words hidden md:block mt-[0.5rem] w-[70%]">{des}</p>
      <p class=" break-words mt-[0.5rem] w-[70%]">{secondaryDes}</p>
   <button class=" mt-32 md:mt-4 w-[10rem] h-10  rounded-[1.5rem] text-white bg-[#FFBA41]">Read more</button>
     </div>
</div>
<div class="block md:hidden bg-[#F8FCFF]">
     	<Header
		title="Frequently asked question"
		subtitle="Look through some of our frequently answered questions"
	/>
  <div class="my-8  grid gap-[0.5rem]">
    {#each arr as item }
      <div class=" border-[1px] p-4 border-[#D3F2FC] bg-white flex justify-between items-center  mx-8 rounded-xl  border-spacing-4">
         <h1>{item}</h1>
         <p><Plus /></p>
   </div>
    {/each}
  </div>
<div class="flex flex-col items-center justify-center h-full">
  <Header
    title="Still Have Questions?"
    subtitle="Feel free to contact us"
  />
  <button class="my-8 md:mt-4 w-[10rem] h-10 rounded-[1.5rem] text-white bg-[#0155BD]">
    Contact Us
  </button>
</div>
</div>