import axios from 'axios';

const BASE_URL = 'https://findout-adf55aa841e8.herokuapp.com/api';

// Configuración global
const CONFIG = {
  MAX_CONCURRENT_REQUESTS: 1, // Reducido a 1 conexión simultánea
  REQUEST_TIMEOUT: 5000,      // Reducido a 5 segundos
  RETRY_DELAY: 2000,         // 2 segundos entre reintentos
  MAX_RETRIES: 1,           // Reducido a 1 reintento
  CACHE_DURATION: 60 * 60 * 1000 // 1 hora de caché
};

// Cola de peticiones para limitar conexiones concurrentes
class RequestQueue {
  constructor() {
    this.queue = [];
    this.running = 0;
    this.pendingRequests = new Map();
  }

  async add(key, request) {
    // Si ya hay una petición pendiente con la misma clave, devolver esa promesa
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const promise = new Promise((resolve, reject) => {
      this.queue.push({ key, request, resolve, reject });
      this.processQueue();
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  async processQueue() {
    if (this.running >= CONFIG.MAX_CONCURRENT_REQUESTS || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { key, request, resolve, reject } = this.queue.shift();

    try {
      const response = await request();
      resolve(response);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.pendingRequests.delete(key);
      this.processQueue();
    }
  }
}

const requestQueue = new RequestQueue();

// Configuración de Axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: CONFIG.REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('La petición ha expirado. Por favor, intente más tarde.');
    }

    if (!error.response) {
      throw new Error('Error de conexión. Por favor, verifique su conexión a internet.');
    }

    const { status, data } = error.response;

    if (status === 500 && data.error?.includes('too many connections')) {
      throw new Error('El servidor está ocupado. Por favor, espere un momento.');
    }

    throw error;
  }
);

// Función para generar una clave única para cada petición
const generateCacheKey = (method, url, params) => {
  return `${method}:${url}:${JSON.stringify(params || {})}`;
};

// Función auxiliar para hacer peticiones con reintentos
const makeRequest = async (method, url, params = null) => {
  const cacheKey = generateCacheKey(method, url, params);
  
  const request = async () => {
    const config = {
      method,
      url,
      ...(params && { params })
    };

    try {
      return await axiosInstance(config);
    } catch (error) {
      if (error.response?.status === 500) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
        return axiosInstance(config);
      }
      throw error;
    }
  };

  return requestQueue.add(cacheKey, request);
};

export const apiService = {
  // Empresas
  async getCompanies() {
    return makeRequest('get', '/companies/');
  },

  async getCompanyById(id) {
    return makeRequest('get', `/companies/${id}/`);
  },

  // Productos
  async getProducts() {
    return makeRequest('get', '/products/');
  },

  async getProductsByCompany(companyId) {
    return makeRequest('get', `/companies/${companyId}/products/`);
  },

  // Categorías
  async getCategories() {
    return makeRequest('get', '/categories/');
  }
};

export default apiService;
