import { NewsItem, RepoDocument, FileType } from './types';

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Inauguración del Año Lectivo 2026-2027",
    date: "2026-05-02",
    excerpt: "Con gran alegría recibimos a nuestros estudiantes en este nuevo periodo académico, reafirmando nuestro compromiso con la educación intercultural.",
    content: "La UECIB Gustavo Adolfo Bécquer dio la bienvenida a más de 500 estudiantes...",
    image: "https://images.unsplash.com/photo-1577891772410-b99730e774fa?q=80&w=2070&auto=format&fit=crop",
    category: "Institucional"
  },
  {
    id: 2,
    title: "Feria de Ciencias y Saberes Ancestrales",
    date: "2026-04-15",
    excerpt: "Estudiantes de bachillerato presentaron proyectos innovadores fusionando tecnología y conocimientos tradicionales.",
    content: "Se presentaron más de 20 proyectos enfocados en la sustentabilidad y el rescate de técnicas agrícolas ancestrales, utilizando monitoreo por sensores IoT.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
    category: "Académico"
  },
  {
    id: 3,
    title: "Capacitación Docente en Nuevas Tecnologías",
    date: "2026-03-20",
    excerpt: "Nuestros docentes participaron en el taller intensivo sobre herramientas digitales para el aula.",
    content: "El taller tuvo una duración de 40 horas cronológicas, donde se abordaron metodologías activas y el uso de plataformas interactivas para el aprendizaje bilingüe.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
    category: "Comunidad"
  },
  {
    id: 4,
    title: "Encuentro Cultural de Saberes",
    date: "2026-06-10",
    excerpt: "Nuestra institución fue sede del encuentro regional de saberes ancestrales y medicina tradicional.",
    content: "Participaron delegaciones de 5 comunidades vecinas, intercambiando conocimientos sobre el uso de plantas medicinales y la preservación de la lengua kichwa.",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224691?q=80&w=2070&auto=format&fit=crop",
    category: "Comunidad"
  },
  {
    id: 5,
    title: "Nueva Dotación para Laboratorio de Computación",
    date: "2026-07-05",
    excerpt: "Recibimos 30 nuevas terminales de alta gama para fortalecer el área de robótica y programación.",
    content: "Gracias a la gestión institucional y el apoyo ministerial, nuestros estudiantes de bachillerato ahora cuentan con mejores herramientas para el desarrollo de software.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop",
    category: "Académico"
  }
];

export const MOCK_DOCUMENTS: RepoDocument[] = [
  {
    id: '1',
    title: 'Planificación Curricular Anual - Matemáticas 10mo',
    type: FileType.PDF,
    level: 'EGB Superior',
    area: 'Matemáticas',
    year: '2026-2027',
    category: 'Planificación',
    uploadedBy: 'Juan Pérez',
    date: '2026-04-10',
    size: '1.2 MB'
  },
  {
    id: '2',
    title: 'Informe de Rendimiento Primer Quimestre',
    type: FileType.XLSX,
    level: 'Bachillerato',
    area: 'Ciencias Naturales',
    year: '2026-2027',
    category: 'Informe',
    uploadedBy: 'Maria González',
    date: '2026-07-15',
    size: '450 KB'
  },
  {
    id: '3',
    title: 'Acta de Junta de Curso - 2do BGU "A"',
    type: FileType.DOCX,
    level: 'Bachillerato',
    area: 'Gestión',
    year: '2026-2027',
    category: 'Acta',
    uploadedBy: 'Carlos Ruiz',
    date: '2026-07-20',
    size: '120 KB'
  },
  {
    id: '4',
    title: 'Lineamientos MINEDUC para Evaluación',
    type: FileType.PDF,
    level: 'General',
    area: 'Normativa',
    year: '2026-2027',
    category: 'Oficial',
    uploadedBy: 'Admin',
    date: '2026-01-10',
    size: '2.5 MB'
  }
];

export const INSTITUTIONAL_INFO = {
  history: "La Unidad Educativa Comunitaria Intercultural Bilingüe Gustavo Adolfo Bécquer fue fundada en 1995 con el objetivo de servir a la comunidad local, integrando los saberes ancestrales con la malla curricular nacional. A lo largo de los años, nos hemos consolidado como un referente de educación intercultural, respetando la diversidad y promoviendo la excelencia académica.",
  mission: "Formar niños, niñas y adolescentes con pensamiento crítico, reflexivo e intercultural, fundamentado en valores éticos y morales, capaces de transformar su realidad y contribuir al desarrollo sostenible de la sociedad ecuatoriana.",
  vision: "Ser una institución educativa líder en el sistema de educación intercultural bilingüe, reconocida por su calidad académica, innovación pedagógica y compromiso con la preservación de la identidad cultural para el año 2028.",
  values: ["Interculturalidad", "Respeto", "Responsabilidad", "Solidaridad", "Honestidad", "Justicia"]
};