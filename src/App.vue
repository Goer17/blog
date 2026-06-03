<script setup lang="ts">
import Navigator from './components/Navigator.vue';
</script>

<template>
  <div id="app">
    <Navigator />
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: calc(var(--nav-height) + 2rem) 1.5rem 3rem;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .app-main {
    padding: calc(var(--nav-height) + 1.5rem) 1rem 2rem;
  }
}
</style>
