<script>
  import DropDownArrow from "$lib/svg/drop-down-arrow.svelte";
  export let color
</script>

<style>
  select {
    -webkit-appearance: none; /* Removes default styling in WebKit browsers */
    -moz-appearance: none; /* Removes default styling in Firefox */
    appearance: none; /* Removes default styling in other browsers */

    border: 2px solid transparent; /* Make sure it doesn’t show an extra border */
    padding-right: 2.5rem; /* Space for custom arrow */
  }

  .select-wrapper {
    position: relative;
  }

  
   select:focus {
    background-color: #D3F2FC; /* Change to the desired background color when selected */
       border: 2px solid #0155BD;
       
  }
</style>

<div class="rounded-lg">
  <label style="color: {color}" class="text-gray-600 text-sm mb-1">
    Select Your Role
  </label>
  <div class="select-wrapper text-gray-500 ">
    <select class="  hover:border-[#0155BD] focus:outline-none focus:border-[#0155BD] relative w-full h-12 text-sm font-[600] bg-[white] md:bg-[#E8EBF1] text-[#0155BD] outline-none rounded-lg pl-4 pr-10">
      <option>Care Giver</option>
      <option>Volunteer</option>
      <option>Joining Team</option>
    </select>
    <DropDownArrow class="custom-arrow" />
  </div>
</div>
