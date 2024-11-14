import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { io } from 'socket.io-client';
import { Store, Home, Truck } from 'lucide-react';

// Cargar el script de Google Maps
const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = (error) => reject(error);
    document.head.appendChild(script);
  });
};

const DeliveryTracker = ({ orderId, initialOrder, googleMapsApiKey }) => {
  const [order, setOrder] = useState(initialOrder);
  const [driverLocation, setDriverLocation] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const socketRef = useRef(null);
  const googleMapsRef = useRef(null);

  // Cargar Google Maps
  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        setIsLoading(true);
        const google = await loadGoogleMapsScript(googleMapsApiKey);
        googleMapsRef.current = google;
        setIsLoading(false);
      } catch (err) {
        setError('Error loading Google Maps');
        setIsLoading(false);
      }
    };

    initGoogleMaps();
  }, [googleMapsApiKey]);

  useEffect(() => {
    socketRef.current = io(`${process.env.REACT_APP_WEBSOCKET_URL}`);
    
    socketRef.current.emit('join', { orderId });

    socketRef.current.on('driver_location', (data) => {
      setDriverLocation({
        lat: data.latitude,
        lng: data.longitude
      });
    });

    socketRef.current.on('status_update', (data) => {
      setOrder(prevOrder => ({
        ...prevOrder,
        status: data.message.status
      }));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [orderId]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!driverLocation || !googleMapsRef.current || isLoading) return;

      const directionsService = new googleMapsRef.current.maps.DirectionsService();
      
      try {
        const result = await directionsService.route({
          origin: new googleMapsRef.current.maps.LatLng(
            driverLocation.lat,
            driverLocation.lng
          ),
          destination: new googleMapsRef.current.maps.LatLng(
            order.delivery_latitude,
            order.delivery_longitude
          ),
          waypoints: [{
            location: new googleMapsRef.current.maps.LatLng(
              order.pickup_latitude,
              order.pickup_longitude
            ),
            stopover: true
          }],
          travelMode: googleMapsRef.current.maps.TravelMode.DRIVING,
        });

        const points = result.routes[0].overview_path.map(point => ({
          lat: point.lat(),
          lng: point.lng()
        }));
        
        setRoutePoints(points);
      } catch (error) {
        console.error('Error fetching route:', error);
        setError('Error calculating route');
      }
    };

    fetchRoute();
  }, [driverLocation, order, isLoading]);

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'text-yellow-500',
      'pickup': 'text-blue-500',
      'in_transit': 'text-purple-500',
      'delivered': 'text-green-500',
      'cancelled': 'text-red-500'
    };
    return statusColors[status.toLowerCase()] || 'text-gray-500';
  };

  const getStatusMessage = (status) => {
    const statusMessages = {
      'pending': 'Conductor asignado, dirigiéndose al restaurante',
      'pickup': 'Conductor en el restaurante',
      'in_transit': 'Pedido recogido, en camino',
      'delivered': 'Pedido entregado',
      'cancelled': 'Pedido cancelado'
    };
    return statusMessages[status.toLowerCase()] || status;
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <p>Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <div className="p-4 bg-white shadow-lg mb-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">
          Estado del Pedido: <span className={getStatusColor(order.status)}>{getStatusMessage(order.status)}</span>
        </h2>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <Store className="w-6 h-6 text-blue-500 mr-2" />
            <span>Restaurante</span>
          </div>
          <div className="flex items-center">
            <Truck className="w-6 h-6 text-green-500 mr-2" />
            <span>Conductor</span>
          </div>
          <div className="flex items-center">
            <Home className="w-6 h-6 text-red-500 mr-2" />
            <span>Punto de entrega</span>
          </div>
        </div>
      </div>

      <MapContainer
        ref={mapRef}
        center={[order.pickup_latitude, order.pickup_longitude]}
        zoom={13}
        className="w-full h-[calc(100vh-100px)]"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Marcador del Restaurante */}
        <Marker position={[order.pickup_latitude, order.pickup_longitude]}>
          <Popup>
            <div className="font-semibold">Ubicación del Restaurante</div>
            <div className="text-sm">Punto de recogida</div>
          </Popup>
        </Marker>

        {/* Marcador de Entrega */}
        <Marker position={[order.delivery_latitude, order.delivery_longitude]}>
          <Popup>
            <div className="font-semibold">Punto de Entrega</div>
            <div className="text-sm">Destino final</div>
          </Popup>
        </Marker>

        {/* Marcador del Conductor */}
        {driverLocation && (
          <Marker position={[driverLocation.lat, driverLocation.lng]}>
            <Popup>
              <div className="font-semibold">Ubicación del Conductor</div>
              <div className="text-sm">{getStatusMessage(order.status)}</div>
            </Popup>
          </Marker>
        )}

        {/* Línea de Ruta */}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints.map(point => [point.lat, point.lng])}
            color="blue"
            weight={3}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default DeliveryTracker;