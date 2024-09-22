<script>
  let latest = "Latest";
  let inCancer = "in Cancer";

  const articles = [
    {
      title: "Global Cancer Incidence and Mortality Rates and Trends",
      authors: [],
      abstract: "There are limited published data on recent cancer incidence and mortality trends worldwide. We used the International Agency for Research on Cancer's CANCERMondial clearinghouse to present age-",
      page: null,
      action: "Read Now"
    },
    {
      title: "Measuring Cancer Evolution from the Genome",
      authors: [],
      abstract: "The temporal dynamics of cancer evolution remain elusive, because it is impractical to longitudinally observe cancers unperturbed by treatment.",
      page: null,
      action: "Read Now"
    },
    {
      title: "The Role of Telomerase in Breast Cancer's Response to Therapy",
      authors: [],
      abstract: "Currently, breast cancer appears to be the most widespread cancer in the world and the most common cause of cancer deaths.",
      page: null,
      action: "Read Now"
    },
    {
      title: "Understanding Cancer Treatment Options",
      authors: [],
      abstract: "This article discusses various treatment options for cancer, including chemotherapy, radiation, and surgical interventions.",
      page: null,
      action: "Read Now"
    },
    {
      title: "Advancements in Cancer Research",
      authors: [],
      abstract: "Recent advancements in cancer research are paving the way for more effective treatments and better patient outcomes.",
      page: null,
      action: "Read Now"
    },
     {
      title: "Global Cancer Incidence and Mortality Rates and Trends",
      authors: [],
      abstract: "There are limited published data on recent cancer incidence and mortality trends worldwide. We used the International Agency for Research on Cancer's CANCERMondial clearinghouse to present age-",
      page: null,
      action: "Read Now"
    }
  ];

  let currentPage = 1;
  const itemsPerPage = 3;

  // Function to get the items for the current page
  function paginatedItems(page, array) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array.slice(startIndex, endIndex);
  }

  // Reactive statement to update data when currentPage changes
  $: articlesPagination = paginatedItems(currentPage, articles);
  const buttonArray = Array.from({ length: Math.ceil(articles.length / itemsPerPage) });

  function goToPage(page) {
    currentPage = page;
  }

  function handleClick(item) {
    // Your click handling logic here
    console.log(item.title);
  }
</script>

<style>
  .border-grad {
    border: 1px solid;
    border-image-source: linear-gradient(2.73deg, #00C8F4 -55.63%, #24D0F5 20.89%, #D6B7FF 104.25%, #FFFFFF 161.36%);
    border-image-slice: 1;
    border-radius: 1rem;
  }
</style>

<div class="mx-12 py-16">
  <div class="flex flex-col gap-4 mb-16">
    <h1 class="text-[#0D2561] font-[600] text-[2.5rem]">
      {latest} <span class="text-[#0155BD]">{inCancer}</span>
    </h1>
  </div>

  <div class="hidden sm:grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[1rem]">
    {#if articles.length > 0}
      {#each articles as item}
        <div class="p-4 flex flex-col gap-[0.5rem] border-grad">
          <h1 class="text-[#24272A] h-12 font-[600]">{item.title}</h1>
          <p class="text-[#676E73] mt-4">{item.abstract.slice(0, 80)}...</p>
          <button class="md:w-1/3 w-1/2 h-10 mt-[0.5rem] rounded-[1.5rem] text-white bg-[#0155BD]" on:click={() => { handleClick(item); }}>
            {item.action}
          </button>
        </div>
      {/each}
    {:else}
      <div class="p-4 flex flex-col gap-[0.5rem] border-grad">
        <h1 class="text-[#24272A] font-[600]">No Articles Available</h1>
        <p class="text-[#676E73]">There are currently no articles to display.</p>
      </div>
    {/if}
  </div>

  <div class="grid sm:hidden grid-cols-1 gap-[1rem]">
    {#if articlesPagination.length > 0}
      {#each articlesPagination as item}
        <div class="p-4 flex flex-col gap-[0.5rem] border-grad">
          <h1 class="text-[#24272A] font-[600]">{item.title}</h1>
          <p class="text-[#676E73]">{item.abstract.slice(0, 80)}...</p>
          <button class="md:max-w-1/3 w-1/2 h-10 mt-[0.5rem] rounded-[1.5rem] text-white bg-[#0155BD]" on:click={() => { handleClick(item); }}>
            {item.action}
          </button>
        </div>
      {/each}
    {:else}
      <div class="p-4 flex flex-col gap-[0.5rem] border-grad">
        <h1 class="text-[#24272A] font-[600]">No Articles Available</h1>
        <p class="text-[#676E73]">There are currently no articles to display.</p>
      </div>
    {/if}
  </div>

  <!-- Pagination controls visible only below md -->
  <div class="flex sm:hidden justify-center gap-4 py-8">
    {#each buttonArray as item, i}
      <button on:click={() => goToPage(i + 1)} 
              disabled={currentPage === (i + 1)} 
              class="px-4 py-2 border bg-[#CFD6DF] disabled:bg-black disabled:text-white rounded h-8 w-8 flex justify-center items-center">
        {i + 1}
      </button>
    {/each}
  </div>
</div>
