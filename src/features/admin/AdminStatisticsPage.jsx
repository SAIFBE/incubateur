import React, { useEffect, useMemo, useState } from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import api from '../../services/api';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';

const getPercentage = (count, total) => (total === 0 ? 0 : Math.round((count / total) * 100));

const AdminStatisticsPage = () => {
  const { submissions } = useAppData();
  const [serverStats, setServerStats] = useState(null);

  useEffect(() => {
    let active = true;
    api.get('/admin/statistics')
      .then((response) => {
        if (active) setServerStats(response.data);
      })
      .catch(() => {
        if (active) setServerStats(null);
      });
    return () => { active = false; };
  }, []);

  const statusCounts = useMemo(() => ({
    pending: Number(serverStats?.submissions?.pending ?? submissions.filter((item) => item.status === 'pending').length),
    under_review: Number(serverStats?.submissions?.under_review ?? submissions.filter((item) => item.status === 'under_review').length),
    accepted: serverStats?.submissions
      ? Number(serverStats.submissions.selected ?? 0) + Number(serverStats.submissions.account_requested ?? 0) + Number(serverStats.submissions.account_created ?? 0)
      : submissions.filter((item) => ['selected', 'account_requested', 'account_created'].includes(item.status)).length,
    rejected: Number(serverStats?.submissions?.rejected ?? submissions.filter((item) => item.status === 'rejected').length),
  }), [serverStats, submissions]);

  const total = Object.values(statusCounts).reduce((sum, value) => sum + value, 0);
  const inProgress = statusCounts.pending + statusCounts.under_review;
  const sectorCounts = submissions.reduce((accumulator, submission) => {
    const sector = submission.current_activity || submission.category || 'Non specifie';
    accumulator[sector] = (accumulator[sector] || 0) + 1;
    return accumulator;
  }, {});

  return (
    <div className="pb-12 animate-fade-in">
      <div className="page-header relative overflow-hidden bg-surface p-8 rounded-2xl border border-glass-border mb-10 shadow-sm flex items-center gap-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full opacity-10 filter blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="w-14 h-14 rounded-xl bg-secondary-dim text-secondary flex items-center justify-center border border-secondary">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
        </div>
        <div className="relative z-10">
          <h1 className="page-title mb-1 text-2xl font-bold tracking-tight">Statistiques globales</h1>
          <p className="page-subtitle mb-0 text-text-secondary">Analyse d'impact et performances de l'incubateur CMC BMK</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-t-4 border-t-success">
          <CardBody className="text-center py-8">
            <div className="text-4xl font-extrabold text-text-primary mb-2 line-height-1">{getPercentage(statusCounts.accepted, total)}%</div>
            <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Taux d'acceptation</div>
            <div className="mt-4 text-xs text-tertiary">{statusCounts.accepted} sur {total} fiches validees</div>
          </CardBody>
        </Card>
        <Card className="border-t-4 border-t-warning">
          <CardBody className="text-center py-8">
            <div className="text-4xl font-extrabold text-text-primary mb-2 line-height-1">{getPercentage(inProgress, total)}%</div>
            <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider">En evaluation</div>
            <div className="mt-4 text-xs text-tertiary">{inProgress} fiches en attente ou en analyse</div>
          </CardBody>
        </Card>
        <Card className="border-t-4 border-t-primary">
          <CardBody className="text-center py-8">
            <div className="text-4xl font-extrabold text-text-primary mb-2 line-height-1">{serverStats?.stagiaires ?? '-'}</div>
            <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Stagiaires</div>
            <div className="mt-4 text-xs text-tertiary">Comptes stagiaires dans Laravel</div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-full">
          <CardHeader title="Repartition par statut" />
          <CardBody>
            <div className="space-y-6 pt-2">
              {[
                ['pending', 'En attente'],
                ['under_review', 'En evaluation'],
                ['accepted', 'Acceptees'],
                ['rejected', 'Refusees'],
              ].map(([status, label]) => {
                const count = statusCounts[status];
                const percent = getPercentage(count, total);

                return (
                  <div key={status} className="mb-2">
                    <div className="flex justify-between text-sm mb-2 items-end">
                      <span className="font-medium text-text-primary">{label}</span>
                      <span className="font-bold text-secondary">{count} <span className="text-xs font-normal text-tertiary">({percent}%)</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-hover rounded-full overflow-hidden shadow-inner flex">
                      <div className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card className="h-full">
          <CardHeader title="Activites declarees" />
          <CardBody>
            <div className="space-y-6 pt-2">
              {Object.entries(sectorCounts).slice(0, 6).map(([sector, count]) => {
                const percent = getPercentage(count, submissions.length);

                return (
                  <div key={sector} className="mb-2">
                    <div className="flex justify-between text-sm mb-2 items-end">
                      <span className="capitalize font-medium text-text-primary">{sector}</span>
                      <span className="font-bold">{count} <span className="text-xs font-normal text-tertiary">({percent}%)</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-hover rounded-full overflow-hidden shadow-inner flex">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
              {Object.keys(sectorCounts).length === 0 && (
                <p className="text-center text-tertiary py-8">Aucune donnee statistique disponible.</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatisticsPage;


