import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, ListGroup, Tab, Tabs, Badge } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Meteorologia = () => {
  // Referencias y estados
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState({ lat: 39.9639, lng: -4.8308 }); // Talavera como posición inicial
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0); // Índice del día seleccionado en el pronóstico
  const [parcelaSeleccionada, setParcelaSeleccionada] = useState(false); // Estado para controlar si el usuario ya seleccionó una parcela

  // Inicializar el mapa al cargar el componente
  useEffect(() => {
    if (!mapRef.current) {
      // Crear el mapa si aún no existe
      const leafletMap = L.map(mapContainerRef.current).setView([position.lat, position.lng], 13);
      
      // Añadir capa de satélite
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19,
      }).addTo(leafletMap);
      
      // Añadir capa de nombres de lugares (híbrido)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
        opacity: 0.35
      }).addTo(leafletMap);
      
      // Añadir marcador inicial
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: rgba(0, 123, 255, 0.6); width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      markerRef.current = L.marker([position.lat, position.lng], {icon: customIcon}).addTo(leafletMap)
        .bindPopup('Tu parcela seleccionada')
        .openPopup();
      
      // Al hacer clic en el mapa, actualizar la posición
      leafletMap.on('click', (e) => {
        const newPosition = {
          lat: e.latlng.lat,
          lng: e.latlng.lng
        };
        setPosition(newPosition);
        markerRef.current.setLatLng(newPosition);
        markerRef.current.getPopup().setContent('Tu parcela seleccionada');
        fetchWeatherData(newPosition.lat, newPosition.lng);
        
        // Marcar que el usuario ha seleccionado una parcela
        setParcelaSeleccionada(true);
      });
      
      // Guardar referencia al mapa
      mapRef.current = leafletMap;
      setMap(leafletMap);
      
      // Obtener datos meteorológicos para la posición inicial
      fetchWeatherData(position.lat, position.lng);
    }
    
    // Limpiar mapa al desmontar componente
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Función para obtener datos meteorológicos actuales y pronóstico
  const fetchWeatherData = async (lat, lng) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Usamos OpenMeteo API que es gratuita y no requiere API key
      // https://open-meteo.com/
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=auto`;
      
      const response = await fetch(forecastUrl);
      if (!response.ok) {
        throw new Error(`Error al obtener datos meteorológicos: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Procesar datos actuales
      const currentWeather = {
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        winddirection: data.current_weather.winddirection,
        weathercode: data.current_weather.weathercode,
        time: new Date(data.current_weather.time)
      };
      
      setWeatherData(currentWeather);
      
      // Procesar pronóstico diario
      const dailyForecast = {
        time: data.daily.time,
        weathercode: data.daily.weathercode,
        temperature_max: data.daily.temperature_2m_max,
        temperature_min: data.daily.temperature_2m_min,
        precipitation: data.daily.precipitation_sum,
        precipitation_probability: data.daily.precipitation_probability_max,
        windspeed: data.daily.windspeed_10m_max,
        winddirection: data.daily.winddirection_10m_dominant
      };
      
      setForecastData(dailyForecast);
      
      // Mostrar información en el popup del marcador
      if (markerRef.current) {
        const weatherDescription = getWeatherDescription(currentWeather.weathercode);
        markerRef.current.getPopup().setContent(`
          <b>Parcela seleccionada</b><br>
          ${currentWeather.temperature}°C | ${weatherDescription}
        `);
      }
      
    } catch (err) {
      console.error('Error al obtener datos meteorológicos:', err);
      setError('No se pudieron obtener los datos meteorológicos. Por favor, intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener descripción del clima basado en el código meteorológico
  // Basado en los códigos WMO (World Meteorological Organization)
  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Despejado',
      1: 'Mayormente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla con escarcha',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna intensa',
      56: 'Llovizna helada ligera',
      57: 'Llovizna helada intensa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia intensa',
      66: 'Lluvia helada ligera',
      67: 'Lluvia helada intensa',
      71: 'Nevada ligera',
      73: 'Nevada moderada',
      75: 'Nevada intensa',
      77: 'Granos de nieve',
      80: 'Chubascos ligeros',
      81: 'Chubascos moderados',
      82: 'Chubascos violentos',
      85: 'Chubascos de nieve ligeros',
      86: 'Chubascos de nieve intensos',
      95: 'Tormenta',
      96: 'Tormenta con granizo ligero',
      99: 'Tormenta con granizo intenso'
    };
    
    return weatherCodes[code] || 'Desconocido';
  };

  // Función para obtener el icono según el código meteorológico
  const getWeatherIcon = (code) => {
    // Mapeamos los códigos WMO a iconos de Font Awesome
    if (code === 0) return 'fas fa-sun text-warning';
    if (code === 1) return 'fas fa-sun text-warning';
    if (code === 2) return 'fas fa-cloud-sun text-warning';
    if (code === 3) return 'fas fa-cloud text-secondary';
    if (code >= 45 && code <= 48) return 'fas fa-smog text-secondary';
    if (code >= 51 && code <= 57) return 'fas fa-cloud-rain text-primary';
    if (code >= 61 && code <= 67) return 'fas fa-cloud-showers-heavy text-primary';
    if (code >= 71 && code <= 77) return 'fas fa-snowflake text-info';
    if (code >= 80 && code <= 82) return 'fas fa-cloud-showers-heavy text-primary';
    if (code >= 85 && code <= 86) return 'fas fa-snowflake text-info';
    if (code >= 95) return 'fas fa-bolt text-warning';
    return 'fas fa-cloud text-secondary';
  };

  // Función para formatear el nombre del día de la semana
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Mañana";
    } else {
      return date.toLocaleDateString('es-ES', { weekday: 'long' });
    }
  };

  // Función para obtener recomendaciones agrícolas según el clima
  const getAgriculturalRecommendations = (dayIndex) => {
    if (!forecastData) return [];
    
    const recommendations = [];
    const day = {
      weathercode: forecastData.weathercode[dayIndex],
      temp_max: forecastData.temperature_max[dayIndex],
      temp_min: forecastData.temperature_min[dayIndex],
      precipitation: forecastData.precipitation[dayIndex],
      precipitation_probability: forecastData.precipitation_probability[dayIndex],
      windspeed: forecastData.windspeed[dayIndex]
    };
    
    // Recomendaciones de riego
    if (day.precipitation > 5) {
      recommendations.push({
        type: 'riego',
        text: 'Se esperan precipitaciones significativas. No es necesario regar.',
        icon: 'fas fa-tint',
        variant: 'info'
      });
    } else if (day.precipitation < 1 && day.temp_max > 25) {
      recommendations.push({
        type: 'riego',
        text: 'Clima seco y cálido. Asegure un riego adecuado para sus cultivos.',
        icon: 'fas fa-tint-slash',
        variant: 'warning'
      });
    }
    
    // Recomendaciones de protección
    if (day.temp_min < 5) {
      recommendations.push({
        type: 'proteccion',
        text: 'Temperaturas bajas previstas. Considere proteger cultivos sensibles a heladas.',
        icon: 'fas fa-temperature-low',
        variant: 'danger'
      });
    } else if (day.temp_max > 35) {
      recommendations.push({
        type: 'proteccion',
        text: 'Temperaturas muy altas previstas. Use mallas de sombreo para cultivos sensibles.',
        icon: 'fas fa-temperature-high',
        variant: 'danger'
      });
    }
    
    // Recomendaciones de tratamiento
    if (day.precipitation_probability > 60 && day.precipitation > 0 && day.temp_max > 15 && day.temp_max < 30) {
      recommendations.push({
        type: 'tratamiento',
        text: 'Condiciones favorables para el desarrollo de hongos. Considere tratamientos preventivos.',
        icon: 'fas fa-disease',
        variant: 'warning'
      });
    }
    
    // Recomendaciones de trabajo
    if (day.windspeed > 40) {
      recommendations.push({
        type: 'trabajo',
        text: 'Vientos fuertes previstos. Evite aplicar productos fitosanitarios.',
        icon: 'fas fa-wind',
        variant: 'danger'
      });
    } else if (day.precipitation_probability < 20 && day.temp_max > 10 && day.temp_max < 28 && day.windspeed < 20) {
      recommendations.push({
        type: 'trabajo',
        text: 'Condiciones favorables para realizar labores en el campo.',
        icon: 'fas fa-tractor',
        variant: 'success'
      });
    }
    
    return recommendations;
  };

  // Renderizar el componente
  return (
    <Container fluid className="px-4" style={{ marginTop: '130px', marginBottom: '2rem' }}>
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-success text-white">
          <h2 className="mb-0">
            <i className="fas fa-cloud-sun-rain me-2"></i>
            Meteorología Agrícola
          </h2>
        </Card.Header>

        <Card.Body>
          {!parcelaSeleccionada && (
            <Row className="mb-4">
              <Col md={12}>
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  Selecciona una ubicación en el mapa para ver el pronóstico meteorológico de tu parcela. Puedes hacer zoom para una selección más precisa.
                </Alert>
              </Col>
            </Row>
          )}

          <Row>
            <Col lg={7} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">
                    <i className="fas fa-map-marked-alt me-2"></i>
                    Mapa de Parcelas
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {/* Mapa de Leaflet */}
                  <div 
                    ref={mapContainerRef} 
                    style={{ height: '500px', width: '100%', borderRadius: '0 0 0.375rem 0.375rem' }}
                  />
                  <div className="bg-light p-2 border-top">
                    <small>
                      <strong>Coordenadas seleccionadas:</strong> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={5}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-cloud me-2"></i>
                    Condiciones Actuales
                  </h5>
                  {weatherData && (
                    <span className="text-muted small">
                      Actualizado: {weatherData.time.toLocaleTimeString('es-ES')}
                    </span>
                  )}
                </Card.Header>
                <Card.Body>
                  {error && (
                    <Alert variant="danger">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {error}
                    </Alert>
                  )}
                  
                  {isLoading && !weatherData && (
                    <div className="text-center py-4">
                      <Spinner animation="border" variant="success" />
                      <p className="mt-2">Obteniendo datos meteorológicos...</p>
                    </div>
                  )}
                  
                  {weatherData && (
                    <div className="text-center">
                      <div className="mb-3">
                        <i className={`${getWeatherIcon(weatherData.weathercode)} fa-3x`}></i>
                      </div>
                      <h2 className="display-4 mb-0">{weatherData.temperature}°C</h2>
                      <p className="lead">{getWeatherDescription(weatherData.weathercode)}</p>
                      
                      <Row className="mt-4">
                        <Col xs={6}>
                          <div className="border rounded p-2">
                            <div className="text-muted">Viento</div>
                            <div className="fw-bold">{weatherData.windspeed} km/h</div>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="border rounded p-2">
                            <div className="text-muted">Dirección</div>
                            <div className="fw-bold">
                              <i className="fas fa-long-arrow-alt-up" style={{ transform: `rotate(${weatherData.winddirection}deg)` }}></i>
                              {' '}{weatherData.winddirection}°
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Pronóstico 5 días
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {isLoading && !forecastData && (
                    <div className="text-center py-4">
                      <Spinner animation="border" variant="success" />
                      <p className="mt-2">Cargando pronóstico...</p>
                    </div>
                  )}
                  
                  {forecastData && (
                    <div>
                      <div className="d-flex overflow-auto border-bottom">
                        {forecastData.time.map((day, index) => (
                          <div 
                            key={day} 
                            className={`text-center flex-grow-1 py-2 px-3 cursor-pointer ${selectedDay === index ? 'bg-light border-bottom border-3 border-success' : ''}`}
                            onClick={() => setSelectedDay(index)}
                            style={{ cursor: 'pointer', minWidth: '100px' }}
                          >
                            <div className="fw-bold">{getDayName(day)}</div>
                            <div>
                              <i className={`${getWeatherIcon(forecastData.weathercode[index])} fa-lg`}></i>
                            </div>
                            <div className="small">
                              <span className="text-danger">{Math.round(forecastData.temperature_max[index])}°</span>
                              {' / '}
                              <span className="text-primary">{Math.round(forecastData.temperature_min[index])}°</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-3">
                        <h6>
                          <i className="fas fa-calendar-day me-2"></i>
                          {getDayName(forecastData.time[selectedDay])}
                        </h6>
                        
                        <div className="d-flex align-items-center mb-3">
                          <i className={`${getWeatherIcon(forecastData.weathercode[selectedDay])} fa-2x me-3`}></i>
                          <div>
                            <div className="fw-bold">{getWeatherDescription(forecastData.weathercode[selectedDay])}</div>
                            <div>
                              <span className="text-danger">{Math.round(forecastData.temperature_max[selectedDay])}°C</span>
                              {' / '}
                              <span className="text-primary">{Math.round(forecastData.temperature_min[selectedDay])}°C</span>
                            </div>
                          </div>
                        </div>
                        
                        <ListGroup variant="flush" className="mb-3">
                          <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                            <div>
                              <i className="fas fa-tint text-primary me-2"></i>
                              Precipitación
                            </div>
                            <div>
                              {forecastData.precipitation[selectedDay]} mm
                              <Badge bg={forecastData.precipitation_probability[selectedDay] > 50 ? 'primary' : 'secondary'} className="ms-2">
                                {forecastData.precipitation_probability[selectedDay]}%
                              </Badge>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                            <div>
                              <i className="fas fa-wind text-secondary me-2"></i>
                              Viento
                            </div>
                            <div>
                              {forecastData.windspeed[selectedDay]} km/h
                              <i className="fas fa-long-arrow-alt-up ms-2" style={{ transform: `rotate(${forecastData.winddirection[selectedDay]}deg)` }}></i>
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                        
                        <h6 className="mb-2">
                          <i className="fas fa-tractor me-2"></i>
                          Recomendaciones Agrícolas
                        </h6>
                        
                        {getAgriculturalRecommendations(selectedDay).length > 0 ? (
                          getAgriculturalRecommendations(selectedDay).map((rec, idx) => (
                            <Alert key={idx} variant={rec.variant} className="py-2 mb-2">
                              <i className={`${rec.icon} me-2`}></i>
                              {rec.text}
                            </Alert>
                          ))
                        ) : (
                          <p className="text-muted fst-italic mb-0">Sin recomendaciones específicas para este día.</p>
                        )}
                      </div>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="text-muted small">
                  <i className="fas fa-info-circle me-1"></i>
                  Datos meteorológicos proporcionados por Open-Meteo API con actualizaciones diarias.
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Meteorologia;