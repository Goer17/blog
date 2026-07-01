<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Post {
  file: string,
  title: string,
  time: string,
  category: string[],
  image?: string
}

interface CategoryNode {
  path: string;
  children: Record<string, CategoryNode>;
  posts: Post[];
}

const posts = ref<Post[]>([]);
const expandedCategories = ref<Record<string, boolean>>({});

onMounted(async () => {
  try {
    const response = await fetch('/posts.json');
    if (!response.ok) throw new Error('Network response was not ok');
    posts.value = await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
});

const toggleCategory = (key: string) => {
  expandedCategories.value[key] = !expandedCategories.value[key];
};

const categorizedPosts = (): Record<string, CategoryNode> => {
  const result: Record<string, CategoryNode> = {};

  posts.value.forEach(post => {
    if (!post.category) return;

    let currentLevel = result;
    post.category.forEach((cat, index) => {
      const path = post.category.slice(0, index + 1).join('/');

      if (!currentLevel[cat]) {
        currentLevel[cat] = {
          path,
          children: {},
          posts: []
        };
      }

      if (index === post.category.length - 1) {
        currentLevel[cat].posts.push(post);
      } else {
        currentLevel = currentLevel[cat].children;
      }
    });
  });

  return result;
};

const countPosts = (node: CategoryNode): number => {
  let count = node.posts.length;
  for (const child of Object.values(node.children)) {
    count += countPosts(child);
  }
  return count;
};
</script>

<template>
  <div class="categories">
    <h1 class="categories-title">Categories</h1>

    <div class="category-tree">
      <div
        v-for="(data, name) in categorizedPosts()"
        :key="name"
        class="category-group"
      >
        <button
          class="category-header"
          @click="toggleCategory(data.path)"
          :class="{ expanded: expandedCategories[data.path] }"
        >
          <span class="category-chevron">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="category-name">{{ name }}</span>
          <span class="category-count">{{ countPosts(data) }}</span>
        </button>

        <div class="category-body" v-show="expandedCategories[data.path]">
          <!-- Sub-categories -->
          <div
            v-for="(subData, subName) in data.children"
            :key="subName"
            class="sub-category"
          >
            <button
              class="sub-category-header"
              @click="toggleCategory(subData.path)"
              :class="{ expanded: expandedCategories[subData.path] }"
            >
              <span class="category-chevron">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="category-name">{{ subName }}</span>
              <span class="category-count">{{ countPosts(subData) }}</span>
            </button>

            <div class="sub-category-body" v-show="expandedCategories[subData.path]">
              <div
                v-for="post in subData.posts"
                :key="post.file"
                class="post-item"
              >
                <router-link
                  :to="{ path: '/post', query: { name: post.file } }"
                  class="post-link"
                  target="_blank"
                >{{ post.title }}</router-link>
                <span class="post-date">{{ post.time }}</span>
              </div>
            </div>
          </div>

          <!-- Direct posts under this category -->
          <div
            v-for="post in data.posts"
            :key="post.file"
            class="post-item"
          >
            <router-link
              :to="{ path: '/post', query: { name: post.file } }"
              class="post-link"
              target="_blank"
            >{{ post.title }}</router-link>
            <span class="post-date">{{ post.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.categories-title {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.category-tree {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-header,
.sub-category-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 0.925rem;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition);
}

.category-header:hover,
.sub-category-header:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-lighter);
}

.sub-category-header {
  font-size: 0.875rem;
  border-color: var(--color-border-light);
}

.category-chevron {
  display: flex;
  align-items: center;
  color: var(--color-text-tertiary);
  transition: transform var(--transition);
}

.expanded > .category-chevron {
  transform: rotate(90deg);
}

.category-count {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  background-color: var(--color-bg-secondary);
  padding: 0.1em 0.5em;
  border-radius: 10px;
  min-width: 1.5em;
  text-align: center;
}

.category-body {
  margin-left: 1.5rem;
  padding-left: 1rem;
  border-left: 2px solid var(--color-border-light);
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sub-category {
  margin-top: 0.25rem;
}

.sub-category-body {
  margin-left: 1.5rem;
  padding-left: 1rem;
  border-left: 2px solid var(--color-border-light);
  margin-top: 0.25rem;
}

.post-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  margin: 0.125rem 0;
  border-radius: var(--radius-sm);
  transition: background-color var(--transition);
}

.post-item:hover {
  background-color: var(--color-primary-lighter);
}

.post-link {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--color-text);
  text-decoration: none;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color var(--transition);
}

.post-link:hover {
  color: var(--color-primary);
}

.post-date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin-left: 1rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .categories-title {
    font-size: 1.25rem;
  }

  .category-body {
    margin-left: 0.75rem;
    padding-left: 0.75rem;
  }

  .sub-category-body {
    margin-left: 0.75rem;
    padding-left: 0.75rem;
  }

  .post-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .post-date {
    margin-left: 0;
  }
}
</style>
