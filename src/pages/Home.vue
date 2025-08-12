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

// Get paginated subset of posts
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return posts.value.slice(start, end);
});

// Calculate total number of pages
const totalPages = computed(() => {
  return Math.ceil(posts.value.length / itemsPerPage.value);
});

function updatePageUrl(page: number, forceReload = false) {
  const query = { 
    ...route.query,
    page: page > 1 ? page.toString() : undefined
  };

  router.replace({
    path: route.path,
    query
  });
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
    <div id="home" v-for="post in paginatedPosts" :key="post.file">
        <PostLink :file="post.file" :title="post.title" :time="post.time" :category="post.category" :image="post.image" />
    </div>
    
    <div class="pagination" v-if="posts.length > 0">
        <button @click="prevPage" :disabled="currentPage === 1">&lt;&lt;</button>
        <button 
            v-for="page in totalPages" 
            :key="page" 
            @click="goToPage(page)"
            :class="{ active: currentPage === page }"
        >
            {{ page }}
        </button>
        
        <button @click="nextPage" :disabled="currentPage === totalPages">&gt;&gt;</button>
    </div>
</template>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    padding: 15px;
    background-color: #e6f7ff;
    border-radius: 8px;
}

.pagination button {
    padding: 8px 12px;
    background-color: #91d5ff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
}

.pagination button:hover:not(:disabled) {
    background-color: #69c0ff;
    color: white;
}

.pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination button.active {
    background-color: #1890ff;
    color: white;
    font-weight: bold;
}
</style>