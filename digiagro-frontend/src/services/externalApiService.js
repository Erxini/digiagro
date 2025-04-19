/**
 * Servicio para obtener información de cultivos
 * Utiliza datos locales para información técnica e imágenes de alta calidad
 */

// Lista completa de cultivos comunes en España
const cultivosComunes = [
  'tomate', 'patata', 'maiz', 'lechuga', 'zanahoria', 'cebolla', 
  'pimiento', 'calabacin', 'pepino', 'berenjena', 'trigo', 
  'cebada', 'avena', 'espinacas', 'guisante', 'haba', 'acelga', 
  'melon', 'sandia', 'fresa'
];

// Imágenes de alta calidad seleccionadas manualmente para cada cultivo
const imagenesRespaldo = {
  tomate: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg",
  patata: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg",
  maiz: "https://images.pexels.com/photos/7878030/pexels-photo-7878030.jpeg",
  lechuga: "https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg", 
  zanahoria: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg",
  cebolla: "https://images.pexels.com/photos/10041322/pexels-photo-10041322.jpeg",
  pimiento: "https://images.pexels.com/photos/2893635/pexels-photo-2893635.jpeg",
  calabacin: "https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg",
  pepino: "https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg",
  berenjena: "https://images.pexels.com/photos/12572532/pexels-photo-12572532.jpeg",
  cebada: "https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg",
  trigo: "https://images.pexels.com/photos/1600139/pexels-photo-1600139.jpeg",
  avena: "https://images.pexels.com/photos/7718286/pexels-photo-7718286.jpeg",
  espinacas: "https://images.pexels.com/photos/2749165/pexels-photo-2749165.jpeg",
  guisante: "https://images.pexels.com/photos/255469/pexels-photo-255469.jpeg",
  haba: "https://images.pexels.com/photos/7792149/pexels-photo-7792149.jpeg",
  acelga: "https://images.pexels.com/photos/5012852/pexels-photo-5012852.jpeg",
  melon: "https://images.pexels.com/photos/2894285/pexels-photo-2894285.jpeg",
  sandia: "https://images.pexels.com/photos/3609872/pexels-photo-3609872.jpeg",
  fresa: "https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg",
  // Imagen predeterminada para cultivos no encontrados
  default: "https://images.pexels.com/photos/2255801/pexels-photo-2255801.jpeg"
};

