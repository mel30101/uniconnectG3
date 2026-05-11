export interface UniversityEvent {
  id: string;
  title: string;
  location: string;
  date: string; // Formato sugerido: YYYY-MM-DD para ordenar fácilmente
  time: string; // Formato sugerido: HH:MM AM/PM
  duration: string; // Ejemplo: "2 horas", "Todo el día"
  description: string;
  type: 'Cultural' | 'Deportivo' | 'Académico' | 'Social'; // Bonus para clasificar
  imageUrl?: string; // Opcional: URL de imagen para que se vea mejor
}

export const MOCK_EVENTS: UniversityEvent[] = [
  {
    id: '1',
    title: 'Festival Cultural de Bienvenida',
    location: 'Auditorio Central y Plazoleta',
    date: '2026-04-15',
    time: '04:00 PM',
    duration: '4 horas',
    description: 'Música en vivo, grupos de danza folclórica de la universidad y muestra gastronómica local para dar la bienvenida al nuevo semestre.',
    type: 'Cultural',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop', // Imagen de ejemplo de internet
  },
  {
    id: '2',
    title: 'Torneo Interfacultades de Futsal',
    location: 'Canchas Deportivas del Campus',
    date: '2026-04-18',
    time: '09:00 AM',
    duration: 'Todo el fin de semana',
    description: 'Ven a apoyar a tu facultad en el torneo inaugural de futsal. Inscripciones abiertas para equipos mixtos.',
    type: 'Deportivo',
    imageUrl: 'https://images.unsplash.com/photo-1579952362224-d9196b025492?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Seminario: IA aplicada a la Educación',
    location: 'Sala de Conferencias Edificio C, Piso 3',
    date: '2026-04-22',
    time: '10:00 AM',
    duration: '2 horas',
    description: 'Conferencistas invitados hablarán sobre cómo las herramientas de Inteligencia Artificial están transformando los métodos de estudio y enseñanza.',
    type: 'Académico',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop',
  },
];