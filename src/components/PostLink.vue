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
        <img :src="image" :alt="title" @error="handleImageError">
      </div>
      <div class="post-content">
        <h2 class="post-title">{{ title }}</h2>
        <div class="post-meta">
          <span class="post-time">{{ time }}</span>
          <div class="post-categories" v-if="category.length">
            <template v-for="(cat, index) in category" :key="cat">
              <span class="post-tag">{{ cat }}</span>
              <span v-if="index < category.length - 1" class="post-tag-sep">&raquo;</span>
            </template>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.post-link {
  margin-bottom: 1rem;
}

.post-card {
  display: flex;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
  transition: all var(--transition);
  background: var(--color-bg);
  text-decoration: none;
  color: inherit;
  height: 150px;
}

.post-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.post-image {
  flex: 0 0 180px;
  height: 100%;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-image img {
  transform: scale(1.05);
}

.post-content {
  flex: 1;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.post-title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.post-time {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.post-categories {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.post-tag-sep {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
}

.post-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  padding: 0.15em 0.5em;
  border-radius: var(--radius-sm);
}

@media (max-width: 768px) {
  .post-card {
    flex-direction: column;
    height: auto;
  }

  .post-image {
    flex: none;
    height: 160px;
    width: 100%;
  }

  .post-content {
    padding: 1rem;
    gap: 0.5rem;
  }

  .post-title {
    font-size: 1.1rem;
  }
}
</style>
