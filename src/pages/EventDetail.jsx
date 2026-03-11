import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Wifi, Clock, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDataStore } from '../contexts/DataStoreContext';
import { useUI } from '../contexts/UIContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Skeleton from '../components/ui/Skeleton';

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
});

export default function EventDetail() {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const { events, registerForEvent, isRegisteredForEvent } = useDataStore();
    const { addToast } = useUI();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);
    const [showRegForm, setShowRegForm] = useState(false);
    const [registered, setRegistered] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setEvent(events.find(e => e.id === id) || null);
            setLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [id, events]);

    const onRegister = async (data) => {
        await new Promise(r => setTimeout(r, 800));
        registerForEvent(id, data);
        setRegistered(true);
        setShowRegForm(false);
        addToast({
            type: 'success',
            title: t('events.registerSuccess'),
            message: t('events.registerSuccessDesc'),
        });
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <Skeleton lines={1} className="h-8 w-1/3 mb-8" />
                <Skeleton lines={1} className="h-12 w-3/4 mb-4" />
                <Skeleton lines={4} />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-2xl font-bold text-surface-900 mb-4">{t('common.notFound')}</h2>
                <Link to="/events"><Button>{t('events.backToList')}</Button></Link>
            </div>
        );
    }

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    return (
        <div className="fade-in pb-20">
            <div className="bg-gradient-primary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-dots opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Badge status={event.mode} className="border border-white/10 bg-surface-900/50 backdrop-blur-md">
                            {event.mode === 'online' ? (
                                <span className="flex items-center gap-2"><Wifi className="h-4 w-4" /> {t('events.online')}</span>
                            ) : (
                                <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {t('events.onsite')}</span>
                            )}
                        </Badge>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                        {event.title_i18n[lang] || event.title_i18n.fr}
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.events'), href: '/events' },
                    { label: event.title_i18n[lang] || event.title_i18n.fr },
                ]} />

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="card-modern p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/10 transition-colors"></div>
                            
                            <h3 className="text-2xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
                                <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                                À propos de l'événement
                            </h3>
                            <p className="text-surface-300 leading-relaxed whitespace-pre-line text-lg relative z-10">
                                {event.description_i18n[lang] || event.description_i18n.fr}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-8 relative z-10">
                                {event.tags.map(tag => (
                                    <span key={tag} className="text-sm font-medium px-3 py-1.5 rounded-md bg-surface-800 text-surface-300 border border-white/5">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="card-modern p-8 space-y-6">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-2 h-5 bg-highlight rounded-full"></span>
                                Informations
                            </h3>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-800/50 border border-white/5 transition-colors hover:bg-surface-800 group">
                                <div className="w-10 h-10 rounded-lg bg-surface-900 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all">
                                    <Calendar className="h-5 w-5 text-primary-400 group-hover:text-highlight transition-colors" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-1">{t('events.date')}</div>
                                    <div className="font-medium text-white">
                                        {startDate.toLocaleDateString(lang, {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-800/50 border border-white/5 transition-colors hover:bg-surface-800 group">
                                <div className="w-10 h-10 rounded-lg bg-surface-900 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all">
                                    <Clock className="h-5 w-5 text-primary-400 group-hover:text-highlight transition-colors" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-1">{t('events.time')}</div>
                                    <div className="font-medium text-white">
                                        {startDate.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                                        {' - '}
                                        {endDate.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-800/50 border border-white/5 transition-colors hover:bg-surface-800 group">
                                <div className="w-10 h-10 rounded-lg bg-surface-900 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all">
                                    <MapPin className="h-5 w-5 text-primary-400 group-hover:text-highlight transition-colors" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-1">{t('events.location')}</div>
                                    <div className="font-medium text-white">
                                        {event.location_i18n[lang] || event.location_i18n.fr}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-white/10">
                                {registered ? (
                                    <div className="bg-success-500/10 border border-success-500/30 text-success-400 rounded-xl p-4 text-center font-semibold flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-success-400 animate-pulse"></div>
                                        {t('events.registered')}
                                    </div>
                                ) : showRegForm ? (
                                    <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
                                        <h4 className="font-bold text-white mb-2">{t('events.registerTitle')}</h4>
                                        <div className="space-y-2">
                                            <input
                                                className="modern-input py-2.5"
                                                placeholder={t('events.registerName')}
                                                {...register('name')}
                                            />
                                            {errors.name?.message && <span className="text-error-400 text-xs mt-1 block">{errors.name.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                type="email"
                                                className="modern-input py-2.5"
                                                placeholder={t('events.registerEmail')}
                                                {...register('email')}
                                            />
                                            {errors.email?.message && <span className="text-error-400 text-xs mt-1 block">{errors.email.message}</span>}
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button 
                                                type="submit" 
                                                disabled={isSubmitting}
                                                className="modern-btn modern-btn-primary flex-1 py-2.5 text-sm"
                                            >
                                                {isSubmitting ? t('admin.loading') : t('events.register')}
                                            </button>
                                            <button 
                                                type="button" 
                                                className="modern-btn py-2.5 px-4 text-sm" 
                                                onClick={() => setShowRegForm(false)}
                                            >
                                                {t('admin.cancel')}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button 
                                        className="modern-btn modern-btn-primary w-full py-4 text-lg flex items-center justify-center gap-2" 
                                        onClick={() => setShowRegForm(true)}
                                    >
                                        <Users className="w-5 h-5" />
                                        {t('events.register')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
