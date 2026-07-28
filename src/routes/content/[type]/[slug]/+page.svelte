<script lang="ts">
  import Nav from '$lib/components/nav.svelte';
  import NewsFooter from '$lib/components/news-footer.svelte';
  import { onMount } from 'svelte';
  import { Link as LinkIcon, Heart, Share2, Bookmark } from 'lucide-svelte';
  import { cmsSupabase } from '$lib/cmsSupabase';
  import toast, { Toaster } from 'svelte-french-toast';

  export let data;
  $: ({ article, type, comments = [] } = data);

  let readingProgress = 0;
  let articleEl: HTMLElement;

  let isLiked = false;
  let user: any = null;

  onMount(async () => {
    const onScroll = () => {
      if (!articleEl) return;
      const rect = articleEl.getBoundingClientRect();
      const total = articleEl.offsetHeight;
      const scrolled = Math.max(0, -rect.top + 100);
      readingProgress = Math.min(100, Math.max(0, Math.round((scrolled / total) * 100)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Check user auth and interactions
    const { data: { session } } = await cmsSupabase.auth.getSession();
    if (session) {
      user = session.user;
      checkInteractions();
    }

    return () => window.removeEventListener('scroll', onScroll);
  });

  async function checkInteractions() {
    if (!user) return;
    try {
      const { data } = await cmsSupabase
        .from('article_likes')
        .select('id')
        .eq('article_id', article.id)
        .eq('reader_id', user.id)
        .maybeSingle();
      if (data) isLiked = true;
    } catch (e) {
      console.error(e);
    }
  }

  async function toggleLike() {
    if (!user) {
      toast.error('Please login to like articles');
      return;
    }
    try {
      if (isLiked) {
        await cmsSupabase
          .from('article_likes')
          .delete()
          .eq('article_id', article.id)
          .eq('reader_id', user.id);
        isLiked = false;
      } else {
        await cmsSupabase
          .from('article_likes')
          .insert([{ article_id: article.id, reader_id: user.id }]);
        isLiked = true;
        // Optionally toast.success('Liked') but visual change is often enough
      }
    } catch (e) {
      toast.error('Could not update like status');
    }
  }

  async function shareArticle() {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.href
      }).catch(console.error);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  }

  function formatDate(dateValue: string | null | undefined) {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  import { enhance } from '$app/forms';
  let submittingComment = false;
</script>

<svelte:head>
  <title>{article.seo_title || article.title} — Jarurat Care Foundation</title>
  <meta name="description" content={article.seo_description || article.excerpt || ''} />
  <meta property="og:title" content={article.seo_title || article.title} />
  <meta property="og:description" content={article.seo_description || article.excerpt || ''} />
  {#if article.featured_image}
    <meta property="og:image" content={article.featured_image} />
  {/if}
</svelte:head>

<Toaster />

<Nav />

<div class="fixed top-0 left-0 right-0 z-[100] h-1 bg-gray-200">
  <div class="h-full bg-[#004085] transition-all duration-100" style="width:{readingProgress}%"/>
</div>

<div class="min-h-screen pt-28 pb-32 bg-[#FAFAF8]">
  <article bind:this={articleEl} class="max-w-4xl mx-auto px-6 font-inter">
    
    <div class="mb-10">
      <span class="inline-block px-4 py-1.5 bg-[#004085] text-white text-xs font-bold uppercase tracking-wider rounded-full mb-6">
        {type}
      </span>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">{article.title}</h1>
      
      <div class="flex items-center text-gray-500 text-sm gap-6 border-t border-gray-200 pt-6 mt-6">
        <span class="flex items-center gap-2">📅 {formatDate(article.created_at)}</span>
        {#if article.author}
          <span class="flex items-center gap-2">✍️ {article.author}</span>
        {/if}
      </div>

      <div class="flex items-center gap-4 mt-6">
        <button on:click={toggleLike} class="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 {isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}">
          <Heart size={18} class={isLiked ? "fill-current" : ""} />
          <span class="font-medium text-sm">{isLiked ? 'Liked' : 'Like'}</span>
        </button>

        <button on:click={shareArticle} class="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all duration-200">
          <Share2 size={18} />
          <span class="font-medium text-sm">Share</span>
        </button>
      </div>
    </div>

    {#if article.featured_image}
      <img src={article.featured_image} alt={article.title} class="w-full h-auto max-h-[500px] object-cover rounded-xl mb-12 shadow-sm border border-gray-100"/>
    {/if}
    
    <div class="article-body prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed">
      {#if article.source_table === 'cms_content'}
        {@html article.content}
      {:else}
        <!-- Research Article Layout -->
        {#if article.abstract}
          <div class="mb-12">
            <h2 class="text-2xl font-bold text-[#004085] mb-6 border-b border-gray-200 pb-3">Abstract</h2>
            <div>{@html article.abstract}</div>
          </div>
        {/if}
        {#if article.introduction}
          <div class="mb-12">
            <h2 class="text-2xl font-bold text-[#004085] mb-6 border-b border-gray-200 pb-3">Introduction</h2>
            <div>{@html article.introduction}</div>
          </div>
        {/if}
        {#if article.methods}
          <div class="mb-12">
            <h2 class="text-2xl font-bold text-[#004085] mb-6 border-b border-gray-200 pb-3">Methods</h2>
            <div>{@html article.methods}</div>
          </div>
        {/if}
        {#if article.results}
          <div class="mb-12">
            <h2 class="text-2xl font-bold text-[#004085] mb-6 border-b border-gray-200 pb-3">Results</h2>
            <div>{@html article.results}</div>
          </div>
        {/if}
        {#if article.discussion}
          <div class="mb-12">
            <h2 class="text-2xl font-bold text-[#004085] mb-6 border-b border-gray-200 pb-3">Discussion</h2>
            <div>{@html article.discussion}</div>
          </div>
        {/if}
        {#if article.conclusion}
          <div class="mb-12">
            <h2 class="text-2xl font-bold text-[#004085] mb-6 border-b border-gray-200 pb-3">Conclusion</h2>
            <div>{@html article.conclusion}</div>
          </div>
        {/if}
        {#if article.funding}
          <div class="mb-8 p-6 bg-blue-50 rounded-lg">
            <h3 class="text-lg font-bold text-[#004085] mb-2">Funding</h3>
            <div class="text-base">{@html article.funding}</div>
          </div>
        {/if}
        {#if article.ethics_statement}
          <div class="mb-8 p-6 bg-gray-100 rounded-lg">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Ethics Statement</h3>
            <div class="text-base">{@html article.ethics_statement}</div>
          </div>
        {/if}
      {/if}
    </div>

    <!-- References/Citations for Research Articles -->
    {#if article.source_table === 'research_articles' && article.references}
      <div class="mt-20 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h3 class="flex items-center gap-2 text-xl font-bold text-[#004085] mb-6">
              <LinkIcon size={20}/> References & Citations
          </h3>
          <div class="prose prose-sm max-w-none text-gray-600 marker:text-gray-400">
            {@html article.references}
          </div>
      </div>
    {/if}

  </article>

  <!-- Comments Section -->
  <section class="mt-16 max-w-4xl mx-auto px-4 md:px-0 mb-20">
    <h3 class="text-2xl font-bold text-[#0D2460] mb-8 border-b pb-4">Comments ({comments.length})</h3>
    
    {#if user}
      <form
        method="POST"
        action="?/submitComment"
        class="mb-12 bg-gray-50 p-6 rounded-xl border border-gray-100"
        use:enhance={() => {
          submittingComment = true;
          return async ({ update, result }) => {
            await update({ reset: false }); 
            submittingComment = false;
            
            if (result.type === 'failure') {
              toast.error(result.data?.message || 'Failed to post comment');
            } else {
              toast.success('Comment posted!');
              const ta = document.querySelector('textarea[name="content"]');
              if(ta) ta.value = '';
            }
          };
        }}
      >
        <input type="hidden" name="articleId" value={article.id} />
        <label for="comment-content" class="sr-only">Your Comment</label>
        <textarea
          id="comment-content"
          name="content"
          rows="3"
          required
          placeholder="Share your thoughts on this..."
          class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0155bd] resize-none"
        ></textarea>
        <div class="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={submittingComment}
            class="bg-[#0155bd] text-white px-6 py-2 rounded-lg font-semibold shadow-sm hover:bg-[#004085] transition-colors disabled:opacity-50"
          >
            {submittingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    {:else}
      <div class="mb-12 bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
        <p class="text-gray-600 mb-4">Please log in to join the discussion.</p>
        <a href="/cms/login" class="inline-block bg-[#0155bd] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#004085] transition">Log in</a>
      </div>
    {/if}

    <div class="space-y-6">
      {#each comments as comment}
        <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex gap-4">
          <div class="w-10 h-10 rounded-full bg-[#0155bd] text-white flex items-center justify-center font-bold flex-shrink-0">
            {(comment.profiles?.full_name || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div class="flex items-baseline gap-3 mb-1">
              <h4 class="font-bold text-gray-900">{comment.profiles?.full_name || 'Anonymous'}</h4>
              <span class="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
            </div>
            <p class="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
        </div>
      {:else}
        <p class="text-gray-500 italic text-center py-8">No comments yet. Be the first to share your thoughts!</p>
      {/each}
    </div>
  </section>
</div>

<NewsFooter />

<style>
  :global(.article-body h1, .article-body h2, .article-body h3, .article-body h4) {
    color: #111827;
    margin-top: 2em;
    margin-bottom: 1em;
  }
  :global(.article-body p) {
    margin-bottom: 1.5em;
  }
  :global(.article-body a) {
    color: #004085;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  :global(.article-body img) {
    border-radius: 12px;
    margin: 2em auto;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
  :global(.article-body ul, .article-body ol) {
    padding-left: 1.5em;
    margin-bottom: 1.5em;
  }
  :global(.article-body li) {
    margin-bottom: 0.5em;
  }
</style>
