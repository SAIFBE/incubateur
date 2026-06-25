import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { CATEGORIES } from '../data/categories';
import { PROGRAMS } from '../data/programs';
import { useAuth } from './AuthContext';

const AppDataContext = createContext(null);

const unwrapResource = (response) => response?.data?.data ?? response?.data ?? null;

const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const AppDataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = useMemo(() => CATEGORIES, []);
  const programs = useMemo(() => PROGRAMS, []);
  const comments = useMemo(() => [], []);

  const fetchAllAdminSubmissions = useCallback(async () => {
    const firstResponse = await api.get('/admin/project-ideas', { params: { page: 1 } });
    const firstPayload = firstResponse.data;
    const firstItems = normalizeCollection(firstPayload);
    const lastPage = firstPayload?.meta?.last_page || 1;

    if (lastPage <= 1) return firstItems;

    const pages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) =>
        api.get('/admin/project-ideas', { params: { page: index + 2 } })
      )
    );

    return [
      ...firstItems,
      ...pages.flatMap((response) => normalizeCollection(response.data)),
    ];
  }, []);

  const getSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = currentUser?.role === 'admin'
        ? await fetchAllAdminSubmissions()
        : normalizeCollection(unwrapResource(await api.get('/my-project-ideas')));

      setSubmissions(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.role, fetchAllAdminSubmissions]);

  const getMySubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = normalizeCollection(unwrapResource(await api.get('/my-project-ideas')));
      setSubmissions(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSubmission = useCallback(async (id) => {
    const submission = currentUser?.role === 'admin'
      ? unwrapResource(await api.get(`/admin/project-ideas/${id}`))
      : normalizeCollection(unwrapResource(await api.get('/my-project-ideas')))
        .find((item) => String(item.id) === String(id));

    if (!submission) {
      throw new Error('Project idea not found');
    }

    setSubmissions((previous) => {
      const exists = previous.some((item) => String(item.id) === String(submission.id));
      return exists
        ? previous.map((item) => (String(item.id) === String(submission.id) ? submission : item))
        : [submission, ...previous];
    });

    return submission;
  }, [currentUser?.role]);

  const createSubmission = useCallback(async (data) => {
    const submission = unwrapResource(await api.post('/project-ideas', data));
    setSubmissions((previous) => [submission, ...previous]);
    return submission;
  }, []);

  const updateSubmission = useCallback(async (id, data) => {
    const submission = unwrapResource(await api.put(`/submissions/${id}`, data));
    setSubmissions((previous) =>
      previous.map((item) => (String(item.id) === String(id) ? submission : item))
    );
    return submission;
  }, []);

  const updateSubmissionStatus = useCallback(async (id, data) => {
    const submission = unwrapResource(await api.patch(`/admin/project-ideas/${id}/review`, {
      status: data.status,
      admin_comment: data.admin_comment ?? '',
    }));

    setSubmissions((previous) =>
      previous.map((item) => (String(item.id) === String(id) ? submission : item))
    );

    return submission;
  }, []);

  const changeSubmissionStatus = useCallback((id, status, adminComment = '') => (
    updateSubmissionStatus(id, { status, admin_comment: adminComment })
  ), [updateSubmissionStatus]);

  const addSubmission = useCallback((data) => createSubmission(data), [createSubmission]);
  const archiveSubmission = useCallback((id) => updateSubmissionStatus(id, { status: 'rejected' }), [updateSubmissionStatus]);
  const addComment = useCallback(async () => null, []);

  const getStatusHistory = useCallback(async () => {
    const response = await api.get('/submission-status-history');
    const data = Array.isArray(response.data) ? response.data : [];
    setStatusHistory(data);
    return data;
  }, []);

  const getStatistics = useCallback(async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setSubmissions([]);
      setStatusHistory([]);
      return;
    }

    const loader = currentUser.role === 'admin' ? getSubmissions : getMySubmissions;
    loader().catch(() => undefined);
    getStatusHistory().catch(() => undefined);
  }, [currentUser, getMySubmissions, getStatusHistory, getSubmissions]);

  const value = useMemo(() => ({
    submissions,
    comments,
    statusHistory,
    categories,
    programs,
    loading,
    error,
    getSubmissions,
    getMySubmissions,
    getSubmission,
    createSubmission,
    updateSubmission,
    updateSubmissionStatus,
    changeSubmissionStatus,
    addSubmission,
    archiveSubmission,
    addComment,
    getStatusHistory,
    getStatistics,
  }), [
    submissions,
    statusHistory,
    loading,
    error,
    getSubmissions,
    getMySubmissions,
    getSubmission,
    createSubmission,
    updateSubmission,
    updateSubmissionStatus,
    changeSubmissionStatus,
    addSubmission,
    archiveSubmission,
    addComment,
    getStatusHistory,
    getStatistics,
    comments,
    categories,
    programs,
  ]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};



