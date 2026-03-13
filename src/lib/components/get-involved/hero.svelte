<script>
    // Path updated to getinvolved.png
    let heroImage = 'src/lib/assets/getinvolved.png'; 
    import { ArrowRight } from "lucide-svelte";
</script>

<section class="relative w-full pt-32 pb-24 bg-[#F4F8FF] overflow-hidden">
    
    <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px]"></div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="grid lg:grid-cols-[1fr_1.2fr] items-center gap-12 lg:gap-20">

            <div class="space-y-8">
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/5 border border-blue-200 rounded-full">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-40"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]"></span>
                    </span>
                    <span class="text-[#061E5C] font-bold text-[10px] md:text-[11px] tracking-[0.2em] uppercase">
                        Advocacy & Impact
                    </span>
                </div>

                <div class="space-y-5">
                    <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#061E5C] leading-[1.1] tracking-tight">
                        Join Our <br/> 
                        <span class="text-[#2563EB]">Advisory Board</span>
                    </h1>

                    <p class="text-slate-600 text-base md:text-lg max-w-md leading-relaxed font-medium">
                        Be part of India’s most inclusive cancer support ecosystem. 
                        Collaborate with experts to shape patient-centered care.
                    </p>
                </div>

                <div class="flex flex-wrap items-center gap-6 pt-2">
                    <a href="#join-qr" class="group">
                        <button class="bg-gradient-to-r from-[#38BDF8] to-[#2563EB] text-white px-10 py-4 rounded-2xl text-base font-bold shadow-[0_20px_40px_-10px_rgba(56,189,248,0.3)] 
                                        hover:shadow-[0_25px_50px_-12px_rgba(56,189,248,0.4)] transition-all duration-300 flex items-center gap-3 group-hover:-translate-y-1">
                            Scan to Join Us
                            <ArrowRight size={20} class="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </a>

                    <div class="flex items-center gap-3">
                        <div class="flex -space-x-3">
                            <div class="w-10 h-10 rounded-full border-2 border-white bg-sky-100 flex items-center justify-center text-[10px] font-bold text-[#061E5C]">JS</div>
                            <div class="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-[#2563EB]">AK</div>
                            <div class="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold">+</div>
                        </div>
                        <span class="text-sm text-slate-500 font-semibold tracking-wide">Joined by 50+ Experts</span>
                    </div>
                </div>
            </div>

            <div class="relative group">
                <div class="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div class="relative flex justify-center md:justify-end">
                    <div class="image-mask-container w-full md:w-[850px]">
                        <img 
                            src={heroImage} 
                            alt="Medical Advisory Board" 
                            class="w-full h-auto object-contain"
                        />
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>

<style>
    h1 {
        letter-spacing: -0.03em;
    }

    /* Second image sarka faded look denyasathi custom mask */
    .image-mask-container {
        /* Mask image vaprun edges soft kele aahet */
        -webkit-mask-image: radial-gradient(
            circle, 
            black 50%, 
            rgba(0, 0, 0, 0.4) 85%, 
            transparent 100%
        );
        mask-image: radial-gradient(
            circle, 
            black 50%, 
            rgba(0, 0, 0, 0.4) 85%, 
            transparent 100%
        );
    }
</style>