import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUBMISSIONS as initialSubmissions, COMMENTS as initialComments, STATUS_HISTORY as initialHistory } from '../data/submissions';
import { CATEGORIES } from '../data/categories';
import { PROGRAMS } from '../data/programs';
import { useAuth } from './AuthContext';

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Load from localStorage or use initial data
  const loadData = (key, initial) => {
    try {
      const stored = localStorage.getItem(`cmc_incubator_${key}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(`Failed to load ${key} from local storage`, e);
    }
    return initial;
  };

  const [submissions, setSubmissions] = useState(() => loadData('submissions', initialSubmissions));
  const [comments, setComments] = useState(() => loadData('comments', initialComments));
  const [statusHistory, setStatusHistory] = useState(() => loadData('history', initialHistory));
  const categories = CATEGORIES;
  const programs = PROGRAMS;

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('cmc_incubator_submissions', JSON.stringify(submissions));
    localStorage.setItem('cmc_incubator_comments', JSON.stringify(comments));
    localStorage.setItem('cmc_incubator_history', JSON.stringify(statusHistory));
  }, [submissions, comments, statusHistory]);

  const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // --- Submissions Mutations ---

  const addSubmission = async (submissionData, isDraft = true) => {
    if (!currentUser) return null;
    
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newStatus = isDraft ? 'draft' : 'submitted';
    const newSubmission = {
      ...submissionData,
      id: generateId('sub'),
      userId: currentUser.id,
      status: newStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSubmissions(prev => [newSubmission, ...prev]);

    // Add history record if submitted directly
    if (!isDraft) {
      addHistoryRecord(newSubmission.id, 'draft', 'submitted');
    }

    return newSubmission;
  };

  const updateSubmission = async (id, updateData, newStatus = null) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === id) {
        const updated = { ...sub, ...updateData, updatedAt: new Date().toISOString() };
        if (newStatus && sub.status !== newStatus) {
          updated.status = newStatus;
          addHistoryRecord(id, sub.status, newStatus);
        }
        return updated;
      }
      return sub;
    }));
  };

  const changeSubmissionStatus = async (id, newStatus) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === id && sub.status !== newStatus) {
        addHistoryRecord(id, sub.status, newStatus);
        return { ...sub, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return sub;
    }));
  };

  const archiveSubmission = async (id) => {
    await changeSubmissionStatus(id, 'archived');
  };

  // --- Comments Mutations ---

  const addComment = async (submissionId, content) => {
    if (!currentUser) return;
    
    await new Promise(resolve => setTimeout(resolve, 400));

    const newComment = {
      id: generateId('msg'),
      submissionId,
      authorRole: currentUser.role,
      authorName: currentUser.fullName,
      content,
      createdAt: new Date().toISOString()
    };

    setComments(prev => [...prev, newComment]);
    return newComment;
  };

  // --- History Helper ---
  const addHistoryRecord = (submissionId, fromStatus, toStatus) => {
    if (!currentUser) return;
    const historyRecord = {
      id: generateId('hist'),
      submissionId,
      fromStatus,
      toStatus,
      changedBy: currentUser.fullName,
      changedAt: new Date().toISOString()
    };
    setStatusHistory(prev => [...prev, historyRecord]);
  };

  return (
    <AppDataContext.Provider value={{
      submissions,
      comments,
      statusHistory,
      categories,
      programs,
      addSubmission,
      updateSubmission,
      changeSubmissionStatus,
      archiveSubmission,
      addComment
    }}>
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
