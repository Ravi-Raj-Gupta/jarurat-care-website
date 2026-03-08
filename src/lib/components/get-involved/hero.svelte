<script>
    let heroImage = '/get-involved/research-bg.webp'; 
    import Button from '$lib/components/ui/button.svelte';
</script>

<section class="relative w-full pt-32 pb-20 bg-[#F4F8FF] overflow-hidden">
    <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-2 items-center gap-12">

            <div class="space-y-5 md:pr-8">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-full backdrop-blur-sm">
                    <span class="relative flex h-1.5 w-1.5">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-40"></span>
                        <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2563EB]"></span>
                    </span>
                    
                    <span class="text-[#2563EB] font-bold text-[10px] md:text-[11px] tracking-[0.18em] uppercase">
                        Advocacy & Impact
                    </span>
                </div>

                <h1 class="text-2xl md:text-4xl font-bold text-[#0D2561] leading-tight">
                    Join Our <br/> 
                    <span class="text-[#2563EB]">Advisory Board</span>
                </h1>

                <p class="text-[#475569] text-sm md:text-base max-w-md leading-relaxed opacity-90">
                    Be part of India’s most inclusive cancer support ecosystem. 
                    Collaborate with experts to shape patient-centered care and bridge treatment gaps.
                </p>

                <div class="pt-4">
                    <a href="/contact-us">
                        <button class="bg-[#1E40AF] text-white px-6 py-3 rounded-full text-sm font-medium shadow-md
                         hover:bg-white hover:text-[#1E40AF] hover:border hover:border-[#1E40AF] transition-colors duration-300">
                            Scan to Join Us
                        </button>
                    </a>
                </div>
            </div>

            <div class="relative mt-8 md:mt-0">
                <div class="relative rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    <img 
                        src={heroImage} 
                        alt="Medical Research Abstract" 
                        class="w-full h-auto object-cover aspect-[4/3] md:aspect-[16/10]" 
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0D2561]/10 to-transparent"></div>
                </div>
            </div>

        </div>
    </div>
</section>