import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import AdminLayout from './layouts/AdminLayout.vue';
import DashboardView from './views/DashboardView.vue';
import ProductsView from './views/ProductsView.vue';
import CategoriesView from './views/CategoriesView.vue';
import BrandsView from './views/BrandsView.vue';
import OrdersView from './views/OrdersView.vue';
import SettingsView from './views/SettingsView.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: DashboardView },
      { path: 'products', name: 'Products', component: ProductsView },
      { path: 'categories', name: 'Categories', component: CategoriesView },
      { path: 'brands', name: 'Brands', component: BrandsView },
      { path: 'orders', name: 'Orders', component: OrdersView },
      { path: 'settings', name: 'Settings', component: SettingsView }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth_token');
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;