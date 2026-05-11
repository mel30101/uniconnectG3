import { UniversityEvent } from '../app/constants/mockEvents';

export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const parseDate = (dateString: string): Date | null => {
  if (!isValidDate(dateString)) return null;
  return new Date(dateString);
};

export const getDaysDifference = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor((date1.getTime() - date2.getTime()) / oneDay);
};

export const sortEventsByClosestDate = (
  events: UniversityEvent[]
): UniversityEvent[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  return [...events].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    const diffA = getDaysDifference(dateA, today);
    const diffB = getDaysDifference(dateB, today);

    return diffA - diffB;
  });
};

export const getValidSortedEvents = (
  events: UniversityEvent[]): UniversityEvent[] => {
  const validEvents = events.filter((event) => isValidDate(event.date));
  return sortEventsByClosestDate(validEvents);
};

export const getEventStatus = (dateString: string):

  'upcoming' | 'today' | 'past' => {
  const eventDate = parseDate(dateString);

  if (!eventDate) return 'past';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDateNormalized = new Date(eventDate);
  eventDateNormalized.setHours(0, 0, 0, 0);
  const diff = getDaysDifference(eventDateNormalized, today);

  if (diff === 0) return 'today';
  if (diff > 0) return 'upcoming';
  return 'past';
};