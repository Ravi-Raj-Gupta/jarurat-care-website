<script>
    import DoubleArrow from "$lib/svg/double-arrow.svelte";

    let email = "";
    let supportText = "Support Us";
    let newsText = "Subscribe to our Newsletter";
    let newsDes = "Get the latest updates, inspiring stories and important news delivered right to your inbox.";
    let collaborateText = "Be part of the Journey";
    let collaborateDes = "Our mission thrives through the support of compassionate corporates, individuals, and organizations. You can be part of this journey too. Every contribution brings hope, supports life-saving care, and helps patients receive the treatment they need. Join us in making a difference.";
    let confirmationMessage = "";
    let taxDes = "All donations to JaruratCare Foundation are eligible for 50% tax exemption under section 80G of the Income Tax Act.";

    const mailchimpAction =
        "https://care.us16.list-manage.com/subscribe/post?u=1c1adf80af9253ef26764a28d&id=3ed044ddf2&f_id=00e80de0f0";

    function validateEmail(value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(value).toLowerCase());
    }

    function handleSubmit() {
        if (validateEmail(email)) {
            confirmationMessage = "Thank you for subscribing!";
        } else {
            confirmationMessage = "Please enter a valid email address.";
        }
    }
</script>

<!-- Section Header -->
<div class="w-full bg-[#DCEEFF] py-12 text-center">
    <h2 class="text-[32px] md:text-[36px] font-bold text-[#0C1F56]">Connect With JCF</h2>
</div>

