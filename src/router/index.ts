import { createRouter, createWebHistory } from 'vue-router'
import Devices from '../views/Devices.vue'
import Map from '../views/Map.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'devices',
      component: Devices
    },
    {
      path: '/map',
      name: 'map',
      component: Map
    }
  ]
})

export default router
