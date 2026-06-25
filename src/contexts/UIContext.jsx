import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [modal, setModal] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const [theme, setThemeState] = useState(() => {
        if (typeof window === 'undefined') return 'dark';
        return localStorage.getItem('cmc_incubator_theme') || 'dark';
    });

    useEffect(() => {
        const nextTheme = theme === 'light' ? 'light' : 'dark';
        document.documentElement.dataset.theme = nextTheme;
        document.documentElement.style.colorScheme = nextTheme;
        localStorage.setItem('cmc_incubator_theme', nextTheme);
    }, [theme]);

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

    const setTheme = useCallback((nextTheme) => {
        setThemeState(nextTheme === 'light' ? 'light' : 'dark');
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((current) => (current === 'light' ? 'dark' : 'light'));
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
                theme,
                setTheme,
                toggleTheme,
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
