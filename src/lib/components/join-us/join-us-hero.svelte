<script>
    import background from "$lib/assets/join-us-hero.png";
</script>

<div class="relative">

    <div
        class="w-full h-72 md:h-96 bg-cover bg-center relative"
        style={`background-image: url(${background})`}
    >

        <!-- Gradient overlay for readability -->
        <div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>

        <div class="font-extrabold text-3xl text-white md:hidden flex justify-center items-center h-full relative">
            Join Us
        </div>

    </div>

    <div class="text-primaryBlue mt-7 md:mt-0 text-center md:text-start max-w-[520px] px-6 md:px-0 md:absolute md:bottom-12 md:left-12 relative">

        <!-- Stronger title hierarchy -->
        <div class="font-extrabold text-4xl md:text-5xl leading-tight">
            Volunteer
        </div>

        <!-- Improved paragraph readability -->
        <div class="text-base md:text-lg mt-4 text-gray-700">
            Join Jarurat Care in supporting patients and families affected by
            gastrointestinal and biliary tract cancers. Contribute through
            internships, volunteering, and awareness initiatives.
        </div>

    </div>

</div>