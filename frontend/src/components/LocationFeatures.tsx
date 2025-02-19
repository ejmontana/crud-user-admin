import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Car, Train, User } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

const STORE_LOCATION = {
  lat: 10.4951,  
  lng: -66.8286,
  address: "Universidad Alejandro de Humboldt"  
};

const LocationFeatures: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState('DRIVING');
  const [directions, setDirections] = useState<string[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [googleApi, setGoogleApi] = useState<typeof google | null>(null);

  const transportModes = [
    { id: 'DRIVING', name: 'Auto', icon: <Car className="h-5 w-5" /> },
    { id: 'WALKING', name: 'Caminando', icon: <User className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const loader = new Loader({
          apiKey: 'AIzaSyBjyRI-OmIC4YrfhbnQMZ1Ane54mFKg4WU', 
          version: "weekly",
          libraries: ["places"]
        });

        const google = await loader.load();
        setGoogleApi(google);
        const mapElement = document.getElementById("map");
        
        if (mapElement) {
          const newMap = new google.maps.Map(mapElement, {
            center: STORE_LOCATION,
            zoom: 15,
            styles: [
              {
                "elementType": "geometry",
                "stylers": [{"color": "#1a1f2b"}]
              },
              {
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#746855"}]
              },
              {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#d59563"}]
              },
              {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#2a303c"}]
              },
              {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#212a37"}]
              }
            ]
          });

          const newDirectionsRenderer = new google.maps.DirectionsRenderer({
            map: newMap,
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: "#ff4757"
            }
          });

          setMap(newMap);
          setDirectionsRenderer(newDirectionsRenderer);

          // Marcador de la tienda
          new google.maps.Marker({
            position: STORE_LOCATION,
            map: newMap,
            title: "Nuestra Tienda",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#ff4757",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
            }
          });
        }
      } catch (err) {
        setError("Error al cargar el mapa. Por favor, intenta más tarde.");
      }
    };

    initializeMap();
  }, []);

  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBjyRI-OmIC4YrfhbnQMZ1Ane54mFKg4WU`
          );
          const data = await response.json();
          
          if (data.results[0]) {
            setUserLocation({
              lat: latitude,
              lng: longitude,
              address: data.results[0].formatted_address
            });
          }
        } catch (err) {
          setError("Error al obtener la dirección");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        switch(err.code) {
          case err.PERMISSION_DENIED:
            setError("Permiso de ubicación denegado");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Información de ubicación no disponible");
            break;
          case err.TIMEOUT:
            setError("Se agotó el tiempo para obtener la ubicación");
            break;
          default:
            setError("Error al obtener la ubicación");
        }
        setLoading(false);
      }
    );
  };

  const getDirections = async () => {
    if (!userLocation || !map || !directionsRenderer || !googleApi) return;

    const directionsService = new googleApi.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: { lat: userLocation.lat, lng: userLocation.lng },
        destination: STORE_LOCATION,
        travelMode: selectedMode as google.maps.TravelMode,
      });

      directionsRenderer.setDirections(result);
      
      const steps = result.routes[0].legs[0].steps.map(step => 
        step.instructions.replace(/<[^>]*>/g, '')
      );
      
      setDirections(steps);
    } catch (err) {
      setError("Error al obtener las indicaciones");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#2a303c] rounded-lg shadow-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mapa */}
          <div className="h-[400px] rounded-lg overflow-hidden">
            <div id="map" className="w-full h-full"></div>
          </div>

          {/* Controles y direcciones */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Tu Ubicación</h3>
              {loading ? (
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#ff4757]"></div>
                  <span>Obteniendo ubicación...</span>
                </div>
              ) : error ? (
                <div className="text-[#ff4757]">{error}</div>
              ) : userLocation ? (
                <div className="text-gray-300">
                  <MapPin className="inline-block h-5 w-5 mr-2 text-[#ff4757]" />
                  {userLocation.address}
                </div>
              ) : (
                <button
                  onClick={getUserLocation}
                  className="flex items-center space-x-2 bg-[#ff4757] text-white px-4 py-2 rounded-lg hover:bg-[#ff6b81] transition-colors"
                >
                  <Navigation className="h-5 w-5" />
                  <span>Obtener mi ubicación</span>
                </button>
              )}
            </div>

            {userLocation && (
              <>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Modo de Transporte</h3>
                  <div className="flex space-x-4">
                    {transportModes.map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setSelectedMode(mode.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          selectedMode === mode.id
                            ? 'bg-[#ff4757] text-white'
                            : 'bg-[#1a1f2b] text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {mode.icon}
                        <span>{mode.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={getDirections}
                  className="w-full bg-[#ff4757] text-white px-6 py-3 rounded-lg hover:bg-[#ff6b81] transition-colors"
                >
                  Obtener Indicaciones
                </button>

                {directions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Indicaciones</h3>
                    <div className="bg-[#1a1f2b] rounded-lg p-4 max-h-[200px] overflow-y-auto">
                      <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        {directions.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationFeatures;