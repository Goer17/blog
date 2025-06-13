<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import MarkdownIt from 'markdown-it';
import markdownItMathjax3 from 'markdown-it-mathjax3';
import markdownItHighlightjs from 'markdown-it-highlightjs';
import markdownItTaskLists from 'markdown-it-task-lists';

import 'highlight.js/styles/github.css';

const route = useRoute();
const content = ref('');
const renderedContent = ref('');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
.use(markdownItHighlightjs)
.use(markdownItTaskLists)
.use(markdownItMathjax3)


const isLoading = ref(false);

async function loadMarkdownFile() {
    isLoading.value = true;
    const name = route.query.name?.toString() || '';
    const path = `/posts/${name}.md`;
    try {
        const response = await fetch(path, {
            headers: {
                'Accept': 'text/plain'
            }
        });
        if (!response.ok)
            throw new Error("File Not Found...");
        content.value = await response.text();
        content.value = content.value.replace(/^---[\s\S]*?---\s*/, '');
    }
    catch (error) {
        content.value = "## This post doesn't exist.    :("
    }
    finally {
        renderedContent.value = md.render(content.value);
        console.log(renderedContent.value);
        isLoading.value = false;
    }
}

watch(
  () => route.query.name,
  () => loadMarkdownFile(),
  { immediate: true }
);

onMounted(loadMarkdownFile);
</script>

<template>
  <div id="post">
    <div v-if="isLoading" class="loading-spinner">
      <span>Loading...</span>
    </div>
    <div v-else class="markdown-container">
      <div v-html="renderedContent"></div>
    </div>
  </div>
</template>

<style scoped>

</style>