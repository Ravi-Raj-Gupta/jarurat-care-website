<script>
  import { onMount, onDestroy } from "svelte";

  let advisoryBoard = [
    { name: "Dr. Milind Javle", role: "Department of Gastrointestinal Medical Oncology" },
    { name: "Dr. Sangeeta Goswami", role: "Associate Professor, MD Anderson Cancer Center" },
    { name: "Dr. Vikas Ostwal", role: "GI Oncology, Tata Memorial Cancer Center, Mumbai" },
    { name: "Dr. Bhawna Sirohi", role: "Medical Director, Balco Medical Centre, Raipur" },
    { name: "Dr. Vinay Kapoor", role: "Pro Vice Chancellor, MGUMST" },
    { name: "Dr. Sewanti Limaye", role: "Director Medical & Precision Oncology, Sir HN Reliance Hospital" },
    { name: "Prof. Usha Dutta", role: "Professor & HOD, Gastroenterology, PGIMER, Chandigarh" },
    { name: "Dr. Darshit Shah", role: "Medical Oncology, Sir H. N. Reliance Foundation Hospital" }
  ];

  function getInitials(name) {
    let parts = name.replace("Dr. ", "").replace("Prof. ", "").split(" ");
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  }

  let scrollContainer;
  let autoScroll;

  const scroll = (direction) => {
    const scrollAmount = 320;
    scrollContainer.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth"
    });
  };

  onMount(() => {
    autoScroll = setInterval(() => {
      if (scrollContainer) {
        scrollContainer.scrollBy({ left: 320, behavior: "smooth" });

        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth
        ) {
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000);
  });

  onDestroy(() => {
    clearInterval(autoScroll);
  });
</script>

<section class="py-20 px-6 bg-[#F4F8FF]">

  <div class="max-w-7xl mx-auto">

    <!-- Heading -->
    <div class="text-center mb-14">

      <h2 class="text-3xl md:text-4xl font-bold text-[#0D2561]">
        Advisory <span class="text-[#2563EB]">Board</span>
      </h2>

      <p class="text-slate-500 text-sm mt-3">
        Leading experts in Oncology & Gastroenterology
      </p>

    </div>

    <!-- Slider Controls -->
    <div class="flex justify-end gap-3 mb-6">

      <button
        on:click={() => scroll("prev")}
        class="p-3 border border-[#0D2561]/20 rounded-full hover:bg-[#0D2561] hover:text-white transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <button
        on:click={() => scroll("next")}
        class="p-3 border border-[#0D2561]/20 rounded-full hover:bg-[#0D2561] hover:text-white transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

    </div>

    <!-- Slider -->
    <div
  bind:this={scrollContainer}
  class="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-14 pt-4 no-scrollbar"
>

      {#each advisoryBoard as doctor}

      <div class="min-w-[340px] md:min-w-[360px] snap-start">

        <div class="bg-white border border-slate-100 rounded-2xl p-10 h-[250px] flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

          <!-- Avatar -->
          <div class="w-16 h-16 rounded-full border-[3px] border-[#0D2561] flex items-center justify-center bg-[#F4F8FF] text-[#0D2561] font-bold text-lg">
            {getInitials(doctor.name)}
          </div>

          <!-- Name -->
          <h3 class="text-[#0D2561] font-bold text-lg mt-4">
            {doctor.name}
          </h3>

          <!-- Role -->
          <p class="text-xs text-slate-500 leading-relaxed uppercase tracking-wide border-t border-slate-100 pt-3">
            {doctor.role}
          </p>

        </div>

      </div>

      {/each}

    </div>

    <!-- CTA -->
    <div class="mt-12 text-center">

      <a
        href="/leadership"
        class="inline-flex items-center gap-2 text-[#0D2561] font-bold hover:text-[#2563EB] transition-colors text-sm uppercase tracking-[0.2em] group"
      >
        View Full Leadership
        <span class="transform group-hover:translate-x-2 transition-transform">→</span>
      </a>

    </div>

  </div>

</section>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>