<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-black text-gray-800">Configuración del Sistema</h2>
        <p class="text-sm text-gray-500">Administra los parámetros generales y de cobro de tu tienda.</p>
      </div>
      <button 
        @click="saveSettings" 
        :disabled="loading"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all"
      >
        {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </div>

    <!-- Alerta Feedback -->
    <div v-if="feedback.message" :class="feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'" class="p-4 rounded-xl border text-sm font-medium">
      {{ feedback.message }}
    </div>

    <!-- Tabs / Pestañas de navegación -->
    <div class="flex gap-2 border-b border-gray-200">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2.5 text-sm font-bold border-b-2 transition-colors"
        :class="activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-700'"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Panel 1: General -->
    <div v-show="activeTab === 'general'" class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Nombre de la Tienda</label>
          <input v-model="form.store_name" type="text" class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Correo de Contacto</label>
          <input v-model="form.contact_email" type="email" class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">WhatsApp / Teléfono</label>
          <input v-model="form.contact_phone" type="text" class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+58 412 0000000">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Dirección Física</label>
          <input v-model="form.store_address" type="text" class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
        </div>
      </div>
    </div>

<!-- Panel 2: Finanzas & Moneda -->
<div v-show="activeTab === 'finance'" class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
  <div class="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 gap-4">
    <div>
      <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wide">Tasas Oficiales (BCV)</h3>
      <p class="text-xs text-gray-400">
        Última sincronización: {{ form.exchange_rate_last_update || 'No registrada' }}
      </p>
    </div>
    
    <button 
      type="button"
      @click="syncRatesNow" 
      :disabled="syncing"
      class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-2 px-4 rounded-xl text-xs shadow transition-all"
    >
      <svg :class="syncing ? 'animate-spin' : ''" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
      {{ syncing ? 'Consultando...' : 'Sincronizar Tasas BCV' }}
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Dólar BCV (USD / VES)</label>
      <div class="relative">
        <span class="absolute left-3 top-3 text-xs font-bold text-gray-400">Bs.</span>
        <input v-model="form.bcv_usd_rate" type="number" step="0.0001" class="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800">
      </div>
    </div>

    <div>
      <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Euro BCV (EUR / VES)</label>
      <div class="relative">
        <span class="absolute left-3 top-3 text-xs font-bold text-gray-400">Bs.</span>
        <input v-model="form.bcv_eur_rate" type="number" step="0.0001" class="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800">
      </div>
    </div>
  </div>
</div>

<!-- Panel 3: Pago Móvil -->
<div v-show="activeTab === 'payments'" class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Banco</label>
      <input v-model="form.pago_movil_bank" type="text" class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej: Banesco (0134)">
    </div>
    <div>
      <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Cédula / RIF</label>
      <input v-model="form.pago_movil_id" type="text" class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="V-12345678">
    </div>
    <div>
      <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Teléfono Afiliado</label>
      <input v-model="form.pago_movil_phone" type="text" class="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="04141234567">
    </div>
  </div>

  <!-- SECCIÓN CÓDIGO QR INTERBANCARIO (S7B) -->
  <div class="border-t border-gray-100 pt-6">
    <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Código QR de Cobro (Estándar Suiche 7B)</label>
    <p class="text-xs text-gray-400 mb-4">Sube la imagen del código QR generado por tu banco para mostrarlo directamente al cliente en el checkout.</p>

    <div class="flex flex-col sm:flex-row items-center gap-6">
      <!-- Preview de la imagen actual o nueva -->
      <div class="w-40 h-40 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 overflow-hidden relative">
        <img 
          v-if="qrPreviewUrl || form.pago_movil_qr_url" 
          :src="qrPreviewUrl || (`${import.meta.env.VITE_API_URL}` + form.pago_movil_qr_url)" 
          alt="QR Pago Móvil" 
          class="w-full h-full object-contain p-2"
        />
        <span v-else class="text-xs text-gray-400 text-center px-2">Sin código QR cargado</span>
      </div>

      <!-- Input de archivo -->
      <div class="space-y-2">
        <input 
          type="file" 
          accept="image/*" 
          @change="handleQrUpload"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        <span class="text-[11px] text-gray-400 block">Formatos recomendados: PNG o JPG. Tamaño máx: 2MB.</span>
      </div>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

const activeTab = ref('general');
const tabs = [
  { id: 'general', name: 'General' },
  { id: 'finance', name: 'Moneda & Tasas' },
  { id: 'payments', name: 'Pago Móvil / Cobros' }
];

const form = reactive({
  store_name: '',
  contact_email: '',
  contact_phone: '',
  store_address: '',
  currency_symbol: '$',
  currency_code: 'USD',
  bcv_exchange_rate: '',
  pago_movil_bank: '',
  pago_movil_id: '',
  pago_movil_phone: ''
});

const loading = ref(false);
const syncing = ref(false);
const feedback = reactive({ message: '', type: 'success' });
const qrFile = ref(null);
const qrPreviewUrl = ref(null);

const handleQrUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    qrFile.value = file;
    qrPreviewUrl.value = URL.createObjectURL(file); // Vista previa instantánea
  }
};

const fetchSettings = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
    if (res.data) {
      Object.assign(form, res.data);
    }
  } catch (error) {
    console.error('Error al cargar configuración:', error);
  }
};

const saveSettings = async () => {
  loading.value = true;
  feedback.message = '';
  try {
    const token = localStorage.getItem('auth_token');
    
    // Usamos FormData para enviar tanto los textos como la imagen del QR
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

    if (qrFile.value) {
      formData.append('pago_movil_qr', qrFile.value);
    }

    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/settings`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    feedback.type = 'success';
    feedback.message = 'Configuración y código QR guardados exitosamente.';
    
    if (res.data.settings) {
      Object.assign(form, res.data.settings);
      qrFile.value = null;
    }
  } catch (error) {
    feedback.type = 'error';
    feedback.message = 'Error al guardar: ' + (error.response?.data?.message || 'Error del servidor');
  } finally {
    loading.value = false;
  }
};
const syncRatesNow = async () => {
  syncing.value = true;
  feedback.message = '';
  try {
    const token = localStorage.getItem('auth_token');
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/settings/sync-rates`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    form.bcv_usd_rate = res.data.rates.bcv_usd;
    form.bcv_eur_rate = res.data.rates.bcv_eur;
    form.exchange_rate_last_update = res.data.rates.updated_at;

    feedback.type = 'success';
    feedback.message = res.data.message;
  } catch (error) {
    feedback.type = 'error';
    feedback.message = 'Error sincronizando: ' + (error.response?.data?.message || 'Error de conexión');
  } finally {
    syncing.value = false;
  }
};

onMounted(fetchSettings);
</script>