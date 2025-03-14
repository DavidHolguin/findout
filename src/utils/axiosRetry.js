import axios from 'axios';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const axiosWithRetry = async (url, options = {}, maxRetries = 3, initialDelay = 1000) => {
  let lastError;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await axios.get(url, options);
      return response;
    } catch (error) {
      lastError = error;
      
      // Si el error no es 500 o ya hemos intentado el máximo de veces, lanzar el error
      if (error.response?.status !== 500 || retryCount === maxRetries - 1) {
        throw error;
      }

      // Esperar antes de reintentar (con backoff exponencial)
      const waitTime = initialDelay * Math.pow(2, retryCount);
      await delay(waitTime);
      retryCount++;
    }
  }

  throw lastError;
};
