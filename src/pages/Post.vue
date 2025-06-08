<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';
import 'katex/dist/katex.min.css'

const route = useRoute();
const content = ref('');
const renderedContent = ref('');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
.use(mk);
// .use(require('markdown-it-highlightjs'))
// .use(require('markdown-it-task-lists'));

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
        <div class="markdown-container">
            <div v-html="renderedContent"></div>
        </div>
    </div>
</template>

<style scoped></style>