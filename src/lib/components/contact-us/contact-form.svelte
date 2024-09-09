<script>

	import ContactUs from "$lib/svg/contact-us.svelte";
	import ContactNumber from "../contact-number.svelte";
	import FormInput from "../form-input.svelte";
	import RoleSelector from "../ui/RoleSelector.svelte";
   import  Image from "./image.png";
</script>
<div class="bg-cover h-[560px] w-full md:items-center flex items-end  md:justify-center bg-center relative" style="background-image: url({Image});">
  <h1 class="text-white tracking-wider font-[600] z-20 text-[24px] p-8  sm:text-[40px] md:text-[84px] md:p-0 md:font-[600]">TALK <span class=" text-[#FFBA41] md:text-white" >TO</span> <span class=" text-[#78C520] md:text-white" >US</span></h1>
</div>

<!-- Wave and Form Section -->
<div class="relative">
  <!-- Container to handle overflow and position SVG -->
  <div class="relative bg-white">
    <!-- SVG wave -->
    <ContactUs class="w-full" />

    <!-- Content inside the wave -->
    <div class="absolute inset-0 flex flex-col items-center   max-w-[800px] md:mx-auto mt-20 mb-16  ">
      <div class="text-center md:mb-8 mb-0 mx-8 md:mx-0 ">
        <h1 class="text-[#0D2460] text-[28px] md:text-[48px] sm:w-1/2 w-2/3  md:w-full mx-auto font-[600]">
          Get in Touch <span class="text-[#0155BD]">with Us</span>
        </h1>
        <p class="text-[#24272A] ">Our team is just an email away and ready to answer your questions</p>
      </div>
      <div class="md:bg-white w-full md:mx-8 mx-0   p-4 rounded-xl">
        <p class="text-[#24272A] text-[18px] text-left hidden md:block mb-4 mt-2">Please fill in your details correctly</p>
        <div class=" md:my-0  md:grid md:grid-cols-2 gap-4">
          <FormInput data={{ name: "Full Name", placeholder: "Enter your full name", type: "text" }} />
          <RoleSelector  />
          <FormInput data={{ name: "Email", placeholder: "Enter your Email", type: "email", required: true }} />
          <ContactNumber />

          <div class="col-span-2 mt-4 md:mt-0">
            <p class="text-sm mb-2   text-[#3B3E43]">Message</p>
            <textarea placeholder="What's on your Mind"
              class=" text-[#0155BD]  hover:border-[#0155BD] focus:outline-none focus:border-[#0155BD] md:bg-[#E8EBF1] bg-white w-full md:h-40 h-28 rounded-xl p-4 borderresize-none"
              
            ></textarea>
          </div>
           <div class=" col-span-2 flex gap-2 mt-4 md:mt-0">
        <input class="h-4 w-4 mx-2 col-span-1 my-auto rounded-2xl" type="checkbox" name="" id="">
        <p class="text-[15px] my-auto text-[#24272A]" >Your information will remain confidential and be used to provide you with personalized support.</p>
      </div>
        <div class="col-span-2 text-center mt-4 md:mt-0">
            <button class="bg-[#0155BD] rounded-3xl mx-auto w-28 h-12 text-white">Submit</button>
          </div>
   </div>
      </div>
    </div>
  </div>
</div>