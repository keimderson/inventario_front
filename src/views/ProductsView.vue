<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-gray-800">Inventario de Productos</h2>
        <p class="text-gray-500 text-sm">Gestiona el catálogo, variantes y stock de tu Marketplace.</p>
      </div>
      <button @click="openModal" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Nuevo Producto
      </button>
    </div>

    <!-- Barra de Búsqueda -->
    <div class="relative max-w-md">
      <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </span>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Buscar por nombre o marca..." 
        class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white shadow-sm" 
      />
    </div>

    <!-- Tabla de Productos -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-400 text-sm">Cargando inventario...</div>
      
      <table v-else class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Producto</th>
            <th class="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Categoría / Marca</th>
            <th class="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Precio Base</th>
            <th class="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock / Variantes</th>
            <th class="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50/50 transition-colors">
            <!-- Producto e Imagen -->
            <td class="py-4 px-6 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  v-if="product.images?.length" 
                  :src="'http://localhost:8000' + product.images[0].url" 
                  class="w-full h-full object-cover"
                />
                <svg v-else class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p class="font-bold text-gray-800 text-sm">{{ product.name }}</p>
                <p class="text-xs text-gray-400 font-mono mt-0.5">{{ product.sku || 'Sin SKU' }}</p>
              </div>
            </td>

            <!-- Categoría y Marca -->
            <td class="py-4 px-6">
              <div class="flex flex-col gap-1 items-start">
                <span class="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-semibold">
                  {{ product.category?.name || 'Sin categoría' }}
                </span>
                <span v-if="product.brand" class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                  {{ product.brand.name }}
                </span>
              </div>
            </td>

            <!-- Precio -->
            <td class="py-4 px-6 font-bold text-emerald-600 text-sm">
              {{ settings.currency_symbol || '$' }}{{ product.price }}
            </td>

            <!-- Stock y Variantes -->
            <td class="py-4 px-6">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-800">{{ product.stock }}</span>
                <span class="text-xs text-gray-500">unds.</span>
              </div>
              <p v-if="product.variants && product.variants.length > 0" class="text-[10px] text-blue-500 font-bold uppercase mt-1">
                {{ product.variants.length }} Variantes
              </p>
            </td>

            <!-- Acciones -->
<td class="py-4 px-6 text-right space-x-2">
  <button @click="openViewModal(product)" class="text-emerald-600 hover:text-emerald-800 font-bold text-xs py-1.5 px-3 rounded-lg hover:bg-emerald-50 transition-colors">
                Ver
              </button>
              <button @click="openEditModal(product)" class="text-blue-600 hover:text-blue-800 font-bold text-xs py-1.5 px-3 rounded-lg hover:bg-blue-50 transition-colors">
                Editar
              </button>
              <button @click="deleteProduct(product.id)" class="text-red-500 hover:text-red-700 font-bold text-xs py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors">
                Eliminar
              </button>
            </td>

          </tr>
          <tr v-if="filteredProducts.length === 0 && !loading">
            <td colspan="5" class="py-8 text-center text-gray-400 text-sm">
              No se encontraron productos con tu búsqueda.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL DE CREACIÓN -->
     
    <div v-if="showModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
        <div class="sticky top-0 bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center z-10">
          <h3 class="text-xl font-bold text-gray-800">
            {{ isViewing ? 'Detalles del Producto' : (isEditing ? 'Editar Producto' : 'Agregar Producto') }}
          </h3>
          <button @click="resetForm" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form @submit.prevent="saveProduct" class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Columna Izquierda: Datos Base -->
          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Nombre del Producto</label>
              <input v-model="newProduct.name" type="text" required class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Ej: Soft Pinch Liquid Blush">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Marca</label>
                <select v-model="newProduct.brand_id" class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                  <option value="">Ninguna</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">SKU Base (Opcional)</label>
                <input v-model="newProduct.sku" type="text" class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="PROD-001">
              </div>
            </div>

