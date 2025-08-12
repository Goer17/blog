<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Post {
  file: string,
  title: string,
  time: string,
  category: string[],
  image?: string
}

const posts = ref<Post[]>([]);
const expandedCategories = ref<Record<string, boolean>>({});

onMounted(async () => {
  try {
    const response = await fetch('/posts.json');
    if (!response.ok) throw new Error('Network response was not ok');
    posts.value = await response.json();
    posts.value.forEach(post => {
      if (post.category) {
        const key = post.category.join('/');
        expandedCategories.value[key] = false;
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
});

const toggleCategory = (key: string) => {
  expandedCategories.value[key] = !expandedCategories.value[key];
};

const categorizedPosts = () => {
  const result: Record<string, any> = {};
  
  posts.value.forEach(post => {
    if (!post.category) return;
    
    let currentLevel = result;
    post.category.forEach((cat, index) => {
      const path = post.category.slice(0, index + 1).join('/');
      
      if (!currentLevel[cat]) {
        currentLevel[cat] = {
          type: 'category',
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

</script>

<template>
  <div id="categories" class="category-nav">
    <div v-for="(categoryData, categoryName) in categorizedPosts()" :key="categoryName" class="category-item">
      <div 
        class="category-header" 
        @click="toggleCategory(categoryData.path)"
        :class="{ 'has-children': Object.keys(categoryData.children).length > 0 }"
      >
        <span class="category-name">{{ categoryName }}</span>
        <span 
          class="toggle-icon"
          v-if="Object.keys(categoryData.children).length > 0"
        >
          {{ expandedCategories[categoryData.path] ? '−' : '+' }}
        </span>
      </div>
      
      <div 
        class="category-content" 
        v-if="expandedCategories[categoryData.path]"
      >

        <div 
          v-for="(subCategoryData, subCategoryName) in categoryData.children" 
          :key="subCategoryName"
          class="sub-category"
        >
          <div 
            class="sub-category-header"
            @click="toggleCategory(subCategoryData.path)"
          >
            <span class="category-name">{{ subCategoryName }}</span>
            <span class="toggle-icon">
              {{ expandedCategories[subCategoryData.path] ? '-' : '+' }}
            </span>
          </div>

          <div 
            class="sub-category-content"
            v-if="expandedCategories[subCategoryData.path]"
          >

            <div 
              v-for="post in subCategoryData.posts" 
              :key="post.file"
              class="post-item"
            >
              <router-link 
                :to="{path: 'post', query: {name: post.file}}"
                class="post-title"
                target="_blank"
                >{{ post.title }}</router-link>
              <span class="post-date">{{ post.time }}</span>
            </div>
          </div>
        </div>
        
        <div 
          v-for="post in categoryData.posts" 
          :key="post.file"
          class="post-item"
        >
          <router-link 
                :to="{path: 'post', query: {name: post.file}}"
                class="post-title"
                target="_blank"
            >{{ post.title }}</router-link>
          <span class="post-date">{{ post.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-nav {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 80vw;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8fafc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.category-item {
  margin-bottom: 10px;
}

.category-header, .sub-category-header {
  padding: 12px 20px; /* 增大内边距 */
  background-color: #e1f0ff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  font-size: 1.1em; /* 增大字体 */
}

.category-header:hover, .sub-category-header:hover {
  background-color: #cce4ff;
}

.sub-category-header {
  background-color: #edf5ff;
  margin-top: 8px;
  font-size: 1em;
}

.category-name {
  font-weight: 500;
  color: #2c3e50;
}

.toggle-icon {
  font-weight: bold;
  color: #4a89dc;
  font-size: 1.2em;
}

.category-content, .sub-category-content {
  padding-left: 20px;
  margin-top: 10px;
  border-left: 2px solid #e1f0ff;
}

.post-item {
  padding: 10px 20px; /* 增大内边距 */
  margin: 8px 0;
  background-color: white;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.post-item:hover {
  transform: translateX(5px); /* 增大悬停移动距离 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-title {
  color: #3498db;
  text-decoration: none;
  font-size: 1em;
  flex-grow: 1;
}

.post-title:hover {
  text-decoration: underline;
}

.post-date {
  font-size: 0.9em;
  color: #7f8c8d;
  margin-left: 15px;
  white-space: nowrap;
}
</style>