<script>
   import album1 from "./album1.png"
   import album2 from "./album2.png"
   import album3 from "./album3.png"



</script>

<div class="flex flex-col items-center md:flex-row md:items-center justify-center mx-auto gap-12 md:my-36 my-16">
  <!-- Card 1 -->
  <div class="relative w-[350px] h-[240.7px]">
    <div class="absolute z-0 w-full h-full bg-[#0D2460] rounded-[15px] rotate-[-1.74deg] left-[-23.93px] top-[23.88px]">
    </div>
    <img src={album1} alt="Card Image 1" class="w-[322px] h-[240px] object-cover relative z-10 rounded-[15px]">
  </div>

  <!-- Card 2 -->
  <div class="relative w-[350px] h-[240.7px]">
    <div class="absolute z-0 w-full h-full bg-[#0D2460] rounded-[15px] rotate-[1.35deg] left-[-7.97px] top-[22.56px]">
    </div>
    <img src={album2} alt="Card Image 2" class="w-[342px] h-[240px] object-cover relative z-10 rounded-[15px]">
  </div>

  <!-- Card 3 -->
  <div class="relative w-[350px] h-[240.7px] md:ml-6">
    <div class="absolute z-0 w-full h-full bg-[#0D2460] rounded-[15px] rotate-[-1.34deg] left-[-21.88px] top-[23.71px]">
    </div>
    <img src={album3} alt="Card Image 3" class="w-[332px] h-[240px] object-cover relative z-10 rounded-[15px]">
  </div>
</div>