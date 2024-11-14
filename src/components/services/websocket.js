// services/websocket.js
class WebSocketService {
    constructor() {
      this.callbacks = {};
      this.socket = null;
      this.isConnected = false;
    }
  
    connect(token) {
      return new Promise((resolve, reject) => {
        this.socket = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws/delivery/events/`);
        
        this.socket.onopen = () => {
          this.isConnected = true;
          this.socket.send(JSON.stringify({ type: 'authentication', token }));
          resolve();
        };
  
        this.socket.onerror = (error) => {
          reject(error);
        };
  
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (this.callbacks[data.type]) {
            this.callbacks[data.type].forEach(callback => callback(data));
          }
        };
  
        this.socket.onclose = () => {
          this.isConnected = false;
          // Intentar reconectar después de 5 segundos
          setTimeout(() => {
            if (!this.isConnected) {
              this.connect(token);
            }
          }, 5000);
        };
      });
    }
  
    on(event, callback) {
      if (!this.callbacks[event]) {
        this.callbacks[event] = [];
      }
      this.callbacks[event].push(callback);
    }
  
    off(event, callback) {
      if (this.callbacks[event]) {
        this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
      }
    }
  
    emit(event, data) {
      if (this.isConnected) {
        this.socket.send(JSON.stringify({ type: event, ...data }));
      }
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  
  export const websocketService = new WebSocketService();
  
  // Ejemplo de uso en un componente
  const useWebSocket = (eventHandlers) => {
    useEffect(() => {
      const token = localStorage.getItem('auth_token');
      
      websocketService.connect(token)
        .then(() => {
          // Registrar los manejadores de eventos
          Object.entries(eventHandlers).forEach(([event, handler]) => {
            websocketService.on(event, handler);
          });
        })
        .catch(error => {
          console.error('Error connecting to WebSocket:', error);
        });
  
      return () => {
        // Limpiar los manejadores de eventos al desmontar
        Object.entries(eventHandlers).forEach(([event, handler]) => {
          websocketService.off(event, handler);
        });
        websocketService.disconnect();
      };
    }, []);
  };
  
  export default useWebSocket;