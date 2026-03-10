import { useTranslation } from 'react-i18next';
import { useDataStore } from '../../contexts/DataStoreContext';
import EventCard from './EventCard';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import './events.css';

export default function PastEventsPage() {
    const { t } = useTranslation();
    const { pastEvents } = useDataStore();

    return (
        <div className="fade-in">
            <div className="hero-gradient text-white py-16 text-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t('pastEvents.title')}</h1>
                    <p className="text-white/80 text-lg">{t('pastEvents.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs items={[
                    { label: t('nav.home'), href: '/' },
                    { label: t('nav.pastEvents') },
                ]} />

                <div className="past-events-container">
                    <div className="past-events-grid">
                        {pastEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
