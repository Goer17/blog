import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import Categories from '../pages/Categories.vue'
import Post from '../pages/Post.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/categories', component: Categories },
  { path: '/post', component: Post}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router