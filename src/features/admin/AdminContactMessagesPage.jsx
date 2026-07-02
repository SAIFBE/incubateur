import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

const normalizePage = (payload) => (Array.isArray(payload?.data) ? payload.data : []);

const formatDate = (value) => {
  if (!value) return 'Non renseigne';
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setLoadError(false);

    try {
      const first = await api.get('/admin/contact-messages', { params: { page: 1 } });
      const firstItems = normalizePage(first.data);
      const lastPage = first.data?.meta?.last_page || first.data?.last_page || 1;

      if (lastPage <= 1) {
        setMessages(firstItems);
        return;
      }

      const pages = await Promise.all(
        Array.from({ length: lastPage - 1 }, (_, index) => api.get('/admin/contact-messages', { params: { page: index + 2 } }))
      );

      setMessages([...firstItems, ...pages.flatMap((response) => normalizePage(response.data))]);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)),
    [messages]
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-end gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Messages contact</h1>
          <p className="text-tertiary">Consultez les questions envoyees depuis le formulaire public de contact.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={fetchMessages} disabled={loading}>
          Actualiser
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-tertiary">Chargement...</div>
        ) : loadError ? (
          <div className="p-8 text-center text-danger">Impossible de charger les messages depuis Laravel.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="border-b border-border bg-black/20 text-secondary text-sm">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Nom</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Sujet</th>
                  <th className="p-4 font-semibold">Question</th>
                </tr>
              </thead>
              <tbody>
                {sortedMessages.length > 0 ? sortedMessages.map((message) => (
                  <tr key={message.id} className="border-b border-border/50 hover:bg-white/5 transition-colors align-top">
                    <td className="p-4 text-secondary whitespace-nowrap">{formatDate(message.created_at)}</td>
                    <td className="p-4 font-medium text-white">{message.name || 'Non renseigne'}</td>
                    <td className="p-4 text-secondary">
                      {message.email ? <a className="text-primary-400 hover:underline" href={`mailto:${message.email}`}>{message.email}</a> : 'Non renseigne'}
                    </td>
                    <td className="p-4 text-secondary max-w-[220px]">{message.subject || 'Sans sujet'}</td>
                    <td className="p-4 text-secondary max-w-[360px] whitespace-pre-wrap">{message.message || 'Aucun message'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="p-8 text-center text-tertiary">Aucun message recu.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
