import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { normalizeMedia } from '../services/assets';

const DataStoreContext = createContext(null);

const unwrap = (response) => {
  const data = response.data?.data ?? response.data ?? [];
  return Array.isArray(data) ? data.map(normalizeMedia) : normalizeMedia(data);
};

const ignoredPayloadKeys = new Set([
  'id',
  'title_i18n',
  'description_i18n',
  'location_i18n',
  'summary_i18n',
  'createdAt',
  'updatedAt',
  'imagePreview',
]);

const toFormData = (item) => {
  const body = new FormData();

  Object.entries(item).forEach(([key, value]) => {
    if (ignoredPayloadKeys.has(key) || value === null || value === undefined) return;

    if (key === 'images') {
      const files = Array.isArray(value) ? value.filter((entry) => entry instanceof File) : [];
      files.forEach((file) => body.append('images[]', file));
      return;
    }

    if (key === 'clear_images') {
      if (value) body.append('clear_images', '1');
      return;
    }

    if (key === 'image') {
      if (value instanceof File) body.append('image', value);
      return;
    }

    body.append(key, value);
  });

  return body;
};

const multipartConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

export function DataStoreProvider({ children }) {
  const [opportunities, setOpportunities] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshPublicData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsResponse, opportunitiesResponse] = await Promise.all([
        api.get('/events'),
        api.get('/opportunities'),
      ]);
      setEvents(unwrap(eventsResponse));
      setOpportunities(unwrap(opportunitiesResponse));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPublicData().catch((error) => console.error('Unable to load public API data', error));
  }, [refreshPublicData]);

  const addOpportunity = useCallback(async (opportunity) => {
    const response = await api.post('/admin/opportunities', toFormData(opportunity), multipartConfig);
    setOpportunities((current) => [unwrap(response), ...current]);
  }, []);

  const updateOpportunity = useCallback(async (opportunity) => {
    const body = toFormData(opportunity);
    body.append('_method', 'PUT');
    const response = await api.post('/admin/opportunities/' + opportunity.id, body, multipartConfig);
    const updated = unwrap(response);
    setOpportunities((current) => current.map((item) => item.id === updated.id ? updated : item));
  }, []);

  const deleteOpportunity = useCallback(async (id) => {
    await api.delete('/admin/opportunities/' + id);
    setOpportunities((current) => current.filter((item) => item.id !== id));
  }, []);

  const addEvent = useCallback(async (event) => {
    const response = await api.post('/admin/events', toFormData(event), multipartConfig);
    setEvents((current) => [unwrap(response), ...current]);
  }, []);

  const updateEvent = useCallback(async (event) => {
    const body = toFormData(event);
    body.append('_method', 'PUT');
    const response = await api.post('/admin/events/' + event.id, body, multipartConfig);
    const updated = unwrap(response);
    setEvents((current) => current.map((item) => item.id === updated.id ? updated : item));
  }, []);

  const deleteEvent = useCallback(async (id) => {
    await api.delete('/admin/events/' + id);
    setEvents((current) => current.filter((item) => item.id !== id));
  }, []);

  const registerForEvent = useCallback(async (eventId, data) => {
    const response = await api.post('/events/' + eventId + '/register', data);
    const nextCount = response.data?.registrations_count;
    setRegistrations((current) => [...new Set([...current, String(eventId)])]);
    if (typeof nextCount === 'number') {
      setEvents((current) => current.map((event) => String(event.id) === String(eventId)
        ? { ...event, registrations_count: nextCount }
        : event));
    }
    return response.data;
  }, []);

  const isRegisteredForEvent = useCallback((eventId) => registrations.includes(String(eventId)), [registrations]);

  const value = useMemo(() => ({
    opportunities, events, registrations, loading,
    addOpportunity, updateOpportunity, deleteOpportunity,
    addEvent, updateEvent, deleteEvent,
    registerForEvent, isRegisteredForEvent, refreshPublicData,
    submissions: [], addSubmission: async () => null, updateSubmission: async () => null,
  }), [opportunities, events, registrations, loading, addOpportunity, updateOpportunity, deleteOpportunity, addEvent, updateEvent, deleteEvent, registerForEvent, isRegisteredForEvent, refreshPublicData]);

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>;
}

export function useDataStore() {
  const context = useContext(DataStoreContext);
  if (!context) throw new Error('useDataStore must be used within DataStoreProvider');
  return context;
}
