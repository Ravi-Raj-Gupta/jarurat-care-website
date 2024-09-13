<script>
  import album1 from "./album1.png";
  import album2 from "./album2.png";
  import album3 from "./album3.png";
</script>

<div class="flex sm:px-[4rem] px-8  m-2  flex-col items-center md:flex-row md:items-center justify-center gap-[3rem] md:my-[9rem] my-[4rem]">
  <!-- Card 1 -->
  <div class="relative  h-[15rem]">
    <div class="absolute z-0 w-full h-full bg-[#0D2460] rounded-[0.9375rem] rotate-[-1.74deg] left-[-1.495rem] top-[1.4925rem]"></div>
    <img src={album1} alt="Card Image 1" class="w-full h-full object-cover relative z-10 rounded-[0.9375rem]">
  </div>

  <!-- Card 2 -->
  <div class="relative  h-[15rem]">
    <div class="absolute z-0 w-full h-full bg-[#0D2460] rounded-[0.9375rem] rotate-[1.35deg] left-[-0.498rem] top-[1.41rem]"></div>
    <img src={album2} alt="Card Image 2" class="w-full h-full object-cover relative z-10 rounded-[0.9375rem]">
  </div>

  <!-- Card 3 -->
  <div class="relative  h-[15rem] md:ml-[1.5rem]">
    <div class="absolute z-0 w-full h-full bg-[#0D2460] rounded-[0.9375rem] rotate-[-1.34deg] left-[-1.3675rem] top-[1.481rem]"></div>
    <img src={album3} alt="Card Image 3" class="w-full h-full object-cover relative z-10 rounded-[0.9375rem]">
  </div>
</div>
