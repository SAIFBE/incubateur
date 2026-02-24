import { createContext, useContext, useReducer, useCallback } from 'react';
import { mockOpportunities, mockEvents, mockSubmissions } from '../data/mockData';

const DataStoreContext = createContext(null);

const initialState = {
    opportunities: mockOpportunities,
    events: mockEvents,
    submissions: mockSubmissions,
    registrations: {},
    loading: false,
};

function dataReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };

        // Opportunities
        case 'ADD_OPPORTUNITY':
            return { ...state, opportunities: [...state.opportunities, action.payload] };
        case 'UPDATE_OPPORTUNITY':
            return {
                ...state,
                opportunities: state.opportunities.map(o =>
                    o.id === action.payload.id ? action.payload : o
                ),
            };
        case 'DELETE_OPPORTUNITY':
            return {
                ...state,
                opportunities: state.opportunities.filter(o => o.id !== action.payload),
            };

        // Events
        case 'ADD_EVENT':
            return { ...state, events: [...state.events, action.payload] };
        case 'UPDATE_EVENT':
            return {
                ...state,
                events: state.events.map(e =>
                    e.id === action.payload.id ? action.payload : e
                ),
            };
        case 'DELETE_EVENT':
            return {
                ...state,
                events: state.events.filter(e => e.id !== action.payload),
            };

        // Submissions
        case 'ADD_SUBMISSION':
            return { ...state, submissions: [...state.submissions, action.payload] };
        case 'UPDATE_SUBMISSION':
            return {
                ...state,
                submissions: state.submissions.map(s =>
                    s.id === action.payload.id ? { ...s, ...action.payload } : s
                ),
            };

        // Event registrations
        case 'REGISTER_FOR_EVENT':
            return {
                ...state,
                registrations: {
                    ...state.registrations,
                    [action.payload.eventId]: [
                        ...(state.registrations[action.payload.eventId] || []),
                        action.payload.registration,
                    ],
                },
            };

        default:
            return state;
    }
}

export function DataStoreProvider({ children }) {
    const [state, dispatch] = useReducer(dataReducer, initialState);

    const addOpportunity = useCallback((opportunity) => {
        dispatch({ type: 'ADD_OPPORTUNITY', payload: { ...opportunity, id: Date.now().toString() } });
    }, []);

    const updateOpportunity = useCallback((opportunity) => {
        dispatch({ type: 'UPDATE_OPPORTUNITY', payload: opportunity });
    }, []);

    const deleteOpportunity = useCallback((id) => {
        dispatch({ type: 'DELETE_OPPORTUNITY', payload: id });
    }, []);

    const addEvent = useCallback((event) => {
        dispatch({ type: 'ADD_EVENT', payload: { ...event, id: Date.now().toString() } });
    }, []);

    const updateEvent = useCallback((event) => {
        dispatch({ type: 'UPDATE_EVENT', payload: event });
    }, []);

    const deleteEvent = useCallback((id) => {
        dispatch({ type: 'DELETE_EVENT', payload: id });
    }, []);

    const addSubmission = useCallback((submission) => {
        const count = state.submissions.length + 1;
        const refCode = `CMC-IDEA-2026-${String(count).padStart(4, '0')}`;
        const newSubmission = {
            ...submission,
            id: Date.now().toString(),
            refCode,
            status: 'received',
            adminComment: '',
            createdAt: new Date().toISOString().split('T')[0],
        };
        dispatch({ type: 'ADD_SUBMISSION', payload: newSubmission });
        return newSubmission;
    }, [state.submissions.length]);

    const updateSubmission = useCallback((updates) => {
        dispatch({ type: 'UPDATE_SUBMISSION', payload: updates });
    }, []);

    const registerForEvent = useCallback((eventId, registration) => {
        dispatch({ type: 'REGISTER_FOR_EVENT', payload: { eventId, registration } });
    }, []);

    const isRegisteredForEvent = useCallback((eventId, email) => {
        const regs = state.registrations[eventId] || [];
        return regs.some(r => r.email === email);
    }, [state.registrations]);

    return (
        <DataStoreContext.Provider
            value={{
                ...state,
                addOpportunity,
                updateOpportunity,
                deleteOpportunity,
                addEvent,
                updateEvent,
                deleteEvent,
                addSubmission,
                updateSubmission,
                registerForEvent,
                isRegisteredForEvent,
            }}
        >
            {children}
        </DataStoreContext.Provider>
    );
}

export function useDataStore() {
    const context = useContext(DataStoreContext);
    if (!context) throw new Error('useDataStore must be used within DataStoreProvider');
    return context;
}
