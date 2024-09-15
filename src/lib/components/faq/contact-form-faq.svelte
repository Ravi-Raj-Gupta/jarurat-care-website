<script>
	import FaqWave from "$lib/svg/faq-wave.svelte";
	import ContactNumber from "../ui/contact-number.svelte";
	import FormInput from "../ui/form-input.svelte";
	import RoleSelector from "../ui/RoleSelector.svelte";
   let head1 ="Didn’t find "
   let head2 ="what you were looking for?  "
   let pageDes ="Our team is just an email away and ready to answer your questions"
   let formDes="Please fill in your details correctly"
   let message="Message"
   let notice="Your information will remain confidential and be used to provide you with personalized support."
   let Submit="Submit"
</script>
<style>
  @media (min-width: 768px) { /* Tailwind's md breakpoint is 768px */
    .gradient-background {
      background: linear-gradient(127.15deg, rgba(1, 85, 189, 0.5) 7.5%, rgba(6, 90, 192, 0.5) 46.08%, rgba(133, 218, 255, 0.5) 111.98%);
    }
  }
</style>


<!-- Wave and Form Section -->
<div class="relative">
  <!-- Container to handle overflow and position SVG -->
  <div class=" bg-[url('/src/lib/components/faq/image.png')] py-8 ">
    <!-- SVG wave -->
    <div class=" inset-0 flex flex-col items-center   md:w-[60vw] md:mx-auto mt-20 mb-16  ">
      <div class="text-center md:mb-8 mb-0 flex flex-col gap-[0.5rem]  ">
        <h1 class="text-[#FFBA41]  text-[1.75rem] md:text-[2.75rem] sm:w-1/2 w-2/3  md:w-2/3 mx-auto font-[600]">
        {head1}<span class="text-white">{head2}</span>
        </h1>
        <p class="text-white">{pageDes}</p>
      </div>
      <div class="gradient-background  max-w-[65rem]  w-full md:mx-8 mx-0 p-4 rounded-xl">
        <p class="text-white text-[1rem] text-left hidden md:block mb-4 mt-2">{formDes}</p>
        <div class=" md:my-0  md:grid md:grid-cols-2 gap-4">
          <FormInput data={{ name: "Full Name", placeholder: "Enter your full name", type: "text" ,color:"white"}} />
          <RoleSelector />
          <FormInput data={{ name: "Email", placeholder: "Enter your Email", type: "email", required: true,color:"white" }} />
          <ContactNumber color="white" />

          <div class="col-span-2 mt-4 md:mt-0">
            <p class="text-sm mb-2 text-white ">{message}</p>
            <textarea placeholder="What's on your Mind"
              class=" text-[#0155BD]  hover:border-[#0155BD] focus:outline-none focus:border-[#0155BD] md:bg-[#E8EBF1] bg-white w-full md:h-40 h-28 rounded-xl p-4 borderresize-none"
              
            ></textarea>
          </div>
           <div class=" col-span-2 flex gap-2 mt-4 md:mt-0">
        <input class="h-4 w-4 mx-2 col-span-1 my-auto rounded-2xl" type="checkbox" name="" id="">
        <p class="text-[1rem] my-auto text-white" >{notice}</p>
      </div>
        <div class="col-span-2 text-center mt-4 md:mt-0">
            <button class="bg-[#FFBA41] rounded-3xl mx-auto w-28 h-12 text-white">{Submit}</button>
          </div>
   </div>
      </div>
    </div>
  </div>
</div>