// Datos locales de cultivos 
const datosLocales = {
  tomate: {
    nombre: "Tomate",
    siembra: "Febrero a Mayo (en invernadero), Abril a Junio (al aire libre)",
    abonado: "Requiere abonado rico en potasio y fósforo. Abonar cada 15-20 días durante el desarrollo.",
    recoleccion: "Junio a Octubre, según variedad y zona de cultivo.",
    riego: "Frecuente pero moderado. Evitar mojar las hojas para prevenir enfermedades."
  },
  patata: {
    nombre: "Patata",
    siembra: "Febrero a Mayo, según la zona de cultivo",
    abonado: "Requiere suelos ricos en potasio. Abonar antes de la siembra y cuando comienzan a formarse los tubérculos.",
    recoleccion: "Junio a Septiembre, cuando la planta comienza a secarse",
    riego: "Regular, evitando encharcamientos. Especialmente importante durante la formación de tubérculos."
  },
  maiz: {
    nombre: "Maíz",
    siembra: "Abril a Junio, cuando la temperatura del suelo alcanza los 12°C",
    abonado: "Necesita suelos ricos en nitrógeno. Aplicar abono completo antes de la siembra y suplementar con nitrógeno durante el desarrollo.",
    recoleccion: "Agosto a Noviembre, dependiendo de la variedad y momento de siembra",
    riego: "Regular durante todo el ciclo, especialmente crítico durante la floración y llenado del grano."
  },
  lechuga: {
    nombre: "Lechuga",
    siembra: "Todo el año, preferentemente en primavera y otoño",
    abonado: "Moderado en nitrógeno. Evitar excesos para prevenir acumulación de nitratos.",
    recoleccion: "45-80 días después de la siembra, dependiendo de la variedad",
    riego: "Frecuente y en pequeñas cantidades, manteniendo el suelo húmedo."
  },
  zanahoria: {
    nombre: "Zanahoria",
    siembra: "Febrero a Julio, escalonadamente",
    abonado: "Moderado, evitando exceso de nitrógeno que favorece el desarrollo foliar en detrimento de la raíz.",
    recoleccion: "90-120 días después de la siembra",
    riego: "Regular, manteniendo humedad constante pero sin encharcamientos."
  },
  cebolla: {
    nombre: "Cebolla",
    siembra: "Septiembre a Febrero según variedades",
    abonado: "Medio en nitrógeno y alto en potasio y fósforo para favorecer la formación del bulbo.",
    recoleccion: "Abril a Septiembre, cuando las hojas comienzan a secarse",
    riego: "Regular hasta que los bulbos empiezan a formarse, después reducir para favorecer la maduración."
  },
  pimiento: {
    nombre: "Pimiento",
    siembra: "Febrero a Abril en semillero protegido, trasplante de Abril a Mayo",
    abonado: "Rico en fósforo y potasio. Evitar exceso de nitrógeno que favorece el desarrollo vegetativo en detrimento de la fructificación.",
    recoleccion: "Julio a Octubre, según variedades y condiciones de cultivo",
    riego: "Regular y abundante, especialmente en floración y cuajado de frutos."
  },
  calabacin: {
    nombre: "Calabacín",
    siembra: "Marzo a Junio, directamente en el terreno o en semillero protegido",
    abonado: "Requiere suelos bien abonados con materia orgánica. Aplicar fertilizante rico en potasio durante la fructificación.",
    recoleccion: "De 45 a 60 días después de la siembra, recolectando continuamente para estimular producción",
    riego: "Abundante y regular, evitando mojar las hojas para prevenir enfermedades fúngicas."
  },
  pepino: {
    nombre: "Pepino",
    siembra: "Marzo a Junio, en semillero o directamente en el terreno cuando no hay riesgo de heladas",
    abonado: "Requiere suelos ricos en materia orgánica. Aportar fertilizante equilibrado durante el desarrollo.",
    recoleccion: "De 60 a 90 días después de la siembra, cuando los frutos alcanzan el tamaño adecuado",
    riego: "Abundante y regular, manteniendo humedad constante pero evitando encharcamientos."
  },
  berenjena: {
    nombre: "Berenjena",
    siembra: "Febrero a Marzo en semillero protegido, trasplante de Abril a Mayo",
    abonado: "Requiere suelos ricos en materia orgánica. Aplicar fertilizante rico en potasio durante la fructificación.",
    recoleccion: "Julio a Octubre, cuando los frutos adquieren su color característico",
    riego: "Regular y abundante, especialmente en floración y desarrollo de frutos."
  },
  trigo: {
    nombre: "Trigo",
    siembra: "Octubre a Diciembre (trigo de invierno), Febrero a Marzo (trigo de primavera)",
    abonado: "Requiere abonado de fondo rico en fósforo y potasio, y abonado de cobertera nitrogenado durante el desarrollo.",
    recoleccion: "Junio a Julio, cuando el grano está duro y la planta amarillea",
    riego: "Moderado, principalmente en épocas de sequía y durante el espigado."
  },
  cebada: {
    nombre: "Cebada",
    siembra: "Octubre a Noviembre (cebada de invierno), Febrero a Marzo (cebada de primavera)",
    abonado: "Menor exigencia que el trigo. Abonado de fondo equilibrado y aporte nitrogenado moderado en primavera.",
    recoleccion: "Mayo a Julio, antes que el trigo y cuando el grano está seco",
    riego: "Tolera bien la sequía, pero necesita agua durante la formación de la espiga."
  },
  avena: {
    nombre: "Avena",
    siembra: "Octubre a Noviembre (avena de invierno), Febrero a Marzo (avena de primavera)",
    abonado: "Requiere menos abonado que otros cereales. Aplicar abono completo antes de la siembra y nitrogenado en cobertera.",
    recoleccion: "Junio a Agosto, cuando el grano está completamente maduro",
    riego: "Moderado, presenta buena resistencia a la sequía una vez establecida."
  },
  espinacas: {
    nombre: "Espinacas",
    siembra: "Agosto a Marzo, preferiblemente en otoño para cultivo invernal",
    abonado: "Requiere suelos ricos en nitrógeno. Aplicar abono orgánico antes de la siembra.",
    recoleccion: "30-60 días después de la siembra según variedades, antes de que florezcan",
    riego: "Regular y moderado, manteniendo humedad constante pero sin encharcamientos."
  },
  guisante: {
    nombre: "Guisante",
    siembra: "Octubre a Marzo, dependiendo de la variedad y zona de cultivo",
    abonado: "Requiere poco abono nitrogenado por ser leguminosa, pero necesita fósforo y potasio.",
    recoleccion: "Abril a Junio, cuando las vainas están llenas pero aún verdes",
    riego: "Moderado, crítico durante la floración y formación de vainas."
  },
  haba: {
    nombre: "Haba",
    siembra: "Octubre a Enero, según clima y variedad",
    abonado: "Como leguminosa, requiere poco nitrógeno. Aplicar fósforo y potasio antes de la siembra.",
    recoleccion: "Abril a Junio, según el momento de siembra y si se consumen verdes o secas",
    riego: "Moderado, sensible tanto al exceso como al déficit hídrico."
  },
  acelga: {
    nombre: "Acelga",
    siembra: "Todo el año, preferiblemente en primavera y otoño",
    abonado: "Requiere suelos ricos en materia orgánica. Aplicar abono equilibrado antes de la siembra.",
    recoleccion: "De 60 a 70 días después de la siembra, cortando las hojas exteriores y dejando crecer el centro",
    riego: "Frecuente pero moderado, manteniendo humedad constante."
  },
  melon: {
    nombre: "Melón",
    siembra: "Marzo a Mayo, en semillero o directamente en terreno cuando no hay riesgo de heladas",
    abonado: "Requiere suelos bien abonados con materia orgánica. Aplicar fertilizante rico en potasio durante la fructificación.",
    recoleccion: "Julio a Septiembre, cuando el fruto cambia de color y desprende aroma característico",
    riego: "Abundante durante el desarrollo vegetativo, reduciendo al comienzo de la maduración para concentrar azúcares."
  },
  sandia: {
    nombre: "Sandía",
    siembra: "Marzo a Mayo, cuando la temperatura del suelo supera los 15°C",
    abonado: "Rico en materia orgánica antes de la siembra. Durante el cultivo, aportes equilibrados con énfasis en potasio durante la fructificación.",
    recoleccion: "Julio a Septiembre, cuando el zarcillo cercano al fruto se seca y la parte inferior adquiere color amarillento",
    riego: "Abundante y regular, reduciendo gradualmente durante la maduración para concentrar azúcares."
  },
  fresa: {
    nombre: "Fresa",
    siembra: "Septiembre a Noviembre mediante plantones o estolones",
    abonado: "Requiere suelos ricos en materia orgánica. Aplicar fertilizante equilibrado antes de la floración.",
    recoleccion: "Abril a Junio, recogiendo los frutos cuando alcanzan su coloración completa",
    riego: "Frecuente pero moderado, evitando mojar los frutos para prevenir pudriciones."
  }
};

