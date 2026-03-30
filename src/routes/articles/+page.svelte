<!--
  src/routes/articles/+page.svelte
  PUBLIC JOURNAL — /articles
  Data: loaded from $lib/data/articles.json (localStorage for CMS edits)
  Auth: none needed on this page
  CMS: lives at /cms (separate route, zero references here)
-->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Nav from '$lib/components/nav.svelte';
	import seedArticles from '$lib/data/articles.json';
	import NewsFooter from '$lib/components/news-footer.svelte';
	import {
		Search,
		Heart,
		Leaf,
		Newspaper,
		ChevronRight,
		ChevronDown,
		LayoutGrid,
		List,
		Tag,
		Microscope,
		Baby,
		Brain,
		BookOpen,
		Award,
		X
	} from 'lucide-svelte';

	interface ArticleDoc {
		id: string;
		slug: string;
		status: string;
		title: string;
		excerpt: string;
		thumbnail: string;
		category: string;
		tags: string[];
		keywords: string[];
		readTime: number;
		author: string;
		date: string;
		stage1Approvals: string[];
		stage2Approvals: string[];
		isFeatured: boolean;
		hidden: boolean;
	}

	const LS_KEY = 'jarurat_cms_articles';

	let articles: ArticleDoc[] = [];
	let loading = true;

	let searchQuery = '';
	let activeTag: string | null = null;
	let viewMode: 'grid' | 'list' = 'grid';
	let sortBy = 'date';
	let showAllTags = false;
	const TAGS_COUNT = 20;
	let currentFeaturedIndex = 0;
	let sliderInterval: ReturnType<typeof setInterval>;

	let newsPage = 1,
		storiesPage = 1,
		wellnessPage = 1,
		blogsPage = 1;
	let medResPage = 1,
		childPage = 1,
		mentalPage = 1;
	const PER = 3;

	function loadArticles() {
		try {
			const raw = localStorage.getItem(LS_KEY);
			articles = raw ? JSON.parse(raw) : (seedArticles as ArticleDoc[]);
		} catch {
			articles = seedArticles as ArticleDoc[];
		}
		loading = false;
	}

	$: pubArticles = articles.filter((a) => (a.status === 'published' || (!a.status && !a.hidden)) && !a.hidden);

	$: sorted = [...pubArticles].sort((a, b) => {
		if (sortBy === 'title') return a.title.localeCompare(b.title);
		if (sortBy === 'category') return a.category.localeCompare(b.category);
		return new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();
	});

	$: filtered = sorted.filter((a) => {
		const q = searchQuery.toLowerCase();
		return (
			(a.title.toLowerCase().includes(q) || (a.excerpt ?? '').toLowerCase().includes(q)) &&
			(activeTag ? (a.tags ?? []).includes(activeTag) : true)
		);
	});

	$: newsItems = filtered.filter((a) => a.category === 'News');
	$: storyItems = filtered.filter((a) => a.category === 'Stories');
	$: wellItems = filtered.filter((a) => a.category === 'Wellness');
	$: blogItems = filtered.filter((a) => a.category === 'Blogs');
	$: medResItems = filtered.filter((a) => a.category === 'Medical Research');
	$: childItems = filtered.filter((a) => a.category === 'Child Health');
	$: mentalItems = filtered.filter((a) => a.category === 'Mental Health');
	$: featuredList = filtered.filter((a) => a.isFeatured);
	$: hero = featuredList[currentFeaturedIndex] ?? filtered[0];
	$: sidebarPicks = filtered.filter((_, i) => i > 0 && i < 5);
	$: allTags = [...new Set(articles.flatMap((a) => a.tags ?? []))];

	function setNewsPage(p: number) {
		newsPage = p;
	}
	function setStoriesPage(p: number) {
		storiesPage = p;
	}
	function setWellnessPage(p: number) {
		wellnessPage = p;
	}
	function setBlogsPage(p: number) {
		blogsPage = p;
	}
	function setMedResPage(p: number) {
		medResPage = p;
	}
	function setChildPage(p: number) {
		childPage = p;
	}
	function setMentalPage(p: number) {
		mentalPage = p;
	}

	$: sections = [
		{ lbl: 'Health News', Icon: Newspaper, col: '#0155BD', bg: '#D3F2FC', items: newsItems, page: newsPage, sp: setNewsPage },
		{ lbl: 'Patient Stories', Icon: Heart, col: '#0D2460', bg: '#EAF3FF', items: storyItems, page: storiesPage, sp: setStoriesPage },
		{ lbl: 'Wellness', Icon: Leaf, col: '#78C520', bg: '#EEF9D9', items: wellItems, page: wellnessPage, sp: setWellnessPage },
		{ lbl: 'Blogs & Insights', Icon: BookOpen, col: '#4A3F8C', bg: '#EAE5FF', items: blogItems, page: blogsPage, sp: setBlogsPage },
		{ lbl: 'Medical Research', Icon: Microscope, col: '#7B4F00', bg: '#FFF0D6', items: medResItems, page: medResPage, sp: setMedResPage },
		{ lbl: 'Child Health', Icon: Baby, col: '#005A8E', bg: '#D8F1FF', items: childItems, page: childPage, sp: setChildPage },
		{ lbl: 'Mental Health', Icon: Brain, col: '#6B3FA0', bg: '#F0E1FF', items: mentalItems, page: mentalPage, sp: setMentalPage }
	];

	const pg = (items: ArticleDoc[], p: number) => items.slice((p - 1) * PER, p * PER);
	const tpg = (items: ArticleDoc[]) => Math.ceil(items.length / PER) || 1;
	const nav = (slug: string) => goto(`/articles/${slug}`);

	const toggleTag = (t: string) => {
		activeTag = activeTag === t ? null : t;
		newsPage = storiesPage = wellnessPage = blogsPage = medResPage = childPage = mentalPage = 1;
	};

	const catColor = (c: string): string =>
		(
			{
				News: '#0155BD',
				Stories: '#0D2460',
				Wellness: '#78C520',
				Blogs: '#4A3F8C',
				'Medical Research': '#7B4F00',
				'Child Health': '#005A8E',
				'Mental Health': '#6B3FA0'
			} as Record<string, string>
		)[c] ?? '#3B3E43';

	const catBg = (c: string): string =>
		(
			{
				News: '#D3F2FC',
				Stories: '#EAF3FF',
				Wellness: '#EEF9D9',
				Blogs: '#EAE5FF',
				'Medical Research': '#FFF0D6',
				'Child Health': '#D8F1FF',
				'Mental Health': '#F0E1FF'
			} as Record<string, string>
		)[c] ?? '#EAF3FF';

	onMount(() => {
		loadArticles();
		sliderInterval = setInterval(() => {
			if (featuredList.length > 1) {
				currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredList.length;
			}
		}, 6000);
	});

	onDestroy(() => {
		if (sliderInterval) clearInterval(sliderInterval);
	});
