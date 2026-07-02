import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Copy, ExternalLink, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Card, { CardBody } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useToast } from '../../components/ui/Toast';

const eventTitle = (event) => event?.title_i18n?.fr || event?.title || 'Evenement';

const eventDate = (event) => {
  if (!event?.startDate) return 'Non renseigne';
  return new Date(event.startDate).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const historyItems = (payload) => (Array.isArray(payload?.data) ? payload.data : []);

export default function AdminEventStaffNotifyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const isReadOnlyAdmin = Boolean(currentUser?.isReadOnlyAdmin);
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState('group');
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState('');
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [previewResponse, historyResponse] = await Promise.all([
        api.get(`/admin/events/${id}/staff-notifications/preview`),
        api.get(`/admin/events/${id}/staff-notifications`),
      ]);
      setEvent(previewResponse.data?.event?.data || previewResponse.data?.event || null);
      setMessage(previewResponse.data?.message || '');
      setContacts(previewResponse.data?.active_contacts?.data || previewResponse.data?.active_contacts || []);
      setHistory(historyItems(historyResponse.data));
    } catch {
      setError('Impossible de charger la notification du personnel.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sentContactIds = useMemo(() => new Set(
    history
      .filter((item) => item.notification_mode === 'individual' && item.status === 'sent_manually')
      .map((item) => String(item.staff_contact_id))
  ), [history]);

  const hasGroupSent = useMemo(
    () => history.some((item) => item.notification_mode === 'group' && item.status === 'sent_manually'),
    [history]
  );

  const copyMessage = async () => {
    await navigator.clipboard.writeText(message);
    showToast({ title: 'Message copie', message: 'Le message WhatsApp est pret a etre colle.' });
  };

  const markGroupSent = async () => {
    setSendingId('group');
    try {
      await api.post(`/admin/events/${id}/staff-notifications/group-sent`, { message });
      showToast({ title: 'Notification enregistree', message: 'Envoi groupe marque comme effectue.' });
      await loadData();
    } catch {
      showToast({ title: 'Erreur', message: 'Impossible de marquer cet envoi.', type: 'error' });
    } finally {
      setSendingId('');
    }
  };

  const openWhatsApp = (contact) => {
    window.open(`https://wa.me/${contact.whatsapp_phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const markIndividualSent = async (contact) => {
    setSendingId(String(contact.id));
    try {
      await api.post(`/admin/events/${id}/staff-notifications/${contact.id}/individual-sent`, { message });
      showToast({ title: 'Notification enregistree', message: `${contact.name} marque comme informe.` });
      await loadData();
    } catch {
      showToast({ title: 'Erreur', message: 'Impossible de marquer ce contact.', type: 'error' });
    } finally {
      setSendingId('');
    }
  };

  return (
    <div className="admin-notify-page animate-fade-in">
      <div className="admin-form-heading">
        <button onClick={() => navigate('/dashboard/admin/events')} className="admin-back-button" aria-label="Retour">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p>Evenements</p>
          <h1>Notifier le personnel</h1>
        </div>
      </div>

      {loading ? (
        <div className="admin-empty-inline">Chargement...</div>
      ) : error ? (
        <div className="admin-registrations-error">{error}</div>
      ) : (
        <div className="admin-notify-grid">
          <Card className="admin-notify-card">
            <CardBody>
              <span className="admin-section-eyebrow">Evenement</span>
              <h2 className="admin-notify-title">{eventTitle(event)}</h2>
              <div className="admin-notify-meta">
                <span>{eventDate(event)}</span>
                <span>{event?.location_i18n?.fr || 'Lieu non renseigne'}</span>
                <Badge>{event?.status || 'upcoming'}</Badge>
              </div>
            </CardBody>
          </Card>

          <Card className="admin-notify-card">
            <CardBody>
              <div className="admin-notify-toolbar">
                <div>
                  <span className="admin-section-eyebrow">Message WhatsApp</span>
                  <h2 className="admin-notify-subtitle">Message genere</h2>
                </div>
                <button type="button" className="admin-inline-action admin-inline-action--success" onClick={copyMessage}>
                  <Copy size={15} />
                  Copier
                </button>
              </div>
              <pre className="admin-whatsapp-message">{message}</pre>
            </CardBody>
          </Card>

          <Card className="admin-notify-card">
            <CardBody>
              <div className="admin-notify-modes" role="tablist" aria-label="Mode de notification">
                <button type="button" className={mode === 'group' ? 'active' : ''} onClick={() => setMode('group')}>Groupe WhatsApp</button>
                <button type="button" className={mode === 'individual' ? 'active' : ''} onClick={() => setMode('individual')}>Individuel</button>
              </div>

              {mode === 'group' ? (
                <div className="admin-notify-group">
                  <p>Copiez le message puis envoyez-le dans le groupe WhatsApp du personnel.</p>
                  <div className="admin-registrations-actions">
                    <button type="button" className="admin-inline-action admin-inline-action--success" onClick={copyMessage}>
                      Copier le message
                    </button>
                    {!isReadOnlyAdmin && (
                      <button type="button" className="admin-inline-action admin-inline-action--info" onClick={markGroupSent} disabled={sendingId === 'group'}>
                        <Send size={15} />
                        {hasGroupSent ? 'Marquer un nouvel envoi' : 'Marquer envoye au groupe'}
                      </button>
                    )}
                  </div>
                </div>
              ) : contacts.length === 0 ? (
                <div className="admin-empty-inline">Aucun contact actif. Ajoutez le personnel avant l envoi individuel.</div>
              ) : (
                <div className="admin-staff-notify-list">
                  {contacts.map((contact) => {
                    const sent = sentContactIds.has(String(contact.id));
                    return (
                      <div className="admin-staff-notify-row" key={contact.id}>
                        <div>
                          <strong>{contact.name}</strong>
                          <span>{[contact.role_title, contact.department].filter(Boolean).join(' - ') || 'Fonction non renseignee'}</span>
                          <small>{contact.whatsapp_phone}</small>
                        </div>
                        <div className="admin-staff-notify-actions">
                          {sent && <Badge>Envoye</Badge>}
                          <button type="button" className="admin-inline-action admin-inline-action--success" onClick={() => openWhatsApp(contact)}>
                            <ExternalLink size={15} />
                            WhatsApp
                          </button>
                          {!isReadOnlyAdmin && (
                            <button type="button" className="admin-inline-action admin-inline-action--info" onClick={() => markIndividualSent(contact)} disabled={sendingId === String(contact.id)}>
                              Marquer envoye
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="admin-notify-card">
            <CardBody>
              <span className="admin-section-eyebrow">Historique</span>
              {history.length === 0 ? (
                <div className="admin-empty-inline">Aucune notification enregistree.</div>
              ) : (
                <div className="admin-notify-history">
                  {history.map((item) => (
                    <div key={item.id}>
                      <strong>{item.notification_mode === 'group' ? 'Groupe WhatsApp' : item.staff_contact?.name || 'Contact'}</strong>
                      <span>{item.sent_manually_at ? new Date(item.sent_manually_at).toLocaleString('fr-FR') : 'Date non renseignee'}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
