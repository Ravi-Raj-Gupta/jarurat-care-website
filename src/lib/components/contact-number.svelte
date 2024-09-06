<style>
  input:focus {
    background-color: #D3F2FC; /* Change to the desired background color when selected */
       border: 2px solid #0155BD;
  }
  
   

  input:focus::placeholder, textarea:focus::placeholder {
    color: #0155BD; /* Change placeholder color when input is focused */
  }
  @media (max-width: 600px){
    input::placeholder {
    color: #676E73;
    font-weight: 400;
  }
  }
  input:focus::placeholder, textarea:focus::placeholder {
    color: #0155BD; /* Change placeholder color when input is focused */
  }
</style>
<div class=" rounded-lg">
            <label class="text-[#3B3E43] text-sm mb-1 ">
                Phone number
            </label>
            <div class="relative  text-[#3B3E43]">
                <div class="a absolute inset-y-0 my-[2px] ml-[2px] bg-[#D3F2FC]  pl-3  flex items-center border-r-2 border-[#0155BD] pr-2">
                    <select class="  text-sm bg-[#D3F2FC] font-[600] text-[18px] text-[#0155BD] outline-none rounded-lg h-full">
                        <option class="">US</option>
                        <option class="">ES</option>
                        <option class="">MR</option>
                    </select>
                </div>
                <input type="number" placeholder="+1 (555) 000-000" class="w-full pl-[4.5rem] pr-3 py-[12px] appearance-none md:bg-[#E8EBF1] bg-white outline-none border focus:border-slate-600 shadow-sm rounded-lg">
            </div>
        </div>