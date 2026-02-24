import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { useUI } from '../contexts/UIContext';

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(3),
    message: z.string().min(10),
});

export default function Contact() {
    const { t } = useTranslation();
    const { addToast } = useUI();
    const [sent, setSent] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async () => {
        await new Promise(r => setTimeout(r, 1000));
        addToast({ type: 'success', title: t('contact.success'), message: t('contact.successDesc') });
        setSent(true);
        reset();
    };

    const contactInfo = [
        { icon: MapPin, label: t('contact.info.address') },
        { icon: Phone, label: t('contact.info.phone') },
        { icon: Mail, label: t('contact.info.email') },
        { icon: Clock, label: t('contact.info.hours') },
    ];

    return (
        <div className="fade-in">
            <div className="hero-gradient text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t('contact.title')}</h1>
                    <p className="text-white/80 text-lg">{t('contact.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.contact') },
                ]} />

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-surface-900 mb-4">{t('contact.info.title')}</h2>
                        {contactInfo.map((item, i) => (
                            <Card key={i} hover={false} className="flex items-center gap-4 p-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <item.icon className="h-5 w-5 text-primary-600" />
                                </div>
                                <span className="text-surface-700 text-sm">{item.label}</span>
                            </Card>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        {sent ? (
                            <Card hover={false} className="text-center py-12">
                                <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-surface-900 mb-2">{t('contact.success')}</h3>
                                <p className="text-surface-500">{t('contact.successDesc')}</p>
                                <Button className="mt-6" variant="secondary" onClick={() => setSent(false)}>
                                    {t('contact.send')}
                                </Button>
                            </Card>
                        ) : (
                            <Card hover={false}>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <Input
                                            label={t('contact.name')}
                                            {...register('name')}
                                            error={errors.name?.message}
                                        />
                                        <Input
                                            label={t('contact.email')}
                                            type="email"
                                            {...register('email')}
                                            error={errors.email?.message}
                                        />
                                    </div>
                                    <Input
                                        label={t('contact.subject')}
                                        {...register('subject')}
                                        error={errors.subject?.message}
                                    />
                                    <Input
                                        label={t('contact.message')}
                                        type="textarea"
                                        placeholder={t('contact.messagePlaceholder')}
                                        {...register('message')}
                                        error={errors.message?.message}
                                    />
                                    <Button type="submit" loading={isSubmitting} icon={Send}>
                                        {isSubmitting ? t('contact.sending') : t('contact.send')}
                                    </Button>
                                </form>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
