<script>
export let content;
</script>

<div class="relative w-full flex justify-center items-center">
    <!-- Background Card -->
    <div class="back bg-[#0D2561] -rotate-1 rounded-2xl w-[100%] h-[18rem]"></div>
    <!-- Foreground Card -->
    <div class="front bg-[#FFFFFF] absolute bottom-2 left-0 rounded-2xl w-[80%] h-[18rem] flex justify-center items-center text-center p-4">
        <!-- Content Box that Shrinks or Scrolls -->
        <div class="w-full h-full flex flex-col justify-center items-center overflow-auto">
            <div class="w-full max-h-full overflow-auto text-sm sm:text-base text-center break-words leading-tight">
                {content}
            </div>
        </div>
    </div>
</div>


