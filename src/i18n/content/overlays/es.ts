import type { ContentOverlays } from "../types";
const overlay = {
  faqs: [
    {
      title: "Reservas y precios",
      items: [
        {
          q: "¿El precio es realmente fijo?",
          a: "Sí. El precio que ve cuando reserva es el precio que paga: sin ofertas, sin aumento de precio, sin recargos posteriores al viaje. Las únicas excepciones son los extras que usted mismo marca (asiento para niños, parada adicional, bienvenida con cartel) y el recargo nocturno automático del 15% para recogidas entre las 22:00 y las 06:00, ambos mostrados antes de confirmar.",
        },
        {
          q: "¿Con cuánta antelación debo reservar?",
          a: "48 horas antes de que su recogida sea cómoda. En agosto, recomendamos una semana de anticipación para garantizar su clase de vehículo preferida. Es posible realizar reservas para el mismo día, pero sujetas a disponibilidad.",
        },
        {
          q: "¿Puedo reservar un traslado de regreso al mismo tiempo?",
          a: "Sí, reserva dos traslados separados con los mismos datos de cliente. Estamos creando un flujo combinado de reservas de ida y vuelta para una futura actualización.",
        },
      ],
    },
    {
      title: "Pago",
      items: [
        {
          q: "¿Cuándo pago?",
          a: "En este momento, operamos con un modelo de reserva y luego confirmación: usted reserva en línea sin necesidad de tarjeta, nosotros confirmamos en unas pocas horas y usted paga al conductor en efectivo o con tarjeta a su llegada. El pago en línea a través de Stripe estará disponible en breve.",
        },
        {
          q: "¿Aceptas tarjetas?",
          a: "Cada conductor lleva consigo un terminal de tarjeta que acepta Visa, Mastercard y Amex. El efectivo en EUR también está bien.",
        },
        {
          q: "¿Cobran una tarifa de reserva?",
          a: "No. El precio que ves es el precio completo. Sin gastos de reserva, sin recargos por combustible, sin gastos de recogida en el aeropuerto.",
        },
      ],
    },
    {
      title: "Cancelaciones y cambios",
      items: [
        {
          q: "¿Cuál es su política de cancelación?",
          a: "Cancelación gratuita hasta 24 horas antes de la recogida (reembolso completo o crédito de reserva del 100 % si se paga por adelantado). Dentro de las 24 horas se aplica una tarifa del 50%. Los viajeros que no se presenten después de la espera gratuita se cobrarán en su totalidad. Los conductores confirmados que no se presenten recibirán una compensación completa más un crédito de buena voluntad de 25 € cuando corresponda.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor?",
          a: "60 minutos gratis en aeropuertos y puertos con seguimiento de vuelos/ferry; 30 minutos en hoteles y domicilios. Después de eso, sin contacto, el viaje puede marcarse como viajero no presentado.",
        },
        {
          q: "¿Qué pasa si el conductor no aparece?",
          a: "Abra Informar un problema en su reserva y elija El conductor no apareció. Revisaremos y reembolsaremos o volveremos a reservar en su totalidad cuando se confirme; esto no es una cancelación automática.",
        },
        {
          q: "¿Puedo cambiar mi hora de recogida?",
          a: "Sí, responda al correo electrónico de confirmación de su reserva o WhatsApp directamente a su conductor. Los cambios son gratuitos hasta 4 horas antes de la recogida.",
        },
        {
          q: "¿Qué pasa si mi vuelo es cancelado?",
          a: "Envíenos la notificación de la aerolínea (o seleccione ese motivo al cancelar) y volveremos a reservar o le reembolsaremos el importe total, lo que prefiera.",
        },
      ],
    },
    {
      title: "Conociendo a su conductor",
      items: [
        {
          q: "¿Dónde me espera el conductor en el aeropuerto?",
          a: "Dentro de la sala de llegadas, pasando el área de recogida de equipaje, con un cartel con su nombre. Añade el extra de conocer y saludar (+10 €) por una señal física; de lo contrario, el conductor te identificará por tu nombre en tu reserva.",
        },
        {
          q: "¿Dónde me espera el conductor en el puerto?",
          a: "A la salida de la cubierta de automóviles para los ferries que llegan, o directamente en la puerta de su hotel/villa asignada para los traslados posteriores.",
        },
        {
          q: "¿Qué pasa si no puedo encontrar mi controlador?",
          a: "Tendrás el móvil del conductor y WhatsApp el día antes de la recogida. Nuestra línea de despacho 24 horas al día, 7 días a la semana, también se encuentra en la confirmación de su reserva.",
        },
      ],
    },
    {
      title: "Equipaje, niños y vehículos.",
      items: [
        {
          q: "¿Cuánto equipaje puedo llevar?",
          a: "Las clases Economy y Standard tienen capacidad para 3 maletas estándar para 3 pasajeros. Las furgonetas y los SUV llevan entre 6 y 7 maletas; minibuses de hasta 12 o 16 plazas. Bolsas, tablas de surf o bicicletas adicionales, solo indíquenoslo en las notas.",
        },
        {
          q: "¿Puedo llevar un asiento para niños?",
          a: "Sí. Añade el extra de silla infantil al reservar (+10€). Suministramos bebés (0 a 13 kg), niños pequeños (9 a 18 kg) y refuerzos (15 a 36 kg); mencione cuál en las notas.",
        },
        {
          q: "¿Todos los vehículos tienen aire acondicionado?",
          a: "Todos los vehículos de la flota tienen control de clima y todos los conductores lo utilizan. Las botellas de agua vienen de serie en la Clase Estándar y superiores.",
        },
      ],
    },
    {
      title: "Retrasos y esperas de vuelos",
      items: [
        {
          q: "¿Qué pasa si mi vuelo llega tarde?",
          a: "Realizamos un seguimiento de su número de vuelo automáticamente. El conductor ajusta la recogida: sin coste adicional ni límite de tiempo para vuelos tardíos.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor?",
          a: "60 minutos de espera gratuita desde la llegada prevista para vuelos, espera ilimitada si el vuelo en sí se retrasa. Para recogida en el hotel, 15 minutos de espera gratis.",
        },
      ],
    },
    {
      title: "Propinas y etiqueta",
      items: [
        {
          q: "¿Se esperan propinas?",
          a: "No es necesario, siempre se agradece. Si su conductor fue excelente, el 10% en efectivo es un gesto cálido en la cultura griega.",
        },
        {
          q: "¿Puede el conductor parar a tomar un café o una foto?",
          a: "En transferencias de larga distancia, sí, solo pregunta. Está integrado en la experiencia.",
        },
      ],
    },
  ],
  services: {
    "airport-transfers": {
      name: "Traslados al aeropuerto",
      tagline: "Recepción y bienvenida desde los aeropuertos de Heraklion (HER) y Chania (CHQ).",
      intro:
        "Traslados de precio fijo desde ambos aeropuertos de Creta a todos los complejos turísticos y villas de la isla. Seguimiento del vuelo, cartel con el nombre en llegadas.",
      body: "Su conductor llega 15 minutos antes de que aterrice su vuelo, sigue la información de la aerolínea y espera en la puerta de llegadas con un cartel con su nombre. Sin buscar paradas de taxis ni negociar tarifas. El precio que viste cuando reservaste es el precio que pagas.",
      whatsIncluded: [
        "Seguimiento de vuelos",
        "Conocer y saludar en la puerta",
        "Tiempo de espera gratuito de 60 minutos.",
        "Conductor directo WhatsApp",
      ],
      bestFor: [
        "Llegadas a HER o CHQ",
        "Vuelos nocturnos",
        "Traslados familiares con niños y maletas.",
      ],
    },
    "port-transfers": {
      name: "Traslados Portuarios",
      tagline: "Desde el puerto de Heraklion y el puerto de Souda directamente a su hotel.",
      intro:
        "Los ferries nocturnos desde El Pireo atracan antes del amanecer. Estamos ahí, sin importar el retraso.",
      body: "Los horarios de ANEK, Minoan y Sea Jets te llevarán a Creta entre las 05:30 y las 06:00. Nuestros conductores programan su llegada a su ferry específico y, si el barco llega tarde, lo esperamos de forma gratuita. Precio fijo, sin recargo por madrugada.",
      whatsIncluded: [
        "Seguimiento del horario del ferry",
        "Nos reunimos en la salida de la cubierta para coches.",
        "Espera gratuita para ferries retrasados",
        "Cualquier hora del día",
      ],
      bestFor: [
        "Llegadas nocturnas al Pireo",
        "Saltos en ferry entre islas",
        "Excursiones en cruceros",
      ],
    },
    "hotel-transfers": {
      name: "Traslados al hotel",
      tagline: "Punto a punto entre hoteles y ciudades, en cualquier lugar de Creta.",
      intro:
        "Cambie de hotel a mitad de vacaciones. Dirígete a una boda en los Domes. Llegue al ferry a la mañana siguiente.",
      body: "No todos los traslados comienzan en un aeropuerto. Nuestra matriz de precios fijos cubre de hotel a hotel, de hotel a ciudad y de hotel a puerto en todas las rutas populares: Elounda a Chania, Rethymno a Matala, Agios Nikolaos a Vai.",
      whatsIncluded: [
        "Recogida en la puerta del hotel",
        "Asistencia de equipaje",
        "Conocimiento del conductor local.",
        "Cualquier ruta a Creta",
      ],
      bestFor: ["Itinerarios multihotel", "Bodas y eventos", "Conexiones de ferry posteriores"],
    },
    "private-tours": {
      name: "Tours privados de un día",
      tagline: "Tu conductor del día, tu itinerario.",
      intro:
        "Knossos, Elafonissi, Samaria, la meseta de Lasithi... con un conductor que conoce los atajos y las buenas tabernas.",
      body: "Reserva un conductor para 6, 8 o 10 horas. Diseñe su propio itinerario o utilice una de nuestras rutas sugeridas: Knossos + museo de Heraklion + circuito de bodegas Archanes, el día de playa en la costa oeste (Balos + Falasarna) o el recorrido por la meseta de Lasithi + cueva Dikteon.",
      whatsIncluded: [
        "Guía-conductor con licencia local.",
        "Vehículo de día completo",
        "Agua a bordo",
        "Itinerarios sugeridos",
      ],
      bestFor: [
        "Viajeros que dan prioridad a la cultura",
        "familias con niños",
        "Visitantes de Creta por primera vez",
      ],
    },
    "long-distance": {
      name: "Traslados de larga distancia",
      tagline: "Cruza toda la isla a un precio fijo.",
      intro:
        "Heraklion a Chania, Chania a Elounda, Rethymno a Sitia. Las rutas largas bien hechas.",
      body: "Los viajes de dos horas por las carreteras de Creta son su propia experiencia. Usamos clase estándar y superior en recorridos a través de la isla: espacio adicional para las piernas, agua a bordo, un conductor que sabe dónde detenerse para tomar el mejor café a mitad de camino.",
      whatsIncluded: [
        "Clase estándar o superior",
        "Parada de café gratis",
        "Agua a bordo",
        "Precio fijo, sin recargo por kilómetro",
      ],
      bestFor: [
        "Itinerarios entre islas",
        "Excursiones de un día en cruceros",
        "Grupos que se mueven entre regiones",
      ],
    },
    "group-transfers": {
      name: "Traslados Grupales",
      tagline: "Minivans, minibuses o flota de coches para bodas y eventos.",
      intro: "Seis amigos o sesenta invitados: tenemos los vehículos y la coordinación.",
      body: "Nuestra clase Van Standard transporta hasta 7 pasajeros con 7 maletas. Para grupos más grandes disponemos de minibuses de 12 y 16 plazas, o coordinamos varios vehículos en una misma camioneta. Bodas en Elounda, oficinas corporativas en Chania, reuniones familiares en Rethymno: un contacto, un precio fijo.",
      whatsIncluded: [
        "Coordinación multivehículo",
        "Contacto del conductor principal",
        "Descuento por reserva de grupo de más de 3 vehículos",
        "Experiencia de bodas y eventos",
      ],
      bestFor: ["Grupos de más de 4 pasajeros", "Bodas y eventos", "viajes corporativos"],
    },
  },
  regions: {
    chania: {
      headline: "La capital occidental, el puerto veneciano, las Montañas Blancas.",
      intro:
        "Desde aquí se llega al rincón más fotografiado de Creta: el casco antiguo de Chania, el desfiladero de Samaria, las playas de Balos y Falasarna.",
      body: "Chania es el lugar donde el puerto veneciano todavía enmarca cada puesta de sol, donde las Montañas Blancas se elevan directamente desde el mar y donde los ferries del Pireo atracan en Souda antes del amanecer. Nuestros conductores cubren el aeropuerto internacional de Chania (CHQ), el puerto de Souda y todas las franjas turísticas desde Kissamos en el oeste hasta Georgioupoli en el este.",
      gateway: "Aeropuerto de La Canea (CHQ) y puerto de Souda",
    },
    rethymno: {
      headline: "Casco antiguo veneciano, largas playas de arena y desfiladeros.",
      intro:
        "La prefectura del medio: el encanto del casco antiguo al norte, las salvajes gargantas de la costa sur y las calas turquesas de Bali en el medio.",
      body: "El casco antiguo veneciano de Rethymno es lo suficientemente compacto como para caminar en una tarde, pero la región se extiende desde Bali en la costa norte hasta Plakias en el sur, atravesada por el desfiladero de Kourtaliotiko. Servimos a todos los hoteles desde Panormo hasta Agia Galini.",
      gateway: "Llegado desde los aeropuertos de Chania (CHQ) o Heraklion (HER)",
    },
    heraklion: {
      headline: "La puerta de entrada principal, Knossos, la franja turística de la costa norte.",
      intro:
        "El aeropuerto más grande de Creta, el puerto más activo y el palacio minoico de Knossos, además de 40 kilómetros de costa turística.",
      body: "Heraklion International (HER) es el lugar al que llegan cuatro de cada cinco turistas a Creta. La ciudad en sí es la capital cultural de la isla: Knossos, el Museo Arqueológico y la fortaleza portuaria. Al este de la ciudad, la franja turística va desde Anissaras pasando por Hersonissos, Stalis y Malia. Al sur, la llanura de Messara conduce a Matala y al mar de Libia.",
      gateway: "Aeropuerto de Heraklion (HER) y puerto de Heraklion",
    },
    lasithi: {
      headline: "El lujo del este: Elounda, la bahía de Mirabello, las palmeras de Vai.",
      intro:
        "Hogar de los hoteles de lujo más emblemáticos de Creta, la bahía de Mirabello y la playa de palmeras de Vai, en el extremo oriental.",
      body: "Lasithi es la prefectura más tranquila y oriental, y la que tiene la mayor concentración de hoteles de cinco estrellas. Elounda, en la península de la Bahía de Mirabello, alberga el Palacio Azul, las Cúpulas de Elounda, la Playa de Elounda y el Palacio de la Bahía de Elounda. Más allá de Agios Nikolaos, la costa está vacía hasta Sitia y Vai.",
      gateway: "Llegado desde el aeropuerto de Heraklion (HER)",
    },
  },
  vehicles: {
    economy: {
      label: "Economía",
      capacity: "1 a 3 pasajeros",
      bags: "3 bolsas",
      description: "Skoda Octavia, Toyota Prius o similar. Climatizado, limpio, puntual.",
      example: "Skoda Octavia",
    },
    comfort: {
      label: "Clase estándar",
      capacity: "1 a 3 pasajeros",
      bags: "3 bolsas",
      description:
        "Mercedes E-Class, BMW 5 Series o similar. Espacio extra para las piernas, agua a bordo.",
      example: "Mercedes E-Class",
    },
    luxury: {
      label: "Clase primera",
      capacity: "1 a 3 pasajeros",
      bags: "3 bolsas",
      description:
        "Mercedes S-Class, BMW 7, Audi A8 o similar. Servicio de chófer, precio todavía fijo.",
      example: "Mercedes S-Class",
    },
    suv: {
      label: "todoterreno",
      capacity: "1 a 6 pasajeros",
      bags: "6 bolsas",
      description:
        "Cadillac Escalade, Chevrolet Suburban o similar. Espacio y presencia para las familias.",
      example: "Cadillac Escalade",
    },
    minivan: {
      label: "Furgoneta estándar",
      capacity: "1 a 7 pasajeros",
      bags: "7 bolsas",
      description:
        "Mercedes Vito, Ford Custom o similar. La elección adecuada para familias y grupos.",
      example: "Mercedes Vito",
    },
    "van-first": {
      label: "Furgoneta de primera clase",
      capacity: "1 a 6 pasajeros",
      bags: "6 bolsas",
      description:
        "Mercedes V-Class o similar. Comodidad en furgoneta premium para grupos pequeños.",
      example: "Mercedes V-Class",
    },
    "minibus-12": {
      label: "Minibús (12 Pax)",
      capacity: "1 a 12 pasajeros",
      bags: "12 bolsas",
      description: "Mercedes Sprinter, Ford Transit o similar. Ideal para grupos más grandes.",
      example: "Mercedes Sprinter",
    },
    "minibus-16": {
      label: "Minibús (16 Pax)",
      capacity: "1 a 16 pasajeros",
      bags: "16 bolsas",
      description:
        "Mercedes Sprinter, Ford Transit o similar. Aforo máximo para fiestas y equipos.",
      example: "Mercedes Sprinter",
    },
  },
  routes: {
    "heraklion-airport-to-elounda": {
      blurb:
        "El clásico traslado desde el aeropuerto de Heraklion por la costa noreste hasta los hoteles boutique de Elounda y la bahía de Mirabello.",
      notes:
        "La ruta sigue la autopista costera E75 hasta Agios Nikolaos y luego la sinuosa carretera montañosa hasta Elounda. Los conductores conocen las entradas privadas a los hoteles en Blue Palace, Domes y Elounda Beach.",
    },
    "heraklion-airport-to-agios-nikolaos": {
      blurb:
        "Siga recto por la autopista E75 hasta Agios Nikolaos y el lago Voulismeni, la plaza más publicada en Instagram de Creta.",
      notes:
        "Autopista en todo su recorrido. Aproximadamente una hora fuera de las tardes pico de agosto.",
    },
    "heraklion-airport-to-hersonissos": {
      blurb:
        "Salto corto hacia el este hasta la zona turística: los hoteles Stalis, Malia y Hersonissos.",
      notes:
        "El tráfico puede disminuir la velocidad en los últimos 3 km en las noches pico de verano; construimos un búfer.",
    },
    "heraklion-airport-to-malia": {
      blurb:
        "Diríjase hacia el este hasta la zona turística de Malia y las ruinas del palacio minoico.",
      notes: "E75 durante todo el trayecto, bajada en cualquier puerta del hotel.",
    },
    "heraklion-airport-to-stalis": {
      blurb: "La tranquila hermana mediana entre Hersonissos y Malia.",
      notes: "Recorrido recto por la E75: menos de 35 minutos en horas valle.",
    },
    "heraklion-airport-to-rethymno": {
      blurb:
        "Oeste por la E75 con el mar de Creta a su derecha durante todo el camino. Servicio de traslado al antiguo puerto veneciano disponible.",
      notes:
        "El casco antiguo de Rethymno es peatonal: lo dejaremos en el puerto o en el punto de acceso al hotel más cercano.",
    },
    "heraklion-airport-to-chania": {
      blurb: "El recorrido completo por la costa norte. Dos horas de viaje, un precio claro.",
      notes:
        "Menos vuelos aterrizan en Chania, por lo que este traslado entre islas es popular. Paramos a tomar un café si quieres.",
    },
    "heraklion-airport-to-matala": {
      blurb:
        "Hacia el sur, a través de la llanura de Messara, hasta las cuevas de la época hippie de la bahía de arena roja de Matala.",
      notes:
        "La ruta cruza el paso de montaña de Agia Varvara, espectacular a la luz de la mañana.",
    },
    "heraklion-airport-to-bali": {
      blurb: "El pueblo pesquero de cuatro calas a medio camino de Rethymno.",
      notes:
        "Empinado descenso final hacia el pueblo de Bali: nuestros conductores conocen las carreteras de acceso al hotel.",
    },
    "heraklion-airport-to-anissaras": {
      blurb:
        "La franja exclusiva justo antes de Hersonissos, hogar de las grandes marcas turísticas.",
      notes:
        "Transferencia más rápida de nuestro catálogo. Menos de 30 minutos a cualquier hora del día.",
    },
    "heraklion-airport-to-analipsi": {
      blurb: "El grupo hotelero de Nana Beach y tranquilas playas familiares.",
      notes: "Salga en el cruce de Analipsi, a cinco minutos de la autopista.",
    },
    "heraklion-airport-to-ierapetra": {
      blurb:
        "Al sureste de la ciudad más meridional de Europa. Un viaje largo y que merece la pena.",
      notes: "La ruta cruza el paso de Selinari y desciende por la llanura de Ierápetra.",
    },
    "heraklion-port-to-matala": {
      blurb: "Directamente desde el ferry nocturno desde El Pireo hasta la playa de Matala.",
      notes:
        "Realizamos un seguimiento de los horarios de ANEK y Minoan; La llegada retrasada no tiene ningún coste.",
    },
    "heraklion-port-to-chania": {
      blurb: "Salga del ferry y siga recto hacia el oeste cruzando la isla.",
      notes: "Viaje de más de dos horas; Pararemos a medio camino para tomar un café si quieres.",
    },
    "chania-airport-to-chania-old-town": {
      blurb:
        "Directamente al puerto veneciano. Reciba y reciba en la puerta de llegadas, firme con su nombre.",
      notes:
        "El acceso al casco antiguo está restringido a los residentes: llegamos al borde del puerto, a 3 minutos a pie de la mayoría de los hoteles.",
    },
    "chania-airport-to-rethymno": {
      blurb: "Al este por la E75 a lo largo de la costa norte, pasando la playa de Georgioupoli.",
      notes: "Una de nuestras rutas más fluidas: autopista hasta el final.",
    },
    "chania-airport-to-kissamos": {
      blurb:
        "La puerta de entrada a Balos y Falasarna. Oeste a través de Chania y hacia la península de Rodopou.",
      notes:
        "¿Se dirige a la salida del barco de Balos a la mañana siguiente? Cuéntanos: te aconsejaremos sobre la hora de recogida.",
    },
    "chania-airport-to-platanias": {
      blurb: "La animada franja de playa justo al oeste de la ciudad de Chania.",
      notes: "Carretera costera, vistas al mar la mayor parte del camino.",
    },
    "chania-airport-to-georgioupoli": {
      blurb: "La ciudad turística situada en la desembocadura del río, a medio camino de Rethymno.",
      notes: "Autopista directa, luego un breve ramal.",
    },
    "chania-airport-to-kolymbari": {
      blurb: "La costa oeste más tranquila: hogar del Grecotel Amirandes y Domes Zeen.",
      notes: "Carretera costera con vistas panorámicas a la bahía de Souda.",
    },
    "chania-airport-to-almyrida": {
      blurb: "La península de Apokoronas: calas tranquilas y tabernas familiares.",
      notes: "Corto recorrido panorámico por Kalyves y a lo largo de la costa.",
    },
    "chania-airport-to-falasarna": {
      blurb: "El lejano oeste: la playa al atardecer de Falasarna y sus antiguas ruinas.",
      notes: "Autopista y después carretera de montaña por la zona olivarera.",
    },
    "chania-airport-to-sougia": {
      blurb: "Cruza las Montañas Blancas hasta la tranquila costa sur.",
      notes: "Ruta sinuosa de montaña: espectacular, espere 90 minutos completos.",
    },
    "chania-airport-to-paleochora": {
      blurb: "La ciudad hippie en la costa suroeste.",
      notes: "Largo viaje por las montañas; si lo desea, realizamos una parada panorámica.",
    },
    "souda-port-to-chania-old-town": {
      blurb:
        "El ferry de la mañana desde El Pireo llega a las 06:00. Estamos allí, con el café en la mano.",
      notes: "Seguimos los horarios de ANEK y Minoan. Llegada retrasada, sin cargo.",
    },
    "rethymno-to-bali": {
      blurb: "Hacia el este a lo largo de la costa hasta las cuatro calas del pueblo de Bali.",
      notes: "Sencillo salto por autopista, descenso de diez minutos hasta el pueblo.",
    },
    "rethymno-to-panormo": {
      blurb: "El bonito pueblo pesquero al este de Rethymno.",
      notes: "Carretera costera hasta el final, el mar a la izquierda.",
    },
    "rethymno-to-plakias": {
      blurb: "Cruce hacia la costa sur por el desfiladero de Kourtaliotiko.",
      notes: "Carretera sinuosa del desfiladero: uno de los recorridos más bellos de la isla.",
    },
    "rethymno-to-agia-galini": {
      blurb: "Al sur, hasta el puerto en forma de anfiteatro de Agia Galini.",
      notes: "A través del valle de Amari y las estribaciones del monte Ida.",
    },
    "agios-nikolaos-to-elounda": {
      blurb: "El breve salto panorámico a la lujosa península de Elounda.",
      notes: "Calle junto a un acantilado con vistas panorámicas de la bahía de Mirabello.",
    },
    "agios-nikolaos-to-sitia": {
      blurb: "El lejano oriente: costa, monasterios y tranquilos pueblos pesqueros.",
      notes: "Nueva carretera nacional en la mayor parte del camino, luego el ramal costero.",
    },
    "agios-nikolaos-to-vai": {
      blurb: "Al palmeral de Vai, el único palmeral natural de Europa.",
      notes: "Viaje de un día largo; podemos esperar y regresar.",
    },
  },
  markets: {
    greece: {
      heroTitle: "Transporte privado en Grecia",
      heroBody:
        "Recogidas en aeropuertos, complejos turísticos insulares y ciudades continentales: precios fijos con choferes locales autorizados. Reserva instantánea en Creta; confirmación de cotización en otros lugares de Grecia.",
      metaTitle: "Traslados Privados en Grecia | Aeropuertos y Ciudades · TransferAround",
      metaDescription:
        "Traslados privados de precio fijo a través de Grecia: aeropuertos de Atenas, Creta, Cícladas, Jónico y Dodecaneso. Conductores locales con licencia, conocer y saludar, seguimiento de vuelos.",
      searchIntents: [
        "Traslado privado al aeropuerto en Grecia.",
        "Servicio de taxi en Grecia",
        "Paseos de ciudad a ciudad por Grecia",
        "Servicio de chófer en Grecia",
        "Traslados al aeropuerto de la isla.",
        "Traslados al puerto de ferry",
      ],
    },
    spain: {
      heroTitle: "Traslados privados en España",
      heroBody:
        "Traslados a aeropuertos y ciudades en toda España: confirmación de cotización con socios locales autorizados. Ampliando cobertura en Madrid, Barcelona, ​​Málaga e islas.",
      metaTitle: "Traslados Privados en España | Aeropuertos y Ciudades · TransferAround",
      metaDescription:
        "Solicite un traslado privado a precio fijo en España. Madrid, Barcelona, ​​Málaga y aeropuertos insulares: chóferes autorizados, Meet & Greet.",
      searchIntents: [
        "Traslado privado al aeropuerto en España.",
        "traslado al aeropuerto de madrid",
        "Chofer privado Barcelona",
        "Aeropuerto de Málaga a la Costa del Sol",
        "Traslado aeropuerto ibiza",
        "Paseos de ciudad a ciudad en España",
      ],
    },
    italy: {
      heroTitle: "Traslados privados en Italia",
      heroBody:
        "Traslados a aeropuertos, estaciones y ciudades en toda Italia: reserva basada en presupuesto con chóferes locales examinados. Primero los corredores de Roma, Milán, Venecia y Amalfi.",
      metaTitle: "Traslados Privados en Italia | Aeropuertos y Ciudades · TransferAround",
      metaDescription:
        "Solicite un traslado privado a precio fijo en Italia. Roma, Milán, Venecia y centros turísticos costeros: conductores con licencia, conozca y salude.",
      searchIntents: [
        "Traslado privado al aeropuerto en Italia.",
        "Traslado Roma Fiumicino",
        "Chofer de Milán Malpensa",
        "Traslado al aeropuerto de Venecia.",
        "Traslado privado a la costa de Amalfi.",
        "Paseos de ciudad a ciudad en Italia",
      ],
    },
  },
  marketHubs: {
    "madrid-barajas-airport-transfers-mad": {
      intro:
        "Solicite un traslado privado de precio fijo desde Madrid-Barajas (MAD) al centro de la ciudad, hoteles y pueblos de alrededor.",
      name: "Aeropuerto de Madrid-Barajas",
    },
    "barcelona-el-prat-airport-transfers-bcn": {
      intro:
        "Traslados privados desde Barcelona-El Prat (BCN) a la ciudad, Sitges y Costa Brava — confirmación de presupuesto con chóferes autorizados.",
      name: "Aeropuerto de Barcelona-El Prat",
    },
    "malaga-airport-transfers-agp": {
      intro:
        "Traslados al aeropuerto de la Costa del Sol desde Málaga (AGP) — Marbella, Torremolinos y más allá con un presupuesto fijo.",
      name: "Aeropuerto de Málaga",
    },
    "rome-fiumicino-airport-transfers-fco": {
      intro:
        "Traslados privados desde Roma Fiumicino (FCO) al centro histórico, zona del Vaticano y puerto de Civitavecchia.",
      name: "Aeropuerto de Roma Fiumicino",
    },
    "milan-malpensa-airport-transfers-mxp": {
      intro:
        "Traslados privados de Malpensa (MXP) a Milán, Como y Lago Mayor: presupuestos fijos, conductores autorizados.",
      name: "Aeropuerto de Milán Malpensa",
    },
    "venice-marco-polo-airport-transfers-vce": {
      intro:
        "Traslados en Venecia Marco Polo (VCE) a Piazzale Roma, Mestre e islas cercanas: vehículos privados con presupuesto.",
      name: "Aeropuerto Marco Polo de Venecia",
    },
    madrid: {
      intro: "Chóferes privados para hoteles, estaciones y excursiones de Madrid.",
      name: "Madrid",
    },
    barcelona: {
      intro: "Traslados ciudad y aeropuerto de Barcelona con presupuesto fijo.",
      name: "Barcelona",
    },
    malaga: { intro: "Traslados privados Málaga y Costa del Sol.", name: "Málaga" },
    rome: {
      intro: "Traslados privados Roma ciudad, aeropuerto y puerto de cruceros.",
      name: "Roma",
    },
    milan: {
      intro: "Distrito de la moda de Milán, aeropuertos y traslados a los lagos.",
      name: "Milán",
    },
    venice: {
      intro: "Traslados privados al aeropuerto y al hotel de Venecia y Véneto.",
      name: "Venecia",
    },
  },
  airports: {
    "crete-heraklion-airport-transfers-her": {
      name: "Aeropuerto de Creta Heraclión",
      alias: "Aeropuerto de Heraclión",
      intro:
        "El aeropuerto de Creta Heraklion se encuentra a sólo 4 km de la ciudad más grande de la isla. La reserva previa de un traslado privado TransferAround garantiza un conductor local con licencia esperando en llegadas con su nombre, sin colas de taxis ni aumento de precios.",
      terminals: "Terminal única para todas las llegadas y salidas.",
      pickupPoint: "Salida de la sala de equipajes de llegadas con cartel con su nombre.",
      cityDriveMin:
        "15 a 20 minutos en horas valle; hasta 30 min de 08:00 a 09:00 y de 17:00 a 19:00",
      tollsNote: "No hay peajes ni tarifas LEZ en las rutas de Creta a partir de HER.",
      knowBefore: [
        {
          title: "Terminal única, llegadas sencillas",
          body: "Una terminal maneja todos los vuelos. Después de recoger el equipaje, salga a la sala de llegadas, donde su conductor le espera con un cartel con su nombre. Espera de 60 minutos gratuita incluida por retrasos y equipaje.",
        },
        {
          title: "E75: 4 km, 15 a 20 minutos normalmente",
          body: "El aeropuerto se encuentra a 4 km del centro de Heraklion por la E75. Permitir hasta 30 minutos en las horas pico de viaje; no existe una ruta alternativa útil.",
        },
        {
          title: "Sin peajes ni cargos de carretera ocultos",
          body: "Creta no tiene carreteras de peaje ni zonas de bajas emisiones en este corredor. Su precio fijo TransferAround es el precio que usted paga.",
        },
        {
          title: "Alquiler privado con licencia y 24 horas al día, 7 días a la semana",
          body: "Los conductores poseen el permiso de conducir especial de Grecia para alquileres privados. Los traslados funcionan las 24 horas, incluso cuando los autobuses KTEL paran y las paradas de taxis se alargan.",
        },
      ],
      insights: [
        "El aeropuerto de Creta Heraklion opera un **single terminal**. Los pasajeros caminan o toman un autobús de plataforma corta hasta las llegadas, pasan por inmigración si es necesario, recogen las maletas y luego salen por el **arrivals baggage-hall exit**, el punto de encuentro para las recogidas en TransferAround. El estacionamiento para recogida a corto plazo es gratuito y está a un minuto a pie de la salida.",
        "El viaje al centro de la ciudad de Heraklion sigue la **E75** y recorre unos 4 km. El tiempo de puerta a puerta suele ser de 15 a 20 minutos; Los picos entre semana (08:00–09:00 y 17:00–19:00) pueden extenderse hasta 30 minutos. Toda la congestión se concentra en este corredor.",
        "Los autobuses urbanos KTEL (líneas 6, 11, 12) cuestan unos 2 €, pero circulan aproximadamente de 06:00 a medianoche y son incómodos con el equipaje. La parada de taxis suele costar entre 20 y 30 € con riesgo de cola. Un **pre-booked private transfer** bloquea la tarifa, incluye seguimiento de vuelos y encuentros y saludos, y elimina las conjeturas, especialmente para familias y personas que llegan tarde.",
      ],
      comparison: [
        {
          mode: "KTEL autobús público (líneas 6, 11, 12)",
          time: "15 minutos",
          cost: "2,00 euros",
          pros: "Barato; directo hacia la ciudad",
          cons: "Centrado en efectivo; horario limitado; hacinamiento de equipaje",
        },
        {
          mode: "Taxi desde la parada",
          time: "10-15 minutos en coche + cola",
          cost: "20-30 euros",
          pros: "Directo; 24/7",
          cons: "Colas; variación medida; sin seguimiento de vuelos",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "15-20 minutos",
          cost: "desde 40 euros",
          pros: "Precio fijo, Meet & Greet, espera de 60 minutos, sillas para niños bajo petición.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me esperará el conductor de TransferAround en el aeropuerto de Creta Heraklion?",
          a: "Su conductor lo recibirá en la salida de la sala de equipajes de llegadas con un cartel con su nombre. Sal detrás del equipaje y busca tu apellido.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Sí, completamente incluido. Creta no tiene peajes ni tarifas LEZ en las rutas urbanas HER; la tarifa reservada es definitiva.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Creta Heraklion Aeropuerto a Heraklion?",
          a: "Normalmente, entre 15 y 20 minutos por la E75. Los períodos pico entre semana pueden alcanzar los 30 minutos.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Creta Heraklion?",
          a: "Los taxis de parada son convenientes, pero las colas y las tarifas nocturnas añaden fricción. TransferAround fija precios y horarios con seguimiento de vuelos.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "HER tiene una terminal: todos los vuelos llegan al mismo edificio. Su conductor se actualiza si los horarios cambian.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Creta Heraklion cuentan con licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible TransferAround para llegadas nocturnas al aeropuerto de Creta Heraklion?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Creta Heraklion. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Creta Heraklion?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "chania-international-airport-transfers-chq": {
      name: "Aeropuerto Internacional de La Canea",
      alias: "Aeropuerto de La Canea",
      intro:
        "El aeropuerto de Chania es la puerta de entrada al oeste de Creta, a unos 14 km del puerto veneciano. TransferAround los conductores conocen los límites de bajada del casco antiguo y las carreteras de acceso al complejo desde Platanias a Kissamos.",
      terminals: "Terminal única.",
      pickupPoint: "Salida de la sala de llegadas con cartel con el nombre.",
      cityDriveMin: "20-30 minutos al casco antiguo de Chania",
      tollsNote:
        "No hay peajes en Creta. El puerto de Souda está cerca y ofrece conexiones en ferry.",
      knowBefore: [
        {
          title: "Llegadas compactas de una sola terminal",
          body: "Recoge las maletas y sal a la sala de llegadas. Su conductor espera con un cartel con su nombre; Se incluyen 60 minutos de tiempo de espera gratuito.",
        },
        {
          title: "14 km hasta el casco antiguo por carreteras costeras",
          body: "Espere entre 20 y 30 minutos, dependiendo del tráfico que atraviese Souda y el anillo de Chania. Las noches pico de verano añaden tiempo.",
        },
        {
          title: "Límites de vehículos en el casco antiguo",
          body: "Gran parte del núcleo del puerto es peatonal. Nos detendremos en el punto de acceso legal más cercano a su hotel; confirme la dirección al hacer la reserva.",
        },
        {
          title: "Ferry + aeropuerto el mismo día",
          body: "El puerto de Souda está a pocos minutos de la carretera del aeropuerto. Podemos conectar llegadas o salidas de ferry en el mismo itinerario como un complemento de cotización.",
        },
      ],
      insights: [
        "El aeropuerto de Chania (CHQ) es un centro estacional de terminal única para el oeste de Creta. Después de recoger el equipaje, salga a la sala de llegadas para TransferAround conocer y saludar. La explanada es compacta; Los conductores se paran cerca y envían mensajes cuando aterrice.",
        "El camino hacia Chania sigue el principal corredor costero pasando por la bahía de Souda. El trayecto puerta a puerta hasta el casco antiguo suele tardar entre 20 y 30 minutos. Las zonas turísticas del oeste (Platanias, Agia Marina) y del este (Georgioupoli, Almyrida) añaden tiempo, pero siguen siendo corredores de precio fijo en nuestro catálogo.",
        "Los autobuses KTEL existen, pero son poco frecuentes en comparación con las oleadas de vuelos chárter. Las paradas de taxis aumentan entre julio y agosto. **Private transfer** elimina el riesgo de colas y bloquea la tarifa antes de aterrizar, algo esencial para alquileres tardíos y entregas en villas en carreteras estrechas de pueblos.",
      ],
      comparison: [
        {
          mode: "KTEL entrenador",
          time: "30 a 40 minutos",
          cost: "2-3 euros",
          pros: "Barato",
          cons: "Horario limitado; problemas de equipaje",
        },
        {
          mode: "Taxi desde la parada",
          time: "20-30 minutos",
          cost: "25-35 euros",
          pros: "Directo",
          cons: "Cola + tarifa variable",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "20-30 minutos",
          cost: "desde 35 euros",
          pros: "Precio fijo, Meet & Greet, seguimiento de vuelos.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me esperará el conductor de TransferAround en el aeropuerto internacional de Chania?",
          a: "El conductor espera en la salida de la sala de llegadas con un cartel con su nombre después de recoger el equipaje.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Sin peajes en Creta. Su precio fijo incluye todos los costes de carretera en rutas estándar CHQ.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde el Aeropuerto Internacional de La Canea hasta La Canea?",
          a: "A unos 20-30 minutos del casco antiguo de Chania; los centros turísticos del oeste o del este tardan más; consulte las páginas de rutas para conocer los horarios exactos.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el Aeropuerto Internacional de La Canea?",
          a: "Los taxis de parada funcionan, pero en verano las colas son largas. Arreglamos el precio y rastreamos su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Terminal única: no hay que preocuparse por cambios de terminal.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el Aeropuerto Internacional de Chania tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible TransferAround para llegadas nocturnas al aeropuerto internacional de Chania?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto internacional de Chania. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto internacional de Chania?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "athens-airport-transfers-ath": {
      name: "Aeropuerto de Atenas",
      alias: "Aeropuerto Internacional de Atenas",
      intro:
        "El aeropuerto de Atenas maneja más de 30 millones de pasajeros al año en dos terminales. Los socios TransferAround le recibirán en la llegada con un cartel con su nombre, controlarán su vuelo e incluirán los peajes de las autopistas en el precio fijo.",
      terminals: "Terminal Principal y Terminal Satélite unidas por paso subterráneo.",
      pickupPoint: "Salida de la sala de equipajes de llegadas (planta baja)",
      cityDriveMin: "25 a 35 minutos en horas valle; Picos de 45 a 60 minutos entre semana",
      tollsNote:
        "Peaje Attiki Odos (~2,55€) y costes de la ZBE central incluidos en cotizaciones fijas.",
      knowBefore: [
        {
          title: "Dos terminales, un patrón de reunión",
          body: "Las terminales principal y satélite se conectan bajo tierra. Su conductor lo recibirá en la salida de la sala de llegadas de equipaje de la planta baja de la terminal en la que aterriza, sin recargo.",
        },
        {
          title: "Peaje Attiki Odos incluido",
          body: "El peaje de la A6 Attiki Odos y los costes de cumplimiento de la LEZ de Daktylios para el centro de Atenas están incluidos en su precio fijo de TransferAround.",
        },
        {
          title: "25-60 minutos al centro",
          body: "Los recorridos por la ciudad en horas valle tardan entre 25 y 35 minutos. Los picos entre semana (07:30–09:30, 17:00–19:30) suelen necesitar entre 45 y 60 minutos.",
        },
        {
          title: "El Pireo y Rafina listos",
          body: "Las conexiones de ferry a las islas son complementos populares: El Pireo, Rafina y Lavrio son corredores de cotización fija de ATH.",
        },
      ],
      insights: [
        "El artículo **Athens Airport (ATH)** divide las llegadas entre el pabellón A (no Schengen) y el pabellón B (Schengen/nacional) antes de una salida compartida de la sala de equipajes en la planta baja. TransferAround Los conductores esperan allí con un cartel con su nombre y se adaptan si su avión utiliza la Terminal Satélite.",
        "La ruta a Atenas utiliza la **A64** y luego la **A6 Attiki Odos**. Los peajes están incluidos en su cotización. La congestión máxima en Attiki Odos es la variable principal, no la elección de la terminal.",
        "La línea 3 del metro (~9€, ~40 min) y el autobús X95 (~5,50€, ~60 min) son más baratos pero molestos con el equipaje. Los taxis oficiales utilizan tarifas fijas publicadas día/noche, pero las colas se forman en oleadas. Un **private transfer** es la opción confiable puerta a puerta con seguimiento de vuelos y tarifa bloqueada.",
      ],
      comparison: [
        {
          mode: "Línea 3 del Metro",
          time: "~40 minutos",
          cost: "9 euros",
          pros: "Frecuente; asequible",
          cons: "Multitudes; estación camina con bolsas",
        },
        {
          mode: "Autobús expreso X95",
          time: "~60 minutos",
          cost: "5,50 euros",
          pros: "24 horas al día, 7 días a la semana; barato",
          cons: "Lento; mañanas llenas de gente",
        },
        {
          mode: "Taxi desde la parada",
          time: "30 a 60 minutos",
          cost: "40-55 euros",
          pros: "Puerta a puerta",
          cons: "Colas; banda fija pero espera variación",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "25 a 60 minutos",
          cost: "desde 45 euros",
          pros: "Cotización fija, Meet & Greet, peajes incluidos.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Atenas?",
          a: "Salida de la sala de equipajes de llegadas en la planta baja con un cartel con el nombre: Principal o Satélite, sin cargo adicional.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Sí. Attiki Odos y los costos LEZ relevantes están incluidos en el presupuesto confirmado.",
        },
        {
          q: "¿Cuánto tiempo suele tardar el viaje en coche desde el Aeropuerto de Atenas a Atenas?",
          a: "25 a 35 minutos fuera de las horas pico hasta el centro de Atenas; calcule entre 45 y 60 minutos en las horas pico de los días laborables.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Atenas?",
          a: "Los taxis oficiales utilizan bandas planas día/noche, pero las colas pueden ser largas. Eliminamos la espera y confirmamos el precio antes de que aterrices.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Sin recargo si aterriza en Satellite vs Main: el conductor se actualiza a partir de los datos de su vuelo.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Atenas tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible TransferAround para llegadas nocturnas al aeropuerto de Atenas?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Atenas. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Atenas?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "thessaloniki-airport-transfers-skg": {
      name: "Aeropuerto de Tesalónica",
      alias: "Aeropuerto de Macedonia",
      intro:
        "El aeropuerto de Tesalónica es el segundo centro más transitado de Grecia. Los socios de TransferAround cubren ambas terminales con Meet & Greet y cotizaciones fijas en la ciudad y los centros turísticos de Halkidiki.",
      terminals: "T1 y T2 unidas por pasillo interno.",
      pickupPoint: "Llegadas salida de la sala de equipajes",
      cityDriveMin: "25-35 minutos al centro de la ciudad",
      tollsNote: "No hay peajes importantes en el trayecto estándar SKG-ciudad.",
      knowBefore: [
        {
          title: "Dos terminales, una lógica de captación",
          body: "T1 y T2 se conectan en interiores. Su conductor lo recibirá en la salida de la sala de llegadas de equipaje de su terminal.",
        },
        {
          title: "25-35 minutos al centro",
          body: "El acceso costero a Salónica suele tardar menos de 35 minutos fuera de las horas punta de viaje.",
        },
        {
          title: "Pasillos de Halkidiki",
          body: "Los centros turísticos de Kassandra y Sithonia son rutas cotizadas populares: recorridos fijos más largos con vehículos aptos para equipaje.",
        },
        {
          title: "Llegadas nocturnas cubiertas",
          body: "Las escapadas a ciudades y chárter suelen llegar tarde. Cobertura 24 horas al día, 7 días a la semana con seguimiento de vuelos está incluida en cada cotización.",
        },
      ],
      insights: [
        "SKG opera **T1 and T2** con un patrón de llegadas compartido. Después de inmigración y maletas, salga al punto de encuentro de la sala de equipajes, donde los conductores de TransferAround sostienen un cartel con su nombre.",
        "Los traslados a la ciudad siguen la carretera principal del aeropuerto hacia Tesalónica. El tiempo de puerta a puerta suele ser de 25 a 35 minutos. Halkidiki añade una distancia significativa, pero sigue siendo un caso de uso central.",
        "Los autobuses existen pero son incómodos con el equipaje. Los taxis de parada están disponibles con riesgo de colas en las horas pico. **Private transfer** fija precios y horarios para familias y viajeros de negocios.",
      ],
      comparison: [
        {
          mode: "Autobús público",
          time: "40-50 minutos",
          cost: "2 euros",
          pros: "Barato",
          cons: "Transferencias; equipaje",
        },
        {
          mode: "Taxi desde la parada",
          time: "25-35 minutos",
          cost: "25-35 euros",
          pros: "Directo",
          cons: "Cola; variable",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "25-35 minutos",
          cost: "desde 35 euros",
          pros: "Cotización fija, Meet & Greet, seguimiento de vuelos.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Tesalónica?",
          a: "Salida de la sala de equipajes de llegadas en la T1 o T2 con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Las rutas urbanas estándar no tienen peajes importantes; Se incluyen todos los cargos por carretera en cotizaciones más largas.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde el Aeropuerto de Tesalónica a Tesalónica?",
          a: "Aproximadamente entre 25 y 35 minutos hasta el centro de Tesalónica con tráfico normal.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Tesalónica?",
          a: "Hay taxis disponibles, pero las horas pico crean colas. Confirmamos tarifa y monitoreamos su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "El conductor sigue la asignación de terminales en tiempo real entre la T1 y la T2 sin coste adicional.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Tesalónica poseen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible el TransferAround para llegadas nocturnas al aeropuerto de Tesalónica?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Tesalónica. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Tesalónica?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "mykonos-airport-transfers-jmk": {
      name: "Aeropuerto de Mikonos",
      alias: "Aeropuerto de Mikonos",
      intro:
        "El aeropuerto de Mykonos (JMK) está a pocos minutos de Ornos y Platys Yialos. Las colas en las paradas de taxis en verano son notorias: reserve con antelación un traslado privado TransferAround por un presupuesto fijo y conozca y salude.",
      terminals: "Terminal compacto único.",
      pickupPoint: "Salida de llegadas con cartel con el nombre.",
      cityDriveMin: "10-20 minutos a la ciudad de Mykonos",
      tollsNote: "No hay peajes en Mykonos.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta la ciudad de Mykonos",
          body: "10-20 minutos a la ciudad de Mykonos. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        { title: "Carretera local y cargos", body: "No hay peajes en Mykonos." },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Mykonos tienen licencias griegas válidas de alquiler privado y conocen las carreteras de acceso a los hoteles en Mykonos.",
        },
      ],
      insights: [
        "El aeropuerto de Mykonos (JMK) sirve a Mykonos. El aeropuerto de Mykonos (JMK) está a pocos minutos de Ornos y Platys Yialos. Las colas en las paradas de taxis en verano son notorias: reserve con antelación un traslado privado TransferAround por un presupuesto fijo y conozca y salude.",
        "Carreteras estrechas de la isla y bajadas de centros turísticos. Las paradas de taxis aumentan entre julio y agosto.",
        "Las alternativas incluyen los escasos autobuses públicos y las paradas de taxis, ya que los autobuses son limitados y hostiles al equipaje. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "10-20 minutos a la ciudad de Mykonos",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "10-20 minutos a la ciudad de Mykonos",
          cost: "desde 35 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Mykonos?",
          a: "Su conductor espera en la salida de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "No hay peajes en Mykonos. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde el Aeropuerto de Mykonos a la ciudad de Mykonos?",
          a: "10-20 minutos desde la ciudad de Mykonos hasta la ciudad de Mykonos.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Mykonos?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Terminal compacto único. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Mykonos tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible TransferAround para llegadas nocturnas al aeropuerto de Mykonos?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Mykonos. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Mykonos?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "santorini-airport-transfers-jtr": {
      name: "Aeropuerto de Santorini",
      alias: "Aeropuerto de Santorini",
      intro:
        "El aeropuerto de Santorini (JTR) alimenta a Fira, Oia, Kamari y Perissa. TransferAround los presupuestos cubren hoteles en lo alto de acantilados con notas claras de devolución en zonas peatonales.",
      terminals: "Terminal única.",
      pickupPoint: "Sala de llegadas con cartel con el nombre.",
      cityDriveMin: "15-25 minutos hasta Fira",
      tollsNote: "Sin peajes; Los hoteles de caldera pueden necesitar caminar los últimos metros.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround le espera en la sala de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta Fira",
          body: "15-25 minutos hasta Fira. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        {
          title: "Carretera local y cargos",
          body: "Sin peajes; Los hoteles de caldera pueden necesitar caminar los últimos metros.",
        },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Santorini tienen licencias griegas válidas de alquiler privado y conocen las carreteras de acceso a los hoteles en Santorini.",
        },
      ],
      insights: [
        "El aeropuerto de Santorini (JTR) sirve a Santorini. El aeropuerto de Santorini (JTR) alimenta a Fira, Oia, Kamari y Perissa. TransferAround los presupuestos cubren hoteles en lo alto de acantilados con notas claras de devolución en zonas peatonales.",
        "Los recorridos por Oia tardan más en el tráfico pico al atardecer. Los transbordadores compartidos hacen múltiples paradas.",
        "Las alternativas incluyen los escasos autobuses públicos y las paradas de taxis que transportan el puerto de Athinios a un corredor separado. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "15-25 minutos hasta Fira",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "15-25 minutos hasta Fira",
          cost: "desde 45 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me esperará el conductor TransferAround en el aeropuerto de Santorini?",
          a: "Su conductor espera en la sala de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Sin peajes; Los hoteles de caldera pueden necesitar caminar los últimos metros. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde el Aeropuerto de Santorini a Firá?",
          a: "15-25 minutos de Fira a Fira.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Santorini?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Santorini tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible TransferAround para llegadas nocturnas al aeropuerto de Santorini?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Santorini. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Santorini?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "corfu-international-airport-transfers-cfu": {
      name: "Aeropuerto de Corfú",
      alias: "Aeropuerto de Corfú",
      intro:
        "El aeropuerto de Corfú se encuentra a unos 2 km de la ciudad de Corfú. Los socios TransferAround cubren Paleokastritsa, Dassia, Kavos y la costa norte con cotizaciones fijas.",
      terminals: "Terminal única cerca de la ciudad.",
      pickupPoint: "Salida de llegadas con cartel con el nombre.",
      cityDriveMin: "10-15 minutos a la ciudad de Corfú",
      tollsNote: "No hay peajes en Corfú.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta la ciudad de Corfú",
          body: "10-15 minutos a la ciudad de Corfú. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        { title: "Carretera local y cargos", body: "No hay peajes en Corfú." },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Corfú tienen licencias griegas válidas de alquiler privado y conocen las carreteras de acceso a los hoteles en Corfú.",
        },
      ],
      insights: [
        "El aeropuerto de Corfú (CFU) sirve a Corfú. El aeropuerto de Corfú se encuentra a unos 2 km de la ciudad de Corfú. Los socios TransferAround cubren Paleokastritsa, Dassia, Kavos y la costa norte con cotizaciones fijas.",
        "Recorrido urbano extremadamente corto. Resort sur/norte agregue de 30 a 60 minutos.",
        "Las alternativas incluyen los escasos autobuses públicos y las paradas de taxis, que existen pero no llegan a muchas direcciones de villas. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "10-15 minutos a la ciudad de Corfú",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "10-15 minutos a la ciudad de Corfú",
          cost: "desde 30 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Corfú?",
          a: "Su conductor espera en la salida de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "No hay peajes en Corfú. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde el Aeropuerto de Corfú a la ciudad de Corfú?",
          a: "De 10 a 15 minutos de la ciudad de Corfú a la ciudad de Corfú.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Corfú?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Terminal única cerca de la ciudad. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Corfú tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible el TransferAround para llegadas nocturnas al aeropuerto de Corfú?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Corfú. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Corfú?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "rhodes-airport-transfers-rho": {
      name: "Aeropuerto de Rodas",
      alias: "Aeropuerto de Rodas",
      intro:
        "El aeropuerto de Rodas (RHO) es el centro del Dodecaneso. TransferAround cubre la ciudad medieval, Faliraki, Lindos y los centros turísticos de la costa oeste con cotizaciones fijas.",
      terminals: "Terminal única.",
      pickupPoint: "Sala de llegadas con cartel con el nombre.",
      cityDriveMin: "20-30 minutos a la ciudad de Rodas",
      tollsNote: "No hay peajes en Rodas.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround le espera en la sala de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta la ciudad de Rodas",
          body: "20-30 min hasta la ciudad de Rodas. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        { title: "Carretera local y cargos", body: "No hay peajes en Rodas." },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Rodas tienen licencias de alquiler privadas griegas válidas y conocen las carreteras de acceso a los hoteles en Rodas.",
        },
      ],
      insights: [
        "El aeropuerto de Rodas (RHO) sirve a Rodas. El aeropuerto de Rodas (RHO) es el centro del Dodecaneso. TransferAround cubre la ciudad medieval, Faliraki, Lindos y los centros turísticos de la costa oeste con cotizaciones fijas.",
        "Lindos es un recorrido panorámico más largo. Se forman colas de taxis en los bancos charter.",
        "Las alternativas incluyen los escasos autobuses públicos y paradas de taxis que ktel cubre únicamente los principales centros turísticos. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "20-30 minutos a la ciudad de Rodas",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "20-30 minutos a la ciudad de Rodas",
          cost: "desde 35 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Rodas?",
          a: "Su conductor espera en la sala de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "No hay peajes en Rodas. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde el Aeropuerto de Rodas a La ciudad de Rodas?",
          a: "20-30 minutos desde la ciudad de Rodas hasta la ciudad de Rodas.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Rodas?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Rodas poseen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible el TransferAround para llegadas nocturnas al aeropuerto de Rodas?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Rodas. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Rodas?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "zakynthos-airport-transfers-zth": {
      name: "Aeropuerto de Zante",
      alias: "Aeropuerto de Zante",
      intro:
        "El aeropuerto de Zakynthos (ZTH) se encuentra cerca de Laganas. Las cotizaciones TransferAround cubren ciudades, Tsilivi y zonas turísticas con seguimiento de vuelos para vuelos chárter tardíos.",
      terminals: "Terminal única.",
      pickupPoint: "Salida de llegadas con cartel con el nombre.",
      cityDriveMin: "15-25 minutos a la ciudad de Zante",
      tollsNote: "Sin peajes.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta la ciudad de Zakynthos",
          body: "15-25 minutos a la ciudad de Zante. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        { title: "Carretera local y cargos", body: "Sin peajes." },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Zakynthos tienen licencias griegas válidas de alquiler privado y conocen las carreteras de acceso a los hoteles en Zakynthos.",
        },
      ],
      insights: [
        "El aeropuerto de Zakynthos (ZTH) sirve a Zakynthos. El aeropuerto de Zakynthos (ZTH) se encuentra cerca de Laganas. Las cotizaciones TransferAround cubren ciudades, Tsilivi y zonas turísticas con seguimiento de vuelos para vuelos chárter tardíos.",
        "Laganás es el más cercano. Los centros turísticos del norte tardan más.",
        "Las alternativas incluyen los escasos autobuses públicos y las paradas de taxis, que son poco frecuentes durante la noche. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "15-25 minutos a la ciudad de Zante",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "15-25 minutos a la ciudad de Zante",
          cost: "desde 30 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Zakynthos?",
          a: "Su conductor espera en la salida de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Sin peajes. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo se tarda en llegar desde Aeropuerto de Zakynthos a Ciudad de Zakynthos?",
          a: "15-25 minutos desde la ciudad de Zakynthos hasta la ciudad de Zakynthos.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Zante?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Zakynthos poseen licencias griegas válidas para el transporte privado de pasajeros, están completamente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible el TransferAround para llegadas nocturnas al aeropuerto de Zakynthos?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Zakynthos. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Zakynthos?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "kefalonia-airport-transfers-efl": {
      name: "Aeropuerto de Cefalonia",
      alias: "Aeropuerto de Cefalonia",
      intro:
        "El aeropuerto de Cefalonia (EFL) está cerca de Argostoli. TransferAround cubre las conexiones de ferry de Lixouri y los centros turísticos de la costa sur con tarifas fijas.",
      terminals: "Terminal única.",
      pickupPoint: "Sala de llegadas con cartel con el nombre.",
      cityDriveMin: "15-25 minutos a Argostoli",
      tollsNote: "Sin peajes; Carreteras de montaña a Skala/Lixouri.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround le espera en la sala de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta Argostoli",
          body: "15-25 minutos hasta Argostoli. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        {
          title: "Carretera local y cargos",
          body: "Sin peajes; Carreteras de montaña a Skala/Lixouri.",
        },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Cefalonia tienen licencias griegas válidas de alquiler privado y conocen las carreteras de acceso a los hoteles en Cefalonia.",
        },
      ],
      insights: [
        "El Aeropuerto de Cefalonia (EFL) sirve a Cefalonia. El aeropuerto de Cefalonia (EFL) está cerca de Argostoli. TransferAround cubre las conexiones de ferry de Lixouri y los centros turísticos de la costa sur con tarifas fijas.",
        "Carreteras sinuosas: permita la amortiguación. El ferry a Lixouri está separado.",
        "Las alternativas incluyen los escasos autobuses públicos y las paradas de taxis que los taxis limitan a altas horas de la noche. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "15-25 minutos a Argostoli",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "15-25 minutos a Argostoli",
          cost: "desde 40 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me esperará el conductor de TransferAround en el aeropuerto de Cefalonia?",
          a: "Su conductor espera en la sala de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Sin peajes; Carreteras de montaña a Skala/Lixouri. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Cefalonia a Argostoli?",
          a: "15-25 minutos de Argostoli a Argostoli.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Cefalonia?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Cefalonia tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible el TransferAround para llegadas nocturnas al aeropuerto de Cefalonia?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Cefalonia. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Cefalonia?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "kos-airport-transfers-kgs": {
      name: "Aeropuerto de Cos",
      alias: "Aeropuerto de Cos",
      intro:
        "El aeropuerto de Kos (KGS) está tierra adentro. Las cotizaciones TransferAround cubren la ciudad de Kos, Kardamena y Mastichari con Meet & Greet.",
      terminals: "Terminal única.",
      pickupPoint: "Salida de llegadas con cartel con el nombre.",
      cityDriveMin: "25-35 minutos a la ciudad de Kos",
      tollsNote: "Sin peajes.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta la ciudad de Kos",
          body: "25-35 minutos hasta la ciudad de Kos. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        { title: "Carretera local y cargos", body: "Sin peajes." },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Kos tienen licencias griegas válidas de alquiler privado y conocen las carreteras de acceso a los hoteles en Kos.",
        },
      ],
      insights: [
        "El Aeropuerto de Kos (KGS) sirve a Kos. El aeropuerto de Kos (KGS) está tierra adentro. Las cotizaciones TransferAround cubren la ciudad de Kos, Kardamena y Mastichari con Meet & Greet.",
        "La ciudad no está adyacente al aeropuerto. Tráfico de verano en la carretera principal.",
        "Las alternativas incluyen los escasos autobuses públicos y las paradas de taxis que los autobuses pasan por alto en muchos hoteles. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "25-35 minutos a la ciudad de Kos",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "25-35 minutos a la ciudad de Kos",
          cost: "desde 35 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Kos?",
          a: "Su conductor espera en la salida de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Sin peajes. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde el Aeropuerto de Kos a la ciudad de Kos?",
          a: "25-35 minutos desde la ciudad de Kos hasta la ciudad de Kos.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Kos?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Kos tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible el TransferAround para llegadas nocturnas al aeropuerto de Kos?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Kos. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Kos?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "aktion-lefkada-airport-transfers-pvk": {
      name: "Aeropuerto Aktion Lefkada",
      alias: "Aeropuerto Aktion Lefkada",
      intro:
        "Aktion (PVK) sirve a Lefkada desde el continente. TransferAround los conductores cruzan a la ciudad de Lefkada, Nikiana y Vassiliki con tarifas fijas.",
      terminals: "Terminal única en costa continental.",
      pickupPoint: "Sala de llegadas con cartel con el nombre.",
      cityDriveMin: "30-40 min hasta la ciudad de Lefkada por la calzada elevada",
      tollsNote: "Puente/calzada elevada: no hay peajes sorpresa en nuestras cotizaciones.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround le espera en la sala de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta la ciudad de Lefkada",
          body: "De 30 a 40 minutos hasta la ciudad de Lefkada por la calzada elevada. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        {
          title: "Carretera local y cargos",
          body: "Puente/calzada elevada: no hay peajes sorpresa en nuestras cotizaciones.",
        },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto Aktion Lefkada tienen licencias griegas de alquiler privado válidas y conocen las carreteras de acceso a los hoteles en Lefkada.",
        },
      ],
      insights: [
        "El Aeropuerto Aktion Lefkada (PVK) sirve a Lefkada. Aktion (PVK) sirve a Lefkada desde el continente. TransferAround los conductores cruzan a la ciudad de Lefkada, Nikiana y Vassiliki con tarifas fijas.",
        "Se sale de la terminal por el lado continental. Tráfico por calzada en picos.",
        "Las alternativas incluyen autobuses públicos escasos y paradas de taxis ideales en lugar de esperar transporte compartido. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "30-40 min hasta la ciudad de Lefkada por la calzada elevada",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "30-40 min hasta la ciudad de Lefkada por la calzada elevada",
          cost: "desde 45 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me esperará el conductor de TransferAround en el aeropuerto Aktion Lefkada?",
          a: "Su conductor espera en la sala de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Puente/calzada elevada: no hay peajes sorpresa en nuestras cotizaciones. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aktion Lefkada Airport hasta Lefkada Town?",
          a: "30 a 40 minutos hasta la ciudad de Lefkada por la calzada hasta la ciudad de Lefkada.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto Aktion Lefkada?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Terminal única en costa continental. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto Aktion Lefkada tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible el TransferAround para llegadas nocturnas al aeropuerto Aktion Lefkada?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto Aktion Lefkada. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto Aktion Lefkada?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "paros-airport-transfers-pas": {
      name: "Aeropuerto de Paros",
      alias: "Aeropuerto de Paros",
      intro:
        "El aeropuerto de Paros (PAS) está a pocos minutos de Parikia. TransferAround cubre Naoussa y los centros turísticos de playa con cotizaciones fijas, mejor que buscar taxis tras los que visitan las islas.",
      terminals: "Pequeño terminal único.",
      pickupPoint: "Salida de llegadas con cartel con el nombre.",
      cityDriveMin: "10-15 minutos a Parikia",
      tollsNote: "Sin peajes.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta Parikia",
          body: "De 10 a 15 minutos hasta Parikia. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        { title: "Carretera local y cargos", body: "Sin peajes." },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Paros tienen licencias griegas válidas de alquiler privado y conocen las carreteras de acceso a los hoteles en Paros.",
        },
      ],
      insights: [
        "El aeropuerto de Paros (PAS) sirve a Paros. El aeropuerto de Paros (PAS) está a pocos minutos de Parikia. TransferAround cubre Naoussa y los centros turísticos de playa con cotizaciones fijas, mejor que buscar taxis tras los que visitan las islas.",
        "Terminal pequeña, salida rápida. Naoussa agrega ~20 minutos.",
        "Las alternativas incluyen los escasos autobuses públicos y las paradas de taxis que funcionan escasamente por las noches. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "10-15 minutos a Parikia",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "10-15 minutos a Parikia",
          cost: "desde 35 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Paros?",
          a: "Su conductor espera en la salida de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Sin peajes. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde el Aeropuerto de Paros hasta Parikia?",
          a: "10-15 minutos de Parikia a Parikia.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Paros?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Pequeño terminal único. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Paros poseen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible el TransferAround para llegadas nocturnas al aeropuerto de Paros?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Paros. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Paros?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "naxos-airport-transfers-jnx": {
      name: "Aeropuerto de Naxos",
      alias: "Aeropuerto de Naxos",
      intro:
        "El aeropuerto de Naxos (JNX) se encuentra en la costa oeste. Las cotizaciones TransferAround cubren Chora y Agia Anna con encuentros para familias e invitados de la villa.",
      terminals: "Pequeño terminal único.",
      pickupPoint: "Salida de llegadas con cartel con el nombre.",
      cityDriveMin: "10-15 minutos a Chora",
      tollsNote: "Sin peajes.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta la ciudad de Naxos (Chora)",
          body: "10-15 minutos hasta Chora. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        { title: "Carretera local y cargos", body: "Sin peajes." },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Naxos tienen licencias griegas válidas de alquiler privado y conocen las carreteras de acceso a los hoteles en Naxos.",
        },
      ],
      insights: [
        "El Aeropuerto de Naxos (JNX) sirve a Naxos. El aeropuerto de Naxos (JNX) se encuentra en la costa oeste. Las cotizaciones TransferAround cubren Chora y Agia Anna con encuentros para familias e invitados de la villa.",
        "Carreras cortas hasta Chora. Las playas del sur tardan más.",
        "Las alternativas incluyen los escasos autobuses públicos y las paradas de taxis que limitaban los taxis que llegaban tarde. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "10-15 minutos a Chora",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "10-15 minutos a Chora",
          cost: "desde 30 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Naxos?",
          a: "Su conductor espera en la salida de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Sin peajes. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde el Aeropuerto de Naxos a la ciudad de Naxos (Chora)?",
          a: "10-15 minutos desde Chora hasta la ciudad de Naxos (Chora).",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Naxos?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Pequeño terminal único. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Naxos poseen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible el TransferAround para llegadas nocturnas al aeropuerto de Naxos?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Naxos. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Naxos?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "milos-airport-transfers-mlo": {
      name: "Aeropuerto de Milo",
      alias: "Aeropuerto de Milo",
      intro:
        "El aeropuerto de Milos (MLO) conecta con el puerto de Adamas y Plaka. TransferAround Las cotizaciones fijas superan la espera de los escasos taxis después de llegar por la tarde.",
      terminals: "Pequeño terminal único.",
      pickupPoint: "Salida de llegadas con cartel con el nombre.",
      cityDriveMin: "15-20 minutos a Adamas",
      tollsNote: "Sin peajes; caminos del pueblo a Plaka.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta Adamas",
          body: "15-20 minutos hasta Adamas. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        { title: "Carretera local y cargos", body: "Sin peajes; caminos del pueblo a Plaka." },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Milos tienen licencias de alquiler privadas griegas válidas y conocen las carreteras de acceso a los hoteles en Milos.",
        },
      ],
      insights: [
        "El Aeropuerto de Milo (MLO) sirve a Milo. El aeropuerto de Milos (MLO) conecta con el puerto de Adamas y Plaka. TransferAround Las cotizaciones fijas superan la espera de los escasos taxis después de llegar por la tarde.",
        "Red de islas compactas. Las carreteras de la colina de Plaka son estrechas.",
        "Las alternativas incluyen los escasos autobuses públicos y paradas de taxis que ofrecen conexiones portuarias disponibles. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "15-20 minutos a Adamas",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "15-20 minutos a Adamas",
          cost: "desde 35 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Milo?",
          a: "Su conductor espera en la salida de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Sin peajes; caminos del pueblo a Plaka. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo se tarda en llegar desde Aeropuerto de Milo hasta Adamas?",
          a: "15-20 minutos de Adamas a Adamas.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Milo?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Pequeño terminal único. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Milos tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible el TransferAround para llegadas nocturnas al aeropuerto de Milo?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Milos. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Milo?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "mytilene-airport-transfers-mjt": {
      name: "Aeropuerto de Mitilene",
      alias: "Aeropuerto de Mitilene",
      intro:
        "El aeropuerto de Mitilene (MJT) está cerca de la capital, Lesbos. Las cotizaciones TransferAround cubren Mitilene y la costa norte de Molyvos.",
      terminals: "Terminal única.",
      pickupPoint: "Sala de llegadas con cartel con el nombre.",
      cityDriveMin: "10-15 minutos a Mitilene",
      tollsNote: "Sin peajes; recorridos más largos hasta Molyvos.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround le espera en la sala de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje a Mitilene",
          body: "10 a 15 minutos hasta Mitilene. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        {
          title: "Carretera local y cargos",
          body: "Sin peajes; recorridos más largos hasta Molyvos.",
        },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Mitilene tienen licencias griegas válidas de alquiler privado y conocen las carreteras de acceso a los hoteles en Lesbos.",
        },
      ],
      insights: [
        "El Aeropuerto de Mitilene (MJT) sirve a Lesbos. El aeropuerto de Mitilene (MJT) está cerca de la capital, Lesbos. Las cotizaciones TransferAround cubren Mitilene y la costa norte de Molyvos.",
        "Traslado corto a la ciudad. Molyvos es un recorrido panorámico más largo.",
        "Las alternativas incluyen los escasos autobuses públicos y las paradas de taxis que los autobuses limitan para el equipaje. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "10-15 minutos a Mitilene",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "10-15 minutos a Mitilene",
          cost: "desde 35 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Mitilene?",
          a: "Su conductor espera en la sala de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Sin peajes; recorridos más largos hasta Molyvos. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo se tarda en llegar desde Aeropuerto de Mitilene a Mitilene?",
          a: "De 10 a 15 minutos de Mitilene a Mitilene.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Mitilene?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Mitilene tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible el TransferAround para llegadas nocturnas al aeropuerto de Mitilene?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Mitilene. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Mitilene?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "sitia-airport-transfers-jsh": {
      name: "Aeropuerto de Sitía",
      alias: "Aeropuerto de Sitía",
      intro:
        "El aeropuerto de Sitia (JSH) sirve al este de Creta. TransferAround ofrece precios instantáneos de Creta donde se catalogan y cotizaciones para entregas de villas hacia Vai y la costa sureste.",
      terminals: "Pequeño terminal único.",
      pickupPoint: "Salida de llegadas con cartel con el nombre.",
      cityDriveMin: "10-15 minutos a la ciudad de Sitía",
      tollsNote: "No hay peajes en el este de Creta.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje a Sitía",
          body: "10-15 minutos hasta la ciudad de Sitía. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        { title: "Carretera local y cargos", body: "No hay peajes en el este de Creta." },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el aeropuerto de Sitia tienen licencias griegas válidas de alquiler privado y conocen las carreteras de acceso a hoteles en Creta.",
        },
      ],
      insights: [
        "El aeropuerto de Sitia (JSH) sirve a Creta. El aeropuerto de Sitia (JSH) sirve al este de Creta. TransferAround ofrece precios instantáneos de Creta donde se catalogan y cotizaciones para entregas de villas hacia Vai y la costa sureste.",
        "Alternativa tranquila a HER para los centros turísticos del este. Menos vuelos: reserve conductores con anticipación.",
        "Las alternativas incluyen los escasos autobuses públicos y las paradas de taxis disponibles que conectan con Ierapetra. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "10-15 minutos a la ciudad de Sitía",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "10-15 minutos a la ciudad de Sitía",
          cost: "desde 40 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Sitía?",
          a: "Su conductor espera en la salida de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "No hay peajes en el este de Creta. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde el Aeropuerto de Sitía a Sitía?",
          a: "De 10 a 15 minutos desde la ciudad de Sitía hasta Sitía.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Sitía?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Pequeño terminal único. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el aeropuerto de Sitía tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible TransferAround para llegadas nocturnas al aeropuerto de Sitía?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto de Sitía. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el aeropuerto de Sitía?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
    "kalamata-international-airport-transfers-klx": {
      name: "Aeropuerto Internacional de Kalamata",
      alias: "Aeropuerto Internacional de Kalamata",
      intro:
        "El Aeropuerto Internacional de Kalamata (KLX) es la puerta de entrada a los vuelos chárter del Peloponeso. Los socios TransferAround incluyen el peaje A7 en su presupuesto fijo y le recibirán en la salida de la sala de equipajes.",
      terminals: "Terminal única y moderna.",
      pickupPoint: "Salida de la sala de equipajes de llegadas con cartel con su nombre.",
      cityDriveMin: "15-25 min por la A7 hasta el centro de la ciudad",
      tollsNote: "Peajes de la Autopista A7 de Moreas incluidos en cotizaciones fijas.",
      knowBefore: [
        {
          title: "Conocer y saludar en llegadas",
          body: "Su conductor TransferAround le espera en la salida de la sala de equipajes de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje.",
        },
        {
          title: "Tiempo de viaje hasta Kalamata",
          body: "15-25 min por la A7 hasta el centro de la ciudad. El monitoreo de tráfico y vuelos en tiempo real ajusta el horario de recogida.",
        },
        {
          title: "Carretera local y cargos",
          body: "Peajes de la Autopista A7 de Moreas incluidos en cotizaciones fijas.",
        },
        {
          title: "Choferes locales con licencia",
          body: "Los conductores asociados en el Aeropuerto Internacional de Kalamata tienen licencias griegas válidas de alquiler privado y conocen las carreteras de acceso a hoteles en todo el Peloponeso.",
        },
      ],
      insights: [
        "El Aeropuerto Internacional de Kalamata (KLX) sirve al Peloponeso. El Aeropuerto Internacional de Kalamata (KLX) es la puerta de entrada a los vuelos chárter del Peloponeso. Los socios TransferAround incluyen el peaje A7 en su presupuesto fijo y le recibirán en la salida de la sala de equipajes.",
        "A7 es el corredor principal. Las tardes de mayor actividad entre semana añaden tiempo.",
        "Las alternativas incluyen los escasos autobuses públicos y las paradas de taxis, cuyas llegadas son limitadas. Un **pre-booked  transfer** bloquea su tarifa, incluye bienvenida y monitoreo de vuelos, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos.",
      ],
      comparison: [
        {
          mode: "Autobús público / KTEL",
          time: "Varía",
          cost: "2-5 euros",
          pros: "Más barato",
          cons: "Horario limitado; equipaje dificil",
        },
        {
          mode: "Taxi desde la parada",
          time: "15-25 min por la A7 hasta el centro de la ciudad",
          cost: "Medido/variable",
          pros: "Directo si está disponible",
          cons: "Colas; incertidumbre de precios",
        },
        {
          mode: "TransferAround transferencia privada",
          time: "15-25 min por la A7 hasta el centro de la ciudad",
          cost: "desde 35 euros",
          pros: "Presupuesto fijo, Meet & Greet, espera de 60 minutos, sillas para niños.",
          cons: "Reserva con antelación",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me esperará el conductor de TransferAround en el Aeropuerto Internacional de Kalamata?",
          a: "Su conductor espera en la salida de la sala de equipajes de llegadas con un cartel con su nombre.",
        },
        {
          q: "¿Están incluidos los peajes y las tasas de circulación en el precio TransferAround?",
          a: "Peajes de la Autopista A7 de Moreas incluidos en cotizaciones fijas. Confirmado en su cotización: sin extras sorpresa en la carretera.",
        },
        {
          q: "¿Cuánto tiempo se tarda en llegar desde Aeropuerto Internacional de Kalamata a Kalamata?",
          a: "15-25 min por la A7 hasta el centro de la ciudad hasta Kalamata.",
        },
        {
          q: "¿En qué se diferencia TransferAround de los taxis en el Aeropuerto Internacional de Kalamata?",
          a: "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          a: "Terminal única y moderna. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios.",
        },
        {
          q: "¿Tienen los conductores TransferAround licencias griegas de alquiler privado?",
          a: "Sí. Los conductores asociados que operan en el Aeropuerto Internacional de Kalamata tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto.",
        },
        {
          q: "¿Está disponible TransferAround para llegadas nocturnas al Aeropuerto Internacional de Kalamata?",
          a: "Sí. Los traslados funcionan las 24 horas, los 7 días de la semana en el aeropuerto internacional de Kalamata. Reserva con antelación con tu número de vuelo y el conductor monitoriza tu llegada en tiempo real.",
        },
        {
          q: "¿Cómo pago? ¿Se esperan propinas?",
          a: "El pago se realiza en el momento de la reserva (tarjeta en línea) o se confirma en el presupuesto. Dar propina no es obligatorio en Grecia; Se aprecia entre un 5% y un 10% por un servicio excepcional.",
        },
        {
          q: "¿Hay sillas de coche para niños disponibles en el Aeropuerto Internacional de Kalamata?",
          a: "Sí, gratis previa solicitud. Indique las edades al hacer la reserva y se instalarán los asientos correctos antes de la recogida.",
        },
        {
          q: "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          a: "Se incluye una espera de 60 minutos de cortesía en las llegadas al aeropuerto. Realizamos un seguimiento de su vuelo para que el conductor se ajuste automáticamente. Las esperas más largas pueden generar un pequeño cargo.",
        },
      ],
    },
  },
  airportRoutes: {
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-elounda": {
      body: "El traslado privado del **Heraklion Airport** al **Elounda** recorre aproximadamente 71 km en unos 75 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "71 km · unos 75 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion hasta Elounda con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Elounda. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Heraklion a Elounda?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Heraklion Aeropuerto a Elunda?",
          a: "Normalmente unos 75 minutos para 71 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-agios-nikolaos": {
      body: "El traslado privado del **Heraklion Airport** al **Agios Nikolaos** recorre aproximadamente 65 km en unos 65 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "65 km · unos 65 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion hasta Agios Nikolaos en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Agios Nikolaos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Heraklion a Agios Nikolaos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Heraklion a Aghios Nicolaos?",
          a: "Normalmente unos 65 minutos por 65 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-hersonissos": {
      body: "El traslado privado del **Heraklion Airport** al **Hersonissos** recorre aproximadamente 26 km en unos 30 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "26 km · unos 30 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion hasta Hersonissos en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Hersonissos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Heraklion a Hersonissos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Heraklion Aeropuerto a Chersonisos?",
          a: "Normalmente unos 30 minutos por 26 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-malia": {
      body: "El traslado privado del **Heraklion Airport** al **Malia** recorre aproximadamente 34 km en unos 35 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "34 km · unos 35 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion a Malia con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Malia. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Heraklion a Malia?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Heraklion a Malia?",
          a: "Normalmente unos 35 minutos por 34 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-stalis": {
      body: "El traslado privado del **Heraklion Airport** al **Stalis** recorre aproximadamente 30 km en unos 32 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "30 km · unos 32 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion a Stalis con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Stalis. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Heraklion a Stalis?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Heraklion Aeropuerto a Stalis?",
          a: "Normalmente unos 32 minutos por 30 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-rethymno": {
      body: "El traslado privado del **Heraklion Airport** al **Rethymno** recorre aproximadamente 80 km en unos 75 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "80 km · unos 75 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion hasta Rethymno en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Rethymno. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Heraklion a Rethymno?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Heraklion a Rétino?",
          a: "Normalmente unos 75 minutos por 80 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-chania": {
      body: "El traslado privado del **Heraklion Airport** al **Chania** recorre aproximadamente 140 km en unos 130 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "140 km · unos 130 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion a Chania con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Chania. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Heraklion a Chania?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Heraklion a La Canea?",
          a: "Normalmente unos 130 minutos por 140 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-matala": {
      body: "El traslado privado del **Heraklion Airport** al **Matala** recorre aproximadamente 75 km en unos 90 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "75 km · unos 90 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion hasta Matala con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Matala. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Heraklion a Matala?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Heraklion Aeropuerto a Mátala?",
          a: "Normalmente unos 90 minutos por 75 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-bali": {
      body: "El traslado privado del **Heraklion Airport** al **Bali** recorre aproximadamente 45 km en unos 45 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "45 km · unos 45 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion a Bali con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Bali. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Heraklion a Bali?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Heraklion a Bali?",
          a: "Normalmente unos 45 minutos por 45 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-anissaras": {
      body: "El traslado privado del **Heraklion Airport** al **Anissaras** recorre aproximadamente 24 km en unos 28 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "24 km · unos 28 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion a Anissaras con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Anissaras. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Heraklion a Anissaras?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Heraklion Aeropuerto a Anissaras?",
          a: "Normalmente unos 28 minutos por 24 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-analipsi": {
      body: "El traslado privado del **Heraklion Airport** al **Analipsi** recorre aproximadamente 22 km en unos 26 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "22 km · unos 26 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion hasta Analipsi en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Analipsi. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Heraklion a Analipsi?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Heraklion Aeropuerto a Análipsi?",
          a: "Normalmente unos 26 minutos por 22 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-ierapetra": {
      body: "El traslado privado del **Heraklion Airport** al **Ierapetra** recorre aproximadamente 105 km en unos 100 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "105 km · unos 100 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion hasta Ierápetra con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Ierápetra. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Heraklion a Ierápetra?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Heraklion Aeropuerto a Ierápetra?",
          a: "Normalmente unos 100 minutos por 105 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-heraklion-city-center":
      {
        body: "El traslado privado del **Heraklion Airport** al **Heraklion City Center** recorre aproximadamente 6 km en unos 15 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
        tips: [
          {
            title: "El precio fijo incluye el tiempo de espera.",
            body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Heraklion. El seguimiento de vuelos ajusta la recogida automáticamente.",
          },
          {
            title: "6 km · unos 15 minutos",
            body: "Tiempo típico de puerta a puerta desde el aeropuerto de Heraklion hasta el centro de la ciudad de Heraklion en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
          },
          {
            title: "Entrega puerta a puerta",
            body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en el centro de la ciudad de Heraklion. Confirme la dirección exacta al hacer la reserva.",
          },
        ],
        faqs: [
          {
            q: "¿Dónde me espera el conductor para ir del aeropuerto de Heraklion al centro de la ciudad de Heraklion?",
            a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
          },
          {
            q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Heraklion a Heraklion Centro De La Ciudad?",
            a: "Normalmente unos 15 minutos por 6 km. Los picos de la tarde pueden agregar un poco de tiempo.",
          },
          {
            q: "¿Qué incluye el precio?",
            a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
          },
          {
            q: "¿Puedo cancelar o cambiar la reserva?",
            a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
          },
        ],
      },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-chania-old-town": {
      body: "El traslado privado del **Chania Airport** al **Chania Old Town** recorre aproximadamente 14 km en unos 25 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Chania. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "14 km · unos 25 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Chania hasta el casco antiguo de Chania con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en el casco antiguo de Chania. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Chania al casco antiguo de Chania?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el trayecto desde Aeropuerto de La Canea hasta Chania Old Town?",
          a: "Normalmente unos 25 minutos por 14 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-rethymno": {
      body: "El traslado privado del **Chania Airport** al **Rethymno** recorre aproximadamente 70 km en unos 70 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Chania. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "70 km · unos 70 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Chania a Rethymno con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Rethymno. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Chania a Rethymno?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de La Canea a Rétino?",
          a: "Normalmente unos 70 minutos por 70 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-kissamos": {
      body: "El traslado privado del **Chania Airport** al **Kissamos** recorre aproximadamente 40 km en unos 45 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Chania. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "40 km · unos 45 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Chania a Kissamos con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Kissamos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Chania a Kissamos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el trayecto de Aeropuerto de La Canea a Kísamos?",
          a: "Por lo general, unos 45 minutos durante 40 km. Los picos de la tarde pueden añadir un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-platanias": {
      body: "El traslado privado del **Chania Airport** al **Platanias** recorre aproximadamente 18 km en unos 25 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Chania. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "18 km · unos 25 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Chania a Platanias con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Platanias. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Chania a Platanias?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de La Canea a Platanias?",
          a: "Normalmente unos 25 minutos por 18 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-georgioupoli": {
      body: "El traslado privado del **Chania Airport** al **Georgioupoli** recorre aproximadamente 35 km en unos 40 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Chania. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "35 km · unos 40 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Chania hasta Georgioupoli con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Georgioupoli. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Chania a Georgioupoli?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el trayecto de Aeropuerto de La Canea a Georgioupoli?",
          a: "Normalmente unos 40 minutos por 35 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-kolymbari": {
      body: "El traslado privado del **Chania Airport** al **Kolymbari** recorre aproximadamente 28 km en unos 35 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Chania. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "28 km · unos 35 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Chania hasta Kolymbari con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Kolymbari. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Chania a Kolymbari?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de La Canea a Kolymbari?",
          a: "Normalmente unos 35 minutos por 28 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-almyrida": {
      body: "El traslado privado del **Chania Airport** al **Almyrida** recorre aproximadamente 30 km en unos 40 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Chania. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "30 km · unos 40 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Chania a Almyrida con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Almyrida. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Chania a Almyrida?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de La Canea a Almyrida?",
          a: "Normalmente unos 40 minutos por 30 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-falasarna": {
      body: "El traslado privado del **Chania Airport** al **Falasarna** recorre aproximadamente 55 km en unos 65 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Chania. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "55 km · unos 65 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Chania a Falasarna con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Falasarna. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Chania a Falasarna?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de La Canea a Falasarna?",
          a: "Normalmente unos 65 minutos por 55 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-sougia": {
      body: "El traslado privado del **Chania Airport** al **Sougia** recorre aproximadamente 70 km en unos 90 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Chania. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "70 km · unos 90 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Chania hasta Sougia con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Sougia. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Chania a Sougia?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de La Canea a Sougia?",
          a: "Normalmente unos 90 minutos por 70 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-paleochora": {
      body: "El traslado privado del **Chania Airport** al **Paleochora** recorre aproximadamente 75 km en unos 100 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Chania. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "75 km · unos 100 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Chania hasta Paleochora con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Paleochora. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Chania a Paleochora?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de La Canea a Paleóchora?",
          a: "Normalmente unos 100 minutos por 75 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-athens-city-center": {
      body: "El traslado privado del **Athens Airport** al **Athens city center** recorre aproximadamente 41 km en unos 35 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Atenas. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "41 km · unos 35 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Atenas hasta el centro de la ciudad de Atenas en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en el centro de la ciudad de Atenas. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Atenas al centro de la ciudad de Atenas?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el viaje desde el aeropuerto de Atenas al centro de la ciudad de Atenas?",
          a: "Normalmente unos 35 minutos para 41 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-piraeus": {
      body: "El traslado privado del **Athens Airport** al **Piraeus** recorre aproximadamente 48 km en unos 40 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Atenas. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "48 km · unos 40 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Atenas al Pireo con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en El Pireo. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Atenas al Pireo?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Atenas a El Pireo?",
          a: "Normalmente unos 40 minutos por 48 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-glyfada": {
      body: "El traslado privado del **Athens Airport** al **Glyfada** recorre aproximadamente 25 km en unos 30 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Atenas. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "25 km · unos 30 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Atenas a Glyfada con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Glyfada. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Atenas a Glyfada?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Atenas a Glyfada?",
          a: "Normalmente unos 30 minutos por 25 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-acropolis": {
      body: "El traslado privado del **Athens Airport** al **Acropolis** recorre aproximadamente 33 km en unos 35 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Atenas. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "33 km · unos 35 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Atenas hasta la Acrópolis con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en la Acrópolis. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Atenas a la Acrópolis?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el viaje desde Aeropuerto de Atenas a la Acrópolis?",
          a: "Normalmente unos 35 minutos por 33 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-lavrio": {
      body: "El traslado privado del **Athens Airport** al **Lavrio** recorre aproximadamente 37 km en unos 35 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Atenas. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "37 km · unos 35 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Atenas hasta Lavrio en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Lavrio. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Atenas a Lavrio?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Atenas a Lavrio?",
          a: "Normalmente unos 35 minutos por 37 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-rafina": {
      body: "El traslado privado del **Athens Airport** al **Rafina** recorre aproximadamente 25 km en unos 30 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Atenas. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "25 km · unos 30 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Atenas a Rafina con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Rafina. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Atenas a Rafina?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Atenas a Rafina?",
          a: "Normalmente unos 30 minutos por 25 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-alimos-marina": {
      body: "El traslado privado del **Athens Airport** al **Alimos Marina** recorre aproximadamente 33 km en unos 35 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Atenas. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "33 km · unos 35 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Atenas hasta el puerto deportivo de Alimos en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Alimos Marina. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Atenas al puerto deportivo de Alimos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Atenas a Alimos Marina?",
          a: "Normalmente unos 35 minutos por 33 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "thessaloniki-airport-transfers-skg::transfer-from-thessaloniki-airport-to-thessaloniki": {
      body: "El traslado privado del **Thessaloniki Airport** al **Thessaloniki** recorre aproximadamente 15 km en unos 30 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Tesalónica. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "15 km · unos 30 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Tesalónica a Tesalónica con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Salónica. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Tesalónica a Tesalónica?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Tesalónica a Tesalónica?",
          a: "Normalmente unos 30 minutos por 15 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "mykonos-airport-transfers-jmk::transfer-from-mykonos-airport-to-mykonos-town": {
      body: "El traslado privado del **Mykonos Airport** al **Mykonos Town** recorre aproximadamente 4 km en unos 15 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Mykonos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "4 km · unos 15 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Mykonos hasta la ciudad de Mykonos con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en la ciudad de Mykonos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Mykonos a la ciudad de Mykonos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Mykonos a Ciudad de Mykonos?",
          a: "Normalmente unos 15 minutos por 4 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "mykonos-airport-transfers-jmk::transfer-from-mykonos-airport-to-platys-yialos": {
      body: "El traslado privado del **Mykonos Airport** al **Platys Yialos** recorre aproximadamente 8 km en unos 20 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Mykonos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "8 km · unos 20 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Mykonos hasta Platys Yialos en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si existen zonas peatonales en Platys Yialos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Mykonos hasta Platys Yialos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Mykonos a Platis Gialos?",
          a: "Normalmente unos 20 minutos por 8 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "mykonos-airport-transfers-jmk::transfer-from-mykonos-airport-to-psarou": {
      body: "El traslado privado del **Mykonos Airport** al **Psarou** recorre aproximadamente 6 km en unos 18 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Mykonos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "6 km · unos 18 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Mykonos hasta Psarou con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Psarou. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Mykonos a Psarou?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Mykonos a Psarou?",
          a: "Normalmente unos 18 minutos por 6 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "mykonos-airport-transfers-jmk::transfer-from-mykonos-airport-to-ornos": {
      body: "El traslado privado del **Mykonos Airport** al **Ornos** recorre aproximadamente 5 km en unos 15 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Mykonos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "5 km · unos 15 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Mykonos a Ornos con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Ornos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me encontrará el conductor del aeropuerto de Mykonos a Ornos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Mykonos a Ornos?",
          a: "Normalmente unos 15 minutos por 5 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "santorini-airport-transfers-jtr::transfer-from-santorini-airport-to-fira": {
      body: "El traslado privado del **Santorini Airport** al **Fira** recorre aproximadamente 6 km en unos 20 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Santorini. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "6 km · unos 20 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Santorini hasta Fira con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Fira. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Santorini a Fira?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el viaje desde Aeropuerto de Santorini a Firá?",
          a: "Normalmente unos 20 minutos por 6 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "santorini-airport-transfers-jtr::transfer-from-santorini-airport-to-oia": {
      body: "El traslado privado del **Santorini Airport** al **Oia** recorre aproximadamente 17 km en unos 35 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Santorini. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "17 km · unos 35 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Santorini a Oia con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Oia. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Santorini a Oia?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el viaje desde Aeropuerto de Santorini a Oia?",
          a: "Normalmente unos 35 minutos por 17 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "santorini-airport-transfers-jtr::transfer-from-santorini-airport-to-kamari": {
      body: "El traslado privado del **Santorini Airport** al **Kamari** recorre aproximadamente 6 km en unos 15 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Santorini. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "6 km · unos 15 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Santorini a Kamari con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Kamari. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Santorini a Kamari?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Santorini a Kamari?",
          a: "Normalmente unos 15 minutos por 6 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "santorini-airport-transfers-jtr::transfer-from-santorini-airport-to-perissa": {
      body: "El traslado privado del **Santorini Airport** al **Perissa** recorre aproximadamente 12 km en unos 25 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Santorini. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "12 km · unos 25 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Santorini hasta Perissa con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Perissa. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Santorini a Perissa?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Santorini Aeropuerto a Perissa?",
          a: "Normalmente unos 25 minutos por 12 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "santorini-airport-transfers-jtr::transfer-from-santorini-airport-to-imerovigli": {
      body: "El traslado privado del **Santorini Airport** al **Imerovigli** recorre aproximadamente 8 km en unos 22 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Santorini. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "8 km · unos 22 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Santorini a Imerovigli con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Imerovigli. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Santorini a Imerovigli?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Santorini Aeropuerto a Imerovigli?",
          a: "Normalmente unos 22 minutos por 8 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "corfu-international-airport-transfers-cfu::transfer-from-corfu-airport-to-corfu-town": {
      body: "El traslado privado del **Corfu Airport** al **Corfu Town** recorre aproximadamente 3 km en unos 12 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Corfú. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "3 km · unos 12 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Corfú hasta la ciudad de Corfú con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en la ciudad de Corfú. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Corfú a la ciudad de Corfú?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el viaje desde Aeropuerto de Corfú a Corfú?",
          a: "Normalmente unos 12 minutos por 3 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "corfu-international-airport-transfers-cfu::transfer-from-corfu-airport-to-paleokastritsa": {
      body: "El traslado privado del **Corfu Airport** al **Paleokastritsa** recorre aproximadamente 25 km en unos 40 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Corfú. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "25 km · unos 40 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Corfú hasta Paleokastritsa con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Paleokastritsa. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Corfú a Paleokastritsa?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el viaje desde Aeropuerto de Corfú a Paleokastritsa?",
          a: "Normalmente unos 40 minutos por 25 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "corfu-international-airport-transfers-cfu::transfer-from-corfu-airport-to-dassia": {
      body: "El traslado privado del **Corfu Airport** al **Dassia** recorre aproximadamente 12 km en unos 25 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Corfú. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "12 km · unos 25 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Corfú hasta Dassia en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Dassia. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Corfú a Dassia?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Corfú a Dassia?",
          a: "Normalmente unos 25 minutos por 12 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "corfu-international-airport-transfers-cfu::transfer-from-corfu-airport-to-kavos": {
      body: "El traslado privado del **Corfu Airport** al **Kavos** recorre aproximadamente 45 km en unos 55 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Corfú. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "45 km · unos 55 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Corfú a Kavos con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Kavos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Corfú a Kavos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Corfú a Kavos?",
          a: "Normalmente unos 55 minutos por 45 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "rhodes-airport-transfers-rho::transfer-from-rhodes-airport-to-rhodes-town": {
      body: "El traslado privado del **Rhodes Airport** al **Rhodes Town** recorre aproximadamente 15 km en unos 25 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Rodas. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "15 km · unos 25 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Rodas hasta la ciudad de Rodas con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en la ciudad de Rodas. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Rodas a la ciudad de Rodas?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el viaje desde Aeropuerto de Rodas a La ciudad de Rodas?",
          a: "Normalmente unos 25 minutos por 15 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "rhodes-airport-transfers-rho::transfer-from-rhodes-airport-to-faliraki": {
      body: "El traslado privado del **Rhodes Airport** al **Faliraki** recorre aproximadamente 20 km en unos 30 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Rodas. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "20 km · unos 30 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Rodas hasta Faliraki con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Faliraki. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Rodas a Faliraki?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Rodas a Faliraki?",
          a: "Normalmente unos 30 minutos por 20 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "rhodes-airport-transfers-rho::transfer-from-rhodes-airport-to-lindos": {
      body: "El traslado privado del **Rhodes Airport** al **Lindos** recorre aproximadamente 50 km en unos 55 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Rodas. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "50 km · unos 55 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Rodas hasta Lindos con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Lindos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Rodas a Lindos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Rodas a Lindos?",
          a: "Normalmente unos 55 minutos por 50 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "rhodes-airport-transfers-rho::transfer-from-rhodes-airport-to-ialysos": {
      body: "El traslado privado del **Rhodes Airport** al **Ialysos** recorre aproximadamente 10 km en unos 20 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Rodas. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "10 km · unos 20 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Rodas hasta Ialysos con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Ialysos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Rodas a Ialysos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Rodas a Ialisos?",
          a: "Normalmente unos 20 minutos por 10 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "zakynthos-airport-transfers-zth::transfer-from-zakynthos-airport-to-zakynthos-town": {
      body: "El traslado privado del **Zakynthos Airport** al **Zakynthos Town** recorre aproximadamente 6 km en unos 20 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Zakynthos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "6 km · unos 20 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Zakynthos hasta la ciudad de Zakynthos con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en la ciudad de Zakynthos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Zakynthos a la ciudad de Zakynthos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Zakynthos a Ciudad de Zakynthos?",
          a: "Normalmente unos 20 minutos por 6 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "zakynthos-airport-transfers-zth::transfer-from-zakynthos-airport-to-laganas": {
      body: "El traslado privado del **Zakynthos Airport** al **Laganas** recorre aproximadamente 8 km en unos 18 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Zakynthos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "8 km · unos 18 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Zakynthos hasta Laganas con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Laganas. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Zakynthos a Laganas?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Zakynthos a Laganas?",
          a: "Normalmente unos 18 minutos por 8 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "zakynthos-airport-transfers-zth::transfer-from-zakynthos-airport-to-tsilivi": {
      body: "El traslado privado del **Zakynthos Airport** al **Tsilivi** recorre aproximadamente 12 km en unos 25 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Zakynthos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "12 km · unos 25 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Zakynthos hasta Tsilivi con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Tsilivi. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Zakynthos a Tsilivi?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Zakynthos a Tsilivi?",
          a: "Normalmente unos 25 minutos por 12 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-kalamata": {
      body: "El traslado privado del **Kalamata Airport** al **Kalamata** recorre aproximadamente 10 km en unos 20 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Kalamata. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "10 km · unos 20 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Kalamata a Kalamata con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Kalamata. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Kalamata a Kalamata?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el viaje desde Kalamata Aeropuerto a Kalamata?",
          a: "Normalmente unos 20 minutos por 10 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-athens": {
      body: "El traslado privado del **Kalamata Airport** al **Athens** recorre aproximadamente 231 km en unos 145 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Kalamata. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "231 km · unos 145 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Kalamata a Atenas con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Atenas. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Kalamata a Atenas?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el viaje desde Kalamata Aeropuerto a Atenas?",
          a: "Normalmente unos 145 minutos para 231 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-nafplio": {
      body: "El traslado privado del **Kalamata Airport** al **Nafplio** recorre aproximadamente 138 km en unos 95 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Kalamata. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "138 km · unos 95 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Kalamata a Nafplio con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Nafplio. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Kalamata a Nafplio?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el trayecto de Kalamata Aeropuerto a Nauplia?",
          a: "Normalmente unos 95 minutos para 138 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-sparta": {
      body: "El traslado privado del **Kalamata Airport** al **Sparta** recorre aproximadamente 91 km en unos 70 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Kalamata. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "91 km · unos 70 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Kalamata a Sparta con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Sparta. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Kalamata a Esparta?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Kalamata Aeropuerto a Esparta?",
          a: "Normalmente unos 70 minutos para 91 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-patras": {
      body: "El traslado privado del **Kalamata Airport** al **Patras** recorre aproximadamente 277 km en unos 170 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Kalamata. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "277 km · unos 170 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Kalamata a Patras con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Patras. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Kalamata a Patras?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Kalamata Aeropuerto a Patrás?",
          a: "Normalmente unos 170 minutos para 277 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-koroni": {
      body: "El traslado privado del **Kalamata Airport** al **Koroni** recorre aproximadamente 43 km en unos 55 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Kalamata. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "43 km · unos 55 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Kalamata hasta Koroni con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Koroni. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Kalamata a Koroni?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Kalamata Aeropuerto a Koroni?",
          a: "Normalmente unos 55 minutos para 43 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-voidokilia-beach":
      {
        body: "El traslado privado del **Kalamata Airport** al **Voidokilia Beach** recorre aproximadamente 46 km en unos 60 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
        tips: [
          {
            title: "El precio fijo incluye el tiempo de espera.",
            body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Kalamata. El seguimiento de vuelos ajusta la recogida automáticamente.",
          },
          {
            title: "46 km · unos 60 minutos",
            body: "Tiempo típico de puerta a puerta desde el aeropuerto de Kalamata hasta la playa de Voidokilia con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
          },
          {
            title: "Entrega puerta a puerta",
            body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Voidokilia Beach. Confirme la dirección exacta al hacer la reserva.",
          },
        ],
        faqs: [
          {
            q: "¿Dónde me espera el conductor para ir del aeropuerto de Kalamata a la playa de Voidokilia?",
            a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
          },
          {
            q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Kalamata a Voidokilia Beach?",
            a: "Normalmente unos 60 minutos para 46 km. Los picos de la tarde pueden agregar un poco de tiempo.",
          },
          {
            q: "¿Qué incluye el precio?",
            a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
          },
          {
            q: "¿Puedo cancelar o cambiar la reserva?",
            a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
          },
        ],
      },
    "kefalonia-airport-transfers-efl::transfer-from-kefalonia-airport-to-argostoli": {
      body: "El traslado privado del **Kefalonia Airport** al **Argostoli** recorre aproximadamente 10 km en unos 20 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Cefalonia. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "10 km · unos 20 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Cefalonia hasta Argostoli con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Argostoli. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Cefalonia a Argostoli?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Cefalonia a Argostoli?",
          a: "Normalmente unos 20 minutos por 10 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kefalonia-airport-transfers-efl::transfer-from-kefalonia-airport-to-lixouri": {
      body: "El traslado privado del **Kefalonia Airport** al **Lixouri** recorre aproximadamente 35 km en unos 45 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Cefalonia. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "35 km · unos 45 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Cefalonia a Lixouri con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Lixouri. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Cefalonia a Lixouri?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Cefalonia a Lixouri?",
          a: "Normalmente unos 45 minutos por 35 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kefalonia-airport-transfers-efl::transfer-from-kefalonia-airport-to-skala-kefalonia": {
      body: "El traslado privado del **Kefalonia Airport** al **Skala** recorre aproximadamente 35 km en unos 45 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Cefalonia. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "35 km · unos 45 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Cefalonia hasta Skala con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Skala. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Cefalonia a Skala?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Cefalonia a Skala?",
          a: "Normalmente unos 45 minutos por 35 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kos-airport-transfers-kgs::transfer-from-kos-airport-to-kos-town": {
      body: "El traslado privado del **Kos Airport** al **Kos Town** recorre aproximadamente 25 km en unos 35 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Kos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "25 km · unos 35 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Kos hasta la ciudad de Kos con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en la ciudad de Kos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Kos a la ciudad de Kos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto dura el viaje desde Aeropuerto de Cos a La ciudad de Cos?",
          a: "Normalmente unos 35 minutos por 25 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kos-airport-transfers-kgs::transfer-from-kos-airport-to-kardamena": {
      body: "El traslado privado del **Kos Airport** al **Kardamena** recorre aproximadamente 10 km en unos 20 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Kos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "10 km · unos 20 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Kos hasta Kardamena con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Kardamena. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Kos a Kardamena?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Kos Aeropuerto a Kardamena?",
          a: "Normalmente unos 20 minutos por 10 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "kos-airport-transfers-kgs::transfer-from-kos-airport-to-mastichari": {
      body: "El traslado privado del **Kos Airport** al **Mastichari** recorre aproximadamente 8 km en unos 15 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Kos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "8 km · unos 15 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Kos hasta Mastichari con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Mastichari. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me encontrará el conductor para el aeropuerto de Kos a Mastichari?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Cos a Mastichari?",
          a: "Normalmente unos 15 minutos por 8 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "aktion-lefkada-airport-transfers-pvk::transfer-from-aktion-airport-to-lefkada": {
      body: "El traslado privado del **Aktion Airport** al **Lefkada Town** recorre aproximadamente 25 km en unos 35 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Aktion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "25 km · unos 35 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Aktion hasta la ciudad de Lefkada con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en la ciudad de Lefkada. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Aktion hasta la ciudad de Lefkada?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aktion Airport hasta Lefkada?",
          a: "Normalmente unos 35 minutos por 25 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "aktion-lefkada-airport-transfers-pvk::transfer-from-aktion-airport-to-nikiana": {
      body: "El traslado privado del **Aktion Airport** al **Nikiana** recorre aproximadamente 35 km en unos 45 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Aktion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "35 km · unos 45 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Aktion hasta Nikiana en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Nikiana. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me encontrará el conductor para el aeropuerto de Aktion a Nikiana?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aktion Airport hasta Nikiana?",
          a: "Normalmente unos 45 minutos por 35 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "aktion-lefkada-airport-transfers-pvk::transfer-from-aktion-airport-to-vassiliki": {
      body: "El traslado privado del **Aktion Airport** al **Vassiliki** recorre aproximadamente 50 km en unos 60 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Aktion. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "50 km · unos 60 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Aktion hasta Vassiliki con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Vassiliki. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me encontrará el conductor para el aeropuerto de Aktion a Vassiliki?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo hay que conducir desde Aktion Airport a Vasilikí?",
          a: "Normalmente unos 60 minutos por 50 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "paros-airport-transfers-pas::transfer-from-paros-airport-to-parikia": {
      body: "El traslado privado del **Paros Airport** al **Parikia** recorre aproximadamente 8 km en unos 15 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Paros. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "8 km · unos 15 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Paros hasta Parikia con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Parikia. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me encontrará el conductor para el aeropuerto de Paros a Parikia?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Paros a Parikia?",
          a: "Normalmente unos 15 minutos por 8 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "paros-airport-transfers-pas::transfer-from-paros-airport-to-naoussa": {
      body: "El traslado privado del **Paros Airport** al **Naoussa** recorre aproximadamente 15 km en unos 25 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Paros. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "15 km · unos 25 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Paros hasta Naoussa con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Naoussa. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Paros a Naoussa?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Paros a Nausa?",
          a: "Normalmente unos 25 minutos por 15 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "naxos-airport-transfers-jnx::transfer-from-naxos-airport-to-naxos-town": {
      body: "El traslado privado del **Naxos Airport** al **Naxos Town (Chora)** recorre aproximadamente 5 km en unos 12 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Naxos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "5 km · unos 12 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Naxos hasta la ciudad de Naxos (Chora) en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en la ciudad de Naxos (Chora). Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Naxos hasta la ciudad de Naxos (Chora)?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Naxos a Naxos (Chora)?",
          a: "Normalmente unos 12 minutos por 5 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "naxos-airport-transfers-jnx::transfer-from-naxos-airport-to-agia-anna-naxos": {
      body: "El traslado privado del **Naxos Airport** al **Agia Anna** recorre aproximadamente 8 km en unos 18 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Naxos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "8 km · unos 18 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Naxos hasta Agia Anna en condiciones de tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Agia Anna. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Naxos a Agia Anna?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Naxos Aeropuerto a Agia Anna?",
          a: "Normalmente unos 18 minutos por 8 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "milos-airport-transfers-mlo::transfer-from-milos-airport-to-adamas": {
      body: "El traslado privado del **Milos Airport** al **Adamas** recorre aproximadamente 8 km en unos 18 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Milos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "8 km · unos 18 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Milos hasta Adamas con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Adamas. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Milos a Adamas?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Milo Aeropuerto a Adamas?",
          a: "Normalmente unos 18 minutos por 8 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "milos-airport-transfers-mlo::transfer-from-milos-airport-to-plaka-milos": {
      body: "El traslado privado del **Milos Airport** al **Plaka** recorre aproximadamente 12 km en unos 25 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas al aeropuerto de Milos. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "12 km · unos 25 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Milos hasta Plaka con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Plaka. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Milos a Plaka?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Milo a Plaka?",
          a: "Normalmente unos 25 minutos por 12 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "mytilene-airport-transfers-mjt::transfer-from-mytilene-airport-to-mytilene": {
      body: "El traslado privado del **Mytilene Airport** al **Mytilene** recorre aproximadamente 8 km en unos 15 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Mitilene. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "8 km · unos 15 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Mitilene hasta Mitilene con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Mitilene. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Mitilene a Mitilene?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Mitilene a Mitilene?",
          a: "Normalmente unos 15 minutos por 8 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "mytilene-airport-transfers-mjt::transfer-from-mytilene-airport-to-molyvos": {
      body: "El traslado privado del **Mytilene Airport** al **Molyvos** recorre aproximadamente 55 km en unos 70 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Mitilene. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "55 km · unos 70 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Mitilene hasta Molyvos con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Molyvos. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para ir del aeropuerto de Mitilene a Molyvos?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Mitilene a Molyvos?",
          a: "Normalmente unos 70 minutos por 55 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "sitia-airport-transfers-jsh::transfer-from-sitia-airport-to-sitia": {
      body: "El traslado privado del **Sitia Airport** al **Sitia** recorre aproximadamente 6 km en unos 12 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Sitía. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "6 km · unos 12 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Sitía hasta Sitía con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Sitia. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Sitía a Sitía?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Sitía a Sitía?",
          a: "Normalmente unos 12 minutos por 6 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
    "sitia-airport-transfers-jsh::transfer-from-sitia-airport-to-ierapetra": {
      body: "El traslado privado del **Sitia Airport** al **Ierapetra** recorre aproximadamente 65 km en unos 70 minutos en condiciones normales. Su conductor TransferAround lo recibe en la terminal de llegadas con un cartel con su nombre, monitorea su vuelo en tiempo real e incluye una espera gratuita de 60 minutos para equipaje y retrasos menores. La tarifa se fija en el momento de la reserva (se incluyen los peajes y las tarifas de carretera estándar cuando correspondan), por lo que no hay sorpresas al dejar el vehículo.",
      tips: [
        {
          title: "El precio fijo incluye el tiempo de espera.",
          body: "Espera de 60 minutos de cortesía en las llegadas del aeropuerto de Sitía. El seguimiento de vuelos ajusta la recogida automáticamente.",
        },
        {
          title: "65 km · unos 70 minutos",
          body: "Tiempo típico de puerta a puerta desde el aeropuerto de Sitía hasta Ierápetra con tráfico normal. Las ventanas máximas pueden agregar de 5 a 15 minutos.",
        },
        {
          title: "Entrega puerta a puerta",
          body: "Lo dejaremos en su hotel o en el punto accesible para vehículos más cercano si se aplican zonas peatonales en Ierápetra. Confirme la dirección exacta al hacer la reserva.",
        },
      ],
      faqs: [
        {
          q: "¿Dónde me espera el conductor para el aeropuerto de Sitía a Ierápetra?",
          a: "En la sala de equipajes de llegadas / salida de llegadas con un cartel con su apellido.",
        },
        {
          q: "¿Cuánto tiempo lleva conducir desde Aeropuerto de Sitía a Ierápetra?",
          a: "Normalmente unos 70 minutos por 65 km. Los picos de la tarde pueden agregar un poco de tiempo.",
        },
        {
          q: "¿Qué incluye el precio?",
          a: "Vehículo, conductor con licencia, encuentro y bienvenida, monitoreo de vuelos, espera gratuita de 60 minutos y peajes/cargos de carretera aplicables en este corredor.",
        },
        {
          q: "¿Puedo cancelar o cambiar la reserva?",
          a: "Sí, cancelación gratuita hasta 24 horas antes de la recogida en condiciones estándar. Los cambios de tiempo de vuelo son fáciles una vez que comparte los nuevos detalles.",
        },
      ],
    },
  },
  posts: {
    "heraklion-airport-to-chania-options": {
      title: "Del aeropuerto de Heraklion a Chania: todas las formas de cruzar la isla",
      description:
        "Autobús, coche de alquiler, taxi o traslado reservado con antelación: una comparación honesta hecha por un local de todas las formas de llegar desde el Aeropuerto de Heraklion (HER) a La Canea, con precios y horarios reales.",
      authorRole: "Jefe de despacho, Heraklion",
      sections: [
        {
          heading: "Por qué tanta gente aterriza en Heraklion pero se queda en Chania",
          body: [
            "Heraklion (HER) recibe aproximadamente tres veces más vuelos que Chania (CHQ) y, por lo general, son más baratos. Por eso, cada verano, miles de viajeros aterrizan en el lado este de la isla con un hotel reservado a 140 km al oeste. La buena noticia: la autopista de la costa norte (E75/VOAK) hace que este sea uno de los viajes largos más fáciles de Grecia.",
            "Calcula unas 2 horas y 10 minutos puerta a puerta con tráfico normal. En agosto, agregue de 20 a 30 minutos para el tramo alrededor de Rethymno.",
          ],
        },
        {
          heading: "Opción 1: El autobús KTEL (el más barato, el más lento)",
          body: [
            "El autobús interurbano KTEL sale desde la estación principal de Heraklion (no desde el aeropuerto) hasta Chania aproximadamente cada hora en temporada, por unos 15 € por persona. Si se tiene en cuenta el autobús local o el taxi desde el aeropuerto hasta la estación, una posible espera y la parada en Rethymno, el tiempo real de viaje es de 3,5 a 4 horas.",
            "Es una buena opción para mochileros solitarios con tiempo. Para las familias con equipaje después de las 3 de la mañana, es la manera más difícil de comenzar las vacaciones.",
          ],
        },
        {
          heading: "Opción 2: Coche de alquiler (flexible, pero piénselo bien)",
          body: [
            "Si de todos modos ibas a alquilar un coche para toda tu estancia, recogerlo en HER y conducir hacia el oeste funciona bien. El problema: los alquileres de ida entre ciudades a menudo conllevan una tarifa de reubicación, las colas de recogida en agosto en los mostradores del aeropuerto pueden durar más de una hora y el casco antiguo de Chania es peatonal; es posible que su hotel no tenga estacionamiento.",
            "Coste aproximado del viaje en sí: entre 25 y 35 € en combustible más el día de alquiler.",
          ],
        },
        {
          heading: "Opción 3: parada de taxis versus traslado reservado previamente",
          body: [
            "Un taxi con taxímetro desde la parada HER hasta Chania costará entre 180 y 250 €, dependiendo del conductor, la hora y su resistencia a la negociación. Es legal, pero el precio es el que diga al final el taxímetro (o el conductor).",
            "Un traslado privado reservado previamente fija el precio antes de volar: 165 € para un sedán económico en nuestra ruta del aeropuerto de Heraklion a Chania, por vehículo, no por persona. Su conductor sigue el vuelo, espera en llegadas con un cartel con su nombre y en el coche caben cuatro personas con maletas para el mismo número fijo. Para dos o más viajeros, casi siempre es más barato que el rango y es puerta a puerta hasta el punto de acceso más cercano a su hotel.",
          ],
        },
        {
          heading: "El veredicto local",
          body: [
            "Viajar solo y con poco presupuesto y con luz natural de sobra: coger el autobús. Quedarse en un lugar remoto y planificar excursiones de un día a diario: alquilar el coche. Todos los demás (parejas, familias, grupos con equipaje, cualquiera que llegue después de las 20:00) reservan con antelación el traslado y duermen en el asiento trasero. El viaje de dos horas a lo largo de la costa es realmente hermoso; Deje que conduzca alguien que lo conduzca todas las semanas.",
          ],
        },
      ],
      faq: [
        {
          q: "¿Cuánto dura el traslado desde el Aeropuerto de Heraklion a La Canea?",
          a: "Aproximadamente 2 horas y 10 minutos para recorrer 140 km, autopista casi todo el camino.",
        },
        {
          q: "¿Cuánto cuesta un traslado privado?",
          a: "Desde 165€ fijos, por vehículo (hasta 3 pasajeros en Economy; monovolúmenes de hasta 7 disponibles).",
        },
      ],
    },
    "taxi-vs-prebooked-transfer-crete": {
      title:
        "Taxi versus traslado reservado previamente en Creta: lo que realmente recomiendan los lugareños",
      description:
        "Comparación de paradas de taxis en aeropuertos, aplicaciones de viajes y traslados reservados con antelación en Creta: transparencia de precios, recargos nocturnos, equipaje y cuándo tiene sentido cada opción.",
      authorRole: "Operaciones, La Canea",
      sections: [
        {
          heading: "Cómo funciona realmente la parada de taxis del aeropuerto",
          body: [
            "Ambos aeropuertos de Creta tienen paradas de taxis oficiales con precios de zona publicados, en teoría. En la práctica, la hoja de precios publicada cubre un puñado de destinos, los recargos por noche y equipaje se agregan verbalmente, y en temporada alta la cola después de una llegada retrasada por la noche puede durar 40 minutos.",
            "Los taxistas cretenses son profesionales abrumadoramente honestos. Pero la estructura (negociar después del aterrizaje, pagar lo cotizado) pone toda la incertidumbre en el viajero.",
          ],
        },
        {
          heading: "Por qué las aplicaciones de transporte no funcionan aquí",
          body: [
            "Uber y Bolt operan en Atenas, pero en Creta la cobertura de la aplicación es escasa o inexistente fuera de la ciudad de Heraklion, y lo que existe son taxis regulares en el taxímetro de la aplicación. Para un recorrido de 30 a 80 km desde el aeropuerto hasta el centro turístico, los conductores habitualmente rechazan las solicitudes de aplicaciones en favor del trabajo en rango. No cree su plan de llegada en torno a un pin de aplicación.",
          ],
        },
        {
          heading: "Qué cambia la pre-reserva",
          body: [
            "Un traslado reservado con antelación invierte el modelo: el precio se fija al reservar, no al aterrizar. Usted sabe el número antes de volar, se le asigna el conductor por su nombre, se realiza un seguimiento del vuelo para que los retrasos no cuesten nada y hay un asiento para niños en el automóvil antes de que usted lo solicite.",
            "El recargo nocturno es la prueba honesta. El nuestro se publica: +15 % entre las 22:00 y las 06:00, y se muestra en el desglose de precios antes de confirmar. En una fila, la tarifa nocturna es la que aparece en la tarifa del taxímetro y que no se puede leer desde el asiento trasero.",
          ],
        },
        {
          heading: "Cuando la parada de taxi es la decisión correcta",
          body: [
            "Saltos cortos sin equipaje (del aeropuerto de Chania a un hotel de la ciudad a las 2 p. m. un martes), la clasificación es rápida y justa, y la reserva previa le aporta poco. Viajes espontáneos por la ciudad: granizo. El traslado reservado con antelación se mantiene en llegadas al aeropuerto, aterrizajes nocturnos, rutas largas, familias con equipo y cualquier día en el que, de otro modo, un retraso se convertiría en un caos.",
          ],
        },
      ],
    },
    "souda-port-cruise-ferry-arrivals": {
      title: "Llegada al puerto de Souda: una guía local para pasajeros de ferry y cruceros",
      description:
        "El ferry nocturno desde El Pireo atraca en Souda a las 6 a.m. Esto es exactamente lo que sucede a continuación: diseño del puerto, taxis, traslados al casco antiguo de Chania y más allá.",
      authorRole: "Operaciones, La Canea",
      sections: [
        {
          heading: "Cómo son realmente las 06:00 en Souda",
          body: [
            "Los ferries nocturnos ANEK y Minoan procedentes del Pireo llegan a Souda entre las 05:45 y las 06:30. Caminas (o conduces) desde la plataforma de vehículos hacia un puerto comercial en funcionamiento, no una terminal de cruceros con cafeterías. Hay un pequeño edificio terminal, una parada de taxis que se vacía rápido y eso es todo.",
            "El casco antiguo de Chania está a sólo 8 km, pero a esa hora el autobús urbano no ha iniciado su horario completo y la mitad del ferry se dirige en la misma dirección que usted.",
          ],
        },
        {
          heading: "Tus tres opciones fuera del barco",
          body: [
            "El autobús público a Chania cuesta alrededor de 2,50 € y sale de la puerta del puerto; está bien si viajas con poco equipaje y tu alojamiento abre temprano. La parada de taxis funciona con tarifas de zona; espere entre 15 y 20 € en la ciudad, más con las maletas y una cola que puede durar más que su paciencia después de que 300 pasajeros desembarquen a la vez.",
            "Un traslado reservado con antelación cuesta 25 € fijos hasta el casco antiguo de Chania: el conductor sigue el ferry (a menudo llega tarde en invierno y principios de verano), lo recibe en la salida de la terminal con un cartel y lo deja en el punto de acceso para vehículos más cercano a su hotel, ya que la mayor parte del casco antiguo es peatonal.",
          ],
        },
        {
          heading: "Pasajeros de cruceros: la matemática del viaje de un día",
          body: [
            "Los cruceros que hacen escala en Souda le dan entre 8 y 10 horas. El servicio de transporte a Chania cubre el casco antiguo, pero lo mejor del oeste de Creta (la laguna de Balos, Falasarna y los monasterios de Akrotiri) necesita transporte. Un conductor privado por una tarifa de día fijo supera a la excursión en barco tanto en precio como en flexibilidad para grupos de tres o más. Dígale al conductor su tiempo a bordo; devolverte con margen es su trabajo y lo hacen a diario.",
          ],
        },
        {
          heading: "¿Vas más allá de Chania?",
          body: [
            "De Souda a Rethymno, Kissamos o la costa sur es donde realmente importa la reserva previa: son viajes de 45 a 90 minutos sin autobús directo al amanecer. Los precios fijos desde Souda se encuentran en nuestras páginas de traslados al puerto, y se aplica la misma regla de seguimiento del ferry: si el barco llega tarde, nosotros llegaremos tarde, sin cargo.",
          ],
        },
      ],
      faq: [
        {
          q: "¿A qué distancia está el puerto de Souda del casco antiguo de Chania?",
          a: "Unos 8 km, 15 minutos en coche. Precio de transferencia fijo 25 € por vehículo.",
        },
      ],
    },
    "crete-with-kids-child-seats": {
      title:
        "Creta con niños: sillas de coche, traslados y la logística de la que nadie te advierte",
      description:
        "Ley griega sobre sillas de coche, por qué las paradas de taxis no pueden ayudarle y cómo planificar traslados familiares en Creta sin arrastrar tres sillas de coche por un aeropuerto.",
      authorRole: "Jefe de despacho, Heraklion",
      sections: [
        {
          heading: "Lo que dice la ley griega sobre los niños en los coches",
          body: [
            "Los niños menores de 135 cm deben viajar en un sistema de retención infantil adecuado en vehículos privados. Los taxis con licencia están técnicamente exentos, y ese es precisamente el problema. El taxi que te recoge no le debe más que una vuelta a tu pequeño. La mayoría de los padres descubren esto en la acera de llegadas, con jet lag y sin buenas opciones.",
          ],
        },
        {
          heading: "¿Traer tu propio asiento o reservar el coche que tiene uno?",
          body: [
            "Las aerolíneas generalmente registran asientos de seguridad gratis, pero luego tienes que llevar un asiento voluminoso a través de dos aeropuertos para un par de viajes de 40 minutos. Alquilar asientos con un coche de alquiler funciona si conduce usted mismo toda la semana: inspeccione el asiento antes de aceptarlo.",
            'El camino intermedio: reservar un traslado con el asiento solicitado al frente. Instalamos asientos orientados hacia la marcha y alzadores (+10€, se solicitan en la reserva según la edad de tu hijo), que se instalan antes de que el conductor salga del garaje. Díganos las edades, no sólo "un asiento para niños": un niño de 10 meses y uno de 6 años necesitan hardware diferente.',
          ],
        },
        {
          heading: "Las matemáticas del monovolumen para familias",
          body: [
            "En un sedán no caben dos adultos, tres niños, un cochecito, cinco maletas y una bolsa de snorkel, diga lo que diga el sitio de reservas. Nuestra clase minivan (hasta 7 pasajeros, 7 maletas) cuesta 1,6 veces el precio del sedán; en el trayecto del aeropuerto de Heraklion a Hersonissos esa es la diferencia entre 42 € y 67 €. Dividida en una familia, la mejora cuesta menos que los sándwiches del aeropuerto.",
          ],
        },
        {
          heading: "Consejos de sincronización de mil camionetas familiares",
          body: [
            "Reserve la recogida para un aterrizaje real más 45 minutos si ha facturado maletas y niños pequeños; apresurar a una familia en el reclamo de equipaje no salva a nadie. Si su vuelo de regreso sale antes de las 08:00, pregunte al operador sobre el período de recargo nocturno y, con honestidad, incorpore el horario de 22:00 a 06:00 +15 % para no sorprenderse. Y escriba el nombre del hotel y las necesidades de asientos de su hijo en las notas de reserva; el conductor los lee la noche anterior.",
          ],
        },
      ],
    },
    "night-arrivals-heraklion-airport": {
      title: "Aterrizando en el aeropuerto de Heraklion después de la medianoche: qué esperar",
      description:
        "HER es uno de los aeropuertos nocturnos de Grecia con mayor actividad en verano. Cómo funcionan las llegadas tardías, qué está abierto, recargos por traslados nocturnos y cómo no quedarse tirado.",
      authorRole: "Jefe de despacho, Heraklion",
      sections: [
        {
          heading: "La prisa de la 01:00 es real",
          body: [
            "Los vuelos chárter y de bajo costo acumulan llegadas tardías a Heraklion durante todo el verano; habitualmente se encuentra entre los aeropuertos griegos más transitados entre la medianoche y las 03:00. El control de pasaportes es rápido para los vuelos de la UE, pero la entrega de equipaje a esa hora tarda entre 20 y 40 minutos. Las opciones de comida de la terminal estarán cerradas; las máquinas expendedoras no inspirarán.",
          ],
        },
        {
          heading: "¿Qué te espera afuera a las 2 a.m.?",
          body: [
            "La parada de taxis funciona durante la noche, pero la oferta es la que sea: después de tres llegadas simultáneas, la cola puede ser de una hora y se aplica la tarifa nocturna. El autobús KTEL no circula durante la noche. Los servicios de transporte del hotel paran principalmente a medianoche. Esta es la única situación en la que la reserva anticipada cambia tu noche de manera más dramática: un conductor identificado, que ya está dentro del estacionamiento, observando tu número de vuelo.",
          ],
        },
        {
          heading: "Sobre los recargos nocturnos (nuestros y de todos)",
          body: [
            "Cualquier operador honesto cobra más por la noche: los conductores trabajan a las 3 de la madrugada. La diferencia es si aprendes el número antes o después del viaje. Nuestro recargo es de +15% para recogidas entre las 22:00 y las 06:00, calculado sobre el precio fijo de la ruta y que se muestra en el desglose antes de confirmar. Una carrera de 42€ en Hersonissos se convierte en 48€. No hay cálculos de medidores en la acera.",
          ],
        },
        {
          heading: "La lista de control para llegar tarde",
          body: [
            'Introduzca su número de vuelo en la reserva: el seguimiento es lo que hace que un "retraso hasta las 02:40" no sea un evento. Haga una captura de pantalla del nombre de su conductor y el número de despacho antes de abordar, en caso de que su eSIM roaming se enfurruña. Dígale a su hotel que llegará a las 3 a.m. para que el portero nocturno lo espere. Y reserve el coche antes de volar: a la 01:30 de agosto, el optimismo en la sala de llegadas no es una estrategia de transporte.',
          ],
        },
      ],
      faq: [
        {
          q: "¿Hay recargo nocturno en los traslados?",
          a: "Sí, +15 % para recogidas entre las 22:00 y las 06:00, que se muestra en el desglose de precios antes de reservar.",
        },
        {
          q: "¿Qué pasa si mi vuelo aterriza a las 3 a. m. tarde?",
          a: "Seguimos el número de vuelo. El conductor se ajusta automáticamente y la espera es gratuita en caso de retrasos en los vuelos.",
        },
      ],
    },
    "chania-old-town-arrival-tips": {
      title: "Llegar al casco antiguo de Chania: por qué su automóvil no puede llegar a su hotel",
      description:
        "El casco antiguo veneciano de Chania está prácticamente libre de coches. Dónde te dejarán los traslados y los taxis, qué tan lejos tendrás que caminar y cómo hacer que tu llegada sea sencilla.",
      authorRole: "Operaciones, La Canea",
      sections: [
        {
          heading: "El hermoso problema",
          body: [
            "Los carriles que rodean el puerto veneciano de Chania son lo que vino a buscar: y son demasiado estrechos, demasiado escalonados o simplemente están cerrados al tráfico. Si la dirección de su hotel boutique dice Zambeliou o Theotokopoulou, ningún vehículo se detendrá en la puerta. Cada llegada termina con una corta caminata, y saber qué punto de entrega lo minimiza es un conocimiento local realmente útil.",
          ],
        },
        {
          heading: "Dónde te dejan los conductores",
          body: [
            "Los principales puntos de acceso son el borde del puerto cerca de la mezquita Yali Tzamisi para los hoteles del norte del casco antiguo, la plaza Talos en el lado oeste y el mercado (Ágora) para los carriles del sur. Un conductor que trabaja diariamente en Chania elegirá el hotel adecuado para su hotel exacto; el nuestro también lo acompañará hasta la puerta si las maletas superan en número a las manos, y nuestra ruta del aeropuerto de Chania al casco antiguo indica exactamente esto.",
          ],
        },
        {
          heading: "Adoquines y equipaje: una advertencia",
          body: [
            "Independientemente de las ruedas de maleta que tengas, los adoquines venecianos no están de acuerdo con ellas. Si le preocupa la movilidad, indíquelo en las notas de la reserva: a menudo se puede elegir el punto de entrega para cambiar una caminata panorámica de 300 metros por una plana de 80 metros. Varios hoteles del casco antiguo también ofrecen servicio de portería si se les avisa; Les pasamos su hora de llegada si lo solicitan.",
          ],
        },
        {
          heading: "Un último consejo: llega antes de la volta vespertina.",
          body: [
            "A partir de las 19:00 aproximadamente en temporada alta, el casco antiguo se llena para disfrutar de un paseo nocturno y del servicio de cena frente al mar. Llegar a las 20:30 significa pasar una maleta con ruedas entre la multitud en la hora dorada. Si su vuelo lo permite, intente llegar al casco antiguo antes de las 18:00, o abracelo, entregue las maletas al portero y únase a la volta de inmediato. Estás en Creta ahora.",
          ],
        },
      ],
    },
  },
} as ContentOverlays;
export default overlay;
