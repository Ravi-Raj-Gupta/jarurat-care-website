 <script>
    const array =[
  {
    "title": "The Role of Telomerase in Breast Cancer's Response to Therapy",
    "authors": [
      "Lindsey A Torre",
      "Rebecca L Seigel",
      "Elizabeth M Ward",
      "Ahmedin Jemal"
    ],
    "abstract": "The paper details variations in cancer incidence across different regions, with higher rates observed in high-income countries due to better detection and reporting mechanisms. Mortality rates, however, remain disproportionately high in low- and middle-income countries, where access to timely diagnosis and treatment is limited. The study emphasizes the urgent need for global collaboration in cancer prevention, early detection, and improved healthcare infrastructure to reduce the growing burden of cancer globally.",
    "page": 40,
    "action": "Read Now"
  },
  {
    "title": "The Role of Telomerase in Breast Cancer's Response to Therapy",
    "authors": [
      "Lindsey A Torre",
      "Rebecca L Seigel",
      "Elizabeth M Ward",
      "Ahmedin Jemal"
    ],
    "abstract": "The paper details variations in cancer incidence across different regions, with higher rates observed in high-income countries due to better detection and reporting mechanisms. Mortality rates, however, remain disproportionately high in low- and middle-income countries, where access to timely diagnosis and treatment is limited. The study emphasizes the urgent need for global collaboration in cancer prevention, early detection, and improved healthcare infrastructure to reduce the growing burden of cancer globally.",
    "page": 40,
    "action": "Read Now"
  },
  {
    "title": "The Role of Telomerase in Breast Cancer's Response to Therapy",
    "authors": [
      "Lindsey A Torre",
      "Rebecca L Seigel",
      "Elizabeth M Ward",
      "Ahmedin Jemal"
    ],
    "abstract": "The paper details variations in cancer incidence across different regions, with higher rates observed in high-income countries due to better detection and reporting mechanisms. Mortality rates, however, remain disproportionately high in low- and middle-income countries, where access to timely diagnosis and treatment is limited. The study emphasizes the urgent need for global collaboration in cancer prevention, early detection, and improved healthcare infrastructure to reduce the growing burden of cancer globally.",
    "page": 40,
    "action": "Read Now"
  },
  {
    "title": "The Role of Telomerase in Breast Cancer's Response to Therapy",
    "authors": [
      "Lindsey A Torre",
      "Rebecca L Seigel",
      "Elizabeth M Ward",
      "Ahmedin Jemal"
    ],
    "abstract": "The paper details variations in cancer incidence across different regions, with higher rates observed in high-income countries due to better detection and reporting mechanisms. Mortality rates, however, remain disproportionately high in low- and middle-income countries, where access to timely diagnosis and treatment is limited. The study emphasizes the urgent need for global collaboration in cancer prevention, early detection, and improved healthcare infrastructure to reduce the growing burden of cancer globally.",
    "page": 40,
    "action": "Read Now"
  },
  {
    "title": "The Role of Telomerase in Breast Cancer's Response to Therapy",
    "authors": [
      "Lindsey A Torre",
      "Rebecca L Seigel",
      "Elizabeth M Ward",
      "Ahmedin Jemal"
    ],
    "abstract": "The paper details variations in cancer incidence across different regions, with higher rates observed in high-income countries due to better detection and reporting mechanisms. Mortality rates, however, remain disproportionately high in low- and middle-income countries, where access to timely diagnosis and treatment is limited. The study emphasizes the urgent need for global collaboration in cancer prevention, early detection, and improved healthcare infrastructure to reduce the growing burden of cancer globally.",
    "page": 40,
    "action": "Read Now"
  },{
    "title": "The Role of Telomerase in Breast Cancer's Response to Therapy",
    "authors": [
      "Lindsey A Torre",
      "Rebecca L Seigel",
      "Elizabeth M Ward",
      "Ahmedin Jemal"
    ],
    "abstract": "The paper details variations in cancer incidence across different regions, with higher rates observed in high-income countries due to better detection and reporting mechanisms. Mortality rates, however, remain disproportionately high in low- and middle-income countries, where access to timely diagnosis and treatment is limited. The study emphasizes the urgent need for global collaboration in cancer prevention, early detection, and improved healthcare infrastructure to reduce the growing burden of cancer globally.",
    "page": 40,
    "action": "Read Now"
  },{
    "title": "The Role of Telomerase in Breast Cancer's Response to Therapy",
    "authors": [
      "Lindsey A Torre",
      "Rebecca L Seigel",
      "Elizabeth M Ward",
      "Ahmedin Jemal"
    ],
    "abstract": "The paper details variations in cancer incidence across different regions, with higher rates observed in high-income countries due to better detection and reporting mechanisms. Mortality rates, however, remain disproportionately high in low- and middle-income countries, where access to timely diagnosis and treatment is limited. The study emphasizes the urgent need for global collaboration in cancer prevention, early detection, and improved healthcare infrastructure to reduce the growing burden of cancer globally.",
    "page": 40,
    "action": "Read Now"
  },{
    "title": "The Role of Telomerase in Breast Cancer's Response to Therapy",
    "authors": [
      "Lindsey A Torre",
      "Rebecca L Seigel",
      "Elizabeth M Ward",
      "Ahmedin Jemal"
    ],
    "abstract": "The paper details variations in cancer incidence across different regions, with higher rates observed in high-income countries due to better detection and reporting mechanisms. Mortality rates, however, remain disproportionately high in low- and middle-income countries, where access to timely diagnosis and treatment is limited. The study emphasizes the urgent need for global collaboration in cancer prevention, early detection, and improved healthcare infrastructure to reduce the growing burden of cancer globally.",
    "page": 40,
    "action": "Read Now"
  },

]
function goToPage(page) {
    currentPage = page;
    // Add your page navigation logic here
  }
  let currentPage = 1;
  const itemsPerPage = 3;
