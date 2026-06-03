<script setup lang="ts">
</script>

<template>
  <div class="about">
    <div class="about-card">
      <img class="avatar" src="/res/avator.png" alt="YY. Lee's avatar">
      <div class="divider"></div>
      <p class="intro">
        Hello, I'm <strong>YY. Lee</strong> <span class="flag">🇨🇳</span>
      </p>
      <p class="desc">
        Welcome to my personal blog where I share thoughts on technology and life.
      </p>
    </div>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--nav-height) - 6rem);
}

.about-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
}

.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-border-light);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition), box-shadow var(--transition);
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.divider {
  width: 60px;
  height: 2px;
  background: var(--color-border);
  margin: 1.5rem 0;
  border-radius: 1px;
}

.intro {
  font-family: var(--font-sans);
  font-size: 1.375rem;
  line-height: 1.5;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.intro strong {
  font-weight: 600;
}

.flag {
  font-size: 1.1em;
  vertical-align: middle;
  margin-left: 2px;
}

.desc {
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .avatar {
    width: 110px;
    height: 110px;
  }

  .intro {
    font-size: 1.2rem;
  }

  .desc {
    font-size: 0.925rem;
  }
}
</style>
