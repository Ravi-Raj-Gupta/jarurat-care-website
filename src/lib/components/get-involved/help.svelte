<script>
  import { Users, Stethoscope, MonitorPlay, HandHeart } from "lucide-svelte";

  let helpItems = [
    {
      title: "Join the Ecosystem",
      desc: "Be part of India's most inclusive cancer support network.",
      icon: Users
    },
    {
      title: "Offer Medical Opinions",
      desc: "Provide secondary medical insights to strengthen treatment pathways.",
      icon: Stethoscope
    },
    {
      title: "Co-Host Webinars",
      desc: "Support educational webinars and cancer screening initiatives.",
      icon: MonitorPlay
    },
    {
      title: "Mentor & Guide",
      desc: "Mentor caregivers and early-career oncologists with your experience.",
      icon: HandHeart
    }
  ];
</script>

<section class="relative py-24 px-6 bg-[#E9F4F7] font-sans overflow-hidden">

  <!-- Background Pattern -->
  <div class="absolute inset-0 opacity-[0.06] pointer-events-none">
    <div class="absolute w-96 h-96 border border-[#2563EB] rounded-full -top-40 -left-40"></div>
    <div class="absolute w-72 h-72 border border-[#2563EB] rounded-full bottom-0 right-0"></div>
    <div class="absolute w-40 h-40 border border-[#2563EB] rotate-45 top-40 right-20"></div>
  </div>

  <div class="max-w-7xl mx-auto relative">

    <!-- Heading -->
    <div class="text-center mb-16">

      <div class="inline-flex items-center gap-2 px-3 py-1 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-full mb-4">
        <span class="text-[#2563EB] font-semibold text-[11px] tracking-widest uppercase">
          Get Involved
        </span>
      </div>

      <h2 class="text-3xl md:text-4xl font-bold text-[#0D2561] mb-4">
        HOW YOU CAN <span class="text-[#2563EB]">GET INVOLVED</span>
      </h2>

      <p class="max-w-3xl mx-auto text-slate-600 text-[16px] leading-relaxed">
        Be part of India's most inclusive cancer support ecosystem and contribute your expertise to transform patient-centered oncology care.
      </p>

    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">

      {#each helpItems as item}

      <div class="group relative border border-[#7FA9B6] rounded-2xl p-8 pt-14 text-center bg-transparent transition-all duration-500 hover:border-[#2563EB] hover:shadow-lg">

        <!-- Icon -->
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#E9F4F7] border border-[#7FA9B6] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-[#2563EB]">

          <svelte:component
            this={item.icon}
            size={28}
            strokeWidth={1.5}
            class="text-[#2563EB] group-hover:text-white transition-colors duration-300"
          />

        </div>

        <!-- Title -->
        <h3 class="text-[#0D2561] font-semibold text-[16px] mb-3 mt-2">
          {item.title}
        </h3>

        <!-- Description -->
        <p class="text-[14px] text-slate-600 leading-relaxed">
          • {item.desc}
        </p>

      </div>

      {/each}

    </div>

    <!-- QR Section -->
    <div class="flex flex-col md:flex-row items-center justify-center gap-12 mt-24">

      <h3 class="text-[#0D2561] font-bold text-2xl">
        Scan to <span class="text-[#2563EB]">Join Us!</span>
      </h3>

      <div class="relative flex items-center">

        <!-- Animated Arrow -->
        <div class="absolute -left-24 top-[-10px] hidden lg:block animate-bounce">

          <svg width="90" height="60" viewBox="0 0 100 60" fill="none">
            <path d="M5 50 C 20 10, 60 10, 85 35" stroke="#2563EB" stroke-width="2" stroke-dasharray="6 6" />
            <path d="M78 35 L 87 37 L 85 28" stroke="#2563EB" stroke-width="2" fill="none" />
          </svg>

        </div>

        <!-- QR -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-lg hover:scale-110 transition duration-300">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://jaruratcare.org"
            alt="QR Code"
            class="w-28 h-28"
          />
        </div>

      </div>

    </div>

  </div>

</section>