</script>

<svelte:head>
	<title>The Journal — Jarurat Care</title>
	<meta
		name="description"
		content="Medical news, wellness articles, patient stories and peer-reviewed research from Jarurat Care."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Nav />

<div class="min-h-screen pt-24 pb-20 bg-[#F4F9FF]" style="font-family:'DM Sans',sans-serif;">
	<!-- Masthead -->
	<div class="max-w-7xl mx-auto px-6 mb-10">
		<div class="flex items-end justify-between flex-wrap gap-4 pb-6 border-b-2 border-[#0155BD]">
			<div>
				<p class="text-[10px] font-black uppercase tracking-[0.3em] text-[#0155BD] mb-1">Jarurat Care</p>
				<h1
					class="text-5xl md:text-6xl font-black text-[#0D2460] leading-none tracking-tight"
					style="font-family:'DM Serif Display',serif;"
				>
					The Journal
				</h1>
			</div>

			<div class="flex items-center gap-3 flex-wrap">
				<select
					bind:value={sortBy}
					class="px-4 py-2 text-xs font-bold border border-[#D8E8FA] bg-white text-[#0D2460] outline-none cursor-pointer rounded-full hover:border-[#0155BD] transition-colors"
				>
					<option value="date">Latest First</option>
					<option value="title">A – Z</option>
					<option value="category">By Category</option>
				</select>
				<div class="flex items-center gap-1 p-1 border border-[#D8E8FA] bg-white rounded-full shadow-sm">
					<button
						on:click={() => (viewMode = 'grid')}
						class="w-9 h-9 rounded-full flex items-center justify-center transition-all {viewMode === 'grid' ? 'bg-[#0155BD] text-white' : 'text-[#7A9999] hover:bg-[#EEF6FF]'}"
					>
						<LayoutGrid size={13} />
					</button>
					<button
						on:click={() => (viewMode = 'list')}
						class="w-9 h-9 rounded-full flex items-center justify-center transition-all {viewMode === 'list' ? 'bg-[#0155BD] text-white' : 'text-[#7A9999] hover:bg-[#EEF6FF]'}"
					>
						<List size={13} />
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Main content -->
	<div class="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-10 xl:gap-12">
		<main class="flex flex-col gap-14 min-w-0">
			{#if hero}
				<div
					role="button"
					tabindex="0"
					on:click={() => nav(hero.slug)}
					on:keydown={(e) => e.key === 'Enter' && nav(hero.slug)}
					class="group cursor-pointer flex flex-col md:flex-row bg-white border border-[#D8E8FA] shadow-[0_10px_30px_rgba(1,85,189,0.08)] hover:shadow-[0_16px_40px_rgba(1,85,189,0.14)] hover:border-[#0155BD] transition-all rounded-[1.75rem] overflow-hidden"
				>
					<div class="md:w-[52%] overflow-hidden relative">
						<img
							src={hero.thumbnail}
							alt=""
							class="w-full h-72 md:h-[420px] object-cover group-hover:scale-[1.03] transition-transform duration-700"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-[#0D2460]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>
					<div class="md:w-[48%] flex flex-col justify-between p-8 md:p-10 border-t md:border-t-0 md:border-l border-[#D8E8FA] bg-[#FBFDFF]">
						<div>
							<div class="flex items-center gap-3 mb-5 flex-wrap">
								<span class="h-0.5 w-10 rounded-full" style="background:{catColor(hero.category)};" />
								<span class="text-[10px] font-black uppercase tracking-[0.2em]" style="color:{catColor(hero.category)};">{hero.category}</span>
								{#if hero.isFeatured}
									<span class="text-[10px] font-black uppercase px-2 py-1 rounded-full bg-[#FFF0C2] text-[#7A5C00]">★ Featured</span>
								{/if}
							</div>
							<h2
								class="text-3xl md:text-4xl font-black leading-tight mb-5 text-[#0D2460] group-hover:text-[#0155BD] transition-colors"
								style="font-family:'DM Serif Display',serif;"
							>
								{hero.title}
							</h2>
							<p class="text-sm text-[#3B3E43] leading-relaxed line-clamp-4">{hero.excerpt}</p>
							{#if (hero.stage1Approvals?.length ?? 0) >= 2 && (hero.stage2Approvals?.length ?? 0) >= 2}
								<div class="flex items-center gap-2 mt-4">
									<span class="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-[#EEF9D9] text-[#5A8F14] flex items-center gap-1">
										<Award size={10} />Peer Reviewed
									</span>
								</div>
							{/if}
						</div>
						<div class="mt-8 pt-6 border-t border-[#E8F0FB] flex items-center justify-between gap-4">
							<div>
								<p class="text-sm font-bold text-[#0D2460]">{hero.author ?? 'Editorial'}</p>
								<p class="text-xs text-[#7A9999] mt-0.5">{hero.date ?? ''}{hero.readTime ? ` · ${hero.readTime} min read` : ''}</p>
							</div>
							<span class="text-xs font-bold text-[#0155BD] border-b border-[#B8D7FB] group-hover:border-[#0155BD] transition-colors pb-0.5">Read →</span>
						</div>
					</div>
				</div>

				{#if featuredList.length > 1}
					<div class="flex gap-2 -mt-10 px-4">
						{#each featuredList as _feat, i}
							<button
								on:click={() => (currentFeaturedIndex = i)}
								class="rounded-full transition-all {i === currentFeaturedIndex ? 'w-7 h-2 bg-[#0155BD]' : 'w-2 h-2 bg-[#C7DDF7] hover:bg-[#7A9999]'}"
							/>
						{/each}
					</div>
				{/if}
			{:else if loading}
				<div class="bg-white border border-[#D8E8FA] rounded-2xl p-10 text-center text-[#7A9999] text-sm font-bold animate-pulse shadow-sm">
					Loading articles…
				</div>
			{:else if pubArticles.length === 0}
				<div class="bg-white border border-dashed border-[#D8E8FA] rounded-2xl py-24 text-center shadow-sm">
					<p class="font-black text-3xl text-[#C7DDF7] mb-3" style="font-family:'DM Serif Display',serif;">No articles yet.</p>
				</div>
			{/if}

			{#each sections as sec}
				{#if sec.items.length > 0}
					<section class="flex flex-col gap-5">
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm" style="background:{sec.bg};">
								<svelte:component this={sec.Icon} size={16} style="color:{sec.col};" />
							</div>
							<h3 class="text-sm font-black uppercase tracking-[0.2em] text-[#0D2460]">{sec.lbl}</h3>
							<span class="flex-1 border-t border-dashed border-[#D8E8FA]" />
							<span class="text-xs font-black text-[#7A9999]">{sec.items.length}</span>
						</div>

						{#if viewMode === 'grid'}
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								{#each pg(sec.items, sec.page) as item, idx}
									{#if (sec.lbl === 'Patient Stories' || sec.lbl === 'Mental Health') && idx === 0}
										<div
											role="button"
											tabindex="0"
											on:click={() => nav(item.slug)}
											on:keydown={(e) => e.key === 'Enter' && nav(item.slug)}
											class="md:col-span-3 group cursor-pointer flex flex-col md:flex-row bg-white border border-[#D8E8FA] shadow-sm hover:shadow-[0_14px_34px_rgba(1,85,189,0.10)] transition-all overflow-hidden rounded-[1.5rem]"
											style="border-top:3px solid {sec.col};"
										>
											<div class="md:w-5/12 overflow-hidden">
												<img src={item.thumbnail} alt="" class="w-full h-56 md:h-full object-cover group-hover:scale-105 transition-transform duration-500" />
											</div>
											<div class="md:w-7/12 p-6 md:p-8 flex flex-col justify-center bg-white">
												<span class="text-[9px] font-black uppercase tracking-widest px-2 py-1 inline-flex rounded-full mb-3 w-fit" style="background:{sec.bg};color:{sec.col};">Top Story</span>
												<h4 class="font-black text-2xl leading-snug mb-3 text-[#0D2460] group-hover:text-[#0155BD] transition-colors" style="font-family:'DM Serif Display',serif;">{item.title}</h4>
												<p class="text-sm text-[#3B3E43] line-clamp-3 leading-relaxed mb-4">{item.excerpt}</p>
												<p class="text-xs font-bold text-[#7A9999]">{item.author ?? ''} · {item.date ?? ''}</p>
											</div>
										</div>
									{:else}
										<div
											role="button"
											tabindex="0"
											on:click={() => nav(item.slug)}
											on:keydown={(e) => e.key === 'Enter' && nav(item.slug)}
											class="group cursor-pointer flex flex-col bg-white border border-[#D8E8FA] shadow-sm hover:shadow-[0_14px_34px_rgba(1,85,189,0.10)] transition-all overflow-hidden rounded-[1.5rem]"
											style="border-top:3px solid {sec.col};"
										>
											<div class="overflow-hidden aspect-[16/9] relative">
												<img src={item.thumbnail} alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
												<div class="absolute top-3 left-3">
													<span class="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-sm" style="background:{sec.col};color:#fff;">{item.category}</span>
												</div>
												{#if (item.stage1Approvals?.length ?? 0) >= 2}
													<div class="absolute bottom-3 right-3">
														<span class="text-[8px] font-black px-2 py-1 rounded-full bg-[#EEF9D9] text-[#5A8F14]">✓ Reviewed</span>
													</div>
												{/if}
											</div>
											<div class="p-5 flex flex-col flex-1">
												<p class="text-[9px] font-black uppercase tracking-[0.2em] mb-2 text-[#7A9999]">{item.date ?? ''}</p>
												<h4 class="font-black text-base leading-snug mb-2 text-[#0D2460] group-hover:text-[#0155BD] transition-colors line-clamp-3" style="font-family:'DM Serif Display',serif;">{item.title}</h4>
												<p class="text-xs text-[#3B3E43] line-clamp-2 mb-4 leading-relaxed">{item.excerpt}</p>
												<div class="mt-auto pt-3 border-t border-[#F0F6FD] flex items-center justify-between">
													<p class="text-[10px] font-bold text-[#7A9999]">{item.author ?? ''}</p>
													<div class="flex items-center gap-2">
														{#if item.readTime}
															<p class="text-[10px] text-[#7A9999]">{item.readTime} min</p>
														{/if}
														<span class="text-[10px] font-bold text-[#0155BD] group-hover:underline">Read →</span>
													</div>
												</div>
											</div>
										</div>
									{/if}
								{/each}
							</div>
						{:else}
							<div class="flex flex-col divide-y divide-[#E8F0FB] bg-white border border-[#D8E8FA] shadow-sm overflow-hidden rounded-[1.5rem]" style="border-top:3px solid {sec.col};">
								{#each pg(sec.items, sec.page) as item}
									<div
										role="button"
										tabindex="0"
										on:click={() => nav(item.slug)}
										on:keydown={(e) => e.key === 'Enter' && nav(item.slug)}
										class="group cursor-pointer flex items-center gap-5 py-4 px-5 hover:bg-[#F8FBFF] transition-colors"
									>
										<div class="w-20 h-14 flex-shrink-0 overflow-hidden border border-[#D8E8FA] rounded-xl">
											<img src={item.thumbnail} alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
										</div>
										<div class="flex-1 min-w-0">
											<h4 class="font-black text-sm text-[#0D2460] line-clamp-2 group-hover:text-[#0155BD] transition-colors" style="font-family:'DM Serif Display',serif;">{item.title}</h4>
											<p class="text-[10px] text-[#7A9999] mt-1">{item.author ?? ''} · {item.date ?? ''}</p>
										</div>
										<ChevronRight size={14} class="text-[#C7DDF7] group-hover:text-[#0155BD] transition-colors flex-shrink-0" />
									</div>
								{/each}
							</div>
						{/if}

						{#if tpg(sec.items) > 1}
							<div class="flex items-center gap-2 flex-wrap">
								<button
									on:click={() => sec.sp(Math.max(1, sec.page - 1))}
									disabled={sec.page === 1}
									class="px-4 py-2 text-xs font-bold border border-[#D8E8FA] bg-white text-[#0D2460] rounded-full hover:bg-[#EEF6FF] disabled:opacity-30"
								>
									← Prev
								</button>
								<span class="text-xs text-[#7A9999] font-bold px-2">{sec.page} / {tpg(sec.items)}</span>
								<button
									on:click={() => sec.sp(Math.min(tpg(sec.items), sec.page + 1))}
									disabled={sec.page === tpg(sec.items)}
									class="px-4 py-2 text-xs font-bold border border-[#D8E8FA] bg-white text-[#0D2460] rounded-full hover:bg-[#EEF6FF] disabled:opacity-30"
								>
									Next →
								</button>
							</div>
						{/if}
					</section>
				{/if}
			{/each}

			{#if filtered.length === 0 && pubArticles.length > 0}
				<div class="py-24 text-center border border-dashed border-[#D8E8FA] bg-white rounded-[1.75rem] shadow-sm">
					<p class="font-black text-3xl text-[#C7DDF7] mb-4" style="font-family:'DM Serif Display',serif;">No articles found.</p>
					<button
						on:click={() => {
							searchQuery = '';
							activeTag = null;
						}}
						class="px-6 py-2.5 text-xs font-bold bg-[#0155BD] text-white hover:bg-[#0D2460] rounded-full"
					>
						Clear Filters
					</button>
				</div>
			{/if}
		</main>

		<aside class="flex flex-col gap-8 min-w-0 xl:pt-2">
			<!-- Search -->
			<div class="bg-white rounded-[1.5rem] border border-[#D8E8FA] shadow-sm p-5">
				<p class="text-[10px] font-black uppercase tracking-[0.25em] text-[#78C520] mb-3">Search</p>
				<div class="relative">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Keywords…"
						class="w-full py-3 pl-5 pr-10 border border-[#D8E8FA] bg-[#FBFDFF] text-sm outline-none rounded-full focus:border-[#0155BD] transition-colors text-[#0D2460] placeholder:text-[#B6C7DE]"
					/>
					<Search size={15} class="absolute right-4 top-1/2 -translate-y-1/2 text-[#B6C7DE]" />
				</div>
			</div>

			<!-- Also reading -->
			{#if sidebarPicks.length > 0}
				<div class="bg-white rounded-[1.5rem] border border-[#D8E8FA] shadow-sm p-5">
					<p class="text-[10px] font-black uppercase tracking-[0.25em] text-[#78C520] mb-5">Also Worth Reading</p>
					<div class="flex flex-col gap-4">
						{#each sidebarPicks as item, i}
							<div
								role="button"
								tabindex="0"
								on:click={() => nav(item.slug)}
								on:keydown={(e) => e.key === 'Enter' && nav(item.slug)}
								class="group cursor-pointer flex items-start gap-4 p-3 rounded-2xl border border-transparent hover:border-[#D8E8FA] hover:bg-[#FBFDFF] transition-all"
							>
								<span class="text-3xl font-black w-8 flex-shrink-0 leading-none text-[#D8E8FA] select-none" style="font-family:'DM Serif Display',serif;">{String(i + 1).padStart(2, '0')}</span>
								<div>
									<span class="text-[9px] font-black uppercase tracking-widest block mb-1" style="color:{catColor(item.category)};">{item.category}</span>
									<h4 class="text-sm font-black text-[#0D2460] leading-snug group-hover:text-[#0155BD] transition-colors line-clamp-2" style="font-family:'DM Serif Display',serif;">{item.title}</h4>
									<p class="text-[10px] text-[#7A9999] mt-1">{item.date ?? ''}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Browse categories -->
			<div class="bg-white rounded-[1.5rem] border border-[#D8E8FA] shadow-sm p-5">
				<p class="text-[10px] font-black uppercase tracking-[0.25em] text-[#78C520] mb-3">Browse Categories</p>
				<div class="flex flex-col overflow-hidden rounded-2xl border border-[#E8F0FB]">
					{#each [
						{ lbl: 'Health News', Icon: Newspaper, col: '#0155BD', bg: '#D3F2FC', n: newsItems.length },
						{ lbl: 'Patient Stories', Icon: Heart, col: '#0D2460', bg: '#EAF3FF', n: storyItems.length },
						{ lbl: 'Wellness', Icon: Leaf, col: '#78C520', bg: '#EEF9D9', n: wellItems.length },
						{ lbl: 'Blogs', Icon: BookOpen, col: '#4A3F8C', bg: '#EAE5FF', n: blogItems.length },
						{ lbl: 'Medical Research', Icon: Microscope, col: '#7B4F00', bg: '#FFF0D6', n: medResItems.length },
						{ lbl: 'Child Health', Icon: Baby, col: '#005A8E', bg: '#D8F1FF', n: childItems.length },
						{ lbl: 'Mental Health', Icon: Brain, col: '#6B3FA0', bg: '#F0E1FF', n: mentalItems.length }
					] as r}
						<div class="flex items-center justify-between px-4 py-3 border-b border-[#E8F0FB] last:border-0 hover:bg-[#FBFDFF] transition-colors group cursor-pointer">
							<div class="flex items-center gap-3 min-w-0">
								<div class="w-7 h-7 flex items-center justify-center rounded-full shrink-0" style="background:{r.bg};">
									<svelte:component this={r.Icon} size={13} style="color:{r.col};" />
								</div>
								<span class="text-sm font-bold text-[#0D2460] group-hover:text-[#0155BD] transition-colors truncate">{r.lbl}</span>
							</div>
							<span class="text-xs font-black px-2 py-0.5 rounded-full" style="background:{r.bg};color:{r.col};">{r.n}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Trending Tags -->
			<div class="bg-white rounded-[1.5rem] border border-[#D8E8FA] shadow-sm p-5">
				<div class="flex items-center justify-between mb-4 gap-3">
					<p class="text-[10px] font-black uppercase tracking-[0.25em] text-[#78C520]">Trending Topics</p>
					{#if allTags.length > TAGS_COUNT}
						<button
							on:click={() => (showAllTags = !showAllTags)}
							class="text-[10px] font-black uppercase tracking-widest text-[#0155BD] hover:text-[#0D2460] flex items-center gap-1"
						>
							{showAllTags ? 'Show Less' : `All ${allTags.length}`}
							<ChevronDown size={10} class="transition-transform {showAllTags ? 'rotate-180' : ''}" />
						</button>
					{/if}
				</div>

				<div class="flex flex-wrap gap-2 mb-2">
					{#each allTags.slice(0, TAGS_COUNT) as tag}
						<button
							on:click={() => toggleTag(tag)}
							class="text-xs font-bold px-3 py-1.5 border rounded-full transition-all {activeTag === tag ? 'bg-[#0155BD] text-white border-[#0155BD]' : 'bg-white text-[#4A6D6D] border-[#D8E8FA] hover:border-[#0155BD] hover:text-[#0155BD]'}"
						>
							#{tag}
						</button>
					{/each}
				</div>

				{#if showAllTags && allTags.length > TAGS_COUNT}
					<div class="bg-[#FBFDFF] border border-[#E8F0FB] rounded-2xl p-4 mt-3">
						<p class="text-[9px] font-black uppercase tracking-widest text-[#7A9999] mb-3">All Tags ({allTags.length})</p>
						<div class="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1" style="scrollbar-width:thin;scrollbar-color:#D8E8FA transparent;">
							{#each allTags as tag, i}
								<button
									on:click={() => toggleTag(tag)}
									class="text-xs font-bold px-3 py-1.5 border rounded-full transition-all flex items-center gap-1.5 {activeTag === tag ? 'bg-[#0155BD] text-[#EAF3FF] border-[#0155BD]' : 'bg-white text-[#4A6D6D] border-[#D8E8FA] hover:border-[#0155BD] hover:bg-[#EEF6FF]'}"
								>
									<Tag size={9} /> #{tag}
									{#if i < TAGS_COUNT}
										<span class="text-[8px] px-1 font-black rounded-full" style="background:{activeTag === tag ? 'rgba(255,255,255,0.2)' : '#D3F2FC'};color:{activeTag === tag ? '#EAF3FF' : '#0155BD'};">hot</span>
									{/if}
								</button>
							{/each}
						</div>
						{#if activeTag}
							<button on:click={() => (activeTag = null)} class="mt-3 text-xs font-bold text-[#0D2460] flex items-center gap-1 hover:text-[#0155BD]">
								<X size={10} /> Clear: #{activeTag}
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</aside>
	</div>

	<!-- Newsletter section full width -->
	<div class="max-w-7xl mx-auto px-6 mt-16">
		<div class="bg-white rounded-[1.75rem] border border-[#D8E8FA] shadow-[0_10px_30px_rgba(1,85,189,0.08)] overflow-hidden">
			<NewsFooter />
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'DM Sans', sans-serif;
		background: #f4f9ff;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(.article-body h2) {
		font-family: 'DM Serif Display', serif;
		font-size: 1.75rem;
		font-weight: 900;
		color: #0d2460;
		margin: 3rem 0 1rem;
	}

	:global(.article-body h3) {
		font-family: 'DM Serif Display', serif;
		font-size: 1.3rem;
		font-weight: 900;
		color: #0155bd;
		margin: 2rem 0 0.75rem;
	}

	:global(.article-body p) {
		font-size: 1.1rem;
		line-height: 1.85;
		color: #374151;
		margin-bottom: 1.5rem;
	}

	:global(.article-body ul, .article-body ol) {
		margin: 0 0 1.5rem 1.5rem;
		color: #374151;
	}

	:global(.article-body li) {
		margin-bottom: 0.5rem;
		font-size: 1.05rem;
	}

	:global(.article-body blockquote) {
		border-left: 3px solid #0155bd;
		padding: 1rem 1.5rem;
		margin: 2rem 0;
		background: #fbfdff;
		font-style: italic;
		font-family: 'DM Serif Display', serif;
	}

	:global(.article-body table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}

	:global(.article-body th) {
		background: #0155bd;
		color: #eaf3ff;
		padding: 0.75rem 1rem;
		text-align: left;
		font-size: 0.8rem;
		font-weight: 900;
		text-transform: uppercase;
	}

	:global(.article-body td) {
		padding: 0.65rem 1rem;
		border-bottom: 1px solid #d8e8fa;
	}

	:global(.article-body .video-embed) {
		position: relative;
		padding-bottom: 56.25%;
		height: 0;
		overflow: hidden;
		margin: 1.5rem 0;
	}

	:global(.article-body .video-embed iframe) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	:global(.ref-cite) {
		font-size: 0.75rem;
		vertical-align: super;
		color: #0155bd;
	}
</style>
