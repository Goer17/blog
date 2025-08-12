<script setup lang="ts">
</script>

<template>
  <div id="navigator">
    <router-link to="/">🏠 Home</router-link>
    <router-link to="/categories">📖 Categories</router-link>
    <router-link to="/about">🌐 About</router-link>
  </div>
</template>

<style scoped>
#navigator {
  background-color: rgba(230, 242, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari 兼容 */
  padding: 1rem 2rem;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 4px 15px rgba(0, 0, 100, 0.1);
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
}

#navigator a {
  color: #2c6ecb;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 0.5rem 1.2rem;
  margin: 0 0.3rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

#navigator a:hover {
  background-color: rgba(208, 227, 255, 0.6);
  color: #1a4d8c;
}

#navigator a.router-link-active {
  background-color: rgba(179, 212, 255, 0.7);
  color: #1a4d8c;
  font-weight: 600;
}

#navigator a::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(100, 149, 237, 0);
  transition: box-shadow 0.3s ease;
}

#navigator a:hover::after {
  box-shadow: 0 0 8px rgba(100, 149, 237, 0.3);
}
</style>