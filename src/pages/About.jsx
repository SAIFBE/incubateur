import { useTranslation } from 'react-i18next';
import { Target, Eye, Heart, Users, Lightbulb, Award, Globe2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function About() {
    const { t } = useTranslation();

    const values = [
        { icon: Lightbulb, label: t('about.value1'), color: 'text-primary-400 bg-primary-500/10 border-primary-500/20 shadow-[0_0_15px_rgba(79,70,229,0.2)]' },
        { icon: Users, label: t('about.value2'), color: 'text-highlight bg-highlight/10 border-highlight/20 shadow-[0_0_15px_rgba(14,165,233,0.2)]' },
        { icon: Award, label: t('about.value3'), color: 'text-success-400 bg-success-500/10 border-success-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]' },
        { icon: Globe2, label: t('about.value4'), color: 'text-warning-400 bg-warning-500/10 border-warning-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]' },
    ];

    const team = [
        { name: 'Dr. Karim El Ouafi', role: 'Directeur', initials: 'KE' },
        { name: 'Amina Belhaj', role: 'Coordinatrice', initials: 'AB' },
        { name: 'Youssef Rahmani', role: 'Mentor Tech', initials: 'YR' },
        { name: 'Fatima Zahra Alami', role: 'Responsable Formation', initials: 'FA' },
    ];

    return (
        <div className="fade-in pb-20">
            {/* Header */}
            <div className="bg-gradient-primary text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-dots opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">{t('about.title')}</h1>
                    <p className="text-surface-400 text-lg max-w-2xl mx-auto">{t('about.missionText').substring(0, 100)}...</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.about') },
                ]} />

                {/* Mission */}
                <section className="mb-20">
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="card-modern p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary-500/20 transition-colors"></div>
                            
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-14 h-14 bg-bg-card border border-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-primary-500/50 transition-all duration-300">
                                    <Target className="h-7 w-7 text-primary-400 group-hover:text-highlight transition-colors" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{t('about.mission')}</h2>
                            </div>
                            <p className="text-surface-400 leading-relaxed text-lg relative z-10">{t('about.missionText')}</p>
                        </div>
                        <div className="card-modern p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-highlight/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-highlight/20 transition-colors"></div>
                            
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-14 h-14 bg-bg-card border border-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-highlight/50 transition-all duration-300">
                                    <Eye className="h-7 w-7 text-highlight group-hover:text-primary-400 transition-colors" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{t('about.vision')}</h2>
                            </div>
                            <p className="text-surface-400 leading-relaxed text-lg relative z-10">{t('about.visionText')}</p>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white tracking-tight inline-block relative">
                            {t('about.values')}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-glow rounded-full"></div>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {values.map((val, i) => (
                            <div key={i} className="card-modern text-center p-8 group hover:-translate-y-2 transition-transform duration-300">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border transition-all duration-300 group-hover:scale-110 ${val.color}`}>
                                    <val.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-highlight transition-colors">{val.label}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-4">{t('about.team')}</h2>
                        <p className="text-surface-400 text-lg max-w-2xl mx-auto">{t('about.teamDesc')}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <div key={i} className="card-modern text-center p-8 group hover:border-primary-500/50 transition-colors duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 blur-[50px] rounded-full pointer-events-none"></div>
                                
                                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-transform duration-300 border-2 border-white/10 group-hover:border-white/30">
                                    {member.initials}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">{member.name}</h3>
                                <p className="text-surface-400 text-sm font-medium">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
