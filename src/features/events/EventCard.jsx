import { Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EventGallery from './EventGallery';
import './events.css';

export default function EventCard({ event }) {
    const { i18n } = useTranslation();
    const lang = i18n.language;

    const title = (event.title_i18n?.[lang] || event.title_i18n?.fr || event.title_i18n?.en || '').trim();
    const description = (event.description_i18n?.[lang] || event.description_i18n?.fr || event.description_i18n?.en || '').trim();
    const location = (event.location_i18n?.[lang] || event.location_i18n?.fr || event.location_i18n?.en || '').trim();

    const displayTitle = title || t('common.noTitle', 'Événement');

    return (
        <div className="event-card">
            <div className="event-card__header">
                <h3 className="event-card__title">{displayTitle}</h3>
                <div className="event-card__date">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                </div>
                {location && (
                    <div className="event-card__date" style={{ marginTop: '0.25rem' }}>
                        <MapPin size={14} />
                        <span>{location}</span>
                    </div>
                )}
            </div>
            
            <p className="event-card__description">
                {description}
            </p>

            {event.impactSummary && (
                <div className="mt-4 mb-2 p-4 bg-primary-50 rounded-lg border border-primary-100 text-left">
                    <h4 className="font-semibold text-primary-800 text-sm mb-1 uppercase tracking-wider">Impact</h4>
                    <p className="text-sm text-primary-900 leading-relaxed font-medium">{event.impactSummary}</p>
                </div>
            )}

            <EventGallery images={event.images} />
        </div>
    );
}
