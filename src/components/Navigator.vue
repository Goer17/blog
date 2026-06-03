<script setup lang="ts">
</script>

<template>
  <nav class="nav">
    <div class="nav-inner">
      <router-link to="/" class="nav-brand">YY. Lee</router-link>
      <div class="nav-links">
        <router-link to="/" exact>Home</router-link>
        <router-link to="/categories">Categories</router-link>
        <router-link to="/about">About</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--nav-height);
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.nav-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.nav-brand:hover {
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  gap: 0.25rem;
}

.nav-links a {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  position: relative;
}

.nav-links a:hover {
  color: var(--color-primary);
  background-color: var(--color-primary-lighter);
}

.nav-links a.router-link-active {
  color: var(--color-primary);
}

.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0.875rem;
  right: 0.875rem;
  height: 2px;
  background-color: var(--color-primary);
  border-radius: 1px;
}

@media (max-width: 768px) {
  .nav-inner {
    padding: 0 1rem;
  }

  .nav-links a {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>
