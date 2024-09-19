<script>
   let notice="No results for "
   let cancerbect="“ Cancer Bect “"
   let des=" Broaden your search terms or check your spelling to improve your results. You might discover something new!"
   let hint="Hint"
   let sug="Suggestions"
   let sugDes="Here are some related topics that might match what you're looking for."
   const cancerTopics = [
  "Cancer cell research",
  "Cancer medicine",
  "Latest in cancer",
  "Cancer terms",
  "Cancer cell",
  "Cancer Tax",
  "Latest in cancer",
  "Cancer terms"
];
   export let searchInput =""
</script>
<div class="py-16 flex flex-col  gap-[1rem] justify-center items-center">
  <p class="text-[1rem] text-[#676E73]">{notice} <span class="text-[#0155BD]">{searchInput}</span></p>
   <div class="flex  md:w-1/2 mx-8 md:mx-0">
       <div class="bg-[#FFBA41] w-[2%]"></div>
      <div class="bg-[#FFF1D2] p-4">
        <p> <span class="font-[600]">{hint}</span>: {des}</p>
      </div>

   </div>
</div>
<div class="md:px-12 px-4 mx-4 md:mx-8 py-6">
  <h1 class="text-[1.5rem] md:text-[2rem] text-[#0D2561] font-[500] text-center md:text-left">{sug}</h1>
  <p class="text-[#24272A] text-center md:text-left">{sugDes}</p>

  <!-- First Grid Section -->
  <div class="py-6 lg:w-[75%] gap-[0.5rem] md:gap-[1rem] w-full grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 items-center">
    <h1 class="py-4 px-2 text-center border-[1px] rounded-lg text-[0.7rem] border-[#3B3E43]">{cancerTopics[0]}</h1>
    <h1 class="py-4 px-2 text-center border-[1px] rounded-lg text-[0.7rem] border-[#3B3E43]">{cancerTopics[1]}</h1>
    <h1 class="py-4 px-2 text-center border-[1px] rounded-lg text-[0.7rem] border-[#3B3E43]">{cancerTopics[2]}</h1>
    <h1 class="py-4 px-2 text-center border-[1px] rounded-lg text-[0.7rem] border-[#3B3E43]">{cancerTopics[3]}</h1>
    
  </div>
   <div class="lg:w-[60%] gap-[0.5rem]  md:gap-[1rem] w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-center">
    <h1 class="py-4 px-2 text-center border-[1px] rounded-lg text-[0.7rem] border-[#3B3E43]">{cancerTopics[4]}</h1>
    <h1 class="py-4 px-2 text-center border-[1px] rounded-lg text-[0.7rem] border-[#3B3E43]">{cancerTopics[5]}</h1>
    <h1 class="py-4 px-2 text-center border-[1px] rounded-lg text-[0.7rem] border-[#3B3E43]">{cancerTopics[6]}</h1>
    <h1 class="py-4 px-2 text-center border-[1px] rounded-lg text-[0.7rem] border-[#3B3E43]">{cancerTopics[7]}</h1>
  </div>

  <!-- Second Grid Section -->
 
</div>

