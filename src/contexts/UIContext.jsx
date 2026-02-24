import { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [modal, setModal] = useState(null);
    const [adminUser, setAdminUser] = useState(null);

    const addToast = useCallback((toast) => {
        const id = Date.now();
        const newToast = { id, duration: 4000, ...toast };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, newToast.duration);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const openModal = useCallback((modalContent) => {
        setModal(modalContent);
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);

    const loginAdmin = useCallback((user) => {
        setAdminUser(user);
    }, []);

    const logoutAdmin = useCallback(() => {
        setAdminUser(null);
    }, []);

    return (
        <UIContext.Provider
            value={{
                toasts,
                addToast,
                removeToast,
                modal,
                openModal,
                closeModal,
                adminUser,
                loginAdmin,
                logoutAdmin,
            }}
        >
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within UIProvider');
    return context;
}
