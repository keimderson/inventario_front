<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-800">Categorías de Productos</h1>
        <p class="text-sm text-gray-500">Organiza y estructura el catálogo de tu tienda.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Nueva Categoría
      </button>
    </div>

    <!-- Feedback alert -->
    <div v-if="alert.message" :class="alert.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'" class="p-4 rounded-xl border text-sm font-medium">
      {{ alert.message }}
    </div>

    <!-- Tabla / Listado Jerárquico -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-400 text-sm">
        Cargando categorías...
      </div>

      <div v-else-if="categories.length === 0" class="p-8 text-center text-gray-400 text-sm">
        No hay categorías registradas. Haz clic en "Nueva Categoría" para comenzar.
      </div>

      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <th class="py-4 px-6">Nombre de Categoría</th>
            <th class="py-4 px-6">Slug</th>
            <th class="py-4 px-6">Tipo</th>
            <th class="py-4 px-6 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm">
          <template v-for="cat in flatCategories" :key="cat.id">
            <tr class="hover:bg-gray-50/60 transition-colors">
              <td class="py-4 px-6 font-medium text-gray-800">
                <!-- Sangría visual según nivel de profundidad -->
                <div class="flex items-center" :style="{ paddingLeft: `${cat.level * 24}px` }">
                  <span v-if="cat.level > 0" class="text-gray-300 mr-2">└─</span>
                  <span :class="cat.level === 0 ? 'font-bold text-gray-900' : 'text-gray-700'">
                    {{ cat.name }}
                  </span>
                </div>
              </td>
              <td class="py-4 px-6 text-gray-400 font-mono text-xs">{{ cat.slug }}</td>
              <td class="py-4 px-6">
                <span 
                  class="px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="cat.level === 0 ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-100 text-gray-600'"
                >
                  {{ cat.level === 0 ? 'Principal' : 'Subcategoría' }}
                </span>
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <button 
                  @click="openEditModal(cat)"
                  class="text-blue-600 hover:text-blue-800 font-semibold text-xs py-1 px-2.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Editar
                </button>
                <button 
                  @click="deleteCategory(cat.id)"
                  class="text-red-500 hover:text-red-700 font-semibold text-xs py-1 px-2.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- MODAL (Crear / Editar) -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-800">
            {{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}
          </h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form @submit.prevent="saveCategory" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              placeholder="Ej: Labiales, Cuidado Facial..." 
              class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría Padre (Opcional)</label>
            <select 
              v-model="form.parent_id" 
              class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            >
              <option :value="null">-- Ninguna (Categoría Principal) --</option>
              <option 
                v-for="parent in availableParents" 
                :key="parent.id" 
                :value="parent.id"
              >
                {{ '— '.repeat(parent.level) + parent.name }}
              </option>
            </select>
            <span class="text-[11px] text-gray-400 mt-1 block">Selecciona un padre solo si es una subcategoría.</span>
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
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';

const categories = ref([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const alert = reactive({ message: '', type: 'success' });
const form = reactive({
  name: '',
  parent_id: null
});

// Aplanar el árbol recursivo para renderizar la tabla con niveles de sangría
const flattenTree = (nodes, level = 0) => {
  let result = [];
  for (const node of nodes) {
    result.push({
      id: node.id,
      name: node.name,
      slug: node.slug,
      parent_id: node.parent_id,
      level: level
    });
    if (node.children_recursive && node.children_recursive.length > 0) {
      result = result.concat(flattenTree(node.children_recursive, level + 1));
    }
  }
  return result;
};

const flatCategories = computed(() => {
  return flattenTree(categories.value);
});

// Evitar que una categoría sea su propio padre al editar
const availableParents = computed(() => {
  if (!isEditing.value) return flatCategories.value;
  return flatCategories.value.filter(c => c.id !== editingId.value);
});

const fetchCategories = async () => {
  loading.value = true;
  try {
    const res = await axios.get('http://localhost:8000/api/categories');
    categories.value = res.data;
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.name = '';
  form.parent_id = null;
  showModal.value = true;
};

const openEditModal = (cat) => {
  isEditing.value = true;
  editingId.value = cat.id;
  form.name = cat.name;
  form.parent_id = cat.parent_id;
  showModal.value = true;
};

const saveCategory = async () => {
  saving.value = true;
  alert.message = '';
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}` };

  try {
    if (isEditing.value) {
      await axios.put(`http://localhost:8000/api/categories/${editingId.value}`, form, { headers });
      alert.message = 'Categoría actualizada con éxito.';
    } else {
      await axios.post('http://localhost:8000/api/categories', form, { headers });
      alert.message = 'Categoría creada con éxito.';
    }
    alert.type = 'success';
    showModal.value = false;
    await fetchCategories();
  } catch (error) {
    alert.type = 'error';
    alert.message = error.response?.data?.message || 'Ocurrió un error al guardar.';
  } finally {
    saving.value = false;
  }
};

const deleteCategory = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta categoría? Las subcategorías vinculadas también se eliminarán.')) return;

  const token = localStorage.getItem('auth_token');
  try {
    await axios.delete(`http://localhost:8000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert.type = 'success';
    alert.message = 'Categoría eliminada con éxito.';
    await fetchCategories();
  } catch (error) {
    alert.type = 'error';
    alert.message = 'Error al eliminar la categoría.';
  }
};

onMounted(fetchCategories);
</script>