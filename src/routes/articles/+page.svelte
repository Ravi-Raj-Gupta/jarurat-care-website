<!--
  src/routes/articles/+page.svelte
  PUBLIC JOURNAL — /articles
  Data: loaded from $lib/data/articles.json (localStorage for CMS edits)
  Auth: none needed on this page
  CMS:  lives at /cms (separate route, zero references here)
-->
<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { goto }               from '$app/navigation';
import Nav                    from '$lib/components/nav.svelte';
import seedArticles           from '$lib/data/articles.json';

import {
  Search, Heart, Leaf, Newspaper, ChevronRight, ChevronDown,
  LayoutGrid, List, Tag, Microscope, Baby, Brain,
  BookOpen, Award, X
} from 'lucide-svelte';

// ── Types ────────────────────────────────────────────────────────────────
interface ArticleDoc {
  id: string; slug: string; status: string;
  title: string; excerpt: string; thumbnail: string;
  category: string; tags: string[]; keywords: string[];
  readTime: number; author: string; date: string;
  stage1Approvals: string[]; stage2Approvals: string[];
  isFeatured: boolean; hidden: boolean;
}

// ── Storage key (must match CMS) ─────────────────────────────────────────
const LS_KEY = 'jarurat_cms_articles';

// ── State ────────────────────────────────────────────────────────────────
let articles: ArticleDoc[] = [];
let loading = true;

let searchQuery  = '';
let activeTag: string | null = null;
let viewMode: 'grid' | 'list' = 'grid';
let sortBy       = 'date';
let showAllTags  = false;
const TAGS_COUNT = 20;
let currentFeaturedIndex = 0;
let sliderInterval: ReturnType<typeof setInterval>;

let newsPage = 1, storiesPage = 1, wellnessPage = 1, blogsPage = 1;
let medResPage = 1, childPage = 1, mentalPage = 1;
const PER = 3;

// ── Load articles from localStorage (CMS edits) or seed JSON ─────────────
function loadArticles() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    articles = raw ? JSON.parse(raw) : (seedArticles as ArticleDoc[]);
  } catch {
    articles = seedArticles as ArticleDoc[];
  }
  loading = false;
}

// ── Reactive derivations ──────────────────────────────────────────────────
$: pubArticles = articles.filter(a => (a.status === 'published' || (!a.status && !a.hidden)) && !a.hidden);

$: sorted = [...pubArticles].sort((a, b) => {
  if (sortBy === 'title')    return a.title.localeCompare(b.title);
  if (sortBy === 'category') return a.category.localeCompare(b.category);
  return new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();
});

$: filtered = sorted.filter(a => {
  const q = searchQuery.toLowerCase();
  return (a.title.toLowerCase().includes(q) || (a.excerpt ?? '').toLowerCase().includes(q))
      && (activeTag ? (a.tags ?? []).includes(activeTag) : true);
});

$: newsItems    = filtered.filter(a => a.category === 'News');
$: storyItems   = filtered.filter(a => a.category === 'Stories');
$: wellItems    = filtered.filter(a => a.category === 'Wellness');
$: blogItems    = filtered.filter(a => a.category === 'Blogs');
$: medResItems  = filtered.filter(a => a.category === 'Medical Research');
$: childItems   = filtered.filter(a => a.category === 'Child Health');
$: mentalItems  = filtered.filter(a => a.category === 'Mental Health');
$: featuredList = filtered.filter(a => a.isFeatured);
$: hero         = featuredList[currentFeaturedIndex] ?? filtered[0];
$: sidebarPicks = filtered.filter((_, i) => i > 0 && i < 5);
$: allTags      = [...new Set(articles.flatMap(a => a.tags ?? []))];

// ── Section definitions (in script — avoids TS syntax in template) ────────
// Pagination setters defined here so they don't need type annotations in {#each}
function setNewsPage(p: number)     { newsPage     = p; }
function setStoriesPage(p: number)  { storiesPage  = p; }
function setWellnessPage(p: number) { wellnessPage = p; }
function setBlogsPage(p: number)    { blogsPage    = p; }
function setMedResPage(p: number)   { medResPage   = p; }
function setChildPage(p: number)    { childPage    = p; }
function setMentalPage(p: number)   { mentalPage   = p; }

