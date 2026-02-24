import { useTranslation } from 'react-i18next';
import { Target, Eye, Heart, Users, Lightbulb, Award, Globe2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function About() {
    const { t } = useTranslation();

    const values = [
        { icon: Lightbulb, label: t('about.value1'), color: 'text-primary-500 bg-primary-100' },
        { icon: Users, label: t('about.value2'), color: 'text-accent-500 bg-accent-100' },
        { icon: Award, label: t('about.value3'), color: 'text-success-500 bg-success-50' },
        { icon: Globe2, label: t('about.value4'), color: 'text-warning-500 bg-warning-50' },
    ];

    const team = [
        { name: 'Dr. Karim El Ouafi', role: 'Directeur', initials: 'KE' },
        { name: 'Amina Belhaj', role: 'Coordinatrice', initials: 'AB' },
        { name: 'Youssef Rahmani', role: 'Mentor Tech', initials: 'YR' },
        { name: 'Fatima Zahra Alami', role: 'Responsable Formation', initials: 'FA' },
    ];

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="hero-gradient text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t('about.title')}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.about') },
                ]} />

                {/* Mission */}
                <section className="mb-16">
                    <div className="grid md:grid-cols-2 gap-10">
                        <Card hover={false} className="p-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <Target className="h-6 w-6 text-primary-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-surface-900">{t('about.mission')}</h2>
                            </div>
                            <p className="text-surface-600 leading-relaxed">{t('about.missionText')}</p>
                        </Card>
                        <Card hover={false} className="p-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                                    <Eye className="h-6 w-6 text-accent-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-surface-900">{t('about.vision')}</h2>
                            </div>
                            <p className="text-surface-600 leading-relaxed">{t('about.visionText')}</p>
                        </Card>
                    </div>
                </section>

                {/* Values */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-surface-900 mb-8 text-center">{t('about.values')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {values.map((val, i) => (
                            <Card key={i} hover={false} className="text-center p-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${val.color}`}>
                                    <val.icon className="h-7 w-7" />
                                </div>
                                <h3 className="font-bold text-surface-800">{val.label}</h3>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-surface-900 mb-2">{t('about.team')}</h2>
                        <p className="text-surface-500">{t('about.teamDesc')}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {team.map((member, i) => (
                            <Card key={i} hover={false} className="text-center p-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                                    {member.initials}
                                </div>
                                <h3 className="font-bold text-surface-800 text-sm">{member.name}</h3>
                                <p className="text-surface-500 text-xs mt-1">{member.role}</p>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
