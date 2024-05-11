<script lang="ts">
	import { marked } from 'marked';

	export let content: string;
</script>

<div class="max-w-[80%] border px-3 py-2 rounded-md self-start prose text-[0.9em] md:text-normal leading-[1.5]">
	{@html marked(content)}
</div>