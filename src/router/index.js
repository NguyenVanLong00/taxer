import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';
import TaxDetail from '../views/TaxDetail.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },{
    path: '/tax-detail/:id',
    name: 'TaxDetail',
    component: TaxDetail
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
