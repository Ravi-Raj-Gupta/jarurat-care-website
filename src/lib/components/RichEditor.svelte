<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import Link from '@tiptap/extension-link';
	import ImageExt from '@tiptap/extension-image';

	export let content: string = '';
	export let placeholder: string = 'Start writing...';
	export let minHeight: string = '160px';

	const dispatch = createEventDispatcher<{ update: string }>();

	let element: HTMLDivElement;
	let editor: Editor;

	// Track current toolbar state so buttons can show active state
	let isBold = false;
	let isItalic = false;
	let isStrike = false;
	let isBulletList = false;
	let isOrderedList = false;
	let isH2 = false;
	let isH3 = false;
	let isQuote = false;
	let isLinkActive = false;

	function updateToolbarState() {
		if (!editor) return;
		isBold = editor.isActive('bold');
		isItalic = editor.isActive('italic');
		isStrike = editor.isActive('strike');
		isBulletList = editor.isActive('bulletList');
		isOrderedList = editor.isActive('orderedList');
		isH2 = editor.isActive('heading', { level: 2 });
		isH3 = editor.isActive('heading', { level: 3 });
		isQuote = editor.isActive('blockquote');
		isLinkActive = editor.isActive('link');
	}

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				StarterKit.configure({
					heading: { levels: [2, 3] },
					link: false
				}),
				Placeholder.configure({ placeholder }),
				Link.configure({ openOnClick: false, autolink: true }),
				ImageExt.configure({ inline: false, allowBase64: false })
			],
			content,
			onTransaction: () => {
				updateToolbarState();
			},
			onUpdate: ({ editor }) => {
				dispatch('update', editor.getHTML());
			}
		});
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});

	// Keep editor content in sync if parent resets `content` externally
	// (e.g. clearing the form after save)
	export function setContent(html: string) {
		if (editor) editor.commands.setContent(html);
	}

	function toggleBold() { editor.chain().focus().toggleBold().run(); }
	function toggleItalic() { editor.chain().focus().toggleItalic().run(); }
	function toggleStrike() { editor.chain().focus().toggleStrike().run(); }
	function toggleH2() { editor.chain().focus().toggleHeading({ level: 2 }).run(); }
	function toggleH3() { editor.chain().focus().toggleHeading({ level: 3 }).run(); }
	function toggleBulletList() { editor.chain().focus().toggleBulletList().run(); }
	function toggleOrderedList() { editor.chain().focus().toggleOrderedList().run(); }
	function toggleQuote() { editor.chain().focus().toggleBlockquote().run(); }
	function undo() { editor.chain().focus().undo().run(); }
	function redo() { editor.chain().focus().redo().run(); }

	function setLink() {
		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('Enter URL', previousUrl || 'https://');
		if (url === null) return;
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}
</script>

<div class="rich-editor">
	<div class="toolbar">
		<button type="button" class:active={isH2} on:click={toggleH2} title="Heading 2">H2</button>
		<button type="button" class:active={isH3} on:click={toggleH3} title="Heading 3">H3</button>
		<span class="sep"></span>
		<button type="button" class:active={isBold} on:click={toggleBold} title="Bold"><b>B</b></button>
		<button type="button" class:active={isItalic} on:click={toggleItalic} title="Italic"><i>I</i></button>
		<button type="button" class:active={isStrike} on:click={toggleStrike} title="Strikethrough"><s>S</s></button>
		<span class="sep"></span>
		<button type="button" class:active={isBulletList} on:click={toggleBulletList} title="Bullet list">• List</button>
		<button type="button" class:active={isOrderedList} on:click={toggleOrderedList} title="Numbered list">1. List</button>
		<button type="button" class:active={isQuote} on:click={toggleQuote} title="Quote">"</button>
		<span class="sep"></span>
		<button type="button" class:active={isLinkActive} on:click={setLink} title="Insert link">🔗</button>
		<span class="sep"></span>
		<button type="button" on:click={undo} title="Undo">↺</button>
		<button type="button" on:click={redo} title="Redo">↻</button>
	</div>
	<div class="editor-body" style="min-height:{minHeight}" bind:this={element}></div>
</div>

<style>
	.rich-editor {
		border: 1px solid #d9e3f0;
		border-radius: 10px;
		background: #fff;
		overflow: hidden;
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		padding: 8px;
		border-bottom: 1px solid #eef2f7;
		background: #f8fafc;
	}

	.toolbar button {
		background: #fff;
		color: #374151;
		border: 1px solid #e2e8f0;
		padding: 5px 10px;
		font-size: 12px;
		font-weight: 700;
		border-radius: 6px;
		cursor: pointer;
		line-height: 1.2;
	}

	.toolbar button:hover {
		background: #eef4ff;
		border-color: #b9d3fb;
	}

	.toolbar button.active {
		background: #0155bd;
		color: #fff;
		border-color: #0155bd;
	}

	.sep {
		width: 1px;
		background: #e2e8f0;
		margin: 2px 4px;
	}

	.editor-body {
		padding: 14px;
	}

	/* TipTap ProseMirror content styling */
	.editor-body :global(.ProseMirror) {
		outline: none;
		font: inherit;
		color: #1f2937;
		line-height: 1.7;
		min-height: inherit;
	}

	.editor-body :global(.ProseMirror p) {
		margin: 0 0 10px;
	}

	.editor-body :global(.ProseMirror h2) {
		font-size: 19px;
		font-weight: 800;
		color: #0d2460;
		margin: 16px 0 8px;
	}

	.editor-body :global(.ProseMirror h3) {
		font-size: 16px;
		font-weight: 700;
		color: #0d2460;
		margin: 14px 0 6px;
	}

	.editor-body :global(.ProseMirror ul) {
		list-style-type: disc;
		padding-left: 22px;
		margin: 0 0 10px;
	}

	.editor-body :global(.ProseMirror ol) {
		list-style-type: decimal;
		padding-left: 22px;
		margin: 0 0 10px;
	}

	.editor-body :global(.ProseMirror ul li),
	.editor-body :global(.ProseMirror ol li) {
		display: list-item;
	}

	.editor-body :global(.ProseMirror li p) {
		margin: 0;
	}

	.editor-body :global(.ProseMirror blockquote) {
		border-left: 3px solid #0155bd;
		padding-left: 12px;
		color: #4b5563;
		font-style: italic;
		margin: 0 0 10px;
	}

	.editor-body :global(.ProseMirror a) {
		color: #0155bd;
		text-decoration: underline;
	}

	.editor-body :global(.ProseMirror p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: #9ca3af;
		pointer-events: none;
		height: 0;
	}
</style>
