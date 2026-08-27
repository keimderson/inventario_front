<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-800">Marcas Comerciales</h1>
        <p class="text-sm text-gray-500">Administra los fabricantes y firmas de tus productos.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Nueva Marca
      </button>
    </div>

    <!-- Alert Feedback -->
    <div v-if="alert.message" :class="alert.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'" class="p-4 rounded-xl border text-sm font-medium">
      {{ alert.message }}
    </div>

    <!-- Grid / Tarjetas de Marcas -->
    <div v-if="loading" class="p-12 text-center text-gray-400 text-sm">
      Cargando marcas...
    </div>

    <div v-else-if="brands.length === 0" class="bg-white rounded-2xl p-12 text-center border border-gray-200 text-gray-400 text-sm">
      No hay marcas registradas aún. Haz clic en "Nueva Marca" para agregar la primera.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      <div 
        v-for="brand in brands" 
        :key="brand.id"
        class="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div class="flex items-center gap-4 mb-4">
          <!-- Logo de la Marca o Inicial -->
          <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              v-if="brand.logo" 
              :src="`${import.meta.env.VITE_API_URL}` + brand.logo" 
              :alt="brand.name" 
              class="w-full h-full object-contain p-1"
            />
            <span v-else class="font-bold text-gray-400 text-lg">
              {{ brand.name.charAt(0).toUpperCase() }}
            </span>
          </div>

          <div class="min-w-0 flex-1">
            <h3 class="font-bold text-gray-900 text-base truncate">{{ brand.name }}</h3>
            <p class="text-xs text-gray-400 font-mono truncate">{{ brand.slug }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-gray-50">
          <span class="text-xs text-gray-400 font-medium">
            {{ brand.products_count || 0 }} productos
          </span>
          <div class="flex gap-1">
            <button 
              @click="openEditModal(brand)"
              class="text-blue-600 hover:text-blue-800 font-semibold text-xs py-1 px-2.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Editar
            </button>
            <button 
              @click="deleteBrand(brand.id)"
              class="text-red-500 hover:text-red-700 font-semibold text-xs py-1 px-2.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL (Crear / Editar) -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-800">
            {{ isEditing ? 'Editar Marca' : 'Nueva Marca' }}
          </h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form @submit.prevent="saveBrand" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre de la Marca</label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              placeholder="Ej: Rare Beauty, Maybelline..." 
              class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Logotipo (Opcional)</label>
            <input 
              type="file" 
              accept="image/*" 
              @change="handleImageChange"
              class="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              @click="showModal = false" 
              class="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="saving"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold px-5 py-2 rounded-xl shadow transition-all"
            >
              {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const brands = ref([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const imageFile = ref(null);

const alert = reactive({ message: '', type: 'success' });
const form = reactive({ name: '' });

const handleImageChange = (e) => {
  imageFile.value = e.target.files[0] || null;
};

const fetchBrands = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/brands`);
    brands.value = res.data;
  } catch (error) {
    console.error('Error al cargar marcas:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.name = '';
  imageFile.value = null;
  showModal.value = true;
};

const openEditModal = (brand) => {
  isEditing.value = true;
  editingId.value = brand.id;
  form.name = brand.name;
  imageFile.value = null;
  showModal.value = true;
};

const saveBrand = async () => {
  saving.value = true;
  alert.message = '';
  const token = localStorage.getItem('auth_token');
  
  const formData = new FormData();
  formData.append('name', form.name);
  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  try {
    const url = isEditing.value 
      ? `${import.meta.env.VITE_API_URL}/api/brands/${editingId.value}` 
      : `${import.meta.env.VITE_API_URL}/api/brands`;

    await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    alert.type = 'success';
    alert.message = isEditing.value ? 'Marca actualizada con éxito.' : 'Marca creada con éxito.';
    showModal.value = false;
    await fetchBrands();
  } catch (error) {
    alert.type = 'error';
    alert.message = error.response?.data?.message || 'Error al guardar la marca.';
  } finally {
    saving.value = false;
  }
};

const deleteBrand = async (id) => {
  if (!confirm('¿Deseas eliminar esta marca?')) return;

  const token = localStorage.getItem('auth_token');
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/brands/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert.type = 'success';
    alert.message = 'Marca eliminada.';
    await fetchBrands();
  } catch (error) {
    alert.type = 'error';
    alert.message = 'Error al eliminar la marca.';
  }
};

onMounted(fetchBrands);
</script>