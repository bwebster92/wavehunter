import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dash/:username', //dynamic route doesn't seem to work?
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/explore',
      name: 'explore',
      // lazy-loaded when route is visited
      component: () => import('../views/ExploreView.vue'),
    },
  ],
});

export default router;
