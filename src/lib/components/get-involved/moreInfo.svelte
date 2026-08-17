<script>
  import { Quote, ChevronDown } from 'lucide-svelte';

  let faqs = [
    {
      question: "Who can volunteer with JCF?",
      answer: "Oncologists, medical students, caregivers, advocates, and passionate individuals who want to contribute their skills toward improving cancer care in India.",
      open: false
    },
    {
      question: "Can I join the Advisory Board?",
      answer: "Yes! We welcome experienced medical professionals, policy experts, and community leaders. Click 'Join Our Advisory Board' below or reach out via our contact page.",
      open: false
    },
    {
      question: "Can cancer survivors or caregivers contribute?",
      answer: "Absolutely. Lived experiences are invaluable for mentoring, sharing insights, and providing empathetic support across our network.",
      open: false
    }
  ];

  function toggleFaq(index) {
    faqs[index].open = !faqs[index].open;
    faqs = faqs;
  }
</script>

<section class="w-full bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F8FF_100%)] flex flex-col items-center justify-center px-4 py-16 border-t border-blue-50">
  
  <div class="max-w-6xl w-full space-y-20">

    <div class="text-center space-y-2">
      <h2 class="text-3xl md:text-4xl font-extrabold text-[#0D2561] tracking-tight">
        Founder's Message
      </h2>
      <p class="text-slate-500 text-xs md:text-sm font-medium tracking-wide">
        Rewriting the narrative, One life at a time
      </p>
    </div>

    <div class="relative bg-white/70 backdrop-blur-md p-10 md:p-16 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
      
      <div class="absolute top-6 left-8 text-blue-200/60 pointer-events-none">
        <Quote size={60} class="rotate-180 fill-current" />
      </div>

      <div class="absolute bottom-6 right-8 text-blue-200/60 pointer-events-none">
        <Quote size={60} class="fill-current" />
      </div>

      <div class="relative z-10 text-center space-y-8">
        <p class="text-2xl md:text-3xl font-bold text-[#0D2561] max-w-2xl mx-auto leading-relaxed tracking-tight">
          Alone we can do so little, <br/>
          <span class="text-[#78C520] font-extrabold">together</span> we can do so much.
        </p>

        <div class="flex items-center justify-center gap-3 pt-2">
          <div class="w-12 h-[1.5px] bg-blue-300"></div>
          <div class="text-center">
            <p class="font-extrabold text-xs text-[#0D2561] uppercase tracking-[0.2em]">
              PRIYANKA JOSHI
            </p>
            <p class="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">
              FOUNDER, JARURAT CARE FOUNDATION
            </p>
          </div>
          <div class="w-12 h-[1.5px] bg-blue-300"></div>
        </div>
      </div>

    </div>

    <div class="max-w-3xl mx-auto w-full space-y-8">
      <h2 class="text-3xl font-extrabold text-[#0D2561] text-center tracking-tight">
        FAQ
      </h2>

      <div class="space-y-4">
        {#each faqs as faq, i}
          <div class="bg-white/80 border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm transition-all duration-200">
            <button
              on:click={() => toggleFaq(i)}
              class="w-full px-6 py-4 text-left flex justify-between items-center gap-4 text-[#78C520] font-bold text-sm md:text-base hover:text-[#68B218] transition-colors"
            >
              <span>{faq.question}</span>
              <ChevronDown
                size={18}
                class="text-[#78C520] transition-transform duration-300 shrink-0 {faq.open ? 'rotate-180' : ''}"
              />
            </button>

            {#if faq.open}
              <div class="px-6 pb-4 text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                {faq.answer}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

  </div>
</section>