<div class="hidden md:block max-w-[1312px] mx-auto my-16 px-4">
    <div class="hidden md:grid grid-cols-2 gap-8 items-stretch">
        
        <!-- Left Card: Subscribe Box -->
        <div class="bg-[#DCEEFF] p-8 rounded-none flex flex-col justify-between">
            <div class="relative px-2 flex flex-col gap-3">
                <div>
                    <!-- Badge -->
                    <span class="inline-block bg-[#FFE3B3] text-[#B45309] border border-[#F59E0B] text-[11px] font-bold tracking-wider px-3 py-1 rounded-full mb-3 uppercase">
                        NEWSLETTER
                    </span>
                    
                    <h1 class="text-[#0C1F56] font-bold text-[1.85rem] leading-snug">
                        {newsText}
                    </h1>
                    
                    <p class="text-[#596273] font-normal text-[0.95rem] mt-2 leading-relaxed max-w-[90%]">
                        {newsDes}
                    </p>
                </div>

                <!-- Input & Submit Form matching Figma specs -->
                <form
                    class="flex items-center w-full gap-3 mt-6"
                    action={mailchimpAction}
                    method="post"
                    target="_blank"
                >
                    <!-- Email Input Box with exact #1E4ED8 border color -->
                    <input
                        class="w-full max-w-[448px] h-[64px] px-5 rounded-md border border-[#1E4ED8] bg-[#FAFAFA] text-base text-[#0C1F56] placeholder-[#A0AEC0] focus:outline-none focus:ring-1 focus:ring-[#1E4ED8]"
                        bind:value={email}
                        placeholder="Enter your email address"
                        type="email"
                        name="EMAIL"
                        id="mce-EMAIL"
                        required
                    />

                    <!-- Compact Pill Submit Button with exact #1E4ED8 border color -->
                    <button
                        type="submit"
                        on:click={handleSubmit}
                        class="h-[64px] px-8 bg-white hover:bg-blue-50 border border-[#1E4ED8] text-[#1E4ED8] font-semibold rounded-full text-base flex items-center justify-center transition-colors whitespace-nowrap shadow-sm shrink-0"
                    >
                        Submit
                    </button>

                    <div aria-hidden="true" style="position: absolute; left: -5000px;">
                        <input
                            type="text"
                            name="b_1c1adf80af9253ef26764a28d_3ed044ddf2"
                            tabindex="-1"
                            value=""
                        />
                    </div>
                </form>

                {#if confirmationMessage}
                    <p class="text-[#596273] text-sm mt-1">{confirmationMessage}</p>
                {/if}
            </div>
        </div>

        <!-- Right Card: Collaborate With Us -->
        <div class="py-4 pl-6 pr-4 flex flex-col justify-between">
            <div class="border-[#1E4ED8] border-l-4 pl-6 flex flex-col gap-4">
                <div>
                    <span class="inline-block bg-[#FFE3B3] text-[#B45309] border border-[#F59E0B] text-[11px] font-bold tracking-wider px-3 py-1 rounded-full mb-3 uppercase">
                        COLLABORATE WITH US
                    </span>
                    
                    <h1 class="text-[#0C1F56] font-bold text-[1.85rem] leading-snug">
                        {collaborateText}
                    </h1>
                    
                    <p class="text-[#596273] font-normal text-[0.95rem] mt-2 leading-relaxed">
                        {collaborateDes}
                    </p>
                </div>

                <!-- Double Blue Arrows ">>" -->
                <div class="grid grid-cols-2 w-full gap-4 mt-6">
                    <div class="flex items-center">
                        <span class="text-[#1E4ED8] font-bold text-base mr-2 leading-none">»»</span>
                        <a href="/" class="font-bold text-[#1E4ED8] text-[0.95rem] hover:underline">
                            Join Jarurat Care Team
                        </a>
                    </div>
                    <div class="flex items-center">
                        <span class="text-[#1E4ED8] font-bold text-base mr-2 leading-none">»»</span>
                        <a href="/" class="font-bold text-[#1E4ED8] text-[0.95rem] hover:underline">
                            Donate Money
                        </a>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

<!-- Mobile layout -->
<div class="w-full relative pb-16 md:hidden flex flex-col items-center bg-[#DCEEFF]">
    <div class="max-w-[65rem] flex flex-col h-full p-[1.25rem] bg-white rounded-[0.5rem] shadow-[0px_0px_10px_2px_rgba(1,85,189,0.12)] mt-[6rem]">
        <div class="max-w-[16rem] flex flex-col gap-4 items-center">
            <h1 class="w-auto h-[2rem] text-center font-rubik text-[1.75rem] text-[#0155BD] font-medium leading-[2rem]">
                {supportText}
            </h1>
            <p class="w-2/3 text-[0.75rem] font-[500] text-center text-[#0D2561]">{taxDes}</p>
        </div>
        <a href="/donate">
            <button class="mx-auto mt-12 h-[3rem] w-2/3 text-white py-[1rem] bg-[#FFBA41] rounded-3xl flex items-center justify-center">
                Donate
            </button>
        </a>
    </div>

    <div class="max-w-[65rem] flex flex-col h-full p-[1.25rem] bg-white rounded-[0.5rem] shadow-[0px_0px_10px_2px_rgba(1,85,189,0.12)] mt-[6rem]">
        <div class="max-w-[16rem] flex flex-col gap-12 items-center">
            <h1 class="w-auto text-center font-rubik text-[1.75rem] text-[#0155BD] font-medium leading-[2rem]">
                {newsText}
            </h1>
            <p class="w-full text-[1rem] font-[500] text-center text-[#0D2561]">{newsDes}</p>
        </div>

        <form class="mt-12 flex flex-col gap-4" action={mailchimpAction} method="post" target="_blank">
            <input
                class="w-full p-4 h-[64px] bg-[#FFF1D2] rounded-md border border-[#1E4ED8]"
                bind:value={email}
                placeholder="Enter your email address"
                type="email"
                name="EMAIL"
                id="mce-EMAIL-mobile"
                required
            />

            <button
                type="submit"
                on:click={handleSubmit}
                class="h-12 p-6 mx-auto text-white bg-[#0155BD] rounded-3xl flex items-center justify-center"
            >
                Submit
            </button>

            <div aria-hidden="true" style="position: absolute; left: -5000px;">
                <input
                    type="text"
                    name="b_1c1adf80af9253ef26764a28d_3ed044ddf2"
                    tabindex="-1"
                    value=""
                />
            </div>
        </form>

        {#if confirmationMessage}
            <p class="text-[#3B3E43] mt-4 text-center">{confirmationMessage}</p>
        {/if}
    </div>
</div>