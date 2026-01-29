export const COURSES = [
    {
        id: 1,
        titulo: "Básquet Formativo: Iniciación",
        slug: "basquet-formativo-iniciacion",
        categoria: "Formativo",
        nivel: "Principiante",
        precio: "$49.99",
        imagen: "https://firebasestorage.googleapis.com/v0/b/basquet-formativo.appspot.com/o/images%2FCancha-Blanca-50.png?alt=media&token=fb103b37-5df5-46f2-8521-39259a133baf",
        descripcion: "Aprende los fundamentos esenciales para entrenar a niños y jóvenes en sus primeros pasos en el baloncesto. Este curso cubre desde la planificación de sesiones divertidas hasta la enseñanza de reglas básicas.",
        caracteristicas: [
            "Planificación de entrenamientos para U10-U12",
            "Juegos lúdicos para el aprendizaje",
            "Fundamentos del pase y el bote",
            "Psicología infantil aplicada al deporte"
        ],
        instructor: {
            nombre: "Laura Martínez",
            rol: "Especialista en Mini-Básquet",
            bio: "Entrenadora certificada con 10 años de experiencia en categorías de iniciación. Autora del libro 'Jugar para Aprender'.",
            imagen: "https://i.pravatar.cc/150?u=laura"
        },
        modulos: [
            {
                titulo: "Módulo 1: Filosofía del Mini-Básquet",
                orden: 1,
                clases: [
                    {
                        titulo: "Introducción al Mini-Básquet",
                        descripcion: "Conceptos básicos y filosofía del entrenamiento en edades tempranas.",
                        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        documento_url: "",
                        orden: 1
                    },
                    {
                        titulo: "El Rol del Entrenador Formador",
                        descripcion: "Cómo ser un guía positivo para los niños.",
                        video_url: "",
                        documento_url: "",
                        orden: 2
                    }
                ]
            },
            {
                titulo: "Módulo 2: Fundamentos Técnicos",
                orden: 2,
                clases: [
                    {
                        titulo: "El Bote: Juegos de Iniciación",
                        descripcion: "Ejercicios lúdicos para familiarizarse con el balón.",
                        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        documento_url: "",
                        orden: 1
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        titulo: "Desarrollo de Habilidades Individuales",
        slug: "desarrollo-habilidades-individuales",
        categoria: "Técnica",
        nivel: "Intermedio",
        precio: "$59.99",
        imagen: "https://firebasestorage.googleapis.com/v0/b/basquet-formativo.appspot.com/o/images%2Ffloor-texture.jpg?alt=media&token=2ac1c71a-742b-4661-a781-dec60b85f8a7",
        descripcion: "Métodos avanzados para mejorar el bote, tiro y pase de tus jugadores con ejercicios específicos. Enfocado en la biomecánica y la corrección de errores comunes.",
        caracteristicas: [
            "Mecánica de tiro avanzada",
            "Drills de manejo de balón (Ball handling)",
            "Finalizaciones cerca del aro",
            "Lectura de juego 1vs1"
        ],
        instructor: {
            nombre: "Carlos Rivera",
            rol: "Skills Coach",
            bio: "Ha trabajado con jugadores profesionales en el desarrollo de técnica individual. Fundador de CR Hoops.",
            imagen: "https://i.pravatar.cc/150?u=carlos"
        },
        modulos: [
            {
                titulo: "Módulo Único: Técnica de Élite",
                orden: 1,
                clases: [
                    {
                        titulo: "Biomecánica del Tiro",
                        descripcion: "Análisis detallado de la postura y el lanzamiento.",
                        video_url: "",
                        documento_url: "",
                        orden: 1
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        titulo: "Defensa y Estrategia de Equipo",
        slug: "defensa-estrategia-equipo",
        categoria: "Avanzado",
        nivel: "Avanzado",
        precio: "$79.99",
        imagen: "https://res.cloudinary.com/dzqdjsrez/image/upload/v1726054543/MBF_OKK_wcguyw.png",
        descripcion: "Domina los sistemas defensivos y ofensivos modernos. Análisis táctico y gestión de partidos para entrenadores que buscan competir al más alto nivel.",
        caracteristicas: [
            "Defensa individual y zonal",
            "Transición defensiva y balance",
            "Sistemas ofensivos contra zona",
            "Scouting del rival"
        ],
        instructor: {
            nombre: "Marcus Thorne",
            rol: "Director Deportivo",
            bio: "Ex-entrenador profesional con experiencia en ligas europeas. Especialista en táctica defensiva.",
            imagen: "https://i.pravatar.cc/150?u=marcus"
        },
        modulos: []
    }
];

export const NEWS = [
    {
        id: 1,
        titulo: "La importancia del Mini-Básquet en el desarrollo motor",
        slug: "importancia-mini-basquet",
        fecha: "10 de Marzo, 2026",
        categoria: "Metodología",
        imagen: "https://firebasestorage.googleapis.com/v0/b/basquet-formativo.appspot.com/o/images%2FCancha-Blanca-50.png?alt=media&token=fb103b37-5df5-46f2-8521-39259a133baf",
        resumen: "Analizamos cómo las primeras etapas formativas influyen decisivamente en la coordinación y habilidades futuras del jugador.",
        contenido: `
      <p>El Mini-Básquet no es solo una versión reducida del baloncesto adulto; es una disciplina con identidad propia y objetivos específicos. En esta etapa, el foco principal debe ser el desarrollo motor y la diversión.</p>
      
      <h2>Desarrollo de habilidades motoras</h2>
      <p>Durante las edades de 8 a 12 años, los niños experimentan una "fase sensible" para el aprendizaje motor. Es el momento ideal para introducir patrones de movimiento complejos que servirán de base para la técnica individual.</p>
      
      <h2>La adaptación del reglamento</h2>
      <p>Jugar con balones más pequeños y aros más bajos no es un capricho. Permite que el niño adquiera una mecánica de tiro correcta sin tener que forzar posturas antinaturales debido al peso del balón.</p>
      
      <p>En conclusión, respetar los tiempos madurativos y adaptar el juego al niño, y no el niño al juego, es la clave del éxito en el Mini-Básquet.</p>
    `,
        autor: "Laura Martínez"
    },
    {
        id: 2,
        titulo: "Clínica Internacional de Entrenadores 2026",
        slug: "clinica-internacional-2026",
        fecha: "5 de Abril, 2026",
        categoria: "Eventos",
        imagen: "https://firebasestorage.googleapis.com/v0/b/basquet-formativo.appspot.com/o/images%2Ffloor-texture.jpg?alt=media&token=2ac1c71a-742b-4661-a781-dec60b85f8a7",
        resumen: "Resumen de lo vivido en nuestro último encuentro con disertantes de la Euroliga y NBA G-League.",
        contenido: `
      <p>El pasado fin de semana vivimos una jornada histórica en nuestras instalaciones. Más de 200 entrenadores de toda Latinoamérica se reunieron para compartir conocimientos y experiencias.</p>
      
      <h2>Disertantes de lujo</h2>
      <p>Contamos con la presencia de entrenadores asistentes del Real Madrid y formadores de la academia de la NBA en México. Los temas principales rondaron sobre la transición del ataque rápido al juego por conceptos.</p>
      
      <p>Agradecemos a todos los que hicieron posible este evento y ya estamos trabajando en la edición 2027.</p>
    `,
        autor: "Redacción Básquet Formativo"
    }
];
