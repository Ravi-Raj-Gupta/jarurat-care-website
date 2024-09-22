<script>
    import { onMount } from 'svelte';
    import SearchResult from './search-result.svelte';
    
    let mainAlphabet = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
            'U', 'V'
        ];
    let leftAlphabet =  [
            'W', 'X', 'Y', 'Z'
        ];;
    
    onMount(() => {
        const width = window.innerWidth;
        if(width<800){
            mainAlphabet = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
            'U', 
        ];
        
        leftAlphabet = [
            'V','W', 'X', 'Y', 'Z'
        ];
        }
    });

    // Reactive variable to track selected button
    let selectedLetter = mainAlphabet[0];

    // Function to handle button clicks
    function handleClick(letter) {
        selectedLetter = letter
    }
</script>

<div class=" mx-auto max-w-[65rem] flex justify-center mt-12 mb-[6.5rem] px-[1.5rem] md:p-0">
    <div class="grid gap-[0.5rem] md:gap-[1.5rem]  grid-cols-[repeat(7,minmax(0,1fr))] lg:grid-cols-[repeat(11,minmax(0,1fr))]">
        {#each mainAlphabet as letter}
            <button 
                class={`h-10 w-10 flex items-center justify-center rounded-full 
                        ${selectedLetter === letter ? 'bg-blue-500 text-white' : 'bg-[#E8EBF1]'}`} 
                on:click={() => handleClick(letter)}
            >
                {letter}
            </button>
        {/each}

        <div class="col-span-full flex justify-center">
            {#each leftAlphabet as letter}
                <button 
                    class={`mx-2 h-10 w-10 flex items-center justify-center rounded-full 
                            ${selectedLetter === letter ? 'bg-[#0155BD] text-white' : 'bg-[#E8EBF1]'}`} 
                    on:click={() => handleClick(letter)}
                >
                    {letter}
                </button>
            {/each}
        </div>
    </div>
</div>

<div class=" px-16  w-full  h-full  mb-[8rem] flex flex-col gap-[3rem]">
    <div class="relative ">
        <h1 class="md:text-[8rem] py-2 border-b-2 md:border-0 border-[#CFD6DF] font-[400] text-[48px] leading-none text-[#0155BD]">
            {selectedLetter}{selectedLetter.toLocaleLowerCase()}
        </h1>
    </div>
    <div class="h-full flex flex-col gap-[2.5rem]">
        <SearchResult />
        <SearchResult />
        <SearchResult />
        <SearchResult />
        <SearchResult />
        <SearchResult />    

    </div>
</div>

<style>
    /* Additional styles can be added here if needed */
</style>
