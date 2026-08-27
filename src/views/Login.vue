<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-800">
          {{ settings.store_name || 'Cargando...' }}
        </h2>
        <p class="text-gray-500 mt-2">Ingresa tus credenciales de administrador</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" required
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="admin@ejemplo.com">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input v-model="form.password" type="password" required
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••">
        </div>

        <button type="submit" :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all">
          {{ loading ? 'Iniciando sesión...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const settings = ref({}); // Aquí guardaremos lo que venga de la API
const form = reactive({ email: '', password: '' });

// Se ejecuta apenas se abre la página
onMounted(() => {
  fetchSettings();
});

// Función para traer la configuración
const fetchSettings = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/settings`);
    settings.value = response.data;
  } catch (error) {
    console.error("Error cargando configuración:", error);
  }
};


const handleLogin = async () => {
  loading.value = true;
  try {
    // REVISA: El puerto 8000 debe ser el de tu php artisan serve
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, form);

    localStorage.setItem('auth_token', response.data.access_token);
    //alert('¡Login exitoso!');
    router.push('/dashboard');

    // router.push('/dashboard'); // Descomenta esto cuando tengas el dashboard
  } catch (error) {
    alert('Error: ' + (error.response?.data?.message || 'Credenciales incorrectas'));
  } finally {
    loading.value = false;
  }
};
</script>