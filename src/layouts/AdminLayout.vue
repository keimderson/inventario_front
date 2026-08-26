<template>
  <div class="flex h-screen bg-gray-100 text-gray-900 font-sans antialiased overflow-hidden">
    <!-- SIDEBAR -->
    <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
      <!-- Logo Dinámico -->
      <div class="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
        <span class="text-xl font-bold tracking-wider text-white uppercase truncate">
          {{ settings.store_name || 'PANEL CONTROL' }}
        </span>
      </div>

      <!-- Menú de Navegación -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div class="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Principal
        </div>

        <!-- Dashboard Link -->
        <router-link 
          to="/dashboard" 
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="$route.path === '/dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 hover:text-white'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Dashboard
        </router-link>

        <div class="px-3 pt-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Gestión de Tienda
        </div>

        <!-- Menú Desplegable: Catálogo -->
        <div>
          <button 
            @click="isCatalogOpen = !isCatalogOpen"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white"
            :class="isCatalogActive ? 'text-white' : 'text-slate-400'"
          >
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              <span>Catálogo</span>
            </div>
            <!-- Flecha interactiva -->
            <svg 
              class="w-4 h-4 transition-transform duration-200"
              :class="isCatalogOpen ? 'rotate-90 text-white' : 'text-slate-500'"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <!-- Submenús de Catálogo -->
          <div v-show="isCatalogOpen" class="mt-1 pl-4 space-y-1">
            <router-link 
              to="/products" 
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              :class="$route.path === '/products' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="$route.path === '/products' ? 'bg-white' : 'bg-slate-600'"></span>
              Productos & Stock
            </router-link>

            <router-link 
              to="/categories" 
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              :class="$route.path === '/categories' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="$route.path === '/categories' ? 'bg-white' : 'bg-slate-600'"></span>
              Categorías
            </router-link>

            <router-link 
              to="/brands" 
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              :class="$route.path === '/brands' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="$route.path === '/brands' ? 'bg-white' : 'bg-slate-600'"></span>
              Marcas
            </router-link>
          </div>
        </div>

        <div class="px-3 pt-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Administración
        </div>

        <!-- Pedidos (Placeholder) -->
        <router-link 
          to="/orders" 
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="$route.path === '/orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 hover:text-white'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          Pedidos
        </router-link>

        <!-- Configuración (Placeholder) -->
        <router-link 
          to="/settings" 
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="$route.path === '/settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'hover:bg-slate-800 hover:text-white'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Configuración
        </router-link>
      </nav>

      <!-- Footer Sesión -->
      <div class="p-3 border-t border-slate-800">
        <button @click="logout" class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- ÁREA PRINCIPAL -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Navbar Superior -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
        <h2 class="text-lg font-bold text-gray-800">
          {{ currentRouteTitle }}
        </h2>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
            AD
          </div>
          <span class="text-sm font-semibold text-gray-600">Admin</span>
        </div>
      </header>

      <!-- Contenedor de Vistas -->
      <main class="flex-1 overflow-y-auto p-6 md:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const settings = ref({});
const isCatalogOpen = ref(true); // Abierto por defecto

const isCatalogActive = computed(() => {
  return ['/products', '/categories', '/brands'].includes(route.path);
});

const currentRouteTitle = computed(() => {
  switch (route.path) {
    case '/dashboard': return 'Panel de Control';
    case '/products': return 'Gestión de Productos';
    case '/categories': return 'Gestión de Categorías';
    case '/brands': return 'Gestión de Marcas';
    case '/orders': return 'Gestión de Pedidos';
    case '/settings': return 'Configuración del Sistema';
    default: return 'Panel de Administración';
  }
});

const fetchSettings = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/settings');
    settings.value = res.data;
  } catch (error) {
    console.error('Error cargando configuración:', error);
  }
};

const logout = () => {
  localStorage.removeItem('auth_token');
  router.push('/login');
};

onMounted(fetchSettings);
</script>