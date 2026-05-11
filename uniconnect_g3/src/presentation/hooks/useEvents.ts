import { useEffect, useState, useCallback } from 'react';
import { getEvents, getEventCategories, subscribeToCategory, unsubscribeFromCategory, getSubscribedCategories } from '../../di/container';
import { Event } from '../../domain/entities/Event';
import { EventCategory } from '../../domain/entities/EventCategory';
import { getValidSortedEvents } from '@/utils/dateUtils';
import { authStore } from '@uniconnect/shared';

export const useEvents = () => {
  const user = authStore((state) => state.user);
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [subscribedCategoryIds, setSubscribedCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submittingSubscription, setSubmittingSubscription] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [user?.uid]);

  const fetchInitialData = async () => {
    setLoading(true);
    setLoadingCategories(true);
    try {
      const promises: [Promise<Event[]>, Promise<EventCategory[]>, Promise<string[]>?] = [
        getEvents.execute(),
        getEventCategories.execute()
      ];

      if (user?.uid) {
        promises.push(getSubscribedCategories.execute(user.uid));
      }

      const [eventsData, categoriesData, subscriptionsData] = await Promise.all(promises);

      // Ordenar por categoría (type) y luego por fecha
      const sorted = [...eventsData].sort((a, b) => {
        const typeA = a.type || '';
        const typeB = b.type || '';
        const catCompare = typeA.localeCompare(typeB);
        if (catCompare !== 0) return catCompare;
        const dateA = a.date || '';
        const dateB = b.date || '';
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });

      setEvents(sorted);
      setCategories(categoriesData);
      if (subscriptionsData) {
        setSubscribedCategoryIds(subscriptionsData);
      }
    } catch (error) {
      console.error('Error cargando los datos iniciales de eventos:', error);
    } finally {
      setLoading(false);
      setLoadingCategories(false);
    }
  };

  const fetchEvents = useCallback(async (categoryId?: string) => {
    try {
      setLoading(true);
      const data = await getEvents.execute(categoryId);

      // Si hay filtro por categoría, solo ordenamos por fecha
      // Si no hay filtro, ordenamos por categoría y luego por fecha
      const sorted = [...data].sort((a, b) => {
        if (!categoryId) {
          const typeA = a.type || '';
          const typeB = b.type || '';
          const catCompare = typeA.localeCompare(typeB);
          if (catCompare !== 0) return catCompare;
        }
        const dateA = a.date || '';
        const dateB = b.date || '';
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });

      setEvents(sorted);
    } catch (error) {
      console.error('Error cargando los eventos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSubscription = async (categoryId: string) => {
    if (!user?.uid) return;

    const isSubscribed = subscribedCategoryIds.includes(categoryId);
    setSubmittingSubscription(true);

    try {
      if (isSubscribed) {
        await unsubscribeFromCategory.execute(user.uid, categoryId);
        setSubscribedCategoryIds(prev => prev.filter(id => id !== categoryId));
      } else {
        await subscribeToCategory.execute(user.uid, categoryId);
        setSubscribedCategoryIds(prev => [...prev, categoryId]);
      }
    } catch (error) {
      console.error('Error al cambiar la suscripción:', error);
    } finally {
      setSubmittingSubscription(false);
    }
  };

  return {
    events,
    categories,
    subscribedCategoryIds,
    loading,
    loadingCategories,
    submittingSubscription,
    fetchEvents,
    toggleSubscription
  };
};