$: sections = [
  { lbl:'Health News',      Icon:Newspaper,  col:'#106A6B', bg:'#D1EAEA', items:newsItems,   page:newsPage,    sp:setNewsPage    },
  { lbl:'Patient Stories',  Icon:Heart,      col:'#9B2335', bg:'#FAD7D7', items:storyItems,  page:storiesPage, sp:setStoriesPage  },
  { lbl:'Wellness',         Icon:Leaf,       col:'#2D6A4F', bg:'#C8E6C9', items:wellItems,   page:wellnessPage,sp:setWellnessPage },
  { lbl:'Blogs & Insights', Icon:BookOpen,   col:'#4A3F8C', bg:'#DDD6F3', items:blogItems,   page:blogsPage,   sp:setBlogsPage    },
  { lbl:'Medical Research', Icon:Microscope, col:'#7B4F00', bg:'#FDEBD0', items:medResItems, page:medResPage,  sp:setMedResPage   },
  { lbl:'Child Health',     Icon:Baby,       col:'#005A8E', bg:'#D0EAF5', items:childItems,  page:childPage,   sp:setChildPage    },
  { lbl:'Mental Health',    Icon:Brain,      col:'#6B3FA0', bg:'#E8D5F5', items:mentalItems, page:mentalPage,  sp:setMentalPage   },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const pg  = (items: ArticleDoc[], p: number) => items.slice((p-1)*PER, p*PER);
const tpg = (items: ArticleDoc[]) => Math.ceil(items.length / PER) || 1;
const nav = (slug: string) => goto(`/articles/${slug}`);

const toggleTag = (t: string) => {
  activeTag = activeTag === t ? null : t;
  newsPage = storiesPage = wellnessPage = blogsPage = medResPage = childPage = mentalPage = 1;
};

const catColor = (c: string): string => ({
  'News':'#106A6B','Stories':'#9B2335','Wellness':'#2D6A4F','Blogs':'#4A3F8C',
  'Medical Research':'#7B4F00','Child Health':'#005A8E','Mental Health':'#6B3FA0'
}[c] ?? '#4A6D6D');

const catBg = (c: string): string => ({
  'News':'#D1EAEA','Stories':'#FAD7D7','Wellness':'#C8E6C9','Blogs':'#DDD6F3',
  'Medical Research':'#FDEBD0','Child Health':'#D0EAF5','Mental Health':'#E8D5F5'
}[c] ?? '#D1E5E5');

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMount(() => {
  loadArticles();
  sliderInterval = setInterval(() => {
    if (featuredList.length > 1)
      currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredList.length;
  }, 6000);
});

onDestroy(() => {
  if (sliderInterval) clearInterval(sliderInterval);
});
</script>

<svelte:head>
  <title>The Journal — Jarurat Care</title>
  <meta name="description" content="Medical news, wellness articles, patient stories and peer-reviewed research from Jarurat Care." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&display=swap" rel="stylesheet" />
</svelte:head>

<Nav />

<div class="min-h-screen pt-24 pb-20" style="background:#E5F0F0;font-family:'DM Sans',sans-serif;">

  <!-- Masthead -->
  <div class="max-w-7xl mx-auto px-6 mb-10">
    <div class="flex items-end justify-between flex-wrap gap-4 pb-6 border-b-2 border-[#0D3B3B]">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-[#4A6D6D] mb-1">Jarurat Care</p>
        <h1 class="text-5xl md:text-6xl font-black text-[#0D3B3B] leading-none tracking-tight" style="font-family:'DM Serif Display',serif;">The Journal</h1>
      </div>
      <div class="flex items-center gap-3">
        <select bind:value={sortBy} class="px-4 py-2 text-xs font-bold border border-[#C1D8D8] bg-white text-[#0D3B3B] outline-none cursor-pointer hover:border-[#106A6B] transition-colors">
          <option value="date">Latest First</option>
          <option value="title">A – Z</option>
          <option value="category">By Category</option>
        </select>
        <div class="flex items-center gap-1 p-1 border border-[#C1D8D8] bg-white">
          <button on:click={() => viewMode='grid'} class="w-8 h-8 flex items-center justify-center transition-all {viewMode==='grid'?'bg-[#0D3B3B] text-white':'text-[#7A9999] hover:bg-[#E5F0F0]'}"><LayoutGrid size={13}/></button>
          <button on:click={() => viewMode='list'} class="w-8 h-8 flex items-center justify-center transition-all {viewMode==='list'?'bg-[#0D3B3B] text-white':'text-[#7A9999] hover:bg-[#E5F0F0]'}"><List size={13}/></button>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-6 flex flex-col xl:flex-row gap-12">

    <!-- ── Main ──────────────────────────────────────────────────────────── -->
    <main class="xl:w-2/3 flex flex-col gap-14">

      <!-- Hero -->
      {#if hero}
        <div role="button" tabindex="0" on:click={() => nav(hero.slug)} on:keydown={e=>e.key==='Enter'&&nav(hero.slug)}
          class="group cursor-pointer flex flex-col md:flex-row bg-white border border-[#D1E5E5] shadow-sm hover:shadow-xl hover:border-[#106A6B] transition-all">
          <div class="md:w-[55%] overflow-hidden relative">
            <img src={hero.thumbnail} alt="" class="w-full h-72 md:h-[420px] object-cover group-hover:scale-[1.02] transition-transform duration-700"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
          </div>
          <div class="md:w-[45%] flex flex-col justify-between p-8 md:p-10 border-t md:border-t-0 md:border-l border-[#D1E5E5]">
            <div>
              <div class="flex items-center gap-3 mb-5">
                <span class="h-0.5 w-8" style="background:{catColor(hero.category)};"/>
                <span class="text-[10px] font-black uppercase tracking-[0.2em]" style="color:{catColor(hero.category)};">{hero.category}</span>
                {#if hero.isFeatured}<span class="text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFF0C2] text-[#7A5C00]">★ Featured</span>{/if}
              </div>
              <h2 class="text-3xl md:text-4xl font-black leading-tight mb-5 text-[#0D3B3B] group-hover:text-[#106A6B] transition-colors" style="font-family:'DM Serif Display',serif;">{hero.title}</h2>
              <p class="text-sm text-[#4A6D6D] leading-relaxed line-clamp-4">{hero.excerpt}</p>
              {#if (hero.stage1Approvals?.length ?? 0) >= 2 && (hero.stage2Approvals?.length ?? 0) >= 2}
                <div class="flex items-center gap-2 mt-4">
                  <span class="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-[#C8E6C9] text-[#2D6A4F] flex items-center gap-1"><Award size={10}/>Peer Reviewed</span>
                </div>
              {/if}
            </div>
            <div class="mt-8 pt-6 border-t border-[#D1E5E5] flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-[#0D3B3B]">{hero.author ?? 'Editorial'}</p>
                <p class="text-xs text-[#7A9999] mt-0.5">{hero.date ?? ''}{hero.readTime ? ` · ${hero.readTime} min read` : ''}</p>
              </div>
              <span class="text-xs font-bold text-[#0D3B3B] border-b border-[#C1D8D8] group-hover:border-[#0D3B3B] transition-colors pb-0.5">Read →</span>
            </div>
          </div>
        </div>
        {#if featuredList.length > 1}
          <div class="flex gap-2 -mt-10">
            {#each featuredList as _feat, i}
              <button on:click={() => currentFeaturedIndex=i}
                class="rounded-full transition-all {i===currentFeaturedIndex?'w-6 h-2 bg-[#0D3B3B]':'w-2 h-2 bg-[#C1D8D8] hover:bg-[#7A9999]'}"/>
            {/each}
          </div>
        {/if}
      {:else if loading}
        <div class="bg-white border border-[#D1E5E5] p-10 text-center text-[#7A9999] text-sm font-bold animate-pulse">Loading articles…</div>
      {:else if pubArticles.length === 0}
        <div class="bg-white border border-dashed border-[#D1E5E5] py-24 text-center">
          <p class="font-black text-3xl text-[#D1E5E5] mb-3" style="font-family:'DM Serif Display',serif;">No articles yet.</p>
        </div>
      {/if}

      <!-- Content sections — uses $: sections array defined in <script> -->
      {#each sections as sec}
        {#if sec.items.length > 0}
          <section class="flex flex-col gap-5">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center" style="background:{sec.bg};"><svelte:component this={sec.Icon} size={16} style="color:{sec.col};"/></div>
              <h3 class="text-sm font-black uppercase tracking-[0.2em] text-[#0D3B3B]">{sec.lbl}</h3>
              <span class="flex-1 border-t border-dashed border-[#C1D8D8]"/>
              <span class="text-xs font-black text-[#7A9999]">{sec.items.length}</span>
            </div>

            {#if viewMode === 'grid'}
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                {#each pg(sec.items, sec.page) as item, idx}
                  {#if (sec.lbl === 'Patient Stories' || sec.lbl === 'Mental Health') && idx === 0}
                    <div role="button" tabindex="0" on:click={() => nav(item.slug)} on:keydown={e=>e.key==='Enter'&&nav(item.slug)}
                      class="md:col-span-3 group cursor-pointer flex flex-col md:flex-row bg-white border border-[#D1E5E5] shadow-sm hover:shadow-xl transition-all overflow-hidden"
                      style="border-top:3px solid {sec.col};">
                      <div class="md:w-5/12 overflow-hidden"><img src={item.thumbnail} alt="" class="w-full h-56 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"/></div>
                      <div class="md:w-7/12 p-6 md:p-8 flex flex-col justify-center">
                        <span class="text-[9px] font-black uppercase tracking-widest px-2 py-1 inline-block mb-3 w-fit" style="background:{sec.bg};color:{sec.col};">Top Story</span>
                        <h4 class="font-black text-2xl leading-snug mb-3 text-[#0D3B3B] group-hover:text-[#106A6B] transition-colors" style="font-family:'DM Serif Display',serif;">{item.title}</h4>
                        <p class="text-sm text-[#4A6D6D] line-clamp-3 leading-relaxed mb-4">{item.excerpt}</p>
                        <p class="text-xs font-bold text-[#7A9999]">{item.author ?? ''} · {item.date ?? ''}</p>
                      </div>
                    </div>
                  {:else}
                    <div role="button" tabindex="0" on:click={() => nav(item.slug)} on:keydown={e=>e.key==='Enter'&&nav(item.slug)}
                      class="group cursor-pointer flex flex-col bg-white border border-[#D1E5E5] shadow-sm hover:shadow-xl transition-all overflow-hidden"
                      style="border-top:3px solid {sec.col};">
                      <div class="overflow-hidden aspect-[16/9] relative">
                        <img src={item.thumbnail} alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                        <div class="absolute top-3 left-3"><span class="text-[8px] font-black uppercase tracking-widest px-2 py-1" style="background:{sec.col};color:#fff;">{item.category}</span></div>
                        {#if (item.stage1Approvals?.length ?? 0) >= 2}<div class="absolute bottom-3 right-3"><span class="text-[8px] font-black px-2 py-1 bg-[#C8E6C9] text-[#2D6A4F]">✓ Reviewed</span></div>{/if}
                      </div>
                      <div class="p-5 flex flex-col flex-1">
                        <p class="text-[9px] font-black uppercase tracking-[0.2em] mb-2 text-[#7A9999]">{item.date ?? ''}</p>
                        <h4 class="font-black text-base leading-snug mb-2 text-[#0D3B3B] group-hover:text-[#106A6B] transition-colors line-clamp-3" style="font-family:'DM Serif Display',serif;">{item.title}</h4>
                        <p class="text-xs text-[#4A6D6D] line-clamp-2 mb-4 leading-relaxed">{item.excerpt}</p>
                        <div class="mt-auto pt-3 border-t border-[#F0F8F8] flex items-center justify-between">
                          <p class="text-[10px] font-bold text-[#7A9999]">{item.author ?? ''}</p>
                          <div class="flex items-center gap-2">
                            {#if item.readTime}<p class="text-[10px] text-[#7A9999]">{item.readTime} min</p>{/if}
                            <span class="text-[10px] font-bold text-[#106A6B] group-hover:underline">Read →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            {:else}
              <div class="flex flex-col divide-y divide-[#D1E5E5] bg-white border border-[#D1E5E5] shadow-sm overflow-hidden" style="border-top:3px solid {sec.col};">
                {#each pg(sec.items, sec.page) as item}
                  <div role="button" tabindex="0" on:click={() => nav(item.slug)} on:keydown={e=>e.key==='Enter'&&nav(item.slug)}
                    class="group cursor-pointer flex items-center gap-5 py-4 px-5 hover:bg-[#F5FAFA] transition-colors">
                    <div class="w-20 h-14 flex-shrink-0 overflow-hidden border border-[#D1E5E5]">
                      <img src={item.thumbnail} alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-black text-sm text-[#0D3B3B] line-clamp-2 group-hover:text-[#106A6B] transition-colors" style="font-family:'DM Serif Display',serif;">{item.title}</h4>
                      <p class="text-[10px] text-[#7A9999] mt-1">{item.author ?? ''} · {item.date ?? ''}</p>
                    </div>
                    <ChevronRight size={14} class="text-[#C1D8D8] group-hover:text-[#106A6B] transition-colors flex-shrink-0"/>
                  </div>
                {/each}
              </div>
            {/if}

            {#if tpg(sec.items) > 1}
              <div class="flex items-center gap-2">
                <button on:click={() => sec.sp(Math.max(1, sec.page-1))} disabled={sec.page===1}
                  class="px-4 py-2 text-xs font-bold border border-[#C1D8D8] bg-white text-[#0D3B3B] hover:bg-[#D1EAEA] disabled:opacity-30">← Prev</button>
                <span class="text-xs text-[#7A9999] font-bold px-2">{sec.page} / {tpg(sec.items)}</span>
                <button on:click={() => sec.sp(Math.min(tpg(sec.items), sec.page+1))} disabled={sec.page===tpg(sec.items)}
                  class="px-4 py-2 text-xs font-bold border border-[#C1D8D8] bg-white text-[#0D3B3B] hover:bg-[#D1EAEA] disabled:opacity-30">Next →</button>
              </div>
            {/if}
          </section>
        {/if}
      {/each}

      {#if filtered.length === 0 && pubArticles.length > 0}
        <div class="py-24 text-center border border-dashed border-[#C1D8D8] bg-white">
          <p class="font-black text-3xl text-[#D1E5E5] mb-4" style="font-family:'DM Serif Display',serif;">No articles found.</p>
          <button on:click={() => { searchQuery=''; activeTag=null; }}
            class="px-6 py-2.5 text-xs font-bold bg-[#0D3B3B] text-[#E5F0F0] hover:bg-[#106A6B]">Clear Filters</button>
        </div>
      {/if}
    </main>

    <!-- ── Sidebar ────────────────────────────────────────────────────── -->
    <aside class="xl:w-1/3 flex flex-col gap-8">

      <!-- Search -->
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.25em] text-[#4A6D6D] mb-3">Search</p>
        <div class="relative">
          <input type="text" bind:value={searchQuery} placeholder="Keywords…"
            class="w-full py-3 pl-5 pr-10 border border-[#C1D8D8] bg-white text-sm outline-none focus:border-[#106A6B] transition-colors text-[#0D3B3B] placeholder:text-[#C1D8D8]"/>
          <Search size={15} class="absolute right-4 top-1/2 -translate-y-1/2 text-[#C1D8D8]"/>
        </div>
      </div>

      <div class="border-t-2 border-[#0D3B3B]"/>

      <!-- Also reading -->
      {#if sidebarPicks.length > 0}
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.25em] text-[#4A6D6D] mb-5">Also Worth Reading</p>
          <div class="flex flex-col gap-5">
            {#each sidebarPicks as item, i}
              <div role="button" tabindex="0" on:click={() => nav(item.slug)} on:keydown={e=>e.key==='Enter'&&nav(item.slug)}
                class="group cursor-pointer flex items-start gap-4 p-3 border border-transparent hover:border-[#D1E5E5] hover:bg-white transition-all">
                <span class="text-3xl font-black w-8 flex-shrink-0 leading-none text-[#D1E5E5] select-none" style="font-family:'DM Serif Display',serif;">{String(i+1).padStart(2,'0')}</span>
                <div>
                  <span class="text-[9px] font-black uppercase tracking-widest block mb-1" style="color:{catColor(item.category)};">{item.category}</span>
                  <h4 class="text-sm font-black text-[#0D3B3B] leading-snug group-hover:text-[#106A6B] transition-colors line-clamp-2" style="font-family:'DM Serif Display',serif;">{item.title}</h4>
                  <p class="text-[10px] text-[#7A9999] mt-1">{item.date ?? ''}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <div class="border-t border-[#D1E5E5]"/>

      <!-- Browse categories -->
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.25em] text-[#4A6D6D] mb-3">Browse Categories</p>
        <div class="flex flex-col bg-white border border-[#D1E5E5] shadow-sm overflow-hidden">
          {#each [
            {lbl:'Health News',     Icon:Newspaper,  col:'#106A6B',bg:'#D1EAEA',n:newsItems.length},
            {lbl:'Patient Stories', Icon:Heart,      col:'#9B2335',bg:'#FAD7D7',n:storyItems.length},
            {lbl:'Wellness',        Icon:Leaf,       col:'#2D6A4F',bg:'#C8E6C9',n:wellItems.length},
            {lbl:'Blogs',           Icon:BookOpen,   col:'#4A3F8C',bg:'#DDD6F3',n:blogItems.length},
            {lbl:'Medical Research',Icon:Microscope, col:'#7B4F00',bg:'#FDEBD0',n:medResItems.length},
            {lbl:'Child Health',    Icon:Baby,       col:'#005A8E',bg:'#D0EAF5',n:childItems.length},
            {lbl:'Mental Health',   Icon:Brain,      col:'#6B3FA0',bg:'#E8D5F5',n:mentalItems.length},
          ] as r}
            <div class="flex items-center justify-between px-4 py-3 border-b border-[#D1E5E5] last:border-0 hover:bg-[#F5FAFA] transition-colors group cursor-pointer">
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 flex items-center justify-center" style="background:{r.bg};"><svelte:component this={r.Icon} size={13} style="color:{r.col};"/></div>
                <span class="text-sm font-bold text-[#0D3B3B] group-hover:text-[#106A6B] transition-colors">{r.lbl}</span>
              </div>
              <span class="text-xs font-black px-2 py-0.5" style="background:{r.bg};color:{r.col};">{r.n}</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="border-t border-[#D1E5E5]"/>

      <!-- Newsletter -->
      <div class="p-7 bg-[#0D3B3B]">
        <p class="text-[10px] font-black uppercase tracking-[0.25em] mb-2 text-[#4A8F8F]">Newsletter</p>
        <h4 class="text-2xl font-black mb-3 leading-tight text-[#E5F0F0]" style="font-family:'DM Serif Display',serif;">Stay in the know.</h4>
        <p class="text-xs mb-5 leading-relaxed text-[#4A8F8F]">Weekly health news and wellness tips, straight to your inbox.</p>
        <input type="email" placeholder="your@email.com"
          class="w-full py-3 px-4 text-sm outline-none mb-3 border border-[#1A5C5C] bg-[#0A2E2E] text-[#E5F0F0] placeholder:text-[#2A6A6A] focus:border-[#4A8F8F] transition-colors"/>
        <button class="w-full py-3 text-xs font-black uppercase tracking-[0.2em] bg-[#E5F0F0] text-[#0D3B3B] hover:bg-white transition-colors">Subscribe</button>
      </div>

      <!-- Trending Tags -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <p class="text-[10px] font-black uppercase tracking-[0.25em] text-[#4A6D6D]">Trending Topics</p>
          {#if allTags.length > TAGS_COUNT}
            <button on:click={() => showAllTags=!showAllTags}
              class="text-[10px] font-black uppercase tracking-widest text-[#106A6B] hover:text-[#0D3B3B] flex items-center gap-1">
              {showAllTags ? 'Show Less' : `All ${allTags.length}`}
              <ChevronDown size={10} class="transition-transform {showAllTags?'rotate-180':''}"/>
            </button>
          {/if}
        </div>
        <div class="flex flex-wrap gap-2 mb-2">
          {#each allTags.slice(0, TAGS_COUNT) as tag}
            <button on:click={() => toggleTag(tag)}
              class="text-xs font-bold px-3 py-1.5 border transition-all {activeTag===tag?'bg-[#0D3B3B] text-[#E5F0F0] border-[#0D3B3B]':'bg-white text-[#4A6D6D] border-[#C1D8D8] hover:border-[#106A6B] hover:text-[#106A6B]'}">
              #{tag}
            </button>
          {/each}
        </div>
        {#if showAllTags && allTags.length > TAGS_COUNT}
          <div class="bg-white border border-[#D1E5E5] shadow-sm p-4 mt-2">
            <p class="text-[9px] font-black uppercase tracking-widest text-[#7A9999] mb-3">All Tags ({allTags.length})</p>
            <div class="flex flex-wrap gap-2 max-h-64 overflow-y-auto" style="scrollbar-width:thin;scrollbar-color:#D1E5E5 transparent;">
              {#each allTags as tag, i}
                <button on:click={() => toggleTag(tag)}
                  class="text-xs font-bold px-3 py-1.5 border transition-all flex items-center gap-1.5 {activeTag===tag?'bg-[#0D3B3B] text-[#E5F0F0] border-[#0D3B3B]':'bg-[#F5FAFA] text-[#4A6D6D] border-[#D1E5E5] hover:border-[#106A6B] hover:bg-[#E5F0F0]'}">
                  <Tag size={9}/> #{tag}
                  {#if i < TAGS_COUNT}<span class="text-[8px] px-1 font-black" style="background:{activeTag===tag?'rgba(255,255,255,0.2)':'#D1EAEA'};color:{activeTag===tag?'#E5F0F0':'#106A6B'};">hot</span>{/if}
                </button>
              {/each}
            </div>
            {#if activeTag}
              <button on:click={() => activeTag=null} class="mt-3 text-xs font-bold text-[#9B2335] flex items-center gap-1">
                <X size={10}/> Clear: #{activeTag}
              </button>
            {/if}
          </div>
        {/if}
      </div>

    </aside>
  </div>
</div>

<style>
  :global(body) { font-family:'DM Sans',sans-serif; background:#E5F0F0; }
  :global(*)    { box-sizing:border-box; }
  :global(.article-body h2) { font-family:'DM Serif Display',serif; font-size:1.75rem; font-weight:900; color:#061E5C; margin:3rem 0 1rem; }
  :global(.article-body h3) { font-family:'DM Serif Display',serif; font-size:1.3rem; font-weight:900; color:#0D3B3B; margin:2rem 0 .75rem; }
  :global(.article-body p)  { font-size:1.1rem; line-height:1.85; color:#374151; margin-bottom:1.5rem; }
  :global(.article-body ul, .article-body ol) { margin:0 0 1.5rem 1.5rem; color:#374151; }
  :global(.article-body li) { margin-bottom:.5rem; font-size:1.05rem; }
  :global(.article-body blockquote) { border-left:3px solid #0D3B3B; padding:1rem 1.5rem; margin:2rem 0; background:#F5FAFA; font-style:italic; font-family:'DM Serif Display',serif; }
  :global(.article-body table) { width:100%; border-collapse:collapse; margin-bottom:1.5rem; font-size:.9rem; }
  :global(.article-body th) { background:#0D3B3B; color:#E5F0F0; padding:.75rem 1rem; text-align:left; font-size:.8rem; font-weight:900; text-transform:uppercase; }
  :global(.article-body td) { padding:.65rem 1rem; border-bottom:1px solid #D1E5E5; }
  :global(.article-body .video-embed) { position:relative; padding-bottom:56.25%; height:0; overflow:hidden; margin:1.5rem 0; }
  :global(.article-body .video-embed iframe) { position:absolute; top:0; left:0; width:100%; height:100%; }
  :global(.ref-cite) { font-size:.75rem; vertical-align:super; color:#106A6B; }
</style>