function paginatedItems(page, array) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array.slice(startIndex, endIndex);
  }

  // Reactive statement to update data when currentPage or arr changes
  $: dataArray = paginatedItems(currentPage, array);
    const buttonArray = Array.from({length:Math.round(array.length/itemsPerPage)})
 </script>
 <style>
   .border-grad {
  border: 1px solid; /* Set a solid border to apply the gradient on */
  border-image-source: linear-gradient(2.73deg, #00C8F4 -55.63%, #24D0F5 20.89%, #D6B7FF 104.25%, #FFFFFF 161.36%);
  border-image-slice: 1; /* Ensures the gradient covers the entire border */
  border-radius: 1rem; /* Apply rounded corners */
}
 </style>
 <div class="bg-[#F8FCFF]">



 <div class="md:ml-20 md:mx-8 my-12  ">
    <h1 class="text-[#0D2460] text-[32px] mx-8 md:mx-0  mb-8">Similar Articles</h1>
    <div class="grid gap-[2rem] ">
     {#each dataArray as item }
       <div class="border-grad bg-white p-4  lg:w-2/3 w-full ">
               <h1 class="text-[24px]">{item.title}</h1>
                 <div class=" grid gap-[1rem] md:grid-cols-4 grid-cols-3 my-4  ">
                        {#each item?.authors as i }
                            <p class="text-[#0155BD]  md:text-[1rem] text-[0.75rem]">{i}</p>
                        {/each}
                       
                 </div>
                <p>{item.abstract.slice(0, 200)}...</p>
                 <button  class="w-40 mt-8 h-10  rounded-[1.5rem] text-white bg-[#0155BD]">{item.action}</button>
      </div>
     {/each}
     
       
    </div>
 </div>
 <div class="flex justify-center  gap-4 py-8">
 {#each buttonArray as item, i}
  <button 

    on:click={() => goToPage(i + 1)} 
    disabled={currentPage === (i + 1)} 
    class="px-4 py-2 border bg-[#CFD6DF] disabled:bg-black disabled:text-white rounded h-8 w-8 flex justify-center items-center">
    {i + 1}
  </button>
{/each}
  </div>
</div>
