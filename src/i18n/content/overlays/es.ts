import type { ContentOverlays } from "../types";

const overlay = {
  "faqs": [
    {
      "title": "Reservas y precios",
      "items": [
        {
          "q": "¿El precio es realmente fijo?",
          "a": "Sí. El precio que aparece al reservar es el precio final: sin pujas, tarifas dinámicas ni recargos después del viaje. Solo se añaden los extras que usted elija —como una silla infantil, una parada adicional o el servicio de bienvenida con cartel— y el recargo nocturno automático del 15 % para recogidas entre las 22:00 y las 06:00. Todo se muestra antes de confirmar."
        },
        {
          "q": "¿Con cuánta antelación debo reservar?",
          "a": "Reservar 48 horas antes de la recogida suele ser suficiente. En agosto recomendamos hacerlo con una semana de antelación para garantizar la clase de vehículo que prefiera. También aceptamos reservas para el mismo día, sujetas a disponibilidad."
        },
        {
          "q": "¿Puedo reservar ida y vuelta al mismo tiempo?",
          "a": "Sí. Seleccione Ida y vuelta en el formulario, indique la fecha y la hora del regreso y verá el precio de ambos trayectos. El descuento del 5 % por ida y vuelta se aplica automáticamente. En el pago puede añadir un número de vuelo distinto para el regreso."
        }
      ]
    },
    {
      "title": "Pago",
      "items": [
        {
          "q": "¿Cuándo se realiza el pago?",
          "a": "En las rutas con reserva inmediata, el pago seguro con tarjeta se realiza al confirmar y el precio queda fijado antes de cobrar. En los destinos que requieren presupuesto, primero le enviamos el precio fijo para que lo apruebe y solo cobramos después de su aceptación."
        },
        {
          "q": "¿Aceptan tarjetas?",
          "a": "Sí. El pago en línea admite Visa, Mastercard, Amex y las carteras digitales compatibles con su dispositivo. Cuando se paga a la llegada, todos los conductores llevan datáfono y también aceptan efectivo en euros."
        },
        {
          "q": "¿Cobran gastos de reserva?",
          "a": "No. El importe mostrado es el precio total: sin gastos de reserva, recargos por combustible ni tasas por recogida en el aeropuerto."
        }
      ]
    },
    {
      "title": "Cancelaciones y cambios",
      "items": [
        {
          "q": "¿Cuál es la política de cancelación?",
          "a": "Puede cancelar gratis hasta 24 horas antes de la recogida. Si ha pagado por adelantado, recibirá un reembolso íntegro o un crédito del 100 %. Dentro de las 24 horas anteriores se aplica un cargo del 50 %. Si el viajero no aparece una vez agotado el tiempo de espera gratuito, se cobra el trayecto completo. Si confirmamos que el conductor no se presentó, ofrecemos una compensación íntegra y, cuando corresponda, un crédito adicional de 25 €."
        },
        {
          "q": "¿Cuánto tiempo espera el conductor?",
          "a": "La espera gratuita es de 60 minutos en aeropuertos y puertos, con seguimiento del vuelo o ferry, y de 30 minutos en hoteles y domicilios. Si transcurre ese tiempo sin poder contactar con usted, la reserva puede marcarse como no presentado."
        },
        {
          "q": "¿Qué ocurre si el conductor no se presenta?",
          "a": "Abra «Informar de un problema» en su reserva y seleccione «El conductor no se presentó». Comprobaremos lo ocurrido y, una vez confirmado, le ofreceremos un reembolso íntegro o una nueva reserva. El proceso no cancela la reserva automáticamente."
        },
        {
          "q": "¿Puedo cambiar la hora de recogida?",
          "a": "Sí. Responda al correo de confirmación o escriba directamente al conductor por WhatsApp. Los cambios son gratuitos hasta 4 horas antes de la recogida."
        },
        {
          "q": "¿Qué ocurre si cancelan mi vuelo?",
          "a": "Envíenos el aviso de la aerolínea —o seleccione ese motivo al cancelar— y podrá elegir entre cambiar la reserva o recibir un reembolso íntegro."
        }
      ]
    },
    {
      "title": "Encuentro con el conductor",
      "items": [
        {
          "q": "¿Dónde me espera el conductor en el aeropuerto?",
          "a": "En la sala de llegadas, después de recoger el equipaje. Si añade el servicio de bienvenida (+10 €), llevará un cartel físico con su nombre; de lo contrario, le identificará mediante los datos de la reserva."
        },
        {
          "q": "¿Dónde me espera el conductor en el puerto?",
          "a": "En la salida de la cubierta de vehículos de los ferris. Para traslados posteriores, la recogida se realiza directamente en la puerta indicada de su hotel o villa."
        },
        {
          "q": "¿Qué hago si no encuentro al conductor?",
          "a": "Recibirá el teléfono móvil y el WhatsApp del conductor el día anterior a la recogida. El número de nuestra central de operaciones, disponible 24/7, también figura en la confirmación."
        }
      ]
    },
    {
      "title": "Equipaje, niños y vehículos",
      "items": [
        {
          "q": "¿Cuánto equipaje puedo llevar?",
          "a": "Las clases Economy y Standard admiten 3 pasajeros con 3 maletas estándar. Las furgonetas y los SUV admiten entre 6 y 7 maletas; los minibuses, hasta 12 o 16 pasajeros. Si lleva bolsas adicionales, tablas de surf o bicicletas, indíquelo en las notas."
        },
        {
          "q": "¿Puedo solicitar una silla infantil?",
          "a": "Sí. Añada la silla infantil al reservar (+10 €). Disponemos de sillas para bebés (0–13 kg), niños pequeños (9–18 kg) y elevadores (15–36 kg); indique cuál necesita en las notas."
        },
        {
          "q": "¿Todos los vehículos tienen aire acondicionado?",
          "a": "Sí. Toda la flota dispone de climatización y los conductores la utilizan. Las botellas de agua están incluidas desde la clase Standard."
        }
      ]
    },
    {
      "title": "Retrasos y tiempo de espera",
      "items": [
        {
          "q": "¿Qué ocurre si mi vuelo se retrasa?",
          "a": "Seguimos automáticamente el número de vuelo y el conductor ajusta la hora de recogida. No hay coste adicional ni límite de espera cuando el propio vuelo se retrasa."
        },
        {
          "q": "¿Cuánto tiempo espera el conductor?",
          "a": "Incluimos 60 minutos de espera gratuita desde la hora prevista de llegada y espera ilimitada si el vuelo se retrasa. En recogidas de hotel se incluyen 15 minutos."
        }
      ]
    },
    {
      "title": "Propinas y cortesía",
      "items": [
        {
          "q": "¿Se espera propina?",
          "a": "No es obligatoria, aunque siempre se agradece. Si el servicio ha sido excelente, dejar un 10 % en efectivo es un gesto habitual en Grecia."
        },
        {
          "q": "¿Puede el conductor parar para tomar un café o hacer una foto?",
          "a": "Sí, en los traslados de larga distancia. Solo tiene que pedirlo; estas paradas forman parte de la experiencia."
        }
      ]
    }
  ],
  "services": {
    "airport-transfers": {
      "name": "Traslados desde el aeropuerto",
      "tagline": "Servicio de bienvenida en los aeropuertos de Heraclión (HER) y Chania (CHQ).",
      "intro": "Traslados privados a precio fijo desde los dos aeropuertos de Creta hasta cualquier hotel, complejo turístico o villa de la isla. Incluyen seguimiento del vuelo y cartel con su nombre en llegadas.",
      "body": "Su conductor consulta el estado del vuelo, llega 15 minutos antes del aterrizaje y le espera en llegadas con un cartel con su nombre. Sin buscar la parada de taxis ni negociar la tarifa: el precio que ve al reservar es el precio final.",
      "whatsIncluded": [
        "Seguimiento del vuelo",
        "Servicio de bienvenida en llegadas",
        "60 minutos de espera gratuita",
        "Contacto directo con el conductor por WhatsApp"
      ],
      "bestFor": [
        "Llegadas a HER o CHQ",
        "Vuelos nocturnos",
        "Familias con niños y equipaje"
      ]
    },
    "port-transfers": {
      "name": "Traslados desde el puerto",
      "tagline": "Del puerto de Heraclión o Souda directamente a su hotel.",
      "intro": "Los ferris nocturnos desde El Pireo atracan antes del amanecer. Su conductor estará allí aunque el barco llegue con retraso.",
      "body": "Los horarios de ANEK, Minoan y Sea Jets te llevarán a Creta entre las 05:30 y las 06:00. Nuestros conductores programan su llegada a su ferry específico y, si el barco llega tarde, lo esperamos de forma gratuita. Precio fijo, sin recargo por madrugada.",
      "whatsIncluded": [
        "Seguimiento del horario del ferry",
        "Encuentro en la salida de la cubierta de vehículos",
        "Espera gratuita si el ferry se retrasa",
        "Servicio a cualquier hora"
      ],
      "bestFor": [
        "Llegadas nocturnas desde El Pireo",
        "Conexiones entre islas",
        "Excursiones desde cruceros"
      ]
    },
    "hotel-transfers": {
      "name": "Traslados entre hoteles",
      "tagline": "Servicio punto a punto entre hoteles y localidades de toda Creta.",
      "intro": "Cambie de hotel a mitad de vacaciones. Dirígete a una boda en los Domes. Llegue al ferry a la mañana siguiente.",
      "body": "No todos los traslados comienzan en un aeropuerto. Nuestra matriz de precios fijos cubre de hotel a hotel, de hotel a ciudad y de hotel a puerto en todas las rutas populares: Elounda a Chania, Rethymno a Matala, Agios Nikolaos a Vai.",
      "whatsIncluded": [
        "Recogida en la puerta del hotel",
        "Ayuda con el equipaje",
        "Conocimiento local del conductor",
        "Cualquier ruta dentro de Creta"
      ],
      "bestFor": [
        "Itinerarios con varios hoteles",
        "Bodas y eventos",
        "Conexiones posteriores en ferry"
      ]
    },
    "private-tours": {
      "name": "Tours privados de un día",
      "tagline": "Tu conductor del día, tu itinerario.",
      "intro": "Knossos, Elafonissi, Samaria, la meseta de Lasithi... con un conductor que conoce los atajos y las buenas tabernas.",
      "body": "Reserva un conductor para 6, 8 o 10 horas. Diseñe su propio itinerario o utilice una de nuestras rutas sugeridas: Knossos + museo de Heraclión + circuito de bodegas Archanes, el día de playa en la costa oeste (Balos + Falasarna) o el recorrido por la meseta de Lasithi + cueva Dikteon.",
      "whatsIncluded": [
        "Guía-conductor con licencia local.",
        "Vehículo de día completo",
        "Agua a bordo",
        "Itinerarios sugeridos"
      ],
      "bestFor": [
        "Viajeros interesados en la cultura",
        "Familias con niños",
        "Quienes visitan Creta por primera vez"
      ]
    },
    "long-distance": {
      "name": "Traslados de larga distancia",
      "tagline": "Cruza toda la isla a un precio fijo.",
      "intro": "Heraclión a Chania, Chania a Elounda, Rethymno a Sitia. Las rutas largas bien hechas.",
      "body": "Los viajes de dos horas por las carreteras de Creta son su propia experiencia. Usamos clase estándar y superior en recorridos a través de la isla: espacio adicional para las piernas, agua a bordo, un conductor que sabe dónde detenerse para tomar el mejor café a mitad de camino.",
      "whatsIncluded": [
        "Clase estándar o superior",
        "Parada de café gratis",
        "Agua a bordo",
        "Precio fijo, sin recargo por kilómetro"
      ],
      "bestFor": [
        "Itinerarios entre regiones",
        "Excursiones de un día en cruceros",
        "Grupos que se mueven entre regiones"
      ]
    },
    "group-transfers": {
      "name": "Traslados para grupos",
      "tagline": "Minivans, minibuses o flota de coches para bodas y eventos.",
      "intro": "Seis amigos o sesenta invitados: tenemos los vehículos y la coordinación.",
      "body": "Nuestra clase Van Standard transporta hasta 7 pasajeros con 7 maletas. Para grupos más grandes disponemos de minibuses de 12 y 16 plazas, o coordinamos varios vehículos en una misma reserva. Bodas en Elounda, oficinas corporativas en Chania, reuniones familiares en Rethymno: un contacto, un precio fijo.",
      "whatsIncluded": [
        "Coordinación multivehículo",
        "Contacto del conductor principal",
        "Descuento por reserva de grupo de más de 3 vehículos",
        "Experiencia de bodas y eventos"
      ],
      "bestFor": [
        "Grupos de más de 4 pasajeros",
        "Bodas y eventos",
        "Viajes de empresa"
      ]
    }
  },
  "regions": {
    "chania": {
      "headline": "La capital occidental, el puerto veneciano, las Montañas Blancas.",
      "intro": "Desde aquí se llega al rincón más fotografiado de Creta: el casco antiguo de Chania, el desfiladero de Samaria, las playas de Balos y Falasarna.",
      "body": "Chania es el lugar donde el puerto veneciano todavía enmarca cada puesta de sol, donde las Montañas Blancas se elevan directamente desde el mar y donde los ferries del Pireo atracan en Souda antes del amanecer. Nuestros conductores cubren el Aeropuerto Internacional de Chania (CHQ), el puerto de Souda y todos los centros turísticos desde Kissamos en el oeste hasta Georgioupoli en el este.",
      "gateway": "Aeropuerto de Chania (CHQ) y puerto de Souda"
    },
    "rethymno": {
      "headline": "Casco antiguo veneciano, largas playas de arena y desfiladeros.",
      "intro": "La prefectura del medio: el encanto del casco antiguo al norte, las salvajes gargantas de la costa sur y las calas turquesas de Bali en el medio.",
      "body": "El casco antiguo veneciano de Rethymno es lo suficientemente compacto como para caminar en una tarde, pero la región se extiende desde Bali en la costa norte hasta Plakias en el sur, atravesada por el desfiladero de Kourtaliotiko. Servimos a todos los hoteles desde Panormo hasta Agia Galini.",
      "gateway": "Se llega desde los aeropuertos de Chania (CHQ) o Heraclión (HER)"
    },
    "heraklion": {
      "headline": "La puerta de entrada principal, Knossos, la franja turística de la costa norte.",
      "intro": "El aeropuerto más grande de Creta, el puerto más activo y el palacio minoico de Knossos, además de 40 kilómetros de costa turística.",
      "body": "Heraclión International (HER) es el lugar donde cuatro de cada cinco turistas aterrizan en Creta. La ciudad en sí es la capital cultural de la isla: Knossos, el Museo Arqueológico y la fortaleza portuaria. Al este de la ciudad, la franja turística va desde Anissaras pasando por Hersonissos, Stalis y Malia. Al sur, la llanura de Messara conduce a Matala y al mar de Libia.",
      "gateway": "Aeropuerto de Heraclión (HER) y puerto de Heraclión"
    },
    "lasithi": {
      "headline": "El lujo del este: Elounda, la bahía de Mirabello, las palmeras de Vai.",
      "intro": "Hogar de los hoteles de lujo más emblemáticos de Creta, la bahía de Mirabello y la playa de palmeras de Vai, en el extremo oriental.",
      "body": "Lasithi es la prefectura más tranquila y oriental, y la que tiene la mayor concentración de hoteles de cinco estrellas. Elounda, en la península de la Bahía de Mirabello, alberga el Palacio Azul, las Cúpulas de Elounda, la Playa de Elounda y el Palacio de la Bahía de Elounda. Más allá de Agios Nikolaos, la costa está vacía hasta Sitia y Vai.",
      "gateway": "Se llega desde el aeropuerto de Heraclión (HER)"
    }
  },
  "vehicles": {
    "economy": {
      "label": "Economía",
      "capacity": "1 a 3 pasajeros",
      "bags": "3 bolsas",
      "description": "Skoda Octavia, Toyota Prius o similar. Climatizado, limpio, puntual.",
      "example": "Skoda Octavia"
    },
    "comfort": {
      "label": "Clase estándar",
      "capacity": "1 a 3 pasajeros",
      "bags": "3 bolsas",
      "description": "Mercedes Clase E, BMW Serie 5 o similar. Espacio extra para las piernas, agua a bordo.",
      "example": "Mercedes E-Class"
    },
    "luxury": {
      "label": "Primera Clase",
      "capacity": "1 a 3 pasajeros",
      "bags": "3 bolsas",
      "description": "Mercedes Clase S, BMW 7, Audi A8 o similar. Servicio de chófer, precio todavía fijo.",
      "example": "Mercedes S-Class"
    },
    "suv": {
      "label": "SUV",
      "capacity": "1 a 6 pasajeros",
      "bags": "6 bolsas",
      "description": "Cadillac Escalade, Chevrolet Suburban o similar. Espacio y presencia para las familias.",
      "example": "Cadillac Escalade"
    },
    "minivan": {
      "label": "Furgoneta estándar",
      "capacity": "1 a 7 pasajeros",
      "bags": "7 bolsas",
      "description": "Mercedes Vito, Ford Custom o similar. La elección adecuada para familias y grupos.",
      "example": "Mercedes Vito"
    },
    "van-first": {
      "label": "Furgoneta de primera clase",
      "capacity": "1 a 6 pasajeros",
      "bags": "6 bolsas",
      "description": "Mercedes Clase V o similar. Comodidad en furgoneta premium para grupos pequeños.",
      "example": "Mercedes V-Class"
    },
    "minibus-12": {
      "label": "Minibús (12 Pax)",
      "capacity": "1 a 12 pasajeros",
      "bags": "12 bolsas",
      "description": "Mercedes Sprinter, Ford Transit o similar. Ideal para grupos más grandes.",
      "example": "Mercedes Sprinter"
    },
    "minibus-16": {
      "label": "Minibús (16 Pax)",
      "capacity": "1 a 16 pasajeros",
      "bags": "16 bolsas",
      "description": "Mercedes Sprinter, Ford Transit o similar. Aforo máximo para fiestas y equipos.",
      "example": "Mercedes Sprinter"
    }
  },
  "routes": {
    "heraklion-airport-to-elounda": {
      "blurb": "El clásico traslado desde el aeropuerto de Heraclión por la costa noreste hasta los hoteles boutique de Elounda y la bahía de Mirabello.",
      "notes": "La ruta sigue la autopista costera E75 hasta Agios Nikolaos y luego la sinuosa carretera montañosa hasta Elounda. Los conductores conocen las entradas privadas a los hoteles en Blue Palace, Domes y Elounda Beach."
    },
    "heraklion-airport-to-agios-nikolaos": {
      "blurb": "Siga recto por la autopista E75 hasta Agios Nikolaos y el lago Voulismeni, la plaza más publicada en Instagram de Creta.",
      "notes": "Autopista en todo su recorrido. Aproximadamente una hora fuera de las tardes pico de agosto."
    },
    "heraklion-airport-to-hersonissos": {
      "blurb": "Salto corto hacia el este hasta la zona turística: los hoteles Stalis, Malia y Hersonissos.",
      "notes": "El tráfico puede disminuir la velocidad en los últimos 3 km en las noches pico de verano; construimos un búfer."
    },
    "heraklion-airport-to-malia": {
      "blurb": "Diríjase hacia el este hasta la zona turística de Malia y las ruinas del palacio minoico.",
      "notes": "E75 durante todo el trayecto, bajada en cualquier puerta del hotel."
    },
    "heraklion-airport-to-stalis": {
      "blurb": "La tranquila hermana mediana entre Hersonissos y Malia.",
      "notes": "Recorrido recto por la E75: menos de 35 minutos en horas valle."
    },
    "heraklion-airport-to-rethymno": {
      "blurb": "Oeste por la E75 con el mar de Creta a su derecha durante todo el camino. Servicio de traslado al antiguo puerto veneciano disponible.",
      "notes": "El casco antiguo de Rethymno es peatonal: lo dejaremos en el puerto o en el punto de acceso al hotel más cercano."
    },
    "heraklion-airport-to-chania": {
      "blurb": "El recorrido completo por la costa norte. Dos horas de viaje, un precio claro.",
      "notes": "Menos vuelos aterrizan en Chania, por lo que este traslado entre islas es popular. Paramos a tomar un café si quieres."
    },
    "heraklion-airport-to-matala": {
      "blurb": "Hacia el sur, a través de la llanura de Messara, hasta las cuevas de la época hippie de la bahía de arena roja de Matala.",
      "notes": "La ruta cruza el paso de montaña de Agia Varvara, espectacular a la luz de la mañana."
    },
    "heraklion-airport-to-bali": {
      "blurb": "El pueblo pesquero de cuatro calas a medio camino de Rethymno.",
      "notes": "Empinado descenso final hacia el pueblo de Bali: nuestros conductores conocen las carreteras de acceso al hotel."
    },
    "heraklion-airport-to-anissaras": {
      "blurb": "La franja exclusiva justo antes de Hersonissos, hogar de las grandes marcas turísticas.",
      "notes": "Uno de los traslados más rápidos del catálogo: menos de 30 minutos a cualquier hora del día."
    },
    "heraklion-airport-to-analipsi": {
      "blurb": "El grupo hotelero de Nana Beach y tranquilas playas familiares.",
      "notes": "Salga en el cruce de Analipsi, a cinco minutos de la autopista."
    },
    "heraklion-airport-to-ierapetra": {
      "blurb": "Al sureste de la ciudad más meridional de Europa. Un viaje largo y que merece la pena.",
      "notes": "La ruta cruza el paso de Selinari y desciende por la llanura de Ierapetra."
    },
    "heraklion-port-to-matala": {
      "blurb": "Directamente desde el ferry nocturno desde El Pireo hasta la playa de Matala.",
      "notes": "Realizamos un seguimiento de los horarios de ANEK y Minoan; La llegada retrasada no tiene ningún coste."
    },
    "heraklion-port-to-chania": {
      "blurb": "Salga del ferry y siga recto hacia el oeste cruzando la isla.",
      "notes": "Viaje de más de dos horas; Pararemos a medio camino para tomar un café si quieres."
    },
    "chania-airport-to-chania-old-town": {
      "blurb": "Directo al puerto veneciano, con servicio de bienvenida en llegadas y cartel con su nombre.",
      "notes": "El acceso al casco antiguo está restringido a los residentes: llegamos al borde del puerto, a 3 minutos a pie de la mayoría de los hoteles."
    },
    "chania-airport-to-rethymno": {
      "blurb": "Al este por la E75 a lo largo de la costa norte, pasando la playa de Georgioupoli.",
      "notes": "Una de nuestras rutas más fluidas: autopista hasta el final."
    },
    "chania-airport-to-kissamos": {
      "blurb": "La puerta de entrada a Balos y Falasarna. Oeste a través de Chania y hacia la península de Rodopou.",
      "notes": "¿Se dirige a la salida del barco de Balos a la mañana siguiente? Cuéntanos: te aconsejaremos sobre la hora de recogida."
    },
    "chania-airport-to-platanias": {
      "blurb": "La animada franja de playa justo al oeste de la ciudad de Chania.",
      "notes": "Carretera costera, vistas al mar la mayor parte del camino."
    },
    "chania-airport-to-georgioupoli": {
      "blurb": "La ciudad turística situada en la desembocadura del río, a medio camino de Rethymno.",
      "notes": "Autopista directa, luego un breve ramal."
    },
    "chania-airport-to-kolymbari": {
      "blurb": "La costa oeste más tranquila: hogar del Grecotel Amirandes y Domes Zeen.",
      "notes": "Carretera costera con vistas panorámicas a la bahía de Souda."
    },
    "chania-airport-to-almyrida": {
      "blurb": "La península de Apokoronas: calas tranquilas y tabernas familiares.",
      "notes": "Corto recorrido panorámico por Kalyves y a lo largo de la costa."
    },
    "chania-airport-to-falasarna": {
      "blurb": "El lejano oeste: la playa al atardecer de Falasarna y sus ruinas antiguas.",
      "notes": "Autopista y después carretera de montaña por la zona olivarera."
    },
    "chania-airport-to-sougia": {
      "blurb": "Cruza las Montañas Blancas hasta la tranquila costa sur.",
      "notes": "Ruta sinuosa de montaña: espectacular, calcule los 90 minutos completos."
    },
    "chania-airport-to-paleochora": {
      "blurb": "La ciudad hippie en la costa suroeste.",
      "notes": "Largo viaje por las montañas; si lo desea, realizamos una parada panorámica."
    },
    "souda-port-to-chania-old-town": {
      "blurb": "El ferry de la mañana desde El Pireo llega a las 06:00. Estamos allí, con el café en la mano.",
      "notes": "Seguimos los horarios de ANEK y Minoan. Llegada retrasada, sin cargo."
    },
    "rethymno-to-bali": {
      "blurb": "Hacia el este a lo largo de la costa hasta las cuatro calas del pueblo de Bali.",
      "notes": "Sencillo salto por autopista, descenso de diez minutos hasta el pueblo."
    },
    "rethymno-to-panormo": {
      "blurb": "El bonito pueblo pesquero al este de Rethymno.",
      "notes": "Carretera costera hasta el final, el mar a la izquierda."
    },
    "rethymno-to-plakias": {
      "blurb": "Cruce hacia la costa sur por el desfiladero de Kourtaliotiko.",
      "notes": "Carretera sinuosa del desfiladero: uno de los recorridos más bellos de la isla."
    },
    "rethymno-to-agia-galini": {
      "blurb": "Al sur, hasta el puerto en forma de anfiteatro de Agia Galini.",
      "notes": "A través del valle de Amari y las estribaciones del monte Ida."
    },
    "agios-nikolaos-to-elounda": {
      "blurb": "El breve salto panorámico a la lujosa península de Elounda.",
      "notes": "Calle junto a un acantilado con vistas panorámicas de la bahía de Mirabello."
    },
    "agios-nikolaos-to-sitia": {
      "blurb": "El lejano oriente: costa, monasterios y tranquilos pueblos pesqueros.",
      "notes": "Nueva carretera nacional en la mayor parte del camino, luego el ramal costero."
    },
    "agios-nikolaos-to-vai": {
      "blurb": "Al palmeral de Vai, el único palmeral natural de Europa.",
      "notes": "Viaje de un día largo; podemos esperar y regresar."
    }
  },
  "markets": {
    "greece": {
      "heroTitle": "Traslados privados en Grecia",
      "heroBody": "Recogidas en aeropuertos, complejos turísticos insulares y ciudades continentales: precios fijos con choferes locales autorizados. Reserva instantánea en Creta; confirmación de presupuesto en otros lugares de Grecia.",
      "metaTitle": "Traslados Privados en Grecia | Aeropuertos y Ciudades · TransferAround",
      "metaDescription": "Traslados privados de precio fijo a través de Grecia: aeropuertos de Atenas, Creta, Cícladas, Jónico y Dodecaneso. Conductores locales con licencia, servicio de bienvenida, seguimiento de vuelos.",
      "searchIntents": [
        "Traslado privado al aeropuerto en Grecia.",
        "Servicio de taxi en Grecia",
        "Traslados entre ciudades de Grecia",
        "Servicio de chófer en Grecia",
        "Traslados al aeropuerto de la isla.",
        "Traslados al puerto de ferry"
      ]
    },
    "spain": {
      "heroTitle": "Traslados privados en España",
      "heroBody": "Traslados a aeropuertos y ciudades en toda España: confirmación de presupuesto con socios locales autorizados. Ampliando cobertura en Madrid, Barcelona, ​​Málaga e islas.",
      "metaTitle": "Traslados Privados en España | Aeropuertos y Ciudades · TransferAround",
      "metaDescription": "Solicite un traslado privado a precio fijo en España. Madrid, Barcelona, ​​Málaga y aeropuertos insulares: chóferes autorizados, servicio de bienvenida.",
      "searchIntents": [
        "Traslado privado al aeropuerto en España.",
        "traslado al aeropuerto de madrid",
        "Chofer privado Barcelona",
        "Aeropuerto de Málaga a la Costa del Sol",
        "Traslado aeropuerto ibiza",
        "Traslados entre ciudades de España"
      ]
    },
    "italy": {
      "heroTitle": "Traslados privados en Italia",
      "heroBody": "Traslados a aeropuertos, estaciones y ciudades en toda Italia: reserva basada en presupuesto con chóferes locales examinados. Primero los corredores de Roma, Milán, Venecia y Amalfi.",
      "metaTitle": "Traslados Privados en Italia | Aeropuertos y Ciudades · TransferAround",
      "metaDescription": "Solicite un traslado privado a precio fijo en Italia. Roma, Milán, Venecia y centros turísticos costeros: conductores con licencia, servicio de bienvenida.",
      "searchIntents": [
        "Traslado privado al aeropuerto en Italia.",
        "Traslado Roma Fiumicino",
        "Chofer de Milán Malpensa",
        "Traslado al aeropuerto de Venecia.",
        "Traslado privado a la costa de Amalfi.",
        "Traslados entre ciudades de Italia"
      ]
    }
  },
  "marketHubs": {
    "madrid-barajas-airport-transfers-mad": {
      "intro": "Solicite un traslado privado a precio fijo desde Madrid-Barajas (MAD) al centro de la ciudad, hoteles y pueblos de alrededor.",
      "name": "Aeropuerto de Madrid-Barajas"
    },
    "barcelona-el-prat-airport-transfers-bcn": {
      "intro": "Traslados privados desde Barcelona-El Prat (BCN) a la ciudad, Sitges y Costa Brava — confirmación de presupuesto con chóferes autorizados.",
      "name": "Aeropuerto de Barcelona-El Prat"
    },
    "malaga-airport-transfers-agp": {
      "intro": "Traslados al aeropuerto de la Costa del Sol desde Málaga (AGP) — Marbella, Torremolinos y más allá con un precio fijo.",
      "name": "Aeropuerto de Málaga"
    },
    "rome-fiumicino-airport-transfers-fco": {
      "intro": "Traslados privados desde Roma Fiumicino (FCO) al centro histórico, zona del Vaticano y puerto de Civitavecchia.",
      "name": "Aeropuerto de Roma Fiumicino"
    },
    "milan-malpensa-airport-transfers-mxp": {
      "intro": "Traslados privados de Malpensa (MXP) a Milán, Como y el Lago Mayor: presupuestos con precio fijo, conductores con licencia.",
      "name": "Aeropuerto de Milán Malpensa"
    },
    "venice-marco-polo-airport-transfers-vce": {
      "intro": "Traslados de Venecia Marco Polo (VCE) a Piazzale Roma, Mestre y las islas cercanas: vehículos privados con presupuesto.",
      "name": "Aeropuerto Marco Polo de Venecia"
    },
    "madrid": {
      "intro": "Chóferes privados para hoteles, estaciones y excursiones de Madrid.",
      "name": "madrid"
    },
    "barcelona": {
      "intro": "Traslados ciudad y aeropuerto de Barcelona con precio fijo.",
      "name": "barcelona"
    },
    "malaga": {
      "intro": "Traslados privados Málaga y Costa del Sol.",
      "name": "málaga"
    },
    "rome": {
      "intro": "Traslados privados Roma ciudad, aeropuerto y puerto de cruceros.",
      "name": "Roma"
    },
    "milan": {
      "intro": "Distrito de la moda de Milán, aeropuertos y traslados a los lagos.",
      "name": "Milán"
    },
    "venice": {
      "intro": "Traslados privados al aeropuerto y al hotel de Venecia y Véneto.",
      "name": "Venecia"
    }
  },
  "airports": {
    "crete-heraklion-airport-transfers-her": {
      "name": "Aeropuerto de Heraclión, Creta",
      "alias": "Aeropuerto de Heraclión",
      "intro": "El aeropuerto de Creta Heraclión se encuentra a sólo 4 km de la ciudad más grande de la isla. La reserva previa de un traslado privado TransferAround garantiza un conductor local con licencia esperando en llegadas con su nombre, sin colas de taxis ni tarifas dinámicas.",
      "terminals": "Terminal única para todas las llegadas y salidas.",
      "pickupPoint": "Salida de la sala de equipajes de llegadas con cartel con su nombre.",
      "cityDriveMin": "15 a 20 minutos en horas valle; hasta 30 min de 08:00 a 09:00 y de 17:00 a 19:00",
      "tollsNote": "No hay carreteras de peaje ni tarifas LEZ en las rutas de Creta desde HER.",
      "knowBefore": [
        {
          "title": "Terminal única, llegadas sencillas",
          "body": "Una terminal maneja todos los vuelos. Después de recoger el equipaje, salga a la sala de llegadas, donde su conductor le espera con un cartel con su nombre. Espera de 60 minutos gratuita incluida por retrasos y equipaje."
        },
        {
          "title": "E75: 4 km, 15 a 20 minutos normalmente",
          "body": "El aeropuerto se encuentra a 4 km del centro de Heraclión por la E75. Permitir hasta 30 minutos en las horas pico de viaje; no existe una ruta alternativa útil."
        },
        {
          "title": "Sin peajes ni cargos de carretera ocultos",
          "body": "Creta no tiene carreteras de peaje ni zonas de bajas emisiones en este corredor. Su precio fijo de TransferAround es el precio que usted paga."
        },
        {
          "title": "Transporte privado con licencia, 24/7",
          "body": "Los conductores poseen el permiso de conducir especial de Grecia para transporte privado de pasajeros. Los traslados funcionan a cualquier hora, incluso cuando los autobuses KTEL paran y las paradas de taxis se alargan."
        }
      ],
      "insights": [
        "El aeropuerto de Creta Heraclión opera una **terminal única**. Los pasajeros caminan o toman un breve autobús de pista hasta las llegadas, pasan por inmigración si es necesario, recogen las maletas y luego salen por la **salida de la sala de equipajes de llegadas**, el punto de encuentro para las recogidas en TransferAround. El estacionamiento para recogida a corto plazo es gratuito y está a un minuto a pie de la salida.",
        "El viaje al centro de la ciudad de Heraclión sigue la **E75**, recorriendo unos 4 km. El tiempo de puerta a puerta suele ser de 15 a 20 minutos; Los picos entre semana (08:00–09:00 y 17:00–19:00) pueden extenderse hasta 30 minutos. Toda la congestión se concentra en este corredor.",
        "Los autobuses urbanos KTEL (líneas 6, 11, 12) cuestan alrededor de 2 €, pero funcionan aproximadamente de 06:00 a medianoche y son incómodos con el equipaje. La parada de taxis suele costar entre 20 y 30 € con riesgo de cola. Un **traslado privado reservado previamente** garantiza el precio, incluye seguimiento de vuelos y servicio de bienvenida, y elimina las conjeturas, especialmente para familias y llegadas tardías."
      ],
      "comparison": [
        {
          "mode": "Autobús público KTEL (líneas 6, 11, 12)",
          "time": "15 minutos",
          "cost": "2,00 euros",
          "pros": "Barato; directo hacia la ciudad",
          "cons": "Pago principalmente en efectivo; horario limitado; hacinamiento de equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "10-15 minutos en coche + cola",
          "cost": "20-30 euros",
          "pros": "Directo; 24/7",
          "cons": "Colas; precio variable según taxímetro; sin seguimiento de vuelos"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "15-20 minutos",
          "cost": "desde 40 euros",
          "pros": "Precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños bajo petición.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Creta Heraclión?",
          "a": "Su conductor lo recibirá en la salida de la sala de equipajes de llegadas con un cartel con su nombre. Sal detrás del equipaje y busca tu apellido."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Sí, completamente incluido. Creta no tiene peajes ni tarifas LEZ en las rutas HER-ciudad; la tarifa reservada es definitiva."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Heraclión hasta Heraclión?",
          "a": "Normalmente, entre 15 y 20 minutos por la E75; en hora punta de días laborables, hasta 30 minutos."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Creta Heraclión?",
          "a": "Los taxis de parada son convenientes, pero las colas y las tarifas nocturnas añaden fricción. TransferAround fija el precio y el tiempo con el seguimiento de los vuelos."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "HER tiene una terminal: todos los vuelos llegan al mismo edificio. Su conductor se actualiza si los horarios cambian."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Creta Heraclión tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de heraclión, creta?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Creta Heraclión?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "chania-international-airport-transfers-chq": {
      "name": "Aeropuerto Internacional de Chania",
      "alias": "Aeropuerto de Chania",
      "intro": "El aeropuerto de Chania es la puerta de entrada al oeste de Creta, a unos 14 km del puerto veneciano. Los conductores de TransferAround conocen los límites de bajada del casco antiguo y las carreteras de acceso al resort desde Platanias a Kissamos.",
      "terminals": "Terminal única.",
      "pickupPoint": "Salida de la sala de llegadas con cartel con su nombre.",
      "cityDriveMin": "20-30 minutos al casco antiguo de Chania",
      "tollsNote": "No hay peajes en Creta. El puerto de Souda está cerca y ofrece conexiones en ferry.",
      "knowBefore": [
        {
          "title": "Llegadas compactas de una sola terminal",
          "body": "Recoge las maletas y sal a la sala de llegadas. Su conductor espera con un cartel con su nombre; se incluyen 60 minutos de tiempo de espera gratuito."
        },
        {
          "title": "14 km hasta el casco antiguo por carreteras costeras",
          "body": "Espere entre 20 y 30 minutos, dependiendo del tráfico que atraviese Souda y el anillo de Chania. Las noches pico de verano añaden tiempo."
        },
        {
          "title": "Límites de vehículos en el casco antiguo",
          "body": "Gran parte del núcleo del puerto es peatonal. Nos detendremos en el punto de acceso legal más cercano a su hotel; confirme la dirección al hacer la reserva."
        },
        {
          "title": "Ferry + aeropuerto el mismo día",
          "body": "El puerto de Souda está a pocos minutos de la carretera del aeropuerto. Podemos conectar llegadas o salidas de ferry en el mismo itinerario como un complemento de presupuesto."
        }
      ],
      "insights": [
        "El aeropuerto de Chania (CHQ) es un centro estacional de terminal única para el oeste de Creta. Después de recoger el equipaje, salga a la sala de llegadas para recibir el servicio de bienvenida a TransferAround. La explanada es compacta; Los conductores se paran cerca y envían mensajes cuando aterrice.",
        "El camino hacia Chania sigue el principal corredor costero pasando por la bahía de Souda. El trayecto puerta a puerta hasta el casco antiguo suele tardar entre 20 y 30 minutos. Las zonas turísticas del oeste (Platanias, Agia Marina) y del este (Georgioupoli, Almyrida) añaden tiempo, pero siguen siendo corredores de precio fijo en nuestro catálogo.",
        "Los autobuses KTEL existen, pero son poco frecuentes en comparación con las olas chárter. Las se forman colas en las paradas de taxis entre julio y agosto. **El traslado privado** elimina el riesgo de hacer cola y garantiza el precio antes de aterrizar, algo esencial para vuelos chárter tardíos y entregas en villas en caminos estrechos de pueblos."
      ],
      "comparison": [
        {
          "mode": "Autobús KTEL",
          "time": "30 a 40 minutos",
          "cost": "2-3 euros",
          "pros": "Barato",
          "cons": "Horario limitado; problemas de equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "20-30 minutos",
          "cost": "25-35 euros",
          "pros": "directo",
          "cons": "Cola + tarifa variable"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "20-30 minutos",
          "cost": "desde 35 euros",
          "pros": "Precio fijo, servicio de bienvenida, seguimiento de vuelos.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor de TransferAround en el Aeropuerto Internacional de Chania?",
          "a": "El conductor espera en la salida de la sala de llegadas con un cartel con su nombre después de recoger el equipaje."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Sin peajes en Creta. Su precio fijo incluye todos los costos de carretera en las rutas CHQ estándar."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto internacional de Chania hasta Chania?",
          "a": "El trayecto suele durar 20-30 minutos al casco antiguo de Chania."
        },
        {
          "q": "¿Cómo se compara TransferAround con los taxis en el Aeropuerto Internacional de Chania?",
          "a": "Los taxis de parada funcionan, pero en verano las colas son largas. Arreglamos el precio y seguimos su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Terminal única: no hay que preocuparse por cambios de terminal."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el Aeropuerto Internacional de Chania tienen licencias griegas válidas para el transporte privado de pasajeros, están completamente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto internacional de chania?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto internacional de Chania?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "athens-airport-transfers-ath": {
      "name": "Aeropuerto de Atenas",
      "alias": "Aeropuerto Internacional de Atenas",
      "intro": "El aeropuerto de Atenas maneja más de 30 millones de pasajeros al año en dos terminales. Los socios de TransferAround lo recibirán en la llegada con un cartel con su nombre, controlarán su vuelo e incluirán los peajes de las autopistas en el precio fijo.",
      "terminals": "Terminal Principal y Terminal Satélite unidas por paso subterráneo.",
      "pickupPoint": "Salida de la sala de equipajes de llegadas (planta baja)",
      "cityDriveMin": "25 a 35 minutos en horas valle; Picos de 45 a 60 minutos entre semana",
      "tollsNote": "Peaje Attiki Odos (~2,55€) y costes de la ZBE central incluidos en presupuestos con precio fijo.",
      "knowBefore": [
        {
          "title": "Dos terminales, un patrón de reunión",
          "body": "Las terminales principal y satélite se conectan bajo tierra. Su conductor lo recibirá en la salida de la sala de llegadas de equipaje de la planta baja de la terminal en la que aterriza, sin recargo."
        },
        {
          "title": "Peaje Attiki Odos incluido",
          "body": "El peaje de la A6 Attiki Odos y los costes de cumplimiento de la zona LEZ de Daktylios para el centro de Atenas están incluidos en su precio fijo de TransferAround."
        },
        {
          "title": "25-60 minutos al centro",
          "body": "Los recorridos por la ciudad en horas valle tardan entre 25 y 35 minutos. Los picos entre semana (07:30–09:30, 17:00–19:30) suelen necesitar entre 45 y 60 minutos."
        },
        {
          "title": "El Pireo y Rafina listos",
          "body": "Las conexiones de ferry a las islas son complementos populares: El Pireo, Rafina y Lavrio son corredores de presupuesto con precio fijo de ATH."
        }
      ],
      "insights": [
        "**El aeropuerto de Atenas (ATH)** divide las llegadas entre el pabellón A (no Schengen) y el pabellón B (Schengen/nacional) antes de una salida compartida para la sala de equipajes en la planta baja. Los conductores de TransferAround esperan allí con un cartel con su nombre y se ajustan si su avión utiliza la Terminal Satélite.",
        "La ruta hacia Atenas utiliza la **A64** y luego la **A6 Attiki Odos**. Los peajes están incluidos en su presupuesto. La congestión máxima en Attiki Odos es la variable principal, no la elección de la terminal.",
        "La línea 3 del metro (~9€, ~40 min) y el autobús X95 (~5,50€, ~60 min) son más baratos pero molestos con el equipaje. Los taxis oficiales utilizan tarifas fijas publicadas día/noche, pero las colas se forman en oleadas. Un **traslado privado** es la opción confiable de puerta a puerta con seguimiento de vuelos y tarifa fija."
      ],
      "comparison": [
        {
          "mode": "Línea 3 del Metro",
          "time": "~40 minutos",
          "cost": "9 euros",
          "pros": "Frecuente; asequible",
          "cons": "Aglomeraciones; hay que caminar con el equipaje"
        },
        {
          "mode": "Autobús expreso X95",
          "time": "~60 minutos",
          "cost": "5,50 euros",
          "pros": "24/7; barato",
          "cons": "Lento; mañanas llenas de gente"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "30 a 60 minutos",
          "cost": "40-55 euros",
          "pros": "Puerta a puerta",
          "cons": "Colas; tarifa regulada, pero puede haber cola"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "25 a 60 minutos",
          "cost": "desde 45 euros",
          "pros": "presupuesto con precio fijo, servicio de bienvenida, peajes incluidos.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Atenas?",
          "a": "Salida de la sala de equipajes de llegadas en la planta baja con un cartel con el nombre: Principal o Satélite, sin cargo adicional."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Sí. Attiki Odos y los costos LEZ relevantes están incluidos en el presupuesto confirmado."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Atenas hasta Atenas?",
          "a": "El trayecto suele durar 25 a 35 minutos en horas valle. Picos de 45 a 60 minutos entre semana."
        },
        {
          "q": "¿Cómo se compara TransferAround con los taxis en el aeropuerto de Atenas?",
          "a": "Los taxis oficiales utilizan bandas planas día/noche, pero las colas pueden ser largas. Eliminamos la espera y confirmamos el precio antes de que aterrices."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Sin recargo si aterriza en Satellite vs Main: el conductor se actualiza a partir de los datos de su vuelo."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Atenas tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de atenas?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Atenas?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "thessaloniki-airport-transfers-skg": {
      "name": "Aeropuerto de Thessaloniki",
      "alias": "Aeropuerto Makedonia",
      "intro": "El aeropuerto de Tesalónica es el segundo centro más transitado de Grecia. Los socios de TransferAround cubren ambas terminales con citas fijas y de bienvenida a la ciudad y a los centros turísticos de Halkidiki.",
      "terminals": "T1 y T2 unidas por pasillo interno.",
      "pickupPoint": "Llegadas salida de la sala de equipajes",
      "cityDriveMin": "25-35 minutos al centro de la ciudad",
      "tollsNote": "No hay peajes importantes en el trayecto estándar SKG-ciudad.",
      "knowBefore": [
        {
          "title": "Dos terminales, una lógica de captación",
          "body": "T1 y T2 se conectan en interiores. Su conductor lo recibirá en la salida de la sala de llegadas de equipaje de su terminal."
        },
        {
          "title": "25-35 minutos al centro",
          "body": "El acceso costero a Salónica suele tardar menos de 35 minutos fuera de las horas punta de viaje."
        },
        {
          "title": "Pasillos de Halkidiki",
          "body": "Los centros turísticos de Kassandra y Sithonia son rutas cotizadas populares: recorridos fijos más largos con vehículos aptos para equipaje."
        },
        {
          "title": "Llegadas nocturnas cubiertas",
          "body": "Las escapadas a ciudades y chárter suelen llegar tarde. Cobertura 24/7 con seguimiento de vuelos está incluida en cada presupuesto."
        }
      ],
      "insights": [
        "SKG opera **T1 y T2** con un patrón de llegadas compartido. Después de inmigración y equipaje, salga al punto de encuentro de la sala de equipaje donde los conductores de TransferAround sostienen un cartel con su nombre.",
        "Los traslados a la ciudad siguen la carretera principal del aeropuerto hacia Tesalónica. El tiempo de puerta a puerta suele ser de 25 a 35 minutos. Halkidiki añade una distancia significativa pero sigue siendo un caso de uso central.",
        "Los autobuses existen pero son incómodos con el equipaje. Los taxis de parada están disponibles con riesgo de colas en las horas pico. **Transporte privado** fija el precio y el horario para familias y viajeros de negocios."
      ],
      "comparison": [
        {
          "mode": "Autobús público",
          "time": "40-50 minutos",
          "cost": "2 euros",
          "pros": "Barato",
          "cons": "traslados; equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "25-35 minutos",
          "cost": "25-35 euros",
          "pros": "directo",
          "cons": "Cola; variable"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "25-35 minutos",
          "cost": "desde 35 euros",
          "pros": "presupuesto con precio fijo, servicio de bienvenida, seguimiento de vuelos.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Tesalónica?",
          "a": "Salida de la sala de equipajes de llegadas en la T1 o T2 con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Las rutas urbanas estándar no tienen peajes importantes; se incluyen todos los cargos por carretera en cotizaciones más largas."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Thessaloniki hasta Thessaloniki?",
          "a": "El trayecto suele durar 25-35 minutos al centro de la ciudad."
        },
        {
          "q": "¿Cómo se compara TransferAround con los taxis en el aeropuerto de Tesalónica?",
          "a": "Hay taxis disponibles, pero las horas pico crean colas. Confirmamos tarifa y monitoreamos su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "El conductor sigue la asignación de terminales en tiempo real entre la T1 y la T2 sin coste adicional."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Tesalónica poseen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de thessaloniki?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Tesalónica?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "mykonos-airport-transfers-jmk": {
      "name": "Aeropuerto de Mykonos",
      "alias": "Aeropuerto de Mykonos",
      "intro": "El aeropuerto de Mykonos (JMK) está a pocos minutos de Ornos y Platys Yialos. Las colas de verano en las paradas de taxis son notorias: reserve con antelación un traslado privado TransferAround por una presupuesto con precio fijo y incluye servicio de bienvenida.",
      "terminals": "Terminal compacto único.",
      "pickupPoint": "Salida de llegadas con cartel con su nombre.",
      "cityDriveMin": "10-20 minutos a la ciudad de Mykonos",
      "tollsNote": "No hay peajes en Mykonos.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta la ciudad de Mykonos",
          "body": "10-20 minutos a la ciudad de Mykonos. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "No hay peajes en Mykonos."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Mykonos tienen licencias griegas válidas de transporte privado de pasajeros y conocen las carreteras de acceso a los hoteles en Mykonos."
        }
      ],
      "insights": [
        "El aeropuerto de Mykonos (JMK) sirve a Mykonos. El aeropuerto de Mykonos (JMK) está a pocos minutos de Ornos y Platys Yialos. Las colas de verano en las paradas de taxis son notorias: reserve con antelación un traslado privado TransferAround por una presupuesto con precio fijo y incluye servicio de bienvenida.",
        "Carreteras estrechas de la isla y bajadas de centros turísticos. Las se forman colas en las paradas de taxis entre julio y agosto.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y las paradas de taxis, ya que los autobuses tienen horarios limitados y resultan incómodos con equipaje. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "10-20 minutos a la ciudad de Mykonos",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "10-20 minutos a la ciudad de Mykonos",
          "cost": "desde 35 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Mykonos?",
          "a": "Su conductor espera en la salida de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "No hay peajes en Mykonos. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Mykonos hasta la ciudad de Mykonos?",
          "a": "El trayecto suele durar 10-20 minutos a la ciudad de Mykonos."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Mykonos?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Terminal compacto único. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Mykonos tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de mykonos?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Mykonos?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "santorini-airport-transfers-jtr": {
      "name": "Aeropuerto de Santorini",
      "alias": "Aeropuerto de Santorini",
      "intro": "El aeropuerto de Santorini (JTR) alimenta a Fira, Oia, Kamari y Perissa. Los presupuestos de TransferAround cubren hoteles en lo alto de acantilados con notas claras de llegada en zonas peatonales.",
      "terminals": "Terminal única.",
      "pickupPoint": "Sala de llegadas con cartel con su nombre.",
      "cityDriveMin": "15-25 minutos a Fira",
      "tollsNote": "Sin peajes; Los hoteles de caldera pueden necesitar caminar los últimos metros.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la sala de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta Fira",
          "body": "15-25 minutos hasta Fira. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "Sin peajes; Los hoteles de caldera pueden necesitar caminar los últimos metros."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Santorini tienen licencias griegas válidas de transporte privado de pasajeros y conocen las carreteras de acceso a los hoteles en Santorini."
        }
      ],
      "insights": [
        "El aeropuerto de Santorini (JTR) sirve a Santorini. El aeropuerto de Santorini (JTR) conecta con Fira, Oia, Kamari y Perissa. Los presupuestos de TransferAround cubren hoteles en lo alto de acantilados con indicaciones claras de llegada en zonas peatonales.",
        "Los recorridos por Oia tardan más en el tráfico pico al atardecer. Los transbordadores compartidos hacen múltiples paradas.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y las paradas de taxis que transportan el puerto de Athinios a un corredor separado. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "15-25 minutos a Fira",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "15-25 minutos a Fira",
          "cost": "desde 45 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor de TransferAround en el aeropuerto de Santorini?",
          "a": "Su conductor espera en la sala de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Sin peajes; Los hoteles de caldera pueden necesitar caminar los últimos metros. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Santorini hasta Fira?",
          "a": "El trayecto suele durar 15-25 minutos a Fira."
        },
        {
          "q": "¿Cómo se compara TransferAround con los taxis en el aeropuerto de Santorini?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Santorini tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de santorini?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Santorini?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "corfu-international-airport-transfers-cfu": {
      "name": "Aeropuerto de Corfú",
      "alias": "Aeropuerto de Corfú",
      "intro": "El aeropuerto de Corfú se encuentra a unos 2 km de la ciudad de Corfú. Los socios de TransferAround cubren Paleokastritsa, Dassia, Kavos y la costa norte con presupuestos con precio fijo.",
      "terminals": "Terminal única cerca de la ciudad.",
      "pickupPoint": "Salida de llegadas con cartel con su nombre.",
      "cityDriveMin": "10-15 minutos a la ciudad de Corfú",
      "tollsNote": "No hay peajes en Corfú.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta la ciudad de Corfú",
          "body": "10-15 minutos a la ciudad de Corfú. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "No hay peajes en Corfú."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Corfú tienen licencias de alquiler privadas griegas válidas y conocen las carreteras de acceso a los hoteles en Corfú."
        }
      ],
      "insights": [
        "El aeropuerto de Corfú (CFU) sirve a Corfú. El aeropuerto de Corfú se encuentra a unos 2 km de la ciudad de Corfú. Los socios de TransferAround cubren Paleokastritsa, Dassia, Kavos y la costa norte con presupuestos con precio fijo.",
        "Recorrido urbano extremadamente corto. Resort sur/norte agregue de 30 a 60 minutos.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y las paradas de taxis, que existen pero no llegan a muchas direcciones de villas. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "10-15 minutos a la ciudad de Corfú",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "10-15 minutos a la ciudad de Corfú",
          "cost": "desde 30 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Corfú?",
          "a": "Su conductor espera en la salida de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "No hay peajes en Corfú. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Corfú hasta la ciudad de Corfú?",
          "a": "El trayecto suele durar 10-15 minutos a la ciudad de Corfú."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Corfú?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Terminal única cerca de la ciudad. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Corfú tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de corfú?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Corfú?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "rhodes-airport-transfers-rho": {
      "name": "Aeropuerto de Rodas",
      "alias": "Aeropuerto de Rodas",
      "intro": "El aeropuerto de Rodas (RHO) es el centro del Dodecaneso. TransferAround cubre la ciudad medieval, Faliraki, Lindos y los centros turísticos de la costa oeste con presupuestos con precio fijo.",
      "terminals": "Terminal única.",
      "pickupPoint": "Sala de llegadas con cartel con su nombre.",
      "cityDriveMin": "20-30 minutos a la ciudad de Rodas",
      "tollsNote": "No hay peajes en Rodas.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la sala de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta la ciudad de Rodas",
          "body": "20-30 min hasta la ciudad de Rodas. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "No hay peajes en Rodas."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Rodas tienen licencias de alquiler privadas griegas válidas y conocen las carreteras de acceso a los hoteles en Rodas."
        }
      ],
      "insights": [
        "El aeropuerto de Rodas (RHO) sirve a Rodas. El aeropuerto de Rodas (RHO) es el centro del Dodecaneso. TransferAround cubre la ciudad medieval, Faliraki, Lindos y los centros turísticos de la costa oeste con presupuestos con precio fijo.",
        "Lindos es un recorrido panorámico más largo. Se forman colas de taxis en los oleadas de vuelos chárter.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y paradas de taxis que ktel cubre únicamente los principales centros turísticos. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "20-30 minutos a la ciudad de Rodas",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "20-30 minutos a la ciudad de Rodas",
          "cost": "desde 35 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Rodas?",
          "a": "Su conductor espera en la sala de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "No hay peajes en Rodas. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Rodas hasta la ciudad de Rodas?",
          "a": "El trayecto suele durar 20-30 minutos a la ciudad de Rodas."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Rodas?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Rodas poseen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de rodas?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Rodas?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "zakynthos-airport-transfers-zth": {
      "name": "Aeropuerto de Zakynthos",
      "alias": "Aeropuerto de Zakynthos",
      "intro": "El aeropuerto de Zakynthos (ZTH) se encuentra cerca de Laganas. Las cotizaciones de TransferAround cubren ciudades, Tsilivi y zonas turísticas con seguimiento de vuelos para vuelos chárter tardíos.",
      "terminals": "Terminal única.",
      "pickupPoint": "Salida de llegadas con cartel con su nombre.",
      "cityDriveMin": "15-25 minutos a la ciudad de Zakynthos",
      "tollsNote": "Sin peajes.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta la ciudad de Zakynthos",
          "body": "15-25 minutos a la ciudad de Zakynthos. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "Sin peajes."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Zakynthos tienen licencias griegas válidas de transporte privado de pasajeros y conocen las carreteras de acceso a los hoteles en Zakynthos."
        }
      ],
      "insights": [
        "El Aeropuerto de Zakynthos (ZTH) llega a Zakynthos. El aeropuerto de Zakynthos (ZTH) se encuentra cerca de Laganas. Las cotizaciones de TransferAround cubren ciudades, Tsilivi y zonas turísticas con seguimiento de vuelos para vuelos chárter tardíos.",
        "Laganás es el más cercano. Los centros turísticos del norte tardan más.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y las paradas de taxis, que son poco frecuentes durante la noche. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "15-25 minutos a la ciudad de Zakynthos",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "15-25 minutos a la ciudad de Zakynthos",
          "cost": "desde 30 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Zakynthos?",
          "a": "Su conductor espera en la salida de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Sin peajes. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Zakynthos hasta la ciudad de Zakynthos?",
          "a": "El trayecto suele durar 15-25 minutos a la ciudad de Zakynthos."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Zakynthos?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Zakynthos poseen licencias griegas válidas para el transporte privado de pasajeros, están completamente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de zakynthos?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Zakynthos?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "kefalonia-airport-transfers-efl": {
      "name": "Aeropuerto de Kefalonia",
      "alias": "Aeropuerto de Kefalonia",
      "intro": "El aeropuerto de Kefalonia (EFL) está cerca de Argostoli. TransferAround cubre las conexiones de ferry de Lixouri y los centros turísticos de la costa sur con tarifas fijas.",
      "terminals": "Terminal única.",
      "pickupPoint": "Sala de llegadas con cartel con su nombre.",
      "cityDriveMin": "15-25 minutos a Argostoli",
      "tollsNote": "Sin peajes; Carreteras de montaña a Skala/Lixouri.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la sala de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta Argostoli",
          "body": "15-25 minutos hasta Argostoli. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "Sin peajes; Carreteras de montaña a Skala/Lixouri."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Kefalonia tienen licencias griegas válidas de transporte privado de pasajeros y conocen las carreteras de acceso a los hoteles en Kefalonia."
        }
      ],
      "insights": [
        "El Aeropuerto de Kefalonia (EFL) sirve a Kefalonia. El aeropuerto de Kefalonia (EFL) está cerca de Argostoli. TransferAround cubre las conexiones de ferry de Lixouri y los centros turísticos de la costa sur con tarifas fijas.",
        "Carreteras sinuosas: permita la amortiguación. El ferry a Lixouri está separado.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y las paradas de taxis que los taxis limitan a altas horas de la noche. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "15-25 minutos a Argostoli",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "15-25 minutos a Argostoli",
          "cost": "desde 40 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Kefalonia?",
          "a": "Su conductor espera en la sala de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Sin peajes; Carreteras de montaña a Skala/Lixouri. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Kefalonia hasta Argostoli?",
          "a": "El trayecto suele durar 15-25 minutos a Argostoli."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Kefalonia?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Kefalonia tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de kefalonia?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Kefalonia?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "kos-airport-transfers-kgs": {
      "name": "Aeropuerto de Kos",
      "alias": "Aeropuerto de Kos",
      "intro": "El aeropuerto de Kos (KGS) está tierra adentro. Las cotizaciones de TransferAround cubren la ciudad de Kos, Kardamena y Mastichari con servicio de bienvenida.",
      "terminals": "Terminal única.",
      "pickupPoint": "Salida de llegadas con cartel con su nombre.",
      "cityDriveMin": "25-35 minutos a la ciudad de Kos",
      "tollsNote": "Sin peajes.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta la ciudad de Kos",
          "body": "25-35 minutos hasta la ciudad de Kos. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "Sin peajes."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Kos tienen licencias de alquiler privadas griegas válidas y conocen las carreteras de acceso a los hoteles en Kos."
        }
      ],
      "insights": [
        "El Aeropuerto de Kos (KGS) sirve a Kos. El aeropuerto de Kos (KGS) está tierra adentro. Las cotizaciones de TransferAround cubren la ciudad de Kos, Kardamena y Mastichari con servicio de bienvenida.",
        "La ciudad no está adyacente al aeropuerto. Tráfico de verano en la carretera principal.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y las paradas de taxis que los autobuses pasan por alto en muchos hoteles. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "25-35 minutos a la ciudad de Kos",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "25-35 minutos a la ciudad de Kos",
          "cost": "desde 35 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Kos?",
          "a": "Su conductor espera en la salida de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Sin peajes. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Kos hasta la ciudad de Kos?",
          "a": "El trayecto suele durar 25-35 minutos a la ciudad de Kos."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Kos?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Kos tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de kos?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Kos?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "aktion-lefkada-airport-transfers-pvk": {
      "name": "Aeropuerto de Aktion-Lefkada",
      "alias": "Aeropuerto de Aktion",
      "intro": "Aktion (PVK) sirve a Lefkada desde el continente. Los conductores de TransferAround viajan a la ciudad de Lefkada, Nikiana y Vassiliki con tarifas fijas.",
      "terminals": "Terminal única en costa continental.",
      "pickupPoint": "Sala de llegadas con cartel con su nombre.",
      "cityDriveMin": "30-40 min hasta la ciudad de Lefkada por la calzada elevada",
      "tollsNote": "Puente/calzada elevada: no hay peajes sorpresa en nuestras cotizaciones.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la sala de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta la ciudad de Lefkada",
          "body": "De 30 a 40 minutos hasta la ciudad de Lefkada por la calzada elevada. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "Puente/calzada elevada: no hay peajes sorpresa en nuestras cotizaciones."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto Aktion Lefkada tienen licencias griegas de transporte privado de pasajeros válidas y conocen las carreteras de acceso a los hoteles en Lefkada."
        }
      ],
      "insights": [
        "El Aeropuerto Aktion Lefkada (PVK) sirve a Lefkada. Aktion (PVK) sirve a Lefkada desde el continente. Los conductores de TransferAround viajan a la ciudad de Lefkada, Nikiana y Vassiliki con tarifas fijas.",
        "Se sale de la terminal por el lado continental. Tráfico por calzada en picos.",
        "Las alternativas incluyen autobuses públicos escasos y paradas de taxis ideales en lugar de esperar transporte compartido. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "30-40 min hasta la ciudad de Lefkada por la calzada elevada",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "30-40 min hasta la ciudad de Lefkada por la calzada elevada",
          "cost": "desde 45 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto Aktion Lefkada?",
          "a": "Su conductor espera en la sala de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Puente/calzada elevada: no hay peajes sorpresa en nuestras cotizaciones. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Aktion-Lefkada hasta la ciudad de Lefkada?",
          "a": "El trayecto suele durar 30-40 min hasta la ciudad de Lefkada por la calzada elevada."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto Aktion Lefkada?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Terminal única en costa continental. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto Aktion Lefkada tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de aktion-lefkada?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto Aktion Lefkada?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "paros-airport-transfers-pas": {
      "name": "Aeropuerto de Paros",
      "alias": "Aeropuerto de Paros",
      "intro": "El aeropuerto de Paros (PAS) está a pocos minutos de Parikia. TransferAround cubre Naoussa y complejos turísticos de playa con presupuestos con precio fijo, mejor que buscar taxis tras ir de isla en isla.",
      "terminals": "Pequeño terminal único.",
      "pickupPoint": "Salida de llegadas con cartel con su nombre.",
      "cityDriveMin": "10-15 minutos a Parikia",
      "tollsNote": "Sin peajes.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta Parikia",
          "body": "De 10 a 15 minutos hasta Parikia. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "Sin peajes."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Paros tienen licencias griegas válidas de transporte privado de pasajeros y conocen las carreteras de acceso a los hoteles en Paros."
        }
      ],
      "insights": [
        "El aeropuerto de Paros (PAS) sirve a Paros. El aeropuerto de Paros (PAS) está a pocos minutos de Parikia. TransferAround cubre Naoussa y complejos turísticos de playa con presupuestos con precio fijo, mejor que buscar taxis tras ir de isla en isla.",
        "Terminal pequeña, salida rápida. Naoussa agrega ~20 minutos.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y las paradas de taxis que funcionan escasamente por las noches. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "10-15 minutos a Parikia",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "10-15 minutos a Parikia",
          "cost": "desde 35 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Paros?",
          "a": "Su conductor espera en la salida de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Sin peajes. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Paros hasta Parikia?",
          "a": "El trayecto suele durar 10-15 minutos a Parikia."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Paros?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Pequeño terminal único. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Paros poseen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de paros?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Paros?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "naxos-airport-transfers-jnx": {
      "name": "Aeropuerto de Naxos",
      "alias": "Aeropuerto de Naxos",
      "intro": "El aeropuerto de Naxos (JNX) se encuentra en la costa oeste. Las cotizaciones de TransferAround cubren Chora y Agia Anna con encuentros para familias e invitados de la villa.",
      "terminals": "Pequeño terminal único.",
      "pickupPoint": "Salida de llegadas con cartel con su nombre.",
      "cityDriveMin": "10-15 minutos a Chora",
      "tollsNote": "Sin peajes.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta la ciudad de Naxos (Chora)",
          "body": "10-15 minutos hasta Chora. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "Sin peajes."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Naxos tienen licencias griegas válidas de transporte privado de pasajeros y conocen las carreteras de acceso a los hoteles en Naxos."
        }
      ],
      "insights": [
        "El Aeropuerto de Naxos (JNX) sirve a Naxos. El aeropuerto de Naxos (JNX) se encuentra en la costa oeste. Las cotizaciones de TransferAround cubren Chora y Agia Anna con encuentros para familias e invitados de la villa.",
        "Carreras cortas hasta Chora. Las playas del sur tardan más.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y las paradas de taxis que limitaban los taxis que llegaban tarde. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "10-15 minutos a Chora",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "10-15 minutos a Chora",
          "cost": "desde 30 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Naxos?",
          "a": "Su conductor espera en la salida de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Sin peajes. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Naxos hasta Chora?",
          "a": "El trayecto suele durar 10-15 minutos a Chora."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Naxos?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Pequeño terminal único. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Naxos poseen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de naxos?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Naxos?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "milos-airport-transfers-mlo": {
      "name": "Aeropuerto de Milos",
      "alias": "Aeropuerto de Milos",
      "intro": "El aeropuerto de Milos (MLO) conecta con el puerto de Adamas y Plaka. Las presupuestos con precio fijo de TransferAround superan la espera de los escasos taxis después de las llegadas por la tarde.",
      "terminals": "Pequeño terminal único.",
      "pickupPoint": "Salida de llegadas con cartel con su nombre.",
      "cityDriveMin": "15-20 minutos a Adamas",
      "tollsNote": "Sin peajes; caminos del pueblo a Plaka.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta Adamas",
          "body": "15-20 minutos hasta Adamas. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "Sin peajes; caminos del pueblo a Plaka."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Milos poseen licencias de alquiler privadas griegas válidas y conocen las carreteras de acceso a los hoteles en Milos."
        }
      ],
      "insights": [
        "El Aeropuerto de Milos (MLO) sirve a Milos. El aeropuerto de Milos (MLO) conecta con el puerto de Adamas y Plaka. Las presupuestos con precio fijo de TransferAround superan la espera de los escasos taxis después de las llegadas por la tarde.",
        "Red de islas compactas. Las carreteras de la colina de Plaka son estrechas.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y paradas de taxis que ofrecen conexiones portuarias disponibles. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "15-20 minutos a Adamas",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "15-20 minutos a Adamas",
          "cost": "desde 35 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Milos?",
          "a": "Su conductor espera en la salida de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Sin peajes; caminos del pueblo a Plaka. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Milos hasta Adamas?",
          "a": "El trayecto suele durar 15-20 minutos a Adamas."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Milos?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Pequeño terminal único. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Milos tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de milos?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Milos?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "mytilene-airport-transfers-mjt": {
      "name": "Aeropuerto de Mytilene",
      "alias": "Aeropuerto de Lesbos",
      "intro": "El aeropuerto de Mytilene (MJT) está cerca de la capital, Lesbos. Las cotizaciones de TransferAround cubren Mytilene y la costa norte de Molyvos.",
      "terminals": "Terminal única.",
      "pickupPoint": "Sala de llegadas con cartel con su nombre.",
      "cityDriveMin": "10-15 minutos a Mytilene",
      "tollsNote": "Sin peajes; recorridos más largos hasta Molyvos.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la sala de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje a Mytilene",
          "body": "10 a 15 minutos hasta Mytilene. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "Sin peajes; recorridos más largos hasta Molyvos."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Mytilene tienen licencias griegas válidas de transporte privado de pasajeros y conocen las carreteras de acceso a los hoteles en Lesbos."
        }
      ],
      "insights": [
        "El Aeropuerto de Mytilene (MJT) sirve a Lesbos. El aeropuerto de Mytilene (MJT) está cerca de la capital, Lesbos. Las cotizaciones de TransferAround cubren Mytilene y la costa norte de Molyvos.",
        "Traslado corto a la ciudad. Molyvos es un recorrido panorámico más largo.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y las paradas de taxis que los autobuses limitan para el equipaje. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "10-15 minutos a Mytilene",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "10-15 minutos a Mytilene",
          "cost": "desde 35 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Mytilene?",
          "a": "Su conductor espera en la sala de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Sin peajes; recorridos más largos hasta Molyvos. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Mytilene hasta Mytilene?",
          "a": "El trayecto suele durar 10-15 minutos a Mytilene."
        },
        {
          "q": "¿En qué se diferencia TransferAround de los taxis en el aeropuerto de Mytilene?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Terminal única. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Mytilene tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de mytilene?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Mytilene?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "sitia-airport-transfers-jsh": {
      "name": "Aeropuerto de Sitia",
      "alias": "Aeropuerto de Sitia",
      "intro": "El aeropuerto de Sitia (JSH) sirve al este de Creta. TransferAround ofrece precios instantáneos de Creta donde se catalogan y cotizaciones para entregas de villas hacia Vai y la costa sureste.",
      "terminals": "Pequeño terminal único.",
      "pickupPoint": "Salida de llegadas con cartel con su nombre.",
      "cityDriveMin": "10-15 minutos a la ciudad de Sitia",
      "tollsNote": "No hay peajes en el este de Creta.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la salida de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje a Sitia",
          "body": "10-15 minutos hasta la ciudad de Sitia. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "No hay peajes en el este de Creta."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el aeropuerto de Sitia tienen licencias griegas válidas de transporte privado de pasajeros y conocen las carreteras de acceso a hoteles en Creta."
        }
      ],
      "insights": [
        "El aeropuerto de Sitia (JSH) sirve a Creta. El aeropuerto de Sitia (JSH) sirve al este de Creta. TransferAround ofrece precios instantáneos de Creta donde se catalogan y cotizaciones para entregas de villas hacia Vai y la costa sureste.",
        "Alternativa tranquila a ELLA para los centros turísticos del este. Menos vuelos: reserve conductores con antelación.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y las paradas de taxis disponibles que conectan con Ierapetra. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "10-15 minutos a la ciudad de Sitia",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "10-15 minutos a la ciudad de Sitia",
          "cost": "desde 40 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me recibirá el conductor de TransferAround en el aeropuerto de Sitia?",
          "a": "Su conductor espera en la salida de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "No hay peajes en el este de Creta. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto de Sitia hasta Sitia?",
          "a": "El trayecto suele durar 10-15 minutos a la ciudad de Sitia."
        },
        {
          "q": "¿Cómo se compara TransferAround con los taxis en el aeropuerto de Sitia?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Pequeño terminal único. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el aeropuerto de Sitia tienen licencias griegas válidas para el transporte privado de pasajeros, están totalmente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto de sitia?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el aeropuerto de Sitia?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    },
    "kalamata-international-airport-transfers-klx": {
      "name": "Aeropuerto Internacional de Kalamata",
      "alias": "Aeropuerto de Kalamata",
      "intro": "El Aeropuerto Internacional de Kalamata (KLX) es la puerta de entrada a los vuelos chárter del Peloponeso. Los socios de TransferAround incluyen los peajes A7 en su presupuesto con precio fijo y lo recibirán en la salida de la sala de equipajes.",
      "terminals": "Terminal única y moderna.",
      "pickupPoint": "Salida de la sala de equipajes de llegadas con cartel con su nombre.",
      "cityDriveMin": "15-25 min por la A7 hasta el centro de la ciudad",
      "tollsNote": "Peajes de la Autopista A7 Moreas incluidos en presupuestos con precio fijo.",
      "knowBefore": [
        {
          "title": "Servicio de bienvenida en llegadas",
          "body": "Su conductor de TransferAround espera en la salida de la sala de equipajes de llegadas con un cartel con su nombre. La espera gratuita de 60 minutos cubre retrasos y equipaje."
        },
        {
          "title": "Tiempo de viaje hasta Kalamata",
          "body": "15-25 min por la A7 hasta el centro de la ciudad. El seguimiento del tráfico y del vuelo en tiempo real ajusta el horario de recogida."
        },
        {
          "title": "Carretera local y cargos",
          "body": "Peajes de la Autopista A7 Moreas incluidos en presupuestos con precio fijo."
        },
        {
          "title": "Choferes locales con licencia",
          "body": "Los conductores asociados en el Aeropuerto Internacional de Kalamata tienen licencias griegas válidas de transporte privado de pasajeros y conocen las carreteras de acceso a hoteles en todo el Peloponeso."
        }
      ],
      "insights": [
        "El Aeropuerto Internacional de Kalamata (KLX) sirve al Peloponeso. El Aeropuerto Internacional de Kalamata (KLX) es la puerta de entrada a los vuelos chárter del Peloponeso. Los socios de TransferAround incluyen los peajes A7 en su presupuesto con precio fijo y lo recibirán en la salida de la sala de equipajes.",
        "A7 es el corredor principal. Las tardes de mayor actividad entre semana añaden tiempo.",
        "Las alternativas incluyen los autobuses públicos con horarios limitados y las paradas de taxis, cuyas llegadas son limitadas. Un **traslado TransferAround reservado previamente** garantiza el precio, incluye bienvenida y seguimiento del vuelo, y elimina el estrés de la llegada, especialmente valioso con niños o aterrizajes tardíos."
      ],
      "comparison": [
        {
          "mode": "Autobús público / KTEL",
          "time": "Varía",
          "cost": "2-5 euros",
          "pros": "Más barato",
          "cons": "Horario limitado; incómodo con equipaje"
        },
        {
          "mode": "Taxi desde la parada",
          "time": "15-25 min por la A7 hasta el centro de la ciudad",
          "cost": "Con taxímetro / variable",
          "pros": "Directo, si hay disponibilidad",
          "cons": "Colas; incertidumbre de precios"
        },
        {
          "mode": "Traslado privado TransferAround",
          "time": "15-25 min por la A7 hasta el centro de la ciudad",
          "cost": "desde 35 euros",
          "pros": "precio fijo, servicio de bienvenida, espera de 60 minutos, sillas para niños.",
          "cons": "Reserva con antelación"
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor de TransferAround en el Aeropuerto Internacional de Kalamata?",
          "a": "Su conductor espera en la salida de la sala de equipajes de llegadas con un cartel con su nombre."
        },
        {
          "q": "¿Están incluidos los peajes y las tasas de carretera en el precio de TransferAround?",
          "a": "Peajes de la Autopista A7 Moreas incluidos en presupuestos con precio fijo. Confirmado en su presupuesto: sin extras sorpresa en la carretera."
        },
        {
          "q": "¿Cuánto dura el trayecto desde el aeropuerto internacional de Kalamata hasta Kalamata?",
          "a": "El trayecto suele durar 15-25 min por la A7 hasta el centro de la ciudad."
        },
        {
          "q": "¿Cómo se compara TransferAround con los taxis en el Aeropuerto Internacional de Kalamata?",
          "a": "Es posible que haya taxis disponibles, pero a menudo hacen cola en las horas pico. TransferAround fija el precio y controla su vuelo."
        },
        {
          "q": "¿Qué pasa si mi vuelo aterriza en una terminal diferente?",
          "a": "Terminal única y moderna. Su conductor sigue los datos del vuelo en vivo si cambian las puertas o los horarios."
        },
        {
          "q": "¿Los conductores de TransferAround tienen licencias griegas de transporte privado de pasajeros?",
          "a": "Sí. Los conductores asociados que operan en el Aeropuerto Internacional de Kalamata tienen licencias griegas válidas para el transporte privado de pasajeros, están completamente asegurados y autorizados para traslados al aeropuerto."
        },
        {
          "q": "¿TransferAround atiende llegadas nocturnas en el aeropuerto internacional de kalamata?",
          "a": "Sí. Los traslados están disponibles 24/7. Reserve con antelación e indique su número de vuelo para que el conductor siga la llegada en tiempo real."
        },
        {
          "q": "¿Cómo pago? ¿Se esperan propinas?",
          "a": "El pago se realiza con tarjeta al reservar o después de aceptar el presupuesto. La propina no es obligatoria en Grecia; para un servicio excepcional suele dejarse entre un 5 % y un 10 %."
        },
        {
          "q": "¿Hay sillas de coche para niños disponibles en el Aeropuerto Internacional de Kalamata?",
          "a": "Sí, sin coste adicional si se solicita con antelación. Indique las edades al reservar para que instalemos las sillas adecuadas antes de la recogida."
        },
        {
          "q": "¿Cuánto tiempo esperará el conductor si mi vuelo se retrasa?",
          "a": "Incluimos 60 minutos de espera gratuita en llegadas y seguimos su vuelo para ajustar automáticamente la recogida. Una espera adicional prolongada puede tener un pequeño coste."
        }
      ]
    }
  },
  "airportRoutes": {
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-elounda": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Elounda** recorre aproximadamente 71 km y dura unos 75 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "71 km · unos 75 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Elounda con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Elounda. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Elounda?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Elounda?",
          "a": "Normalmente, unos 75 minutos para recorrer 71 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-agios-nikolaos": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Agios Nikolaos** recorre aproximadamente 65 km y dura unos 65 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "65 km · unos 65 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Agios Nikolaos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Agios Nikolaos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Agios Nikolaos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Agios Nikolaos?",
          "a": "Normalmente, unos 65 minutos para recorrer 65 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-hersonissos": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Hersonissos** recorre aproximadamente 26 km y dura unos 30 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "26 km · unos 30 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Hersonissos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Hersonissos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Hersonissos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Hersonissos?",
          "a": "Normalmente, unos 30 minutos para recorrer 26 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-malia": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Malia** recorre aproximadamente 34 km y dura unos 35 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "34 km · unos 35 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Malia con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Malia. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Malia?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Malia?",
          "a": "Normalmente, unos 35 minutos para recorrer 34 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-stalis": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Stalis** recorre aproximadamente 30 km y dura unos 32 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "30 km · unos 32 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Stalis con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Stalis. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Stalis?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Stalis?",
          "a": "Normalmente, unos 32 minutos para recorrer 30 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-rethymno": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Rethymno** recorre aproximadamente 80 km y dura unos 75 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "80 km · unos 75 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Rethymno con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Rethymno. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Rethymno?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Rethymno?",
          "a": "Normalmente, unos 75 minutos para recorrer 80 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-chania": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Chania** recorre aproximadamente 140 km y dura unos 130 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "140 km · unos 130 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Chania con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Chania. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Chania?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Chania?",
          "a": "Normalmente, unos 130 minutos para recorrer 140 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-matala": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Matala** recorre aproximadamente 75 km y dura unos 90 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "75 km · unos 90 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Matala con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Matala. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Matala?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Matala?",
          "a": "Normalmente, unos 90 minutos para recorrer 75 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-bali": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Bali** recorre aproximadamente 45 km y dura unos 45 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "45 km · unos 45 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Bali con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Bali. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Bali?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Bali?",
          "a": "Normalmente, unos 45 minutos para recorrer 45 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-anissaras": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Anissaras** recorre aproximadamente 24 km y dura unos 28 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "24 km · unos 28 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Anissaras con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Anissaras. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Anissaras?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Anissaras?",
          "a": "Normalmente, unos 28 minutos para recorrer 24 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-analipsi": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Analipsi** recorre aproximadamente 22 km y dura unos 26 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "22 km · unos 26 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Analipsi con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Analipsi. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Analipsi?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Analipsi?",
          "a": "Normalmente, unos 26 minutos para recorrer 22 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-ierapetra": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **Ierapetra** recorre aproximadamente 105 km y dura unos 100 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "105 km · unos 100 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta Ierapetra con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Ierapetra. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a Ierapetra?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a Ierapetra?",
          "a": "Normalmente, unos 100 minutos para recorrer 105 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "crete-heraklion-airport-transfers-her::transfer-from-heraklion-airport-to-heraklion-city-center": {
      "body": "El traslado privado desde el **aeropuerto de Heraclión** hasta **centro de Heraclión** recorre aproximadamente 6 km y dura unos 15 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Heraclión. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "6 km · unos 15 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Heraclión hasta centro de Heraclión con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en centro de Heraclión. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Heraclión a centro de Heraclión?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Heraclión a centro de Heraclión?",
          "a": "Normalmente, unos 15 minutos para recorrer 6 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-chania-old-town": {
      "body": "El traslado privado desde el **aeropuerto de Chania** hasta **casco antiguo de Chania** recorre aproximadamente 14 km y dura unos 25 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Chania. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "14 km · unos 25 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Chania hasta casco antiguo de Chania con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en casco antiguo de Chania. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Chania a casco antiguo de Chania?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Chania a casco antiguo de Chania?",
          "a": "Normalmente, unos 25 minutos para recorrer 14 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-rethymno": {
      "body": "El traslado privado desde el **aeropuerto de Chania** hasta **Rethymno** recorre aproximadamente 70 km y dura unos 70 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Chania. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "70 km · unos 70 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Chania hasta Rethymno con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Rethymno. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Chania a Rethymno?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Chania a Rethymno?",
          "a": "Normalmente, unos 70 minutos para recorrer 70 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-kissamos": {
      "body": "El traslado privado desde el **aeropuerto de Chania** hasta **Kissamos** recorre aproximadamente 40 km y dura unos 45 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Chania. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "40 km · unos 45 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Chania hasta Kissamos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Kissamos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Chania a Kissamos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Chania a Kissamos?",
          "a": "Normalmente, unos 45 minutos para recorrer 40 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-platanias": {
      "body": "El traslado privado desde el **aeropuerto de Chania** hasta **Platanias** recorre aproximadamente 18 km y dura unos 25 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Chania. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "18 km · unos 25 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Chania hasta Platanias con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Platanias. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Chania a Platanias?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Chania a Platanias?",
          "a": "Normalmente, unos 25 minutos para recorrer 18 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-georgioupoli": {
      "body": "El traslado privado desde el **aeropuerto de Chania** hasta **Georgioupoli** recorre aproximadamente 35 km y dura unos 40 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Chania. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "35 km · unos 40 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Chania hasta Georgioupoli con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Georgioupoli. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Chania a Georgioupoli?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Chania a Georgioupoli?",
          "a": "Normalmente, unos 40 minutos para recorrer 35 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-kolymbari": {
      "body": "El traslado privado desde el **aeropuerto de Chania** hasta **Kolymbari** recorre aproximadamente 28 km y dura unos 35 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Chania. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "28 km · unos 35 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Chania hasta Kolymbari con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Kolymbari. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Chania a Kolymbari?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Chania a Kolymbari?",
          "a": "Normalmente, unos 35 minutos para recorrer 28 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-almyrida": {
      "body": "El traslado privado desde el **aeropuerto de Chania** hasta **Almyrida** recorre aproximadamente 30 km y dura unos 40 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Chania. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "30 km · unos 40 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Chania hasta Almyrida con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Almyrida. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Chania a Almyrida?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Chania a Almyrida?",
          "a": "Normalmente, unos 40 minutos para recorrer 30 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-falasarna": {
      "body": "El traslado privado desde el **aeropuerto de Chania** hasta **Falasarna** recorre aproximadamente 55 km y dura unos 65 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Chania. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "55 km · unos 65 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Chania hasta Falasarna con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Falasarna. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Chania a Falasarna?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Chania a Falasarna?",
          "a": "Normalmente, unos 65 minutos para recorrer 55 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-sougia": {
      "body": "El traslado privado desde el **aeropuerto de Chania** hasta **Sougia** recorre aproximadamente 70 km y dura unos 90 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Chania. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "70 km · unos 90 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Chania hasta Sougia con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Sougia. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Chania a Sougia?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Chania a Sougia?",
          "a": "Normalmente, unos 90 minutos para recorrer 70 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "chania-international-airport-transfers-chq::transfer-from-chania-airport-to-paleochora": {
      "body": "El traslado privado desde el **aeropuerto de Chania** hasta **Paleochora** recorre aproximadamente 75 km y dura unos 100 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Chania. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "75 km · unos 100 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Chania hasta Paleochora con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Paleochora. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Chania a Paleochora?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Chania a Paleochora?",
          "a": "Normalmente, unos 100 minutos para recorrer 75 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-athens-city-center": {
      "body": "El traslado privado desde el **aeropuerto de Atenas** hasta **el centro de Atenas** recorre aproximadamente 41 km y dura unos 35 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Atenas. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "41 km · unos 35 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Atenas hasta el centro de Atenas con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en el centro de Atenas. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Atenas a el centro de Atenas?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Atenas a el centro de Atenas?",
          "a": "Normalmente, unos 35 minutos para recorrer 41 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-piraeus": {
      "body": "El traslado privado desde el **aeropuerto de Atenas** hasta **El Pireo** recorre aproximadamente 48 km y dura unos 40 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Atenas. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "48 km · unos 40 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Atenas hasta El Pireo con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en El Pireo. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Atenas a El Pireo?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Atenas a El Pireo?",
          "a": "Normalmente, unos 40 minutos para recorrer 48 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-glyfada": {
      "body": "El traslado privado desde el **aeropuerto de Atenas** hasta **Glyfada** recorre aproximadamente 25 km y dura unos 30 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Atenas. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "25 km · unos 30 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Atenas hasta Glyfada con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Glyfada. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Atenas a Glyfada?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Atenas a Glyfada?",
          "a": "Normalmente, unos 30 minutos para recorrer 25 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-acropolis": {
      "body": "El traslado privado desde el **aeropuerto de Atenas** hasta **la Acrópolis** recorre aproximadamente 33 km y dura unos 35 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Atenas. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "33 km · unos 35 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Atenas hasta la Acrópolis con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en la Acrópolis. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Atenas a la Acrópolis?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Atenas a la Acrópolis?",
          "a": "Normalmente, unos 35 minutos para recorrer 33 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-lavrio": {
      "body": "El traslado privado desde el **aeropuerto de Atenas** hasta **Lavrio** recorre aproximadamente 37 km y dura unos 35 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Atenas. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "37 km · unos 35 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Atenas hasta Lavrio con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Lavrio. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Atenas a Lavrio?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Atenas a Lavrio?",
          "a": "Normalmente, unos 35 minutos para recorrer 37 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-rafina": {
      "body": "El traslado privado desde el **aeropuerto de Atenas** hasta **Rafina** recorre aproximadamente 25 km y dura unos 30 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Atenas. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "25 km · unos 30 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Atenas hasta Rafina con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Rafina. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Atenas a Rafina?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Atenas a Rafina?",
          "a": "Normalmente, unos 30 minutos para recorrer 25 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "athens-airport-transfers-ath::transfer-from-athens-airport-to-alimos-marina": {
      "body": "El traslado privado desde el **aeropuerto de Atenas** hasta **puerto deportivo de Alimos** recorre aproximadamente 33 km y dura unos 35 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Atenas. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "33 km · unos 35 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Atenas hasta puerto deportivo de Alimos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en puerto deportivo de Alimos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Atenas a puerto deportivo de Alimos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Atenas a puerto deportivo de Alimos?",
          "a": "Normalmente, unos 35 minutos para recorrer 33 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "thessaloniki-airport-transfers-skg::transfer-from-thessaloniki-airport-to-thessaloniki": {
      "body": "El traslado privado desde el **aeropuerto de Thessaloniki** hasta **Thessaloniki** recorre aproximadamente 15 km y dura unos 30 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Thessaloniki. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "15 km · unos 30 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Thessaloniki hasta Thessaloniki con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Thessaloniki. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Thessaloniki a Thessaloniki?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Thessaloniki a Thessaloniki?",
          "a": "Normalmente, unos 30 minutos para recorrer 15 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "mykonos-airport-transfers-jmk::transfer-from-mykonos-airport-to-mykonos-town": {
      "body": "El traslado privado desde el **aeropuerto de Mykonos** hasta **ciudad de Mykonos** recorre aproximadamente 4 km y dura unos 15 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Mykonos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "4 km · unos 15 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Mykonos hasta ciudad de Mykonos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en ciudad de Mykonos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Mykonos a ciudad de Mykonos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Mykonos a ciudad de Mykonos?",
          "a": "Normalmente, unos 15 minutos para recorrer 4 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "mykonos-airport-transfers-jmk::transfer-from-mykonos-airport-to-platys-yialos": {
      "body": "El traslado privado desde el **aeropuerto de Mykonos** hasta **Platys Yialos** recorre aproximadamente 8 km y dura unos 20 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Mykonos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "8 km · unos 20 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Mykonos hasta Platys Yialos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Platys Yialos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Mykonos a Platys Yialos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Mykonos a Platys Yialos?",
          "a": "Normalmente, unos 20 minutos para recorrer 8 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "mykonos-airport-transfers-jmk::transfer-from-mykonos-airport-to-psarou": {
      "body": "El traslado privado desde el **aeropuerto de Mykonos** hasta **Psarou** recorre aproximadamente 6 km y dura unos 18 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Mykonos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "6 km · unos 18 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Mykonos hasta Psarou con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Psarou. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Mykonos a Psarou?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Mykonos a Psarou?",
          "a": "Normalmente, unos 18 minutos para recorrer 6 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "mykonos-airport-transfers-jmk::transfer-from-mykonos-airport-to-ornos": {
      "body": "El traslado privado desde el **aeropuerto de Mykonos** hasta **Ornos** recorre aproximadamente 5 km y dura unos 15 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Mykonos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "5 km · unos 15 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Mykonos hasta Ornos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Ornos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Mykonos a Ornos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Mykonos a Ornos?",
          "a": "Normalmente, unos 15 minutos para recorrer 5 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "santorini-airport-transfers-jtr::transfer-from-santorini-airport-to-fira": {
      "body": "El traslado privado desde el **aeropuerto de Santorini** hasta **Fira** recorre aproximadamente 6 km y dura unos 20 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Santorini. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "6 km · unos 20 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Santorini hasta Fira con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Fira. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Santorini a Fira?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Santorini a Fira?",
          "a": "Normalmente, unos 20 minutos para recorrer 6 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "santorini-airport-transfers-jtr::transfer-from-santorini-airport-to-oia": {
      "body": "El traslado privado desde el **aeropuerto de Santorini** hasta **Oia** recorre aproximadamente 17 km y dura unos 35 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Santorini. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "17 km · unos 35 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Santorini hasta Oia con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Oia. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Santorini a Oia?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Santorini a Oia?",
          "a": "Normalmente, unos 35 minutos para recorrer 17 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "santorini-airport-transfers-jtr::transfer-from-santorini-airport-to-kamari": {
      "body": "El traslado privado desde el **aeropuerto de Santorini** hasta **Kamari** recorre aproximadamente 6 km y dura unos 15 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Santorini. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "6 km · unos 15 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Santorini hasta Kamari con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Kamari. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Santorini a Kamari?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Santorini a Kamari?",
          "a": "Normalmente, unos 15 minutos para recorrer 6 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "santorini-airport-transfers-jtr::transfer-from-santorini-airport-to-perissa": {
      "body": "El traslado privado desde el **aeropuerto de Santorini** hasta **Perissa** recorre aproximadamente 12 km y dura unos 25 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Santorini. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "12 km · unos 25 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Santorini hasta Perissa con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Perissa. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Santorini a Perissa?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Santorini a Perissa?",
          "a": "Normalmente, unos 25 minutos para recorrer 12 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "santorini-airport-transfers-jtr::transfer-from-santorini-airport-to-imerovigli": {
      "body": "El traslado privado desde el **aeropuerto de Santorini** hasta **Imerovigli** recorre aproximadamente 8 km y dura unos 22 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Santorini. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "8 km · unos 22 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Santorini hasta Imerovigli con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Imerovigli. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Santorini a Imerovigli?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Santorini a Imerovigli?",
          "a": "Normalmente, unos 22 minutos para recorrer 8 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "corfu-international-airport-transfers-cfu::transfer-from-corfu-airport-to-corfu-town": {
      "body": "El traslado privado desde el **aeropuerto de Corfú** hasta **ciudad de Corfú** recorre aproximadamente 3 km y dura unos 12 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Corfú. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "3 km · unos 12 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Corfú hasta ciudad de Corfú con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en ciudad de Corfú. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Corfú a ciudad de Corfú?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Corfú a ciudad de Corfú?",
          "a": "Normalmente, unos 12 minutos para recorrer 3 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "corfu-international-airport-transfers-cfu::transfer-from-corfu-airport-to-paleokastritsa": {
      "body": "El traslado privado desde el **aeropuerto de Corfú** hasta **Paleokastritsa** recorre aproximadamente 25 km y dura unos 40 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Corfú. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "25 km · unos 40 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Corfú hasta Paleokastritsa con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Paleokastritsa. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Corfú a Paleokastritsa?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Corfú a Paleokastritsa?",
          "a": "Normalmente, unos 40 minutos para recorrer 25 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "corfu-international-airport-transfers-cfu::transfer-from-corfu-airport-to-dassia": {
      "body": "El traslado privado desde el **aeropuerto de Corfú** hasta **Dassia** recorre aproximadamente 12 km y dura unos 25 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Corfú. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "12 km · unos 25 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Corfú hasta Dassia con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Dassia. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Corfú a Dassia?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Corfú a Dassia?",
          "a": "Normalmente, unos 25 minutos para recorrer 12 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "corfu-international-airport-transfers-cfu::transfer-from-corfu-airport-to-kavos": {
      "body": "El traslado privado desde el **aeropuerto de Corfú** hasta **Kavos** recorre aproximadamente 45 km y dura unos 55 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Corfú. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "45 km · unos 55 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Corfú hasta Kavos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Kavos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Corfú a Kavos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Corfú a Kavos?",
          "a": "Normalmente, unos 55 minutos para recorrer 45 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "rhodes-airport-transfers-rho::transfer-from-rhodes-airport-to-rhodes-town": {
      "body": "El traslado privado desde el **aeropuerto de Rodas** hasta **ciudad de Rodas** recorre aproximadamente 15 km y dura unos 25 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Rodas. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "15 km · unos 25 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Rodas hasta ciudad de Rodas con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en ciudad de Rodas. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Rodas a ciudad de Rodas?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Rodas a ciudad de Rodas?",
          "a": "Normalmente, unos 25 minutos para recorrer 15 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "rhodes-airport-transfers-rho::transfer-from-rhodes-airport-to-faliraki": {
      "body": "El traslado privado desde el **aeropuerto de Rodas** hasta **Faliraki** recorre aproximadamente 20 km y dura unos 30 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Rodas. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "20 km · unos 30 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Rodas hasta Faliraki con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Faliraki. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Rodas a Faliraki?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Rodas a Faliraki?",
          "a": "Normalmente, unos 30 minutos para recorrer 20 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "rhodes-airport-transfers-rho::transfer-from-rhodes-airport-to-lindos": {
      "body": "El traslado privado desde el **aeropuerto de Rodas** hasta **Lindos** recorre aproximadamente 50 km y dura unos 55 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Rodas. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "50 km · unos 55 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Rodas hasta Lindos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Lindos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Rodas a Lindos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Rodas a Lindos?",
          "a": "Normalmente, unos 55 minutos para recorrer 50 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "rhodes-airport-transfers-rho::transfer-from-rhodes-airport-to-ialysos": {
      "body": "El traslado privado desde el **aeropuerto de Rodas** hasta **Ialysos** recorre aproximadamente 10 km y dura unos 20 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Rodas. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "10 km · unos 20 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Rodas hasta Ialysos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Ialysos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Rodas a Ialysos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Rodas a Ialysos?",
          "a": "Normalmente, unos 20 minutos para recorrer 10 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "zakynthos-airport-transfers-zth::transfer-from-zakynthos-airport-to-zakynthos-town": {
      "body": "El traslado privado desde el **aeropuerto de Zakynthos** hasta **ciudad de Zakynthos** recorre aproximadamente 6 km y dura unos 20 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Zakynthos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "6 km · unos 20 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Zakynthos hasta ciudad de Zakynthos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en ciudad de Zakynthos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Zakynthos a ciudad de Zakynthos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Zakynthos a ciudad de Zakynthos?",
          "a": "Normalmente, unos 20 minutos para recorrer 6 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "zakynthos-airport-transfers-zth::transfer-from-zakynthos-airport-to-laganas": {
      "body": "El traslado privado desde el **aeropuerto de Zakynthos** hasta **Laganas** recorre aproximadamente 8 km y dura unos 18 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Zakynthos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "8 km · unos 18 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Zakynthos hasta Laganas con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Laganas. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Zakynthos a Laganas?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Zakynthos a Laganas?",
          "a": "Normalmente, unos 18 minutos para recorrer 8 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "zakynthos-airport-transfers-zth::transfer-from-zakynthos-airport-to-tsilivi": {
      "body": "El traslado privado desde el **aeropuerto de Zakynthos** hasta **Tsilivi** recorre aproximadamente 12 km y dura unos 25 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Zakynthos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "12 km · unos 25 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Zakynthos hasta Tsilivi con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Tsilivi. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Zakynthos a Tsilivi?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Zakynthos a Tsilivi?",
          "a": "Normalmente, unos 25 minutos para recorrer 12 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-kalamata": {
      "body": "El traslado privado desde el **aeropuerto de Kalamata** hasta **Kalamata** recorre aproximadamente 10 km y dura unos 20 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kalamata. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "10 km · unos 20 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kalamata hasta Kalamata con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Kalamata. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kalamata a Kalamata?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kalamata a Kalamata?",
          "a": "Normalmente, unos 20 minutos para recorrer 10 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-athens": {
      "body": "El traslado privado desde el **aeropuerto de Kalamata** hasta **Athens** recorre aproximadamente 231 km y dura unos 145 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kalamata. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "231 km · unos 145 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kalamata hasta Athens con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Athens. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kalamata a Athens?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kalamata a Athens?",
          "a": "Normalmente, unos 145 minutos para recorrer 231 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-nafplio": {
      "body": "El traslado privado desde el **aeropuerto de Kalamata** hasta **Nafplio** recorre aproximadamente 138 km y dura unos 95 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kalamata. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "138 km · unos 95 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kalamata hasta Nafplio con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Nafplio. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kalamata a Nafplio?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kalamata a Nafplio?",
          "a": "Normalmente, unos 95 minutos para recorrer 138 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-sparta": {
      "body": "El traslado privado desde el **aeropuerto de Kalamata** hasta **Sparta** recorre aproximadamente 91 km y dura unos 70 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kalamata. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "91 km · unos 70 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kalamata hasta Sparta con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Sparta. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kalamata a Sparta?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kalamata a Sparta?",
          "a": "Normalmente, unos 70 minutos para recorrer 91 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-patras": {
      "body": "El traslado privado desde el **aeropuerto de Kalamata** hasta **Patras** recorre aproximadamente 277 km y dura unos 170 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kalamata. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "277 km · unos 170 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kalamata hasta Patras con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Patras. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kalamata a Patras?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kalamata a Patras?",
          "a": "Normalmente, unos 170 minutos para recorrer 277 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-koroni": {
      "body": "El traslado privado desde el **aeropuerto de Kalamata** hasta **Koroni** recorre aproximadamente 43 km y dura unos 55 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kalamata. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "43 km · unos 55 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kalamata hasta Koroni con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Koroni. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kalamata a Koroni?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kalamata a Koroni?",
          "a": "Normalmente, unos 55 minutos para recorrer 43 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kalamata-international-airport-transfers-klx::transfer-from-kalamata-airport-to-voidokilia-beach": {
      "body": "El traslado privado desde el **aeropuerto de Kalamata** hasta **playa de Voidokilia** recorre aproximadamente 46 km y dura unos 60 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kalamata. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "46 km · unos 60 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kalamata hasta playa de Voidokilia con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en playa de Voidokilia. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kalamata a playa de Voidokilia?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kalamata a playa de Voidokilia?",
          "a": "Normalmente, unos 60 minutos para recorrer 46 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kefalonia-airport-transfers-efl::transfer-from-kefalonia-airport-to-argostoli": {
      "body": "El traslado privado desde el **aeropuerto de Kefalonia** hasta **Argostoli** recorre aproximadamente 10 km y dura unos 20 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kefalonia. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "10 km · unos 20 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kefalonia hasta Argostoli con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Argostoli. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kefalonia a Argostoli?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kefalonia a Argostoli?",
          "a": "Normalmente, unos 20 minutos para recorrer 10 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kefalonia-airport-transfers-efl::transfer-from-kefalonia-airport-to-lixouri": {
      "body": "El traslado privado desde el **aeropuerto de Kefalonia** hasta **Lixouri** recorre aproximadamente 35 km y dura unos 45 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kefalonia. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "35 km · unos 45 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kefalonia hasta Lixouri con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Lixouri. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kefalonia a Lixouri?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kefalonia a Lixouri?",
          "a": "Normalmente, unos 45 minutos para recorrer 35 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kefalonia-airport-transfers-efl::transfer-from-kefalonia-airport-to-skala-kefalonia": {
      "body": "El traslado privado desde el **aeropuerto de Kefalonia** hasta **Skala** recorre aproximadamente 35 km y dura unos 45 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kefalonia. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "35 km · unos 45 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kefalonia hasta Skala con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Skala. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kefalonia a Skala?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kefalonia a Skala?",
          "a": "Normalmente, unos 45 minutos para recorrer 35 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kos-airport-transfers-kgs::transfer-from-kos-airport-to-kos-town": {
      "body": "El traslado privado desde el **aeropuerto de Kos** hasta **ciudad de Kos** recorre aproximadamente 25 km y dura unos 35 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "25 km · unos 35 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kos hasta ciudad de Kos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en ciudad de Kos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kos a ciudad de Kos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kos a ciudad de Kos?",
          "a": "Normalmente, unos 35 minutos para recorrer 25 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kos-airport-transfers-kgs::transfer-from-kos-airport-to-kardamena": {
      "body": "El traslado privado desde el **aeropuerto de Kos** hasta **Kardamena** recorre aproximadamente 10 km y dura unos 20 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "10 km · unos 20 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kos hasta Kardamena con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Kardamena. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kos a Kardamena?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kos a Kardamena?",
          "a": "Normalmente, unos 20 minutos para recorrer 10 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "kos-airport-transfers-kgs::transfer-from-kos-airport-to-mastichari": {
      "body": "El traslado privado desde el **aeropuerto de Kos** hasta **Mastichari** recorre aproximadamente 8 km y dura unos 15 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Kos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "8 km · unos 15 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Kos hasta Mastichari con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Mastichari. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Kos a Mastichari?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Kos a Mastichari?",
          "a": "Normalmente, unos 15 minutos para recorrer 8 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "aktion-lefkada-airport-transfers-pvk::transfer-from-aktion-airport-to-lefkada": {
      "body": "El traslado privado desde el **aeropuerto de Aktion** hasta **la ciudad de Lefkada** recorre aproximadamente 25 km y dura unos 35 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Aktion. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "25 km · unos 35 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Aktion hasta la ciudad de Lefkada con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en la ciudad de Lefkada. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Aktion a la ciudad de Lefkada?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Aktion a la ciudad de Lefkada?",
          "a": "Normalmente, unos 35 minutos para recorrer 25 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "aktion-lefkada-airport-transfers-pvk::transfer-from-aktion-airport-to-nikiana": {
      "body": "El traslado privado desde el **aeropuerto de Aktion** hasta **Nikiana** recorre aproximadamente 35 km y dura unos 45 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Aktion. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "35 km · unos 45 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Aktion hasta Nikiana con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Nikiana. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Aktion a Nikiana?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Aktion a Nikiana?",
          "a": "Normalmente, unos 45 minutos para recorrer 35 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "aktion-lefkada-airport-transfers-pvk::transfer-from-aktion-airport-to-vassiliki": {
      "body": "El traslado privado desde el **aeropuerto de Aktion** hasta **Vassiliki** recorre aproximadamente 50 km y dura unos 60 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Aktion. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "50 km · unos 60 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Aktion hasta Vassiliki con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Vassiliki. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Aktion a Vassiliki?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Aktion a Vassiliki?",
          "a": "Normalmente, unos 60 minutos para recorrer 50 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "paros-airport-transfers-pas::transfer-from-paros-airport-to-parikia": {
      "body": "El traslado privado desde el **aeropuerto de Paros** hasta **Parikia** recorre aproximadamente 8 km y dura unos 15 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Paros. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "8 km · unos 15 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Paros hasta Parikia con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Parikia. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Paros a Parikia?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Paros a Parikia?",
          "a": "Normalmente, unos 15 minutos para recorrer 8 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "paros-airport-transfers-pas::transfer-from-paros-airport-to-naoussa": {
      "body": "El traslado privado desde el **aeropuerto de Paros** hasta **Naoussa** recorre aproximadamente 15 km y dura unos 25 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Paros. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "15 km · unos 25 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Paros hasta Naoussa con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Naoussa. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Paros a Naoussa?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Paros a Naoussa?",
          "a": "Normalmente, unos 25 minutos para recorrer 15 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "naxos-airport-transfers-jnx::transfer-from-naxos-airport-to-naxos-town": {
      "body": "El traslado privado desde el **aeropuerto de Naxos** hasta **Chora, Naxos** recorre aproximadamente 5 km y dura unos 12 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Naxos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "5 km · unos 12 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Naxos hasta Chora, Naxos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Chora, Naxos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Naxos a Chora, Naxos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Naxos a Chora, Naxos?",
          "a": "Normalmente, unos 12 minutos para recorrer 5 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "naxos-airport-transfers-jnx::transfer-from-naxos-airport-to-agia-anna-naxos": {
      "body": "El traslado privado desde el **aeropuerto de Naxos** hasta **Agia Anna** recorre aproximadamente 8 km y dura unos 18 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Naxos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "8 km · unos 18 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Naxos hasta Agia Anna con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Agia Anna. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Naxos a Agia Anna?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Naxos a Agia Anna?",
          "a": "Normalmente, unos 18 minutos para recorrer 8 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "milos-airport-transfers-mlo::transfer-from-milos-airport-to-adamas": {
      "body": "El traslado privado desde el **aeropuerto de Milos** hasta **Adamas** recorre aproximadamente 8 km y dura unos 18 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Milos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "8 km · unos 18 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Milos hasta Adamas con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Adamas. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Milos a Adamas?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Milos a Adamas?",
          "a": "Normalmente, unos 18 minutos para recorrer 8 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "milos-airport-transfers-mlo::transfer-from-milos-airport-to-plaka-milos": {
      "body": "El traslado privado desde el **aeropuerto de Milos** hasta **Plaka** recorre aproximadamente 12 km y dura unos 25 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Milos. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "12 km · unos 25 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Milos hasta Plaka con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Plaka. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Milos a Plaka?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Milos a Plaka?",
          "a": "Normalmente, unos 25 minutos para recorrer 12 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "mytilene-airport-transfers-mjt::transfer-from-mytilene-airport-to-mytilene": {
      "body": "El traslado privado desde el **aeropuerto de Mytilene** hasta **Mytilene** recorre aproximadamente 8 km y dura unos 15 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Mytilene. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "8 km · unos 15 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Mytilene hasta Mytilene con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Mytilene. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Mytilene a Mytilene?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Mytilene a Mytilene?",
          "a": "Normalmente, unos 15 minutos para recorrer 8 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "mytilene-airport-transfers-mjt::transfer-from-mytilene-airport-to-molyvos": {
      "body": "El traslado privado desde el **aeropuerto de Mytilene** hasta **Molyvos** recorre aproximadamente 55 km y dura unos 70 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Mytilene. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "55 km · unos 70 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Mytilene hasta Molyvos con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Molyvos. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Mytilene a Molyvos?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Mytilene a Molyvos?",
          "a": "Normalmente, unos 70 minutos para recorrer 55 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "sitia-airport-transfers-jsh::transfer-from-sitia-airport-to-sitia": {
      "body": "El traslado privado desde el **aeropuerto de Sitia** hasta **Sitia** recorre aproximadamente 6 km y dura unos 12 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Sitia. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "6 km · unos 12 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Sitia hasta Sitia con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Sitia. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Sitia a Sitia?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Sitia a Sitia?",
          "a": "Normalmente, unos 12 minutos para recorrer 6 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    },
    "sitia-airport-transfers-jsh::transfer-from-sitia-airport-to-ierapetra": {
      "body": "El traslado privado desde el **aeropuerto de Sitia** hasta **Ierapetra** recorre aproximadamente 65 km y dura unos 70 minutos en condiciones normales. Su conductor de TransferAround le espera en la terminal de llegadas con un cartel con su nombre, sigue el vuelo en tiempo real e incluye 60 minutos de espera gratuita para recoger el equipaje o absorber pequeños retrasos. El precio queda fijado al reservar e incluye los peajes y tasas de carretera habituales cuando correspondan, para que no haya sorpresas al llegar.",
      "tips": [
        {
          "title": "El precio fijo incluye el tiempo de espera",
          "body": "Incluye 60 minutos de espera gratuita en llegadas del aeropuerto de Sitia. El seguimiento del vuelo ajusta automáticamente la hora de recogida."
        },
        {
          "title": "65 km · unos 70 minutos",
          "body": "Este es el tiempo habitual puerta a puerta desde el aeropuerto de Sitia hasta Ierapetra con tráfico normal. En hora punta, el trayecto puede alargarse entre 5 y 15 minutos."
        },
        {
          "title": "Llegada puerta a puerta",
          "body": "Le dejamos en su hotel o en el punto accesible para vehículos más cercano si hay zonas peatonales en Ierapetra. Confirme la dirección exacta al reservar."
        }
      ],
      "faqs": [
        {
          "q": "¿Dónde me esperará el conductor para el traslado del aeropuerto de Sitia a Ierapetra?",
          "a": "En la salida de la sala de equipajes de llegadas, con un cartel con su apellido."
        },
        {
          "q": "¿Cuánto dura el trayecto del aeropuerto de Sitia a Ierapetra?",
          "a": "Normalmente, unos 70 minutos para recorrer 65 km. El tráfico de la tarde puede alargar un poco el trayecto."
        },
        {
          "q": "¿Qué incluye el precio?",
          "a": "El vehículo, un conductor con licencia, el servicio de bienvenida, el seguimiento del vuelo, 60 minutos de espera gratuita y los peajes o tasas de carretera aplicables en esta ruta."
        },
        {
          "q": "¿Puedo cancelar o cambiar la reserva?",
          "a": "Sí. La cancelación es gratuita hasta 24 horas antes de la recogida en condiciones estándar. Si cambia el horario del vuelo, comuníquenos los nuevos datos para ajustar la reserva."
        }
      ]
    }
  },
  "posts": {
    "heraklion-airport-to-chania-options": {
      "title": "Del aeropuerto de Heraclión a Chania: todas las formas de cruzar la isla",
      "description": "Autobús, coche de alquiler, taxi o traslado reservado con antelación: una comparación local y sincera de todas las formas de llegar desde el aeropuerto de Heraclión (HER) a Chania, con precios y horarios reales.",
      "authorRole": "Jefe de despacho, Heraclión",
      "sections": [
        {
          "heading": "Por qué tanta gente aterriza en Heraclión pero se queda en Chania",
          "body": [
            "Heraclión (HER) recibe aproximadamente tres veces más vuelos que Chania (CHQ) y, por lo general, son más baratos. Por eso, cada verano, miles de viajeros aterrizan en el lado este de la isla con un hotel reservado a 140 km al oeste. La buena noticia: la autopista de la costa norte (E75/VOAK) hace que este sea uno de los viajes largos más fáciles de Grecia.",
            "Calcule unas 2 horas y 10 minutos puerta a puerta con tráfico normal. En agosto, añada entre 20 y 30 minutos para el tramo de Rethymno."
          ]
        },
        {
          "heading": "Opción 1: El autobús KTEL (el más barato y el más lento)",
          "body": [
            "El autobús interurbano KTEL sale desde la estación principal de Heraclión (no desde el aeropuerto) hasta Chania aproximadamente cada hora en temporada, por unos 15 € por persona. Si se tiene en cuenta el autobús local o el taxi desde el aeropuerto hasta la estación, una posible espera y la parada en Rethymno, el tiempo real de viaje es de 3,5 a 4 horas.",
            "Es una buena opción para quien viaja solo, con mochila y sin prisa. Para una familia con equipaje tras empezar el viaje a las 3:00, es la forma más incómoda de comenzar las vacaciones."
          ]
        },
        {
          "heading": "Opción 2: Coche de alquiler (flexible, pero piénselo bien)",
          "body": [
            "Si ya tenía previsto alquilar un coche para toda la estancia, recogerlo en HER y conducir hacia el oeste es una opción razonable. Tenga en cuenta que los alquileres de solo ida entre ciudades suelen incluir una tasa de devolución, que las colas en los mostradores del aeropuerto pueden superar una hora en agosto y que el casco antiguo de Chania es peatonal; quizá su hotel no disponga de aparcamiento.",
            "Coste aproximado del viaje en sí: entre 25 y 35 € en combustible más el día de alquiler."
          ]
        },
        {
          "heading": "Opción 3: parada de taxis versus traslado reservado previamente",
          "body": [
            "Un taxi con taxímetro desde la parada de HER hasta Chania puede costar entre 180 y 250 €, según la hora, el tráfico y la tarifa final. Es un servicio legal, pero el importe será el que marque el taxímetro o acuerde con el conductor.",
            "Un traslado privado reservado previamente fija el precio antes de volar: 165 € para un sedán económico en nuestra ruta del aeropuerto de Heraclión a Chania, por vehículo, no por persona. Su conductor sigue el vuelo, espera en llegadas con un cartel con su nombre y en el coche caben cuatro personas con maletas para el mismo número fijo. Para dos o más viajeros, casi siempre resulta más barato que tomar un taxi en la parada y es puerta a puerta hasta el punto de acceso más cercano a su hotel."
          ]
        },
        {
          "heading": "El veredicto local",
          "body": [
            "Si viaja solo, tiene un presupuesto ajustado y llega con varias horas de luz, elija el autobús. Si se aloja en un lugar remoto y piensa hacer excursiones a diario, alquile un coche. En los demás casos —parejas, familias, grupos con equipaje o llegadas después de las 20:00—, reserve el traslado y descanse durante el trayecto. Las dos horas por la costa son realmente bonitas; deje el volante a alguien que recorre esta ruta cada semana."
          ]
        }
      ],
      "faq": [
        {
          "q": "¿Cuánto dura el traslado desde el Aeropuerto de Heraclión a Chania?",
          "a": "Aproximadamente 2 horas y 10 minutos para recorrer 140 km, autopista casi todo el camino."
        },
        {
          "q": "¿Cuánto cuesta un traslado privado?",
          "a": "Desde 165 € a precio fijo por vehículo: hasta 3 pasajeros en Economy, con monovolúmenes de hasta 7 plazas disponibles."
        }
      ]
    },
    "taxi-vs-prebooked-transfer-crete": {
      "title": "Taxi versus traslado reservado previamente en Creta: lo que realmente recomiendan los lugareños",
      "description": "Comparación entre las paradas de taxis, las aplicaciones de transporte y los traslados reservados con antelación en Creta: precios transparentes, recargos nocturnos, equipaje y cuándo conviene cada opción.",
      "authorRole": "Operaciones, Chania",
      "sections": [
        {
          "heading": "Cómo funciona realmente la parada de taxis del aeropuerto",
          "body": [
            "Ambos aeropuertos de Creta tienen paradas de taxis oficiales con precios de zona publicados, en teoría. En la práctica, la hoja de precios publicada cubre un puñado de destinos, los recargos por noche y equipaje se agregan verbalmente, y en temporada alta la cola después de una llegada retrasada por la noche puede durar 40 minutos.",
            "Los taxistas cretenses son profesionales, en su inmensa mayoría, honestos. Pero la estructura (conocer o negociar el importe después de aterrizar y pagar la tarifa resultante) pone toda la incertidumbre en el viajero."
          ]
        },
        {
          "heading": "Por qué las aplicaciones de transporte no funcionan aquí",
          "body": [
            "Uber y Bolt operan en Atenas, pero en Creta su cobertura es escasa o inexistente fuera de Heraclión; cuando hay servicio, la aplicación asigna un taxi convencional con taxímetro. Para trayectos de 30 a 80 km entre el aeropuerto y una zona turística, los conductores suelen rechazar solicitudes para permanecer en la parada. No base su llegada en encontrar un vehículo mediante una aplicación."
          ]
        },
        {
          "heading": "Qué cambia la pre-reserva",
          "body": [
            "Reservar el traslado con antelación invierte el modelo: el precio se fija al reservar, no al aterrizar. Conoce el importe antes de volar, tiene un conductor asignado por su nombre, el vuelo se sigue para que los retrasos no generen costes y la silla infantil está instalada en el vehículo antes de la recogida.",
            "El recargo nocturno es la prueba honesta. El nuestro se publica: +15 % entre las 22:00 y las 06:00, y se muestra en el desglose de precios antes de confirmar. En la parada de taxis, la tarifa nocturna es la que marque el taxímetro, algo difícil de comprobar desde el asiento trasero."
          ]
        },
        {
          "heading": "Cuando la parada de taxi es la decisión correcta",
          "body": [
            "Para un trayecto corto y sin equipaje —por ejemplo, del aeropuerto de Chania a un hotel de la ciudad a las 2 p. m. de un martes—, la parada de taxis suele ser rápida y razonable, y reservar antes aporta poco. También es la opción práctica para desplazamientos urbanos improvisados. El traslado reservado con antelación compensa en llegadas al aeropuerto, aterrizajes nocturnos, rutas largas, familias con equipamiento y cualquier situación en la que un retraso pueda causar problemas."
          ]
        }
      ]
    },
    "souda-port-cruise-ferry-arrivals": {
      "title": "Llegar al puerto de Souda: guía local para pasajeros de ferry y crucero",
      "description": "El ferry nocturno desde El Pireo atraca en Souda a las 6 a.m. Esto es lo que encontrará al desembarcar: distribución del puerto, taxis, traslados al casco antiguo de Chania y más allá.",
      "authorRole": "Operaciones, Chania",
      "sections": [
        {
          "heading": "Cómo son realmente las 06:00 en Souda",
          "body": [
            "Los ferries nocturnos ANEK y Minoan procedentes del Pireo llegan a Souda entre las 05:45 y las 06:30. Se sale a pie —o en coche— desde la cubierta de vehículos hacia un puerto comercial en funcionamiento, no una terminal de cruceros con cafeterías. Hay un pequeño edificio terminal, una parada de taxis que se vacía rápido y eso es todo.",
            "El casco antiguo de Chania está a sólo 8 km, pero a esa hora el autobús urbano no ha iniciado su horario completo y la mitad del ferry se dirige en la misma dirección que usted."
          ]
        },
        {
          "heading": "Tres opciones al desembarcar",
          "body": [
            "El autobús público a Chania cuesta alrededor de 2,50 € y sale de la puerta del puerto; es práctico si lleva poco equipaje y su alojamiento abre temprano. La parada de taxis funciona con tarifas de zona; espere entre 15 y 20 € en la ciudad, más con las maletas y una cola que puede durar más que su paciencia después de que 300 pasajeros desembarquen a la vez.",
            "Un traslado reservado con antelación cuesta 25 € fijos hasta el casco antiguo de Chania: el conductor sigue el ferry (a menudo llega tarde en invierno y principios de verano), lo recibe en la salida de la terminal con un cartel y lo deja en el punto de acceso para vehículos más cercano a su hotel, ya que la mayor parte del casco antiguo es peatonal."
          ]
        },
        {
          "heading": "Pasajeros de cruceros: cómo aprovechar una escala de un día",
          "body": [
            "Los cruceros que hacen escala en Souda le dan entre 8 y 10 horas. El servicio de transporte a Chania cubre el casco antiguo, pero lo mejor del oeste de Creta (la laguna de Balos, Falasarna y los monasterios de Akrotiri) necesita transporte. Un conductor privado por una tarifa de día fijo supera a la excursión en barco tanto en precio como en flexibilidad para grupos de tres o más. Indique al conductor la hora límite de regreso al barco: su trabajo es llevarle de vuelta con margen y lo hace a diario."
          ]
        },
        {
          "heading": "¿Va más allá de Chania?",
          "body": [
            "De Souda a Rethymno, Kissamos o la costa sur es donde realmente importa la reserva previa: son viajes de 45 a 90 minutos sin autobús directo al amanecer. Los precios fijos desde Souda se encuentran en nuestras páginas de traslados al puerto, y se aplica la misma regla de seguimiento del ferry: si el barco llega tarde, nosotros llegaremos tarde, sin cargo."
          ]
        }
      ],
      "faq": [
        {
          "q": "¿A qué distancia está el puerto de Souda del casco antiguo de Chania?",
          "a": "Unos 8 km, aproximadamente 15 minutos en coche. El precio fijo del traslado es de 25 € por vehículo."
        }
      ]
    },
    "crete-with-kids-child-seats": {
      "title": "Creta con niños: sillas de coche, traslados y la logística de la que nadie le advierte",
      "description": "Ley griega sobre sillas de coche, por qué las paradas de taxis no pueden ayudarle y cómo planificar traslados familiares en Creta sin arrastrar tres sillas de coche por un aeropuerto.",
      "authorRole": "Jefe de despacho, Heraclión",
      "sections": [
        {
          "heading": "Lo que dice la ley griega sobre los niños en los coches",
          "body": [
            "Los niños menores de 135 cm deben viajar en un sistema de retención infantil adecuado en vehículos privados. Los taxis con licencia están técnicamente exentos, y ese es precisamente el problema. El taxi que le recoja no tiene obligación de llevar una silla adecuada para su hijo. La mayoría de los padres descubren esto en la acera de llegadas, con desfase horario y sin buenas opciones."
          ]
        },
        {
          "heading": "¿Llevar su propia silla o reservar un vehículo que ya la incluya?",
          "body": [
            "Las aerolíneas suelen facturar las sillas infantiles gratis, pero después tendrá que transportar una silla voluminosa por dos aeropuertos para un par de trayectos de 40 minutos. Alquilarla junto con el coche es práctico si va a conducir toda la semana; inspecciónela antes de aceptarla.",
            "La opción intermedia es reservar un traslado y solicitar la silla de antemano. Instalamos sillas orientadas hacia delante y elevadores (+10 €, según la edad del menor) antes de que el conductor salga del garaje. Indique las edades, no solo «una silla infantil»: un bebé de 10 meses y un niño de 6 años necesitan sistemas de retención distintos."
          ]
        },
        {
          "heading": "Qué tamaño de vehículo necesita una familia",
          "body": [
            "En un sedán no caben dos adultos, tres niños, un cochecito, cinco maletas y una bolsa de esnórquel, diga lo que diga la web de reservas. Nuestra clase Minivan —hasta 7 pasajeros y 7 maletas— cuesta 1,6 veces el precio del sedán; en la ruta del aeropuerto de Heraclión a Hersonissos, supone pasar de 42 € a 67 €. Repartido entre toda la familia, el cambio cuesta menos que los bocadillos del aeropuerto."
          ]
        },
        {
          "heading": "Cómo calcular los tiempos cuando viaja una familia",
          "body": [
            "Reserve la recogida 45 minutos después de la hora real de aterrizaje si ha facturado maletas y viaja con niños pequeños; meter prisa a una familia en la cinta de equipajes no ayuda a nadie. Si el vuelo de regreso sale antes de las 08:00, consulte el recargo nocturno: en nuestro caso, se aplica un +15 % entre las 22:00 y las 06:00. Añada también el nombre del hotel y las edades de los menores en las notas; el conductor las revisa la noche anterior."
          ]
        }
      ]
    },
    "night-arrivals-heraklion-airport": {
      "title": "Llegar al aeropuerto de Heraclión después de medianoche: qué esperar",
      "description": "HER es uno de los aeropuertos nocturnos más transitados de Grecia en verano. Cómo funcionan las llegadas tardías, qué está abierto, recargos por traslados nocturnos y cómo no quedarse tirado.",
      "authorRole": "Jefe de despacho, Heraclión",
      "sections": [
        {
          "heading": "La oleada de llegadas de la 01:00 es real",
          "body": [
            "Los vuelos chárter y de bajo costo acumulan llegadas tardías a Heraclión durante todo el verano; habitualmente se encuentra entre los aeropuertos griegos más transitados entre la medianoche y las 03:00. El control de pasaportes es rápido para los vuelos de la UE, pero la entrega de equipaje a esa hora tarda entre 20 y 40 minutos. Las opciones de comida de la terminal estarán cerradas; las máquinas expendedoras ofrecen pocas opciones."
          ]
        },
        {
          "heading": "¿Qué le espera fuera a las 2:00?",
          "body": [
            "La parada de taxis funciona toda la noche, pero la disponibilidad es imprevisible: tras tres llegadas simultáneas, la cola puede durar una hora y se aplica la tarifa nocturna. El autobús KTEL no circula de madrugada y la mayoría de los servicios de hotel terminan a medianoche. Aquí es donde reservar antes cambia por completo la llegada: tendrá un conductor identificado, ya en el aparcamiento y siguiendo su número de vuelo."
          ]
        },
        {
          "heading": "Sobre los recargos nocturnos (nuestros y de todos)",
          "body": [
            "Cualquier operador serio cobra más por la noche: los conductores trabajan a las 3:00. La diferencia es conocer el importe antes o después del viaje. Nuestro recargo es del +15 % para recogidas entre las 22:00 y las 06:00; se calcula sobre el precio fijo de la ruta y aparece en el desglose antes de confirmar. Un trayecto de 42 € a Hersonissos pasa a costar 48 €. Sin sorpresas con el taxímetro al llegar."
          ]
        },
        {
          "heading": "La lista de control para llegar tarde",
          "body": [
            "Introduzca el número de vuelo en la reserva: el seguimiento evita que un «retraso hasta las 02:40» se convierta en un problema. Antes de embarcar, haga una captura con el nombre del conductor y el teléfono de la central por si falla la eSIM en itinerancia. Avise al hotel de que llegará a las 3:00 para que le espere el portero nocturno. Y reserve antes de volar: a la 01:30 de agosto, confiar en encontrar transporte al llegar no es una estrategia."
          ]
        }
      ],
      "faq": [
        {
          "q": "¿Hay recargo nocturno en los traslados?",
          "a": "Sí, +15 % para recogidas entre las 22:00 y las 06:00, que se muestra en el desglose de precios antes de reservar."
        },
        {
          "q": "¿Qué ocurre si mi vuelo aterriza con retraso a las 3:00?",
          "a": "Seguimos el número de vuelo. El conductor se ajusta automáticamente y la espera es gratuita en caso de retrasos en los vuelos."
        }
      ]
    },
    "chania-old-town-arrival-tips": {
      "title": "Llegar al casco antiguo de Chania: por qué el coche no puede llegar hasta su hotel",
      "description": "El casco antiguo veneciano de Chania está prácticamente libre de coches. Dónde le dejarán los traslados y taxis, cuánto tendrá que caminar y cómo hacer que su llegada sea sencilla.",
      "authorRole": "Operaciones, Chania",
      "sections": [
        {
          "heading": "El hermoso problema",
          "body": [
            "Las calles que rodean el puerto veneciano de Chania son parte de su encanto, pero también son demasiado estrechas, tienen escalones o están cerradas al tráfico. Si su hotel boutique está en Zambeliou o Theotokopoulou, ningún vehículo podrá detenerse en la puerta. Todas las llegadas terminan con un breve paseo; conocer el punto de acceso más cercano marca una diferencia real."
          ]
        },
        {
          "heading": "Dónde le dejan los conductores",
          "body": [
            "Los principales accesos son el borde del puerto junto a la mezquita Yali Tzamisi para los hoteles del norte, la plaza Talos en el lado oeste y el mercado (Ágora) para las calles del sur. Un conductor que trabaja a diario en Chania elegirá el punto adecuado para su hotel. Si lleva más maletas que manos, el nuestro también le acompañará hasta la puerta; la página de la ruta desde el aeropuerto de Chania al casco antiguo explica estos accesos."
          ]
        },
        {
          "heading": "Adoquines y equipaje: una advertencia",
          "body": [
            "Por buenas que sean las ruedas de su maleta, los adoquines venecianos las pondrán a prueba. Si tiene necesidades de movilidad, indíquelo en las notas: a menudo podemos cambiar un paseo pintoresco de 300 metros por un trayecto llano de 80 metros. Varios hoteles del casco antiguo ofrecen servicio de portería si se les avisa; podemos facilitarles su hora de llegada."
          ]
        },
        {
          "heading": "Un último consejo: llegue antes del paseo vespertino",
          "body": [
            "A partir de las 19:00 en temporada alta, el casco antiguo se llena para el paseo vespertino y las cenas junto al mar. Llegar a las 20:30 implica abrirse paso con una maleta entre la multitud de la hora dorada. Si el vuelo se lo permite, llegue antes de las 18:00; si no, entregue el equipaje al portero y únase al paseo. Ya está en Creta."
          ]
        }
      ]
    }
  }
} as ContentOverlays;

const countryGuides = {
  greece: {
    tagline: "Seis mil islas, 227 habitadas, y una Grecia continental a la que casi ningún visitante llega.",
    intro:
      "Grecia no es un solo destino, sino varios que comparten bandera. Las Cícladas ofrecen casas encaladas y puestas de sol sobre la caldera; Creta es tan grande que merece un viaje propio, con montañas donde la nieve aguanta hasta mayo; las Jónicas son verdes y venecianas; y la Grecia continental —Atenas, el Peloponeso, Meteora, Tesalónica— concentra buena parte de la arqueología y casi ninguna de las multitudes. Todo lo enlaza una red de ferris y un verano que se alarga durante meses.",
    facts: [
      { label: "Moneda", value: "Euro (€)" },
      { label: "Conducción", value: "Por la derecha" },
      { label: "Idioma", value: "Griego; el inglés está muy extendido" },
      { label: "Temporada alta", value: "Julio y agosto" },
      { label: "Mejor relación calidad-precio", value: "Mayo, junio y septiembre" },
    ],
    highlights: [
      {
        title: "Creta",
        body: "La isla más grande y la única que funciona por sí sola como viaje completo. Puertos venecianos en Chania y Rethymno, la garganta de Samaria, Cnosos a las afueras de Heraclión y una costa sur a la que solo se llega en barco o por carreteras de curvas cerradas. Tiene dos aeropuertos internacionales, así que puede entrar por uno y salir por el otro.",
        citySlug: "chania",
      },
      {
        title: "Santorini",
        body: "La caldera es tan espectacular como prometen las fotos y está tan concurrida como cuentan. Fira y Oia reciben a las multitudes; Pyrgos, Megalochori y las playas orientales de Perissa y Kamari, no. El aeropuerto está en el centro de la isla, a veinte minutos de casi cualquier lugar.",
        citySlug: "oia",
      },
      {
        title: "Atenas",
        body: "Merece dos días, no la media jornada que le conceden muchos itinerarios. El Museo de la Acrópolis, el mercadillo dominical de Monastiraki y una escena gastronómica que, sin hacer ruido, se ha convertido en una de las mejores de Europa. También es la puerta de entrada a los ferris: El Pireo es el mayor puerto de pasajeros de Europa.",
        citySlug: "athens",
      },
      {
        title: "Las islas Jónicas",
        body: "Corfú, Cefalonia, Zante y Lefkada son más verdes, lluviosas y de influencia italiana que las islas del Egeo. Tienen una temporada más corta, un paisaje más amable y playas —Myrtos, Porto Katsiki, Navagio— que lucen mejor en las fotos que al nadar.",
        citySlug: "corfu-town",
      },
      {
        title: "Rodas y el Dodecaneso",
        body: "El casco antiguo medieval de Rodas es el mayor de Europa que sigue habitado y está declarado Patrimonio Mundial por la UNESCO. Lindos se encuentra una hora al sur, bajo una acrópolis. Kos, Symi y Patmos quedan a un breve trayecto en ferry.",
        citySlug: "lindos",
      },
      {
        title: "Tesalónica y el norte",
        body: "La segunda ciudad de Grecia tiene una oferta gastronómica aún mejor y solo una fracción de los visitantes. Es la base para recorrer las tres penínsulas de Calcídica y visitar Meteora, tres horas hacia el interior, donde los monasterios coronan pilares de arenisca.",
        citySlug: "thessaloniki",
      },
    ],
    seasons: [
      {
        season: "Primavera",
        months: "Abril – junio",
        body: "Flores silvestres, yacimientos arqueológicos abiertos y sin colas, y un mar lo bastante cálido para bañarse desde mediados de junio. Hasta finales de mayo hay pocos ferris, por lo que recorrer varias islas exige más planificación.",
      },
      {
        season: "Pleno verano",
        months: "Julio – agosto",
        body: "Caluroso, concurrido y caro. El viento meltemi refresca las Cícladas, pero también cancela ferris. Reserve alojamiento y traslados con mucha antelación: agosto es el mes en que las plazas se agotan de verdad.",
      },
      {
        season: "Principios de otoño",
        months: "Septiembre – octubre",
        body: "El momento perfecto. El mar alcanza su máxima temperatura, las multitudes desaparecen después de la primera semana de septiembre y los precios bajan. La mayoría de los servicios de las islas siguen funcionando hasta mediados de octubre.",
      },
      {
        season: "Invierno",
        months: "Noviembre – marzo",
        body: "Atenas, Tesalónica y Creta mantienen su actividad. Las islas pequeñas prácticamente cierran: pocos ferris y la mayoría de los hoteles clausurados. Buena época para ciudades y montañas, no para playas.",
      },
    ],
    gettingAroundTitle: "Cómo moverse por Grecia",
    gettingAround: [
      "Las distancias engañan. Las carreteras griegas atraviesan montañas y rara vez son directas: recorrer 90 km en Creta lleva bastante más de dos horas, aunque el mapa indique una. Todo trayecto que cruce una cordillera tarda más de lo que parece.",
      "El ferry es un medio de transporte, no una excursión de un día. El Pireo, Rafina y Lavrio conectan con las Cícladas; Patras, con Italia; Souda y Heraclión, con Creta. Los barcos rápidos y convencionales cubren las mismas rutas con precios y duraciones muy distintos, y el meltemi puede cancelar ambos en agosto.",
      "Los aeropuertos insulares son pequeños y estacionales. Santorini, Mykonos y Zante gestionan un enorme volumen de verano en terminales diseñadas para una fracción de ese tráfico. Las salas de llegadas se saturan; aquí, un conductor esperando con un cartel vale más que en casi ningún otro lugar.",
      "Las paradas de taxi de los aeropuertos griegos usan taxímetro, pero aplican suplementos fijos de aeropuerto, tarifas nocturnas y cargos por equipaje que no siempre están anunciados. Acordar el precio de antemano es la única forma de conocer el total antes de aterrizar.",
    ],
    knowBefore: [
      {
        title: "Creta se confirma al instante; el resto, mediante presupuesto",
        body: "En Creta contamos con nuestra propia flota autorizada, por lo que esos traslados se confirman de inmediato a precio fijo. En el resto de Grecia confirmamos el presupuesto con un colaborador local antes de que pague: el mismo precio fijo, con un paso adicional.",
      },
      {
        title: "Los puertos de ferry no están junto a los aeropuertos",
        body: "Con tráfico, El Pireo está aproximadamente a una hora del aeropuerto de Atenas, y el puerto es tan grande que equivocarse de puerta puede hacerle perder el barco. Indíquenos el ferry y el número de puerta para que el conductor calcule la recogida.",
      },
      {
        title: "Fuera de las ciudades, el efectivo sigue siendo útil",
        body: "Hoy se aceptan tarjetas casi en todas partes, pero algunas tabernas de pueblo, ferris pequeños y gasolineras rurales solo cobran en efectivo. Saque euros antes de abandonar las ciudades principales.",
      },
      {
        title: "Cierres dominicales y por la tarde",
        body: "Fuera de las zonas turísticas, muchas tiendas cierran los domingos y hacen una larga pausa por la tarde. Los yacimientos arqueológicos suelen cerrar a las 15:00 en invierno y amplían el horario en verano; compruébelo el mismo día de la visita.",
      },
    ],
    faqs: [
      {
        q: "¿Merece la pena un traslado privado frente a un taxi en Grecia?",
        a: "En los grandes aeropuertos, la parada de taxis funciona bien, pero la tarifa no es fija y se añaden suplementos por equipaje, recogidas nocturnas y el propio aeropuerto. En las islas hay pocos taxis y se agotan enseguida en temporada alta. Un traslado reservado fija el precio, garantiza un vehículo con espacio para su equipaje y deja a un conductor esperándole en llegadas con su nombre.",
      },
      {
        q: "¿Con cuánta antelación debo reservar para agosto?",
        a: "Con una semana para las islas, y antes aún para grupos grandes o minibuses. Agosto es el único mes en el que la disponibilidad se agota realmente, sobre todo en vehículos para más de seis pasajeros.",
      },
      {
        q: "¿Pueden recogerme al llegar en ferry en vez de en avión?",
        a: "Sí. Indíquenos el barco y el puerto y ajustaremos la recogida a la llegada, también en El Pireo, Rafina, Souda y Heraclión. Los ferris se retrasan más a menudo que los aviones, y el tiempo de espera de una llegada con seguimiento está incluido.",
      },
      {
        q: "¿Llegan también a las islas pequeñas?",
        a: "Cubrimos mediante presupuesto todas las islas con aeropuerto comercial o un puerto de ferry importante, salvo Creta, donde la confirmación es inmediata. Si viaja a una isla muy pequeña, envíenos la ruta y le diremos con franqueza si contamos allí con un conductor autorizado.",
      },
    ],
  },
  spain: {
    tagline: "Dos archipiélagos, una costa mediterránea y ciudades donde se cena a las diez.",
    intro:
      "España recibe más visitantes que casi cualquier otro país del mundo y, aun así, conserva una identidad marcadamente regional. Baleares y Canarias viven a ritmos distintos y, en el caso de Canarias, con un clima completamente diferente. Andalucía es calurosa y de herencia andalusí; el País Vasco, verde y lluvioso; Madrid se alza en una meseta de veranos implacables e inviernos fríos. Las distancias son considerables, pero su red de carreteras y ferrocarril figura entre las mejores de Europa.",
    facts: [
      { label: "Moneda", value: "Euro (€)" },
      { label: "Conducción", value: "Por la derecha" },
      { label: "Idioma", value: "Español, además de catalán, euskera y gallego" },
      { label: "Temporada alta", value: "Julio y agosto" },
      { label: "Mejor relación calidad-precio", value: "Abril, mayo y octubre" },
    ],
    highlights: [
      {
        title: "Barcelona",
        body: "Gaudí, el Barrio Gótico y una playa urbana a un paseo del casco antiguo. El aeropuerto de El Prat está a quince minutos, una cercanía poco habitual para una ciudad de este tamaño y la razón por la que sus traslados de aeropuerto resultan baratos frente a los de otras capitales europeas.",
        citySlug: "barcelona",
      },
      {
        title: "Madrid",
        body: "El Prado, el Reina Sofía y el Thyssen están separados por apenas unos cientos de metros. Barajas es un aeropuerto enorme y extendido, con cuatro terminales; entre T4 y T4S hay que tomar un tren lanzadera, así que confirme en cuál aterriza.",
        citySlug: "madrid",
      },
      {
        title: "Andalucía",
        body: "Sevilla, Granada y Córdoba forman un triángulo que puede recorrerse en coche en una semana. Para la Alhambra hay que comprar entradas con meses de antelación. El aeropuerto de Málaga da servicio a toda la región y también a la Costa del Sol.",
        citySlug: "seville",
      },
      {
        title: "Las Baleares",
        body: "Mallorca es mucho más de lo que su fama sugiere: la Serra de Tramuntana es un paisaje declarado Patrimonio Mundial por la UNESCO y la isla tiene tamaño suficiente para encontrar rincones tranquilos. El norte de Ibiza vive completamente al margen de las discotecas.",
        citySlug: "mallorca",
      },
      {
        title: "Las Canarias",
        body: "Subtropicales durante todo el año: 22 °C en enero es algo normal. Tenerife y Gran Canaria concentran las conexiones aéreas; sus paisajes volcánicos interiores son el verdadero motivo para alejarse de la costa.",
        citySlug: "tenerife",
      },
      {
        title: "Valencia y el este",
        body: "La Ciudad de las Artes y las Ciencias, la paella original y una playa que los propios vecinos disfrutan. Más tranquila que Barcelona y considerablemente más barata.",
        citySlug: "valencia",
      },
    ],
    seasons: [
      {
        season: "Primavera",
        months: "Abril – junio",
        body: "La mejor época para conocer Andalucía antes de que llegue el calor. La Semana Santa y la Feria de Abril llenan Sevilla: son espectaculares, pero exigen reservarlo todo con mucha antelación.",
      },
      {
        season: "Pleno verano",
        months: "Julio – agosto",
        body: "Las costas y las islas españolas están al límite de su capacidad; las ciudades del interior pueden superar los 40 °C. Madrid se vacía en agosto cuando sus habitantes salen de vacaciones. Canarias mantiene temperaturas suaves.",
      },
      {
        season: "Otoño",
        months: "Septiembre – octubre",
        body: "Mar cálido, menos gente y un interior por fin agradable. Septiembre es posiblemente el mejor mes para combinarlo todo.",
      },
      {
        season: "Invierno",
        months: "Noviembre – marzo",
        body: "Las ciudades siguen animadas y los precios bajan. Canarias es un verdadero destino de playa en invierno; Baleares, en cambio, cierra en gran medida.",
      },
    ],
    gettingAroundTitle: "Cómo moverse por España",
    gettingAround: [
      "La red de alta velocidad AVE es rápida y compite de verdad con el avión entre las grandes ciudades: Madrid–Barcelona tarda menos de tres horas de centro a centro. Aquí, los traslados desde y hacia las estaciones importan tanto como los del aeropuerto.",
      "Los aeropuertos españoles son grandes y dispersos. Madrid-Barajas tiene cuatro terminales conectadas por lanzadera; entre la T1 y la T2 de Barcelona hay que tomar un autobús. La terminal determina dónde le espera el conductor.",
      "Los aeropuertos insulares sufren picos extremos en verano. Palma, Ibiza y Alicante reciben un enorme volumen de vuelos chárter estacionales, y se nota en las paradas de taxi: en agosto, esperar una hora es habitual.",
      "Los complejos costeros suelen quedar lejos del aeropuerto con el que se anuncian. Algunos hoteles de la Costa del Sol están a noventa minutos de Málaga; ciertas zonas de la Costa Blanca, a una hora de Alicante. Compruebe el tiempo de conducción antes de dar por hecho que el trayecto será corto.",
    ],
    knowBefore: [
      {
        title: "Los traslados se confirman mediante presupuesto",
        body: "Trabajamos con colaboradores locales autorizados en toda España. Usted envía la ruta, nosotros le respondemos con un precio fijo confirmado por un operador concreto y paga cuando lo acepta: sin taxímetro ni tarifas dinámicas.",
      },
      {
        title: "La cena empieza tarde",
        body: "En gran parte de España, las cocinas abren hacia las 20:30 y se llenan después de las 22:00. Si reserva un traslado temprano a un restaurante, probablemente llegará antes de que abra.",
      },
      {
        title: "Peajes en las autopistas AP",
        body: "Muchas autopistas costeras son de peaje y las alternativas gratuitas resultan mucho más lentas. El presupuesto incluye todos los peajes de la ruta; no los añadimos después.",
      },
      {
        title: "Agosto es el mes nacional de vacaciones",
        body: "Buena parte del país se toma agosto libre. Cierran restaurantes en las ciudades y las zonas turísticas funcionan a plena capacidad. Reserve el vehículo pronto, en especial si necesita más de seis plazas.",
      },
    ],
    faqs: [
      {
        q: "¿A qué distancia está el aeropuerto de Málaga de los complejos de la Costa del Sol?",
        a: "Torremolinos está a quince minutos; Marbella, a unos cuarenta y cinco; Estepona o Sotogrande, más cerca de noventa. La denominación «Costa del Sol» abarca bastante más de cien kilómetros de litoral, así que compruebe la ubicación real del hotel antes de suponer que el traslado será breve.",
      },
      {
        q: "¿En qué terminal de Madrid me esperará el conductor?",
        a: "En aquella donde aterrice: indíquenos el número de vuelo y haremos su seguimiento. La T4 y la T4S quedan a un trayecto en lanzadera de la T1–T3, por lo que en Barajas este dato importa más que en la mayoría de los aeropuertos.",
      },
      {
        q: "¿Prestan servicio en las Islas Canarias?",
        a: "Sí, desde Tenerife Sur y Gran Canaria, mediante presupuesto confirmado. Indíquenos el complejo turístico y calcularemos el traslado con cualquier suplemento específico de la isla incluido desde el principio.",
      },
      {
        q: "¿Pueden transportar palos de golf, esquís o tablas de surf?",
        a: "Sí, pero avísenos al reservar. El equipaje de gran tamaño cambia la clase de vehículo; presentarse con cuatro bolsas de golf para una berlina es una de las pocas cosas que de verdad no pueden solucionarse ese mismo día.",
      },
    ],
  },
  italy: {
    tagline: "Veinte regiones que discuten sobre comida y dos islas que discuten con la península.",
    intro:
      "Italia recompensa a quien viaja despacio y castiga a quien intenta verlo todo. El norte es alpino e industrial; Toscana y Umbría son la imagen de postal; Roma acumula capas de historia hasta treinta metros de profundidad; el sur y las islas son más cálidos, más pobres y, para muchos viajeros, la parte más memorable. El tren conecta bien las ciudades, pero el campo —el motivo por el que tantos vienen— exige coche o conductor.",
    facts: [
      { label: "Moneda", value: "Euro (€)" },
      { label: "Conducción", value: "Por la derecha" },
      { label: "Idioma", value: "Italiano; el nivel de inglés cambia mucho según la región" },
      { label: "Temporada alta", value: "Junio a agosto" },
      { label: "Mejor relación calidad-precio", value: "Abril, mayo, septiembre y octubre" },
    ],
    highlights: [
      {
        title: "Roma",
        body: "El Foro, el Vaticano y el Panteón acaparan los titulares, pero la ciudad se disfruta de verdad en los espacios entre ellos. Fiumicino queda a cuarenta y cinco minutos; Ciampino recibe aerolíneas de bajo coste y está más cerca, aunque es más pequeño.",
        citySlug: "rome",
      },
      {
        title: "La Costa Amalfitana",
        body: "Positano, Amalfi y Ravello se asoman a una carretera excavada en el acantilado, y esa carretera es el gran problema: estrecha, concurrida y lenta, con restricciones para vehículos grandes en verano. El aeropuerto de Nápoles es la puerta de entrada; el trayecto dura unos noventa minutos y merece la pena hacerlo con alguien que lo conozca.",
        citySlug: "naples-amalfi",
      },
      {
        title: "Florencia y Toscana",
        body: "La ciudad es lo bastante pequeña para recorrerla a pie y tiene una ZTL que multa a quien entra en coche. En el campo —Chianti, Val d'Orcia, San Gimignano— resulta más útil un conductor que un vehículo de alquiler imposible de aparcar.",
        citySlug: "florence",
      },
      {
        title: "Venecia",
        body: "No hay coches, ninguno. Los vehículos se detienen en Piazzale Roma o Tronchetto; a partir de ahí, todo se hace a pie o por agua. Desde el aeropuerto Marco Polo se llega por carretera hasta Piazzale Roma o directamente en taxi acuático.",
        citySlug: "venice",
      },
      {
        title: "Sicilia",
        body: "Grande, cálida y marcada por capas de historia griega, árabe y normanda. Palermo y Catania están a tres horas por autopista y parecen países distintos. El Etna sigue activo y se puede visitar.",
        citySlug: "palermo",
      },
      {
        title: "Apulia",
        body: "El tacón de la bota: los trulli de Alberobello, el barroco de Lecce y una costa que solo recientemente se ha llenado de visitantes. Bari y Bríndisi son sus aeropuertos, y las distancias entre localidades son mayores de lo que parecen.",
        citySlug: "bari-puglia",
      },
    ],
    seasons: [
      {
        season: "Primavera",
        months: "Abril – mayo",
        body: "Ideal para ciudades y pueblos en las colinas. La Semana Santa llena Roma y Florencia. La Costa Amalfitana empieza a abrir en abril, pero no recupera toda su actividad hasta mayo.",
      },
      {
        season: "Pleno verano",
        months: "Junio – agosto",
        body: "Calor y multitudes en todas partes. En agosto, los italianos también se van de vacaciones: las ciudades se vacían, las costas se llenan y muchos restaurantes urbanos cierran dos semanas alrededor de Ferragosto.",
      },
      {
        season: "Otoño",
        months: "Septiembre – octubre",
        body: "El mejor equilibrio: tiempo cálido, vendimia en Toscana y Piamonte, y costas donde aún se puede nadar hasta principios de octubre.",
      },
      {
        season: "Invierno",
        months: "Noviembre – marzo",
        body: "Las ciudades alcanzan sus precios más bajos y están más tranquilas. Los Alpes y los Dolomitas abren para esquiar. Los complejos costeros y la carretera de Amalfi cierran en gran medida.",
      },
    ],
    gettingAroundTitle: "Cómo moverse por Italia",
    gettingAround: [
      "Las zonas ZTL le multarán. Casi todos los centros históricos restringen el tráfico, las cámaras lo controlan automáticamente y la empresa de alquiler le enviará la sanción meses después. Los conductores autorizados disponen de permisos que los coches particulares no tienen.",
      "Las carreteras de Amalfi y Sorrento restringen los vehículos grandes en verano. Los minibuses tienen limitaciones estacionales en la SS163, algo que afecta directamente a los traslados de grupos; al preparar el presupuesto le diremos si el grupo debe dividirse en dos vehículos.",
      "Los trenes son excelentes entre ciudades e inútiles para llegar al campo. El eje Roma–Florencia–Milán es más rápido en tren que en avión. Fuera de él, todo se hace por carretera.",
      "Las distancias desde el aeropuerto varían enormemente. Fiumicino está a 45 minutos del centro de Roma; Milán-Malpensa, casi a una hora; y en Venecia Marco Polo el último tramo se hace en barco. Ninguno queda tan cerca como da a entender la página de reservas.",
    ],
    knowBefore: [
      {
        title: "Los traslados se confirman mediante presupuesto",
        body: "Calculamos la ruta con un operador italiano autorizado y confirmamos el total antes de que pague. En Italia esto importa más que en muchos destinos, porque los permisos ZTL y las restricciones de vehículos en la costa deben comprobarse ruta por ruta.",
      },
      {
        title: "Venecia termina donde empieza el agua",
        body: "El conductor puede llegar hasta Piazzale Roma y no más allá. Si el hotel está en pleno centro, organice el último tramo en vaporetto o taxi acuático y prepare el equipaje en consecuencia: hay muchos puentes y ninguna rueda que ayude.",
      },
      {
        title: "Ferragosto lo cierra casi todo",
        body: "Alrededor del 15 de agosto, buena parte del país se detiene. Restaurantes, tiendas y pequeños negocios cierran durante dos semanas. El transporte sigue funcionando, pero conviene reservarlo antes de lo habitual.",
      },
      {
        title: "El coperto no es una propina",
        body: "El cubierto por persona que aparece en la cuenta del restaurante es habitual y no equivale al servicio. Redondear el importe es normal; dejar entre un quince y un veinte por ciento, como se espera en Estados Unidos, no lo es.",
      },
    ],
    faqs: [
      {
        q: "¿Pueden llevarme en coche dentro de una zona ZTL?",
        a: "Los vehículos de traslado autorizados pueden acceder a la mayoría de los centros restringidos donde no entran los coches particulares, pero las normas cambian según la ciudad y algunas direcciones son realmente inaccesibles. Facilítenos la dirección exacta del hotel al pedir presupuesto y confirmaremos hasta dónde podemos llegar.",
      },
      {
        q: "¿Cuánto se tarda del aeropuerto de Nápoles a Positano?",
        a: "Unos noventa minutos en condiciones normales y bastante más en julio y agosto, cuando la carretera costera se congestiona. Con un precio fijo, el tráfico es problema nuestro y no de un taxímetro que sigue corriendo.",
      },
      {
        q: "¿Es mejor un traslado que el tren desde el aeropuerto de Roma?",
        a: "El Leonardo Express es rápido y barato si el hotel está cerca de Termini. Si no lo está —o viaja con equipaje, niños o en un vuelo temprano—, el traslado puerta a puerta suele ganar tanto en tiempo como en tranquilidad.",
      },
      {
        q: "¿Prestan servicio en Cerdeña y Sicilia?",
        a: "Sí, desde Cagliari, Palermo y Catania. Los traslados insulares se confirman mediante presupuesto, igual que los peninsulares, y las rutas que atraviesan la isla se calculan como larga distancia, no como simples trayectos de aeropuerto.",
      },
    ],
  },
  portugal: {
    tagline: "Atlántico, no Mediterráneo: agua más fresca, olas mayores y más horas de luz.",
    intro:
      "Portugal es lo bastante pequeño para cruzarlo en un día y lo bastante variado para que no deba hacerlo. Lisboa y Oporto son ciudades de colinas levantadas junto a ríos; el Alentejo que las separa es vacío, llano y caluroso; el Algarve es el país de playas que todos conocen. Y después están las islas atlánticas: Madeira, subtropical y volcánica, y las Azores, nueve islas en las que la mayoría de los viajeros nunca ha pensado. El agua es más fría que la del Mediterráneo en todas partes. Es el precio de tener esas olas.",
    facts: [
      { label: "Moneda", value: "Euro (€)" },
      { label: "Conducción", value: "Por la derecha" },
      { label: "Idioma", value: "Portugués; el inglés está muy extendido" },
      { label: "Temporada alta", value: "Julio y agosto" },
      { label: "Mejor relación calidad-precio", value: "Mayo, junio y septiembre" },
    ],
    highlights: [
      {
        title: "Lisboa",
        body: "Siete colinas, fachadas de azulejos y tranvías que siguen siendo transporte público de verdad, no una atracción. Sintra está a cuarenta minutos y merece un día entero. El aeropuerto Humberto Delgado se encuentra dentro de la ciudad, algo tan poco habitual como práctico.",
        citySlug: "lisbon",
      },
      {
        title: "Oporto y el Duero",
        body: "Las bodegas de vino de Oporto están en Vila Nova de Gaia, al otro lado del río. Hacia el interior, el valle del Duero despliega cien kilómetros de viñedos en terrazas y una de las carreteras más bellas de Europa.",
        citySlug: "porto",
      },
      {
        title: "El Algarve",
        body: "Faro es el aeropuerto y la costa se prolonga mucho en ambas direcciones. El oeste, cerca de Sagres, es agreste y ventoso; el centro, alrededor de Lagos y Albufeira, está más desarrollado; el este, hacia Tavira, es más tranquilo y llano.",
        citySlug: "algarve",
      },
      {
        title: "Madeira",
        body: "Subtropical, montañosa y verde todo el año, con senderos de levadas excavados en las laderas. El aeropuerto de Funchal es famoso por su corta pista sobre pilares; el trayecto a la mayoría de los hoteles es breve, pero empinado.",
        citySlug: "funchal",
      },
      {
        title: "Las Azores",
        body: "Nueve islas volcánicas en mitad del Atlántico. São Miguel reúne los lagos de cráter y la mayoría de los vuelos; las demás son cada vez más tranquilas. El tiempo cambia cada hora y el avistamiento de ballenas es de categoría mundial.",
        citySlug: "ponta-delgada",
      },
    ],
    seasons: [
      {
        season: "Primavera",
        months: "Abril – junio",
        body: "Flores silvestres en el Alentejo, temperaturas cómodas para recorrer las ciudades a pie y un Algarve que empieza a calentarse sin multitudes. El Atlántico aún está frío.",
      },
      {
        season: "Pleno verano",
        months: "Julio – agosto",
        body: "El Algarve se llena de veraneantes europeos y Lisboa se vuelve calurosa. Madeira conserva temperaturas moderadas. Reserve pronto los traslados del Algarve: la franja de complejos turísticos genera una demanda simultánea enorme.",
      },
      {
        season: "Otoño",
        months: "Septiembre – octubre",
        body: "La mejor época en conjunto. El mar alcanza su máxima temperatura, la vendimia del Duero tiene lugar en septiembre y las ciudades vuelven a resultar agradables.",
      },
      {
        season: "Invierno",
        months: "Noviembre – marzo",
        body: "Lisboa y Oporto siguen animadas y económicas. Madeira es un auténtico destino de invierno, con unos 19 °C. El Algarve está tranquilo y muchos complejos reducen su actividad.",
      },
    ],
    gettingAroundTitle: "Cómo moverse por Portugal",
    gettingAround: [
      "El aeropuerto de Lisboa está dentro de la ciudad, por lo que los traslados son cortos, aunque el tráfico de los alrededores es denso. En hora punta, llegar a Cascais o Sintra lleva mucho más de lo que sugiere la distancia.",
      "El Algarve es más largo de lo que parece. De Faro a Sagres hay unos noventa minutos; de Faro a Tavira, treinta. Bajo la etiqueta «Algarve» se anuncian complejos repartidos por más de 150 km de costa.",
      "Los peajes de autopista son electrónicos. Muchas autopistas portuguesas cobran automáticamente y no tienen cabinas, algo que sorprende con frecuencia a quienes alquilan un coche. Todos los peajes están incluidos en el precio que presupuestamos.",
      "Madeira y las Azores tienen pendientes pronunciadas. Las carreteras son estrechas, los desniveles fuertes y algunos hoteles solo admiten vehículos pequeños. Indíquenos el alojamiento y enviaremos un vehículo que pueda llegar de verdad.",
    ],
    knowBefore: [
      {
        title: "Los traslados se confirman mediante presupuesto",
        body: "Confirmamos la ruta y el precio con un operador portugués autorizado antes del pago. En Madeira y las Azores, las rutas se calculan individualmente porque el acceso cambia mucho de un alojamiento a otro.",
      },
      {
        title: "El Atlántico está frío",
        body: "En la costa oeste, la temperatura del mar rara vez supera los 19 °C, incluso en agosto. El Algarve, orientado al sur, está unos grados más cálido. Para hacer surf se usa neopreno todo el año.",
      },
      {
        title: "La tarjeta se acepta casi en todas partes",
        body: "Portugal adoptó pronto los pagos sin contacto y funcionan prácticamente en cualquier sitio, también en pequeños cafés y taxis. No hace falta llevar grandes cantidades de efectivo.",
      },
      {
        title: "Sintra exige madrugar",
        body: "Las entradas para el Palacio da Pena y la Quinta da Regaleira se agotan, y a media mañana la carretera de subida ya es un cuello de botella. Salir de Lisboa con conductor antes de las 08:00 transforma por completo el día.",
      },
    ],
    faqs: [
      {
        q: "¿A qué distancia está el aeropuerto de Faro de los complejos turísticos?",
        a: "Albufeira está a unos cuarenta minutos; Lagos, a una hora; Vilamoura, a veinticinco minutos; y Sagres, más cerca de noventa. Indíquenos el nombre del hotel y presupuestaremos el trayecto real, no una media regional.",
      },
      {
        q: "¿Merece la pena un traslado desde el aeropuerto de Lisboa?",
        a: "El metro llega al centro por poco dinero si viaja ligero. Con equipaje, niños o un hotel entre las calles llenas de escaleras de Alfama, un coche puerta a puerta ofrece una experiencia muy distinta por una diferencia de precio moderada.",
      },
      {
        q: "¿Prestan servicio en Madeira y las Azores?",
        a: "Sí: Funchal y Ponta Delgada, con presupuesto confirmado. En ambas islas hay alojamientos a los que los vehículos grandes no pueden llegar físicamente, así que adaptamos el vehículo a la dirección y no solo al número de pasajeros.",
      },
      {
        q: "¿Puedo recorrer el valle del Duero durante un día con conductor?",
        a: "Sí, mediante un servicio por horas o de jornada completa desde Oporto. Funciona mejor que conducir por cuenta propia porque las carreteras del valle tienen muchas curvas y en las quintas sirven el vino con generosidad.",
      },
    ],
  },
  cyprus: {
    tagline: "El rincón más cálido del Mediterráneo, con una temporada de baño que llega hasta noviembre.",
    intro:
      "Chipre es la tercera isla más grande del Mediterráneo y la que disfruta del verano más largo: el mar se mantiene por encima de 22 °C hasta bien entrado noviembre. Es tan compacta que cualquier trayecto se completa en menos de tres horas, y está dividida de una forma que condiciona el viaje: la República al sur, el norte administrado por Turquía y, entre ambos, una zona de amortiguación de la ONU. La mayoría de los visitantes se aloja en el sur, donde se encuentran los aeropuertos, los complejos turísticos y los yacimientos arqueológicos.",
    facts: [
      { label: "Moneda", value: "Euro (€)" },
      { label: "Conducción", value: "Por la izquierda" },
      { label: "Idioma", value: "Griego y turco; el inglés está muy extendido" },
      { label: "Temporada alta", value: "Julio y agosto" },
      { label: "Mejor relación calidad-precio", value: "Abril, mayo y octubre" },
    ],
    highlights: [
      {
        title: "Pafos",
        body: "Un parque arqueológico declarado Patrimonio Mundial por la UNESCO, con algunos de los mosaicos romanos mejor conservados del mundo, además de las Tumbas de los Reyes y un paseo junto al puerto. El aeropuerto está a quince minutos.",
        citySlug: "paphos",
      },
      {
        title: "Limasol",
        body: "El centro económico y de ocio nocturno de la isla, con un largo paseo marítimo, puerto deportivo y la mejor variedad de restaurantes de Chipre. Está aproximadamente a mitad de camino entre los dos aeropuertos.",
        citySlug: "limassol",
      },
      {
        title: "Ayia Napa y Protaras",
        body: "Las playas del sureste —Nissi, Fig Tree Bay, Konnos— tienen la mejor arena de la isla. Ayia Napa concentra la fiesta; Protaras, el ambiente familiar. Solo las separan diez minutos.",
        citySlug: "ayia-napa",
      },
      {
        title: "Los montes Troodos",
        body: "Iglesias bizantinas pintadas, pueblos de montaña y, durante un breve periodo invernal, nieve suficiente para esquiar. Están a una hora de la costa y en agosto registran quince grados menos.",
      },
      {
        title: "Nicosia",
        body: "La última capital dividida de Europa. Conserva sus murallas venecianas, el Museo de Chipre y un paso en la calle Ledra hacia la mitad norte.",
        citySlug: "nicosia",
      },
      {
        title: "Akamas y la bahía de Lara",
        body: "La agreste península del noroeste, sin asfaltar ni urbanizar, donde las tortugas bobas anidan entre junio y agosto. Solo se puede acceder en todoterreno o a pie.",
      },
    ],
    seasons: [
      {
        season: "Primavera",
        months: "Marzo – mayo",
        body: "Flores silvestres, temperaturas agradables para caminar por Troodos y un mar apto para el baño desde mayo. Es el periodo de buen tiempo más tranquilo.",
      },
      {
        season: "Pleno verano",
        months: "Junio – agosto",
        body: "Caluroso: en el interior, Nicosia supera con frecuencia los 40 °C; la costa registra unos grados menos. Hay mucha actividad, pero Chipre absorbe mejor las multitudes que las islas griegas pequeñas.",
      },
      {
        season: "Otoño",
        months: "Septiembre – noviembre",
        body: "La mejor estación de la isla. El mar alcanza su máxima temperatura en septiembre y aún permite bañarse en noviembre, mientras todo sigue abierto y los precios bajan.",
      },
      {
        season: "Invierno",
        months: "Diciembre – febrero",
        body: "Suave y verde, con unos 17 °C en la costa y nevadas ocasionales en Troodos. Los complejos turísticos se tranquilizan, pero Limasol y Pafos siguen abiertos.",
      },
    ],
    gettingAroundTitle: "Cómo moverse por Chipre",
    gettingAround: [
      "Se conduce por la izquierda, herencia de la administración británica. Sorprende a quienes llegan de la Europa continental y es un buen motivo para dejarse llevar, en vez de conducir, durante el primer día.",
      "Hay dos aeropuertos, ambos en el sur. Lárnaca recibe la mayor parte del tráfico y ocupa una posición central; Pafos da servicio al oeste. De Lárnaca a Pafos hay unos noventa minutos, así que volar al aeropuerto equivocado sale caro.",
      "El transporte público es limitado. Los autobuses conectan las principales ciudades, pero pasan con poca frecuencia y apenas llegan a las montañas o a las playas alejadas de los complejos turísticos. Las distancias son cortas, pero hace falta un vehículo.",
      "Cruzar al norte es posible, aunque no con todos los vehículos. Los seguros de coches de alquiler y traslados no siempre son válidos al otro lado de la zona de amortiguación. Avísenos si su ruta la cruza y confirmaremos qué opciones existen.",
    ],
    knowBefore: [
      {
        title: "Los traslados se confirman mediante presupuesto",
        body: "Calculamos la ruta con un operador chipriota autorizado y la confirmamos antes del pago. Cubrimos ambos aeropuertos, incluidos los trayectos que cruzan la isla de uno a otro.",
      },
      {
        title: "Lárnaca y Pafos están a noventa minutos",
        body: "Compruebe desde qué aeropuerto sale el vuelo de regreso. Con las aerolíneas de bajo coste es habitual llegar por uno y partir desde el otro, y debe tenerlo en cuenta al planificar el traslado.",
      },
      {
        title: "La temporada de baño es realmente larga",
        body: "Octubre y principios de noviembre ofrecen temperaturas fiables para bañarse, algo que no sucede en Grecia ni en España. Chipre al final de la temporada es uno de los secretos mejor guardados del Mediterráneo.",
      },
      {
        title: "Pedir un meze es un compromiso",
        body: "Un meze chipriota completo puede incluir veinte platos o más y prolongarse durante horas. Pídalo para cenar, no antes de un vuelo.",
      },
    ],
    faqs: [
      {
        q: "¿A qué aeropuerto debería volar?",
        a: "Lárnaca para Ayia Napa, Protaras, Nicosia y Limasol. Pafos para la propia Pafos, Coral Bay y el oeste. Limasol está aproximadamente a la misma distancia de ambos, así que puede decidir por el precio del vuelo.",
      },
      {
        q: "¿Cuánto se tarda del aeropuerto de Lárnaca a Ayia Napa?",
        a: "Unos cuarenta y cinco minutos por autopista. Protaras está aproximadamente a una hora. Ambos son trayectos sencillos y se presupuestan como traslados de aeropuerto a precio fijo.",
      },
      {
        q: "¿Pueden llevarme hasta la parte norte?",
        a: "En ocasiones, según el seguro del operador y el paso fronterizo. Pregunte antes de reservar, no el mismo día: es una cuestión de licencias, no de voluntad.",
      },
      {
        q: "¿Merece la pena visitar Chipre fuera del verano?",
        a: "Mucho. Octubre es posiblemente el mejor mes del año, y el invierno en la costa permite caminar, visitar yacimientos arqueológicos y jugar al golf con temperaturas suaves mientras el norte de Europa se congela.",
      },
    ],
  },
  turkey: {
    tagline: "Dos continentes, más costa que Italia y una lira que cunde.",
    intro:
      "Turquía se extiende por Europa y Asia y sus precios no se parecen a los de ninguna de las dos. Estambul basta por sí sola para justificar el viaje: una ciudad de dieciséis millones de habitantes a ambos lados del Bósforo, construida sobre capas romanas, bizantinas y otomanas. Más allá, las costas del Egeo y del Mediterráneo reúnen ruinas clásicas y aguas turquesas en un mismo paisaje, mientras los valles volcánicos de Capadocia no se parecen a ningún otro lugar del planeta. Las distancias son continentales: el país tiene el tamaño de Francia y Alemania juntas.",
    facts: [
      { label: "Moneda", value: "Lira turca (₺)" },
      { label: "Conducción", value: "Por la derecha" },
      { label: "Idioma", value: "Turco; el inglés es habitual en las zonas turísticas" },
      { label: "Temporada alta", value: "Junio a septiembre" },
      { label: "Mejor relación calidad-precio", value: "Abril, mayo y octubre" },
    ],
    highlights: [
      {
        title: "Estambul",
        body: "Santa Sofía, la Mezquita Azul, Topkapı y el Gran Bazar se concentran en una zona que puede recorrerse a pie, pero la ciudad se extiende por dos continentes. El aeropuerto de Estambul está en el lado europeo y muy alejado: se tarda una hora o más hasta Sultanahmet. Sabiha Gökçen queda en el lado asiático y aún más lejos del casco antiguo.",
        citySlug: "istanbul",
      },
      {
        title: "Capadocia",
        body: "Chimeneas de hadas, iglesias excavadas en roca y ciudades subterráneas, mejor contempladas desde un globo al amanecer. Kayseri y Nevşehir son los aeropuertos; el trayecto hasta Göreme dura alrededor de una hora.",
        citySlug: "cappadocia",
      },
      {
        title: "La Costa Turquesa",
        body: "Entre Dalaman y Antalya, la costa encadena bahías, ruinas licias y aguas bordeadas de pinos: Ölüdeniz, Kaş, Kalkan, Kaputaş. La carretera es espectacular y lenta.",
        citySlug: "dalaman",
      },
      {
        title: "Antalya",
        body: "Una extensa región de complejos turísticos con un auténtico casco antiguo en Kaleiçi y las ruinas romanas de Perge y Aspendos en las cercanías. El aeropuerto tiene mucho tráfico y la franja hotelera se prolonga una hora en ambas direcciones.",
        citySlug: "antalya",
      },
      {
        title: "Bodrum y el Egeo",
        body: "Casas encaladas, buganvillas y un ambiente más exclusivo que el de los complejos mediterráneos. La península tiene una docena de bahías con personalidad propia, y el aeropuerto queda a unos cuarenta minutos de la mayoría.",
        citySlug: "bodrum",
      },
      {
        title: "Éfeso y İzmir",
        body: "Una de las ciudades clásicas mejor conservadas del Mediterráneo, a una hora del aeropuerto de İzmir. Şirince y la península de Çeşme están lo bastante cerca para combinarlas en el mismo viaje.",
        citySlug: "izmir",
      },
    ],
    seasons: [
      {
        season: "Primavera",
        months: "Abril – mayo",
        body: "Ideal para Estambul, Capadocia y las ruinas: días cálidos, sin multitudes, y tulipanes en Estambul durante abril. El mar todavía está fresco.",
      },
      {
        season: "Pleno verano",
        months: "Junio – agosto",
        body: "Las costas están calurosas y llenas; el interior de Capadocia, cálido y seco; Estambul, húmeda. Conviene reservar los traslados a los complejos turísticos con mucha antelación, sobre todo en Antalya.",
      },
      {
        season: "Otoño",
        months: "Septiembre – octubre",
        body: "Los mejores meses en la costa: el mar alcanza su máxima temperatura, las multitudes disminuyen y los vuelos en globo de Capadocia son más fiables.",
      },
      {
        season: "Invierno",
        months: "Noviembre – marzo",
        body: "Estambul tiene ambiente y precios bajos; Capadocia se cubre de nieve y luce espectacular. Los complejos costeros cierran en gran medida.",
      },
    ],
    gettingAroundTitle: "Cómo moverse por Turquía",
    gettingAround: [
      "Los aeropuertos de Estambul están lejos y en lados opuestos del Bósforo. Del aeropuerto de Estambul a Sultanahmet se tarda entre 45 y 90 minutos, según el tráfico; desde Sabiha Gökçen puede llevar bastante más de una hora y hay que cruzar un puente que se atasca con frecuencia. El aeropuerto donde aterrice cambia realmente su jornada.",
      "Los vuelos nacionales son baratos y frecuentes. Para viajar de Estambul a Capadocia o a la costa sur, volar gana por mucha diferencia a conducir: las distancias son continentales.",
      "Las franjas de complejos turísticos son largas. La región de Antalya va desde Kemer, al oeste, hasta Side y Alanya, al este: más de dos horas de costa bajo el nombre de un solo aeropuerto. Confirme la ubicación real del hotel.",
      "El tráfico de Estambul es intenso e imprevisible. Un traslado a precio fijo nos asigna ese riesgo; un taxímetro atrapado en el tráfico se lo asigna a usted.",
    ],
    knowBefore: [
      {
        title: "Los traslados se confirman mediante presupuesto",
        body: "Calculamos el precio con un operador turco autorizado y confirmamos el total en euros antes del pago. Así se eliminan las variaciones del tipo de cambio de la lira entre la reserva y el viaje, que pueden ser considerables.",
      },
      {
        title: "Compruebe el aeropuerto de Estambul",
        body: "IST y SAW están separados por más de sesenta kilómetros, con el Bósforo entre ambos. Reservar el traslado al aeropuerto equivocado es el error más frecuente en este mercado.",
      },
      {
        title: "Los vuelos en globo dependen del tiempo",
        body: "En Capadocia, el viento cancela más vuelos de lo que anuncian los operadores, especialmente en invierno y a mediados de verano. Deje una mañana libre adicional en el itinerario.",
      },
      {
        title: "Vestimenta discreta en las mezquitas",
        body: "Las mezquitas en uso piden llevar hombros y rodillas cubiertos, además de pañuelo para las mujeres. La mayoría de los grandes monumentos presta prendas en la entrada y todos cierran a los visitantes durante la oración.",
      },
    ],
    faqs: [
      {
        q: "¿Cuánto se tarda del aeropuerto de Estambul a Sultanahmet?",
        a: "Normalmente entre 45 y 60 minutos, y hasta 90 en hora punta. Desde Sabiha Gökçen, en el lado asiático, calcule entre 60 y 100 minutos porque la ruta cruza el Bósforo.",
      },
      {
        q: "¿Sale más barato tomar un taxi en Turquía?",
        a: "La tarifa inicial puede parecer menor, pero las disputas por el taxímetro y la ruta en los taxis de Estambul son un problema bien conocido entre los visitantes. Acordar un precio fijo en euros antes del viaje elimina por completo la negociación.",
      },
      {
        q: "¿Prestan servicio en Capadocia?",
        a: "Sí, desde los aeropuertos de Kayseri y Nevşehir hasta Göreme, Ürgüp y Uçhisar. Los hoteles cueva suelen estar en calles donde no entran los vehículos grandes, así que indíquenos el nombre del alojamiento al pedir presupuesto.",
      },
      {
        q: "¿Qué aeropuerto debo elegir para la Costa Turquesa?",
        a: "Dalaman para Fethiye, Ölüdeniz, Kalkan y Kaş. Antalya para Kemer, Side y Alanya. Bodrum para la península del Egeo. La costa es tan larga que elegir el aeropuerto equivocado puede añadir tres horas al trayecto.",
      },
    ],
  },
} satisfies NonNullable<ContentOverlays["countryGuides"]>;

export default { ...overlay, countryGuides } satisfies ContentOverlays;
