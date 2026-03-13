<script>
  import { onMount, onDestroy } from "svelte";

  let advisoryBoard = [
    { name: "Dr. Milind Javle", role: "Department of Gastrointestinal Medical Oncology" },
    { name: "Prof. Usha Dutta", role: "Professor & HOD, Gastroenterology, PGIMER, Chandigarh" },
    { name: "Dr. Sangeeta Goswami", role: "Associate Professor, Genitourinary and Immunology, MD Anderson Cancer Center" },
    { name: "Dr. Darshit Shah", role: "Consultant Medical Oncology, Sir H. N. Reliance Foundation Hospital" },
    { name: "Dr. Vikas Ostwal", role: "GI Oncology, Tata Memorial Cancer Center, Mumbai" },
    { name: "Dr. Soumil Vyas", role: "Consultant Surgical Oncology, Sir H N Reliance Foundation Hospital" },
    { name: "Dr. Bhawna Sirohi", role: "Medical Director, Balco Medical Centre, Raipur" },
    { name: "Dr. Jill Koshiol", role: "Senior Investigator, National Cancer Institute (NCI)" },
    { name: "Dr. Vinay Kapoor", role: "Pro Vice Chancellor, MGUMST" },
    { name: "Stacie C. Lindsey", role: "Founder & CEO, Cholangiocarcinoma Foundation" },
    { name: "Dr. Sewanti Limaye", role: "Director Medical & Precision Oncology, Sir HN Reliance Hospital" },
    { name: "Dr. Ravi Kanan", role: "Surgical Oncologist & Director, Cachar Cancer Hospital & Research" },
    { name: "Dr. Shefali Agarwal", role: "Professor of Surgery, Senior Consultant, Indraprastha Apollo Hospitals" },
    { name: "Dr. Raman Sood", role: "Hematology and Oncology Care Provider, Brooks TLC" },
    { name: "Dr. Moushumi Suryavanshi", role: "HOD, Molecular Biology, Amrita Institute of Medical Sciences" },
    { name: "Dr. Vineet Gupta", role: "Oncologist, Fortis Hospital, New Delhi" },
    { name: "Dr. Chetan Arora", role: "Professor and Scientist, IIT Delhi" }
  ];

  function getInitials(name) {
    let cleanName = name.replace("Dr. ", "").replace("Prof. ", "").replace("Ms. ", "");
    let parts = cleanName.split(" ");
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  }

  let scrollContainer;
  let autoScroll;

  const scroll = (direction) => {
    const scrollAmount = 350;
    scrollContainer.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth"
    });
  };

  onMount(() => {
    autoScroll = setInterval(() => {
      if (scrollContainer) {
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainer.scrollBy({ left: 350, behavior: "smooth" });
        }
      }
    }, 4000);
  });

  onDestroy(() => {
    clearInterval(autoScroll);
  });
</script>

<section class="py-16 px-6 bg-[#F8FAFF] overflow-hidden">
  <div class="max-w-7xl mx-auto flex flex-col items-center text-center">
    
    <div class="mb-10">
      <div class="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
        Expert Network
      </div>
      <h2 class="text-3xl md:text-5xl font-black text-[#0D2561] tracking-tight">
        Advisory <span class="text-blue-600">Board</span>
      </h2>
      <p class="text-slate-500 text-sm md:text-base mt-3 font-medium opacity-80 max-w-2xl mx-auto">
        World-class medical leaders guiding our mission to transform cancer care pathways.
      </p>
    </div>

    <div class="flex gap-4 mb-8">
      <button on:click={() => scroll("prev")} class="p-2.5 border border-blue-200 rounded-full bg-white text-[#0D2561] hover:bg-[#0D2561] hover:text-white transition-all shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <button on:click={() => scroll("next")} class="p-2.5 border border-blue-200 rounded-full bg-white text-[#0D2561] hover:bg-[#0D2561] hover:text-white transition-all shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <div
      bind:this={scrollContainer}
      class="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-10 pt-2 no-scrollbar scroll-smooth w-full"
    >
      {#each advisoryBoard as doctor}
        <div class="min-w-[280px] md:min-w-[340px] snap-start">
          <div class="group bg-white border border-slate-100 rounded-[2rem] p-6 h-[280px] flex flex-col items-center transition-all duration-300 hover:border-blue-400 hover:shadow-[0_15px_35px_rgba(37,99,235,0.08)]">
            
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg shadow-md mb-4 group-hover:scale-110 transition-transform duration-500">
              {getInitials(doctor.name)}
            </div>

            <h3 class="text-[#0D2561] font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
              {doctor.name}
            </h3>

            <div class="w-full pt-3 border-t border-slate-50">
              <p class="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] mb-0.5">Affiliation & Role</p>
              <p class="text-[13px] text-slate-600 font-medium leading-snug px-2">
                {doctor.role}
              </p>
            </div>
          </div>
        </div>
      {/each}
    </div>

  </div>
</section>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>