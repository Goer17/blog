<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';

import MarkdownIt from 'markdown-it';
import markdownItMathjax3 from 'markdown-it-mathjax3';
import markdownItHighlightjs from 'markdown-it-highlightjs';
import markdownItTaskLists from 'markdown-it-task-lists';

import 'highlight.js/styles/github.css';
import '../styles/markdown.css';

const route = useRoute();
const content = ref('');
const renderedContent = ref('');
const isLoading = ref(false);

interface PostMeta {
  file: string;
  title: string;
  time: string;
  category?: string[];
  image?: string;
}

const postMeta = ref<PostMeta | null>(null);

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const toc = ref<TocItem[]>([]);
const activeHeading = ref('');
const tocOpen = ref(false);

let headingIdCounter = 0;

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
.use(markdownItHighlightjs)
.use(markdownItTaskLists)
.use(markdownItMathjax3);

const originalHeadingOpen = md.renderer.rules.heading_open ||
  function(tokens: any, idx: any, options: any, _env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.heading_open = function(tokens: any, idx: any, options: any, env: any, self: any) {
  const token = tokens[idx];
  const level = parseInt(token.tag.slice(1));
  if (level <= 3) {
    const contentToken = tokens[idx + 1];
    const text = contentToken.children
      ? contentToken.children.filter((t: any) => t.type === 'text' || t.type === 'code_inline').map((t: any) => t.content).join('')
      : '';
    const id = `heading-${headingIdCounter++}`;
    token.attrSet('id', id);
    env.__toc = env.__toc || [];
    env.__toc.push({ id, text, level });
  }
  return originalHeadingOpen(tokens, idx, options, env, self);
};

async function loadPostMeta(name: string) {
  try {
    const response = await fetch('/posts.json');
    if (!response.ok) return;
    const posts: PostMeta[] = await response.json();
    postMeta.value = posts.find(p => p.file === name) || null;
  } catch {}
}

async function loadMarkdownFile() {
  isLoading.value = true;
  headingIdCounter = 0;
  const name = route.query.name?.toString() || '';
  await loadPostMeta(name);
  const path = `/posts_/${name}.md`;
  try {
    const response = await fetch(path, {
      headers: { 'Accept': 'text/plain' }
    });
    if (!response.ok) throw new Error("File Not Found...");
    content.value = await response.text();
    content.value = content.value.replace(/^---[\s\S]*?---\s*/, '');
  } catch {
    content.value = "## This post doesn't exist.    :(";
  } finally {
    const env: any = {};
    renderedContent.value = md.render(content.value, env);
    toc.value = env.__toc || [];
    isLoading.value = false;

    await nextTick();
    setupScrollSpy();
  }
}

let observer: IntersectionObserver | null = null;

function setupScrollSpy() {
  if (observer) observer.disconnect();

  const headings = toc.value
    .map(item => document.getElementById(item.id))
    .filter(Boolean) as HTMLElement[];

  if (!headings.length) return;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeHeading.value = entry.target.id;
          break;
        }
      }
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
  );

  headings.forEach(h => observer!.observe(h));
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeHeading.value = id;
    tocOpen.value = false;
  }
}

watch(() => route.query.name, () => loadMarkdownFile(), { immediate: true });
onMounted(loadMarkdownFile);
onUnmounted(() => { if (observer) observer.disconnect(); });
</script>

<template>
  <div class="post-page">
    <!-- Mobile TOC toggle -->
    <button
      v-if="toc.length"
      class="toc-toggle"
      @click="tocOpen = !tocOpen"
      :class="{ active: tocOpen }"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 4h12M3 9h8M3 14h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>TOC</span>
    </button>

    <!-- TOC sidebar -->
    <aside
      v-if="toc.length"
      class="toc-sidebar"
      :class="{ open: tocOpen }"
    >
      <nav class="toc-nav">
        <h3 class="toc-title">Contents</h3>
        <ul class="toc-list">
          <li
            v-for="item in toc"
            :key="item.id"
            :class="[
              `toc-level-${item.level}`,
              { active: activeHeading === item.id }
            ]"
          >
            <a @click.prevent="scrollToHeading(item.id)" :href="`#${item.id}`">
              {{ item.text }}
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Overlay for mobile TOC -->
    <div
      v-if="tocOpen"
      class="toc-overlay"
      @click="tocOpen = false"
    ></div>

    <!-- Post content -->
    <article class="post-content">
      <div v-if="isLoading" class="loading">
        <span>Loading...</span>
      </div>
      <template v-else>
        <header v-if="postMeta" class="post-header">
          <h1 class="post-header-title">{{ postMeta.title }}</h1>
          <div class="post-header-meta">
            <span class="post-header-time">{{ postMeta.time }}</span>
            <div v-if="postMeta.category?.length" class="post-header-categories">
              <template v-for="(cat, index) in postMeta.category" :key="cat">
                <span class="post-header-tag">{{ cat }}</span>
                <span v-if="index < postMeta.category!.length - 1" class="post-header-sep">&raquo;</span>
              </template>
            </div>
          </div>
        </header>
        <div class="markdown-body" v-html="renderedContent"></div>
      </template>
    </article>
  </div>
</template>

<style scoped>
.post-page {
  display: flex;
  gap: 2rem;
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
}

.toc-sidebar {
  position: fixed;
  top: calc(var(--nav-height) + 2rem);
  width: 220px;
  max-height: calc(100vh - var(--nav-height) - 4rem);
  overflow-y: auto;
  left: max(1rem, calc((100vw - 1100px) / 2 - 240px));
}

.toc-nav {
  padding-right: 1rem;
}

.toc-title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary);
  margin-bottom: 0.75rem;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin: 0;
}

.toc-list li a {
  display: block;
  padding: 0.3rem 0 0.3rem 0.75rem;
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: all var(--transition);
  line-height: 1.4;
  cursor: pointer;
}

.toc-list li a:hover {
  color: var(--color-primary);
}

.toc-list li.active a {
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  font-weight: 500;
}

.toc-level-2 a {
  padding-left: 1.5rem !important;
  font-size: 0.775rem !important;
}

.toc-level-3 a {
  padding-left: 2.25rem !important;
  font-size: 0.75rem !important;
}

.toc-toggle {
  display: none;
}

.toc-overlay {
  display: none;
}

.post-content {
  flex: 1;
  min-width: 0;
  max-width: var(--max-width);
}

.post-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.post-header-title {
  font-family: var(--font-sans);
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
  margin-bottom: 0.75rem;
}

.post-header-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.post-header-time {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.post-header-categories {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.post-header-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  padding: 0.15em 0.5em;
  border-radius: var(--radius-sm);
}

.post-header-sep {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
}

.loading {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--color-text-tertiary);
  padding: 3rem 0;
  text-align: center;
}

@media (max-width: 1400px) {
  .toc-sidebar {
    left: 1rem;
  }
}

@media (max-width: 1200px) {
  .toc-sidebar {
    display: none;
  }

  .toc-sidebar.open {
    display: block;
    position: fixed;
    top: var(--nav-height);
    left: 0;
    width: 280px;
    max-height: calc(100vh - var(--nav-height));
    background: var(--color-bg);
    border-right: 1px solid var(--color-border);
    box-shadow: var(--shadow-lg);
    z-index: 90;
    padding: 1.5rem;
  }

  .toc-toggle {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 95;
    padding: 0.6rem 1rem;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--transition);
  }

  .toc-toggle:hover,
  .toc-toggle.active {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .toc-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 85;
  }
}

@media (max-width: 768px) {
  .post-page {
    gap: 0;
  }

  .toc-toggle {
    bottom: 1rem;
    right: 1rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>
