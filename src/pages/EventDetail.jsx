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
        <div className="fade-in">
            <div className="hero-gradient text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge status={event.mode} className="border border-white/30">
                            {event.mode === 'online' ? (
                                <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> {t('events.online')}</span>
                            ) : (
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {t('events.onsite')}</span>
                            )}
                        </Badge>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold">
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
                        <Card hover={false}>
                            <p className="text-surface-600 leading-relaxed whitespace-pre-line">
                                {event.description_i18n[lang] || event.description_i18n.fr}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                {event.tags.map(tag => (
                                    <Badge key={tag} color="gray">#{tag}</Badge>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card hover={false} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-primary-500" />
                                <div>
                                    <div className="text-xs text-surface-400">{t('events.date')}</div>
                                    <div className="font-semibold text-surface-800">
                                        {startDate.toLocaleDateString(lang, {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-primary-500" />
                                <div>
                                    <div className="text-xs text-surface-400">{t('events.time')}</div>
                                    <div className="font-semibold text-surface-800">
                                        {startDate.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                                        {' - '}
                                        {endDate.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-primary-500" />
                                <div>
                                    <div className="text-xs text-surface-400">{t('events.location')}</div>
                                    <div className="font-semibold text-surface-800">
                                        {event.location_i18n[lang] || event.location_i18n.fr}
                                    </div>
                                </div>
                            </div>

                            {registered ? (
                                <div className="bg-success-50 text-success-600 rounded-xl p-3 text-center font-semibold text-sm">
                                    ✓ {t('events.registered')}
                                </div>
                            ) : showRegForm ? (
                                <form onSubmit={handleSubmit(onRegister)} className="space-y-3 pt-2 border-t border-surface-100">
                                    <h4 className="font-semibold text-surface-800">{t('events.registerTitle')}</h4>
                                    <Input
                                        label={t('events.registerName')}
                                        {...register('name')}
                                        error={errors.name?.message}
                                    />
                                    <Input
                                        label={t('events.registerEmail')}
                                        type="email"
                                        {...register('email')}
                                        error={errors.email?.message}
                                    />
                                    <div className="flex gap-2">
                                        <Button type="submit" loading={isSubmitting} size="sm" className="flex-1">
                                            {t('events.register')}
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setShowRegForm(false)}>
                                            {t('admin.cancel')}
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <Button className="w-full" onClick={() => setShowRegForm(true)} icon={Users}>
                                    {t('events.register')}
                                </Button>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