// Cache para almacenar datos y reducir procesamiento
const cache = {
  cultivosInfo: {},
  cultivosDisponibles: null
};

/**
 * Obtiene información de un cultivo específico
 * @param {string} cultivoNombre - Nombre del cultivo
 * @returns {Promise} - Promesa con la información del cultivo
 */
export const obtenerInfoCultivo = async (cultivoNombre) => {
  try {
    // Normalizar el nombre del cultivo (minúsculas, sin acentos)
    const nombreNormalizado = cultivoNombre.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    
    // Verificar si el cultivo ya está en caché
    if (cache.cultivosInfo[nombreNormalizado]) {
      console.log('Usando datos de caché para:', nombreNormalizado);
      return cache.cultivosInfo[nombreNormalizado];
    }

    // Verificar si tenemos datos locales para este cultivo
    const datosLocalesDisponibles = datosLocales[nombreNormalizado];
    
    // Obtener imagen de respaldo
    const imagen = imagenesRespaldo[nombreNormalizado] || imagenesRespaldo.default;
    
    if (!datosLocalesDisponibles) {
      // Creamos información genérica con la imagen de respaldo
      const infoGenerica = {
        nombre: cultivoNombre.charAt(0).toUpperCase() + cultivoNombre.slice(1),
        siembra: "Consultar calendario agrícola local para fechas óptimas según variedad y zona.",
        abonado: "Aplicar abono orgánico antes de la siembra y fertilizante equilibrado durante el desarrollo.",
        recoleccion: "Varía según el cultivo, variedad y condiciones climáticas.",
        riego: "Adaptado a las necesidades específicas del cultivo y condiciones climáticas.",
        imagen: imagen,
        fuentes: ['Base de datos DigiAgro']
      };
      
      // Guardar en caché
      cache.cultivosInfo[nombreNormalizado] = infoGenerica;
      return infoGenerica;
    }
    
    // Usamos los datos locales disponibles + imagen de respaldo
    const cultivoInfo = {
      ...datosLocalesDisponibles,
      imagen: imagen,
      fuentes: ['Base de datos DigiAgro', 'Ministerio de Agricultura, Pesca y Alimentación']
    };

    // Guardar en caché
    cache.cultivosInfo[nombreNormalizado] = cultivoInfo;
    
    return cultivoInfo;
  } catch (error) {
    console.error(`Error al obtener información para ${cultivoNombre}:`, error);
    
    // En caso de error total, devolver información con imagen predeterminada
    return {
      nombre: cultivoNombre.charAt(0).toUpperCase() + cultivoNombre.slice(1),
      siembra: "Consultar calendario agrícola local para fechas óptimas según variedad y zona.",
      abonado: "Aplicar abono orgánico antes de la siembra y fertilizante equilibrado durante el desarrollo.",
      recoleccion: "Varía según el cultivo, variedad y condiciones climáticas.",
      riego: "Adaptado a las necesidades específicas del cultivo y condiciones climáticas.",
      imagen: imagenesRespaldo.default,
      fuentes: ['Base de datos DigiAgro']
    };
  }
};

/**
 * Obtiene la lista de cultivos disponibles
 * @returns {Promise} - Promesa con la lista de cultivos
 */
export const obtenerCultivosDisponibles = async () => {
  try {
    // Verificar si ya tenemos la lista en caché
    if (cache.cultivosDisponibles) {
      return cache.cultivosDisponibles;
    }
    
    // Usar la lista local
    cache.cultivosDisponibles = cultivosComunes;
    
    return cultivosComunes;
  } catch (error) {
    console.error('Error al obtener lista de cultivos:', error);
    return cultivosComunes; // En caso de error, devolver la lista local
  }
};

export default {
  obtenerInfoCultivo,
  obtenerCultivosDisponibles
};