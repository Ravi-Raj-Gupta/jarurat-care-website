<script>
	import DoubleArrow from "$lib/svg/double-arrow.svelte";

</script>
<div class="hidden md:block">
   <div class="min-h-[400px]  grid  md:grid-cols-2">
  <div class="bg-[#D3F2FC] h-full px-[30px] lg:pl-[85px] lg:pr-[20px] py-[80px] gap-[10px]">
    <div class="h-full px-4 gap-[50px] md:gap-[100px] border-l-4 grid border-[#0155BD]">
      <div class="flex flex-col gap-[10px]">
        <h1 class="text-[20px] md:text-[28px] text-[#0D2561] font-[500]">Subscribe to our Newsletter</h1>
        <p class="text-[#3B3E43] font-[500] text-[14px]">Get the latest updates, inspiring stories, and important news delivered right to your inbox.</p>
      </div>
      <div class="flex flex-col md:flex-row gap-4">
        <input class="w-full h-[48px] md:h-[56px] p-2 lg:p-4" placeholder="Enter your email address" type="email">
        <button class="h-[48px] md:h-[56px] mx-auto w-full md:w-[140px] border-[1px] border-[#0155BD] text-[#0155BD] bg-[white] rounded-3xl flex items-center justify-center">
          Submit
        </button>
      </div>
    </div>
  </div>
  <div class="bg-white h-full px-[30px] lg:pr-[30px] lg:pl-[85px]  py-[80px] gap-[10px]">
    <div class="h-full px-4 border-l-4 grid border-[#FFBA41]">
      <div class="flex flex-col gap-[10px]">
        <h1 class="text-[20px] md:text-[28px] text-[#FFBA41] font-[500]">Collaborate <span class="text-[#78C520]">With Us</span></h1>
        <p class= " text-[#3B3E43] text-[14px]">Our mission thrives through the support of compassionate corporates, individuals, and organizations. You can be a part of this journey too—join us in making a difference.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div class="flex my-auto"><DoubleArrow /><a href="/" class="ml-2 font-semibold my-auto text-[#24272A]  text-[16px]">Join jarurat care team</a></div>
        <div class="flex my-auto"><DoubleArrow /><a href="/" class="ml-2 font-semibold my-auto text-[#24272A]  text-[16px]">Join jarurat care team</a></div>
        <div class="flex my-auto"><DoubleArrow /><a href="/" class="ml-2 font-semibold my-auto text-[#24272A]  text-[16px]">Join jarurat care team</a></div>
        <div class="flex my-auto"><DoubleArrow /><a href="/" class="ml-2 font-semibold my-auto text-[#24272A]  text-[16px]">Join jarurat care team</a></div>
      </div>
    </div>
  </div>
</div>

</div>
<div class="w-full    relative h-[856px] md:hidden flex flex-col items-center bg-[#D3F2FC]">
    <!-- First Card -->
    <div class="  max-w-[65rem]  flex flex-col  h-[285px] p-[20px] bg-white rounded-[10px] shadow-[0px_0px_10px_2px_rgba(1,85,189,0.12)] mt-[95px]">
        <div class="w-[280px] h-[180px] flex flex-col gap-4 items-center">
            <h1 class="w-auto h-[33px] text-center font-rubik text-[28px] text-[#0155BD] font-medium leading-[33.18px]">
                Support Us
            </h1>
            <p class="w-[300px] text-[14px] font-[500] text-center text-[#0D2561]">All donations to JaruratCare Foundation are eligible for 50% tax exemption under section 80G of the Income Tax Act.</p>
        </div>
        <button class="mx-auto h-[48px] w-[184px] text-white py-[13px] bg-[#FFBA41] rounded-3xl flex items-center justify-center">
            Seek Support
        </button>
    </div>
    
    <!-- Second Card -->
    <div class="w-[320px]  max-w-[65rem] flex flex-col gap-[60px] h-[350px] py-[20px] bg-white rounded-[10px] shadow-[0px_0px_10px_2px_rgba(1,85,189,0.12)] mt-[60px]">
        <div class="w-[280px] flex flex-col gap-[12px] items-center mx-auto">
            <h1 class="w-[210px] h-[64px] text-center font-rubik text-[28px] text-[#0D2460] font-medium leading-[33.18px]">
                Subscribe to our <span class="text-[#0155BD]">Newsletter</span>
            </h1>
            <p class="w-[300px] text-[14px] text-center text-[#0D2561]">Get the latest updates, inspiring stories, and important news delivered right to your inbox.</p>
        </div>
        <div class="h-[112px] w-[280px] flex flex-col gap-[24px] mx-auto">
            <input class="w-full h-[46px] p-4 bg-[#FFF1D2] rounded-md" placeholder="Enter your email address" type="email">
            <button class="h-[48px] mx-auto w-[122px] text-white  bg-[#0155BD] rounded-3xl flex items-center justify-center">
                Submit
            </button>
        </div>
    </div>
</div>
