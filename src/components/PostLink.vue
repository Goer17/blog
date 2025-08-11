<script setup lang="ts">

interface Props {
    file: string,
    title: string,
    time: string,
    category?: string[],
    image?: string
}

const { file, title, time, category = [], image = 'res/img-not-found.png' } = defineProps<Props>()

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = 'res/img-not-found.png'
}
</script>

<template>
  <div class="post-link">
    <router-link 
      :to="{ path: '/post', query: { name: file } }" 
      class="post-card"
      target="_blank"
    >
      <div class="post-image">
        <img :src="image" :alt="title" class="post-image__img" @error="handleImageError">
      </div>
      <div class="post-content">
        <h2 class="post-title">{{ title }}</h2>
        <div class="post-meta">
          <span class="post-time">{{ time }}</span>
          <span class="post-categories" v-if="category">
            <span class="post-category" v-for="(cat, index) in category" :key="cat">
              {{ cat }}<span v-if="index < category.length - 1"> &rArr; </span>
            </span>
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.post-link {
  margin-bottom: 1.5rem;
}

.post-card {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
  text-decoration: none;
  color: inherit;
  height: 160px;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.post-image {
  flex: 0 0 20%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.post-image__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s;
}

.post-card:hover .post-image__img {
  transform: scale(1.05);
}

.post-content {
  flex: 1;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  color: #333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-meta {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #666;
}

.post-time {
  font-weight: 500;
}

.post-categories {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-category {
  color: #8690b7;
  font-weight: 500;
}

@media (max-width: 768px) {
  .post-card {
    height: 140px;
    flex-direction: column; /* 小屏幕改为垂直布局 */
  }
  
  .post-image {
    flex: 0 0 120px; /* 小屏幕固定图片高度 */
    width: 100%;
  }
  
  .post-content {
    padding: 1rem;
  }
  
  .post-title {
    font-size: 1.1rem;
  }
}
</style>