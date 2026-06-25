import { useTranslation } from 'react-i18next';
import useImpactMoments from '../impact/useImpactMoments';
import EventCard from './EventCard';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import './events.css';

export default function PastEventsPage() {
    const { t } = useTranslation();
    const { moments, loading, error } = useImpactMoments();

    return (
        <div className="fade-in">
            <div className="hero-gradient text-white py-16 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">Moments d'Impact</h1>
                    <p className="text-white/80 text-lg">Revivez nos événements phares, success stories et célébrations de l'innovation.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.pastEvents') },
                ]} />

                <div className="past-events-container">
                    {loading && <p className="text-center text-secondary">Chargement des Moments d’impact...</p>}
                    {error && <p className="text-center text-danger-500">{error}</p>}
                    {!loading && !error && moments.length === 0 && (
                        <p className="text-center text-secondary">Aucun Moment d’impact publié pour le moment.</p>
                    )}
                    <div className="past-events-grid">
                        {moments.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
