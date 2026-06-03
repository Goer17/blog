<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PostLink from '../components/PostLink.vue';

interface Post {
    file: string,
    title: string,
    time: string,
    category?: string[],
    image?: string
}

const route = useRoute()
const router = useRouter();

const posts = ref<Post[]>([]);
const currentPage = ref(parseInt(route.query.page as string) || 1);
const itemsPerPage = ref(4);

onMounted(async () => {
  try {
    const response = await fetch('/posts.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    posts.value = await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
});

watch(
  () => route.query.page,
  (newPage) => {
    const pageNum = parseInt(newPage as string) || 1;
    if (pageNum !== currentPage.value) {
      currentPage.value = pageNum;
    }
  },
  { immediate: true }
);

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return posts.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(posts.value.length / itemsPerPage.value);
});

function updatePageUrl(page: number) {
  const query = {
    ...route.query,
    page: page > 1 ? page.toString() : undefined
  };
  router.replace({ path: route.path, query });
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    updatePageUrl(currentPage.value);
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    updatePageUrl(currentPage.value);
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    updatePageUrl(page);
  }
}
</script>

<template>
  <div class="home">
    <div class="post-list">
      <PostLink
        v-for="post in paginatedPosts"
        :key="post.file"
        :file="post.file"
        :title="post.title"
        :time="post.time"
        :category="post.category"
        :image="post.image"
      />
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
        &larr;
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        class="page-btn"
        :class="{ active: currentPage === page }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
        &rarr;
      </button>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.375rem;
  padding: 1rem 0;
}

.page-btn {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 500;
  min-width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  transition: all var(--transition);
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: var(--color-primary-lighter);
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-btn.active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  font-weight: 600;
}
</style>
