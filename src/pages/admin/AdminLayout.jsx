import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Briefcase, Calendar, FileText, LogOut, Shield, Menu, X } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ToastContainer from '../../components/ui/Toast';

export default function AdminLayout() {
    const { t } = useTranslation();
    const { adminUser, loginAdmin, logoutAdmin } = useUI();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loginData, setLoginData] = useState({ username: '', password: '', role: 'admin' });

    const navItems = [
        { path: '/admin', label: t('admin.dashboard'), icon: LayoutDashboard, exact: true },
        { path: '/admin/opportunities', label: t('admin.opportunities'), icon: Briefcase },
        { path: '/admin/events', label: t('admin.events'), icon: Calendar },
        { path: '/admin/submissions', label: t('admin.submissions'), icon: FileText },
    ];

    const isActive = (path, exact) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        loginAdmin({
            username: loginData.username || 'admin',
            role: loginData.role,
        });
    };

    if (!adminUser) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-surface-900">{t('admin.login.title')}</h1>
                        <p className="text-surface-500 text-sm mt-2">{t('admin.login.hint')}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input
                                label={t('admin.login.username')}
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                placeholder="admin"
                            />
                            <Input
                                label={t('admin.login.password')}
                                type="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                placeholder="••••••"
                            />
                            <Select
                                label={t('admin.login.role')}
                                options={[
                                    { value: 'admin', label: t('admin.login.roles.admin') },
                                    { value: 'editor', label: t('admin.login.roles.editor') },
                                    { value: 'viewer', label: t('admin.login.roles.viewer') },
                                ]}
                                value={loginData.role}
                                onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                            />
                            <Button type="submit" className="w-full" icon={Shield}>
                                {t('admin.login.submit')}
                            </Button>
                        </form>
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/" className="text-sm text-primary-600 hover:text-primary-700">
                            ← {t('common.backToHome')}
                        </Link>
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 flex">
            {/* Sidebar */}
            <aside className={`
        fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-surface-900 text-white
        flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="p-4 border-b border-surface-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center text-sm font-bold">
                            C
                        </div>
                        <span className="font-bold">CMC BMK</span>
                    </div>
                    <button className="lg:hidden p-1.5 rounded-lg hover:bg-surface-800" onClick={() => setSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive(item.path, item.exact)
                                    ? 'bg-primary-600 text-white'
                                    : 'text-surface-400 hover:text-white hover:bg-surface-800'
                                }
              `}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-3 border-t border-surface-800">
                    <div className="px-4 py-2 text-xs text-surface-500 mb-2">
                        <div className="font-medium text-surface-300">{adminUser.username}</div>
                        <div>{t(`admin.login.roles.${adminUser.role}`)}</div>
                    </div>
                    <button
                        onClick={logoutAdmin}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-400 hover:text-white hover:bg-surface-800 w-full transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        {t('nav.logout')}
                    </button>
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-400 hover:text-white hover:bg-surface-800 w-full transition-colors mt-1"
                    >
                        ← {t('common.backToHome')}
                    </Link>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main */}
            <div className="flex-1 min-w-0">
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-surface-200 px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4 lg:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-surface-100">
                        <Menu className="h-5 w-5" />
                    </button>
                    <span className="font-bold text-surface-900">{t('admin.title')}</span>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