<div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
  <!-- 1. Precio de Costo -->
  <div>
    <label class="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Costo</label>
    <div class="relative">
      <span class="absolute left-3 top-3 text-sm font-bold text-gray-400">{{ settings.currency_symbol || '$' }}</span>
      <input v-model="newProduct.cost_price" type="number" step="0.01" min="0" class="w-full border border-gray-200 p-3 pl-8 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-gray-500">
    </div>
  </div>

  <!-- 2. Precio Regular -->
  <div>
    <label class="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Precio</label>
    <div class="relative">
      <span class="absolute left-3 top-3 text-sm font-bold text-gray-400">{{ settings.currency_symbol || '$' }}</span>
      <input v-model="newProduct.price" @input="recalculateDiscount" type="number" step="0.01" min="0" required class="w-full border border-gray-200 p-3 pl-8 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-gray-800">
    </div>
  </div>

  <!-- 3. Porcentaje de Descuento (Solo Visual) -->
  <div>
    <label class="block text-[10px] font-bold text-blue-500 mb-1 uppercase tracking-wider">Descuento %</label>
    <div class="relative">
      <input v-model="discountPercent" @input="applyPercentage" type="number" step="1" min="0" max="100" class="w-full border border-blue-200 bg-blue-50/30 p-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-blue-600 text-right">
      <span class="absolute right-3 top-3 text-sm font-bold text-blue-400">%</span>
    </div>
  </div>

  <!-- 4. Precio Oferta (El que se guarda) -->
  <div>
    <label class="block text-[10px] font-bold text-emerald-500 mb-1 uppercase tracking-wider">Precio Final</label>
    <div class="relative">
      <span class="absolute left-3 top-3 text-sm font-bold text-emerald-500">{{ settings.currency_symbol || '$' }}</span>
      <input v-model="newProduct.sale_price" @input="recalculateDiscount" type="number" step="0.01" min="0" class="w-full border border-emerald-200 bg-emerald-50/30 p-3 pl-8 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-emerald-700">
    </div>
  </div>
</div>

<!-- Stock Total Movido a su propia fila -->
<div class="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
  <div>
    <label class="block text-xs font-bold text-gray-700 uppercase">Stock Total en Inventario</label>
    <span class="text-[10px] text-gray-500">Suma automática de las variantes.</span>
  </div>
  <input :value="computedTotalStock" type="number" disabled class="w-24 text-center bg-white font-black text-blue-600 border border-gray-200 p-2 rounded-lg cursor-not-allowed">
</div>

            <!-- CASCADA DE CATEGORÍAS -->
            <div>
              <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Categoría y Subcategorías</label>
              <div v-for="(level, index) in (selectedChain.length + 1)" :key="index">
                <select 
                  v-if="getOptions(index).length > 0" 
                  v-model="selectedChain[index]" 
                  @change="handleCategoryChange(index)" 
                  class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white mb-2"
                >
                  <option :value="undefined">-- Seleccionar nivel {{ index + 1 }} --</option>
                  <option v-for="cat in getOptions(index)" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
            </div>

<div>
              <label class="block text-xs font-bold text-gray-500 mb-2 uppercase">Imágenes del Producto</label>
              
              <!-- Input para subir nuevas fotos (Se oculta si solo estamos "Viendo") -->
              <input 
                v-if="!isViewing" 
                type="file" 
                multiple 
                @change="handleFileUpload" 
                accept="image/*" 
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mb-3"
              >
              <p v-if="!isViewing && existingImages.length > 0" class="text-[10px] text-gray-400 mb-2">
                * Si subes nuevas imágenes, se agregarán a la galería actual.
              </p>

              <!-- Galería de fotos actuales -->
              <div v-if="existingImages.length > 0" class="flex gap-3 overflow-x-auto p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div v-for="img in existingImages" :key="img.id" class="shrink-0 relative">
                  <img :src="'`${import.meta.env.VITE_API_URL}' + img.url" class="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm bg-white" />
                </div>
              </div>
              <div v-else-if="isViewing" class="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <span class="text-xs text-gray-400 italic">No hay imágenes cargadas para este producto.</span>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Variantes -->
          <div class="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <div v-if="!isViewing" class="flex justify-between items-center mb-2">
              <label class="block text-sm font-bold text-gray-800">Variantes / Combinaciones</label>
              <button type="button" @click="addVariant" class="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                + Añadir Variante
              </button>
            </div>
            
            <p class="text-xs text-gray-400 mb-4 leading-relaxed">
              Define las características (Ej: Calibre = 12). Puedes agregar varias a una misma variante.
            </p>

            <div v-for="(v, vIndex) in productVariants" :key="vIndex" class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 relative group">
              <!-- Botón Eliminar Variante -->
              <button v-if="!isViewing" @click="removeVariant(vIndex)" type="button" class="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
              
              <div v-if="!isViewing" class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Variante #{{ vIndex + 1 }}</span>
                <button type="button" @click="addAttributeToVariant(vIndex)" class="text-blue-500 text-[10px] font-bold hover:underline">
                  + Agregar Característica
                </button>
              </div>

              <!-- Iterador Dinámico de Clave / Valor -->
              <div class="space-y-2">
                <div v-for="(attr, aIndex) in v.attrs" :key="aIndex" class="flex items-center gap-2">
                  <input v-model="attr.key" placeholder="Ej: Calibre, Talla..." class="w-1/2 p-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-blue-500 bg-gray-50">
                  <input v-model="attr.value" placeholder="Ej: 12, S, Azul..." class="w-1/2 p-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-blue-500 bg-gray-50">
                  
                  <button type="button" v-if="v.attrs.length > 1" @click="removeAttributeFromVariant(vIndex, aIndex)" class="text-gray-300 hover:text-red-500 px-1">
                    &times;
                  </button>
                </div>
              </div>

              <!-- Stock de la variante -->
              <div class="flex items-center gap-3 pt-3 border-t border-gray-50">
                <span class="text-xs font-bold text-gray-500 w-12">Stock:</span>
                <input v-model.number="v.stock" type="number" min="0" class="w-full p-2 rounded-lg border border-gray-200 text-xs font-bold outline-none focus:border-blue-500">
              </div>
            </div>

            <p v-if="productVariants.length === 0" class="text-gray-400 text-sm italic text-center py-8">
              Sin variantes. Se guardará con el stock general.
            </p>
          </div>

          <!-- Footer Modal -->
          <div class="col-span-1 md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button @click="resetForm" type="button" class="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
              Cancelar
            </button>
            <button v-if="!isViewing" type="submit" :disabled="saving" class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold px-8 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all">
              {{ saving ? 'Guardando...' : 'Guardar Producto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import axios from 'axios';

const showModal = ref(false);
const loading = ref(true);
const saving = ref(false);

const discountPercent = ref('');

const isViewing = ref(false);
const existingImages = ref([]);

const products = ref([]);
const categories = ref([]);
const brands = ref([]); // <-- Nuevo estado para marcas
const settings = ref({});
const searchQuery = ref('');
const isEditing = ref(false);
const editingId = ref(null);

const selectedChain = ref([]);
const productVariants = ref([
  { stock: 0, attrs: [{ key: '', value: '' }] }
]);


const addAttributeToVariant = (variantIndex) => {
  productVariants.value[variantIndex].attrs.push({ key: '', value: '' });
};

const removeAttributeFromVariant = (variantIndex, attrIndex) => {
  productVariants.value[variantIndex].attrs.splice(attrIndex, 1);
};

const newProduct = reactive({ 
  name: '', 
  price: '', 
  cost_price: '', // Nuevo
  sale_price: '', // Nuevo
  sku: '', 
  category_id: '', 
  brand_id: '' // <-- Nuevo campo para marca
});

const selectedFiles = ref([]);

// NUEVA FUNCIÓN: Abrir modal en modo Solo Lectura
const openViewModal = (product) => {
  openEditModal(product); // Reutilizamos la lógica de carga de datos
  isViewing.value = true; // Pero activamos la bandera de solo lectura
  isEditing.value = false;
  existingImages.value = product.images || []; // Cargamos las fotos actuales
};

// --- FUNCIÓN PARA ELIMINAR (Soft Delete) ---
const deleteProduct = async (id) => {
  if (!confirm('¿Estás seguro de enviar este producto a la papelera?')) return;
  
  try {
    const token = localStorage.getItem('auth_token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await fetchData(); // Recargar la tabla
  } catch (error) {
    alert('Error al eliminar el producto');
  }
};

// --- FUNCIÓN PARA RECONSTRUIR EL ÁRBOL DE CATEGORÍAS ---
// Necesaria para que los selectores en cascada se llenen solos al editar
const findCategoryPath = (categoriesList, targetId, path = []) => {
  for (let cat of categoriesList) {
    if (cat.id === targetId) return [...path, cat.id];
    if (cat.children_recursive && cat.children_recursive.length > 0) {
      const found = findCategoryPath(cat.children_recursive, targetId, [...path, cat.id]);
      if (found) return found;
    }
  }
  return null;
};

const openEditModal = (product) => {
  isEditing.value = true;
  editingId.value = product.id;
  existingImages.value = product.images || [];
  // Llenar datos base
  newProduct.name = product.name;
  newProduct.price = product.price;
  newProduct.cost_price = product.cost_price || '';
  newProduct.sale_price = product.sale_price || '';
  newProduct.sku = product.sku || '';
  newProduct.brand_id = product.brand_id || '';
  newProduct.category_id = product.category_id;

  recalculateDiscount(); // Calcular porcentaje visual

  // Reconstruir la ruta de la categoría en cascada
  const path = findCategoryPath(categories.value, product.category_id);
  selectedChain.value = path || [];

  // Reconstruir variantes desde el JSON
  if (product.variants && product.variants.length > 0) {
    productVariants.value = product.variants.map(v => {
      const attrs = [];
      if (v.attributes) {
        for (const [key, value] of Object.entries(v.attributes)) {
          attrs.push({ key, value });
        }
      }
      // Si no hay atributos, dejar uno vacío para la UI
      if (attrs.length === 0) attrs.push({ key: '', value: '' });
      
      return { stock: v.stock, attrs };
    });
  } else {
    productVariants.value = [{ stock: product.stock, attrs: [{ key: '', value: '' }] }];
  }

  showModal.value = true;
};

// Stock total calculado en tiempo real sumando las variantes
const computedTotalStock = computed(() => {
  if (productVariants.value.length === 0) return 0;
  return productVariants.value.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
});

// Funciones para calcular automáticamente
const applyPercentage = () => {
  const price = parseFloat(newProduct.price);
  const percent = parseFloat(discountPercent.value);
  
  if (price > 0 && percent >= 0) {
    const finalPrice = price - (price * (percent / 100));
    newProduct.sale_price = finalPrice.toFixed(2);
  } else {
    newProduct.sale_price = '';
  }
};

const recalculateDiscount = () => {
  const price = parseFloat(newProduct.price);
  const sale = parseFloat(newProduct.sale_price);
  
  if (price > 0 && sale >= 0 && sale < price) {
    const percent = 100 - ((sale * 100) / price);
    discountPercent.value = Math.round(percent);
  } else {
    discountPercent.value = '';
  }
};

// Filtro de búsqueda por nombre o marca
const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return products.value.filter(product => {
    const matchName = product.name?.toLowerCase().includes(query);
    const matchBrand = product.brand?.name?.toLowerCase().includes(query);
    return matchName || matchBrand;
  });
});

const addVariant = () => {
  productVariants.value.push({ stock: 0, attrs: [{ key: '', value: '' }] });
};

const removeVariant = (index) => {
  productVariants.value.splice(index, 1);
};

const handleFileUpload = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

const getOptions = (level) => {
  if (level === 0) return categories.value;
  let currentLevelData = categories.value;
  for (let i = 0; i < level; i++) {
    const parent = currentLevelData.find(c => c.id === selectedChain.value[i]);
    if (parent && parent.children_recursive) {
      currentLevelData = parent.children_recursive;
    } else { return []; }
  }
  return currentLevelData;
};

const handleCategoryChange = (level) => {
  selectedChain.value = selectedChain.value.slice(0, level + 1);
  newProduct.category_id = selectedChain.value[selectedChain.value.length - 1];
};

const openModal = () => {
  resetForm();
  showModal.value = true;
};

const resetForm = () => {

  isEditing.value = false;
  editingId.value = null;
  isViewing.value = false;
  existingImages.value = [];
  newProduct.name = '';
  newProduct.price = '';
  newProduct.cost_price = '';
  newProduct.sale_price = '';
  newProduct.sku = '';
  newProduct.category_id = '';
  newProduct.brand_id = '';
  selectedFiles.value = [];
  selectedChain.value = [];
  // Resetear la variante base
  productVariants.value = [{ stock: 0, attrs: [{ key: '', value: '' }] }];
  showModal.value = false;
  discountPercent.value = '';
}
const fetchData = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    
    // Ejecutar todas las peticiones al mismo tiempo para mayor rapidez
    const [prodRes, catRes, setRes, brandRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { headers }),
      axios.get(`${import.meta.env.VITE_API_URL}/api/categories`, { headers }),
      axios.get(`${import.meta.env.VITE_API_URL}/api/settings`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/brands`, { headers }) // <-- Llamada a marcas
    ]);
    
    products.value = prodRes.data;
    categories.value = catRes.data;
    settings.value = setRes.data;
    brands.value = brandRes.data;
  } catch (error) {
    console.error("Error cargando datos:", error);
  } finally {
    loading.value = false;
  }
};

const saveProduct = async () => {
  saving.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();

    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    if (newProduct.sku) formData.append('sku', newProduct.sku);
    if (newProduct.brand_id) formData.append('brand_id', newProduct.brand_id);
    if (newProduct.category_id) formData.append('category_id', newProduct.category_id);
    if (newProduct.cost_price) formData.append('cost_price', newProduct.cost_price);
  if (newProduct.sale_price) formData.append('sale_price', newProduct.sale_price);
    formData.append('stock', computedTotalStock.value);

    // Armando el JSON dinámico de variantes
    const formattedVariants = productVariants.value.map(v => {
      const dynamicAttributes = {};
      
      // Recorremos los atributos agregados por el usuario
      v.attrs.forEach(attr => {
        if (attr.key.trim() && attr.value.trim()) {
          dynamicAttributes[attr.key.trim()] = attr.value.trim();
        }
      });

      return {
        stock: v.stock,
        attributes: dynamicAttributes
      };
    });
    
    formData.append('variants', JSON.stringify(formattedVariants));

    // Adjuntar imágenes
    selectedFiles.value.forEach(file => {
      formData.append('images[]', file);
    });

if (isEditing.value) {
      formData.append('_method', 'PUT');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/products/${editingId.value}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
    }

    resetForm();
    await fetchData(); 
  } catch (error) {
    alert("Error al guardar: " + (error.response?.data?.message || 'Error desconocido'));
  } finally {
    saving.value = false;
  }
};
onMounted(fetchData);
</script>