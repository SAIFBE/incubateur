import React from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';

const AdminStatisticsPage = () => {
  const { submissions, categories, programs } = useAppData();

  // Basic mock statistical calculations
  const total = submissions.length;
  const accepted = submissions.filter(s => s.status === 'accepted').length;
  const rejected = submissions.filter(s => s.status === 'rejected').length;
  const inProgress = total - accepted - rejected;

  const getPercentage = (count) => total === 0 ? 0 : Math.round((count / total) * 100);

  return (
    <div className="pb-12 animate-fade-in">
      <div className="page-header relative overflow-hidden bg-surface p-8 rounded-2xl border border-glass-border mb-10 shadow-sm flex items-center gap-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full opacity-10 filter blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="w-14 h-14 rounded-xl bg-secondary-dim text-secondary flex items-center justify-center border border-secondary">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
        </div>
        <div className="relative z-10">
          <h1 className="page-title mb-1 text-2xl font-bold tracking-tight">Statistiques Globales</h1>
          <p className="page-subtitle mb-0 text-text-secondary">Analyse d'impact et performances de l'incubateur CMC BMK</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-t-4 border-t-success">
          <CardBody className="text-center py-8">
            <div className="flex justify-center mb-4 text-success">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="text-4xl font-extrabold text-text-primary mb-2 line-height-1">{getPercentage(accepted)}%</div>
            <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Taux d'acceptation</div>
            <div className="mt-4 text-xs text-tertiary">{accepted} sur {total} projets validés</div>
          </CardBody>
        </Card>
        <Card className="border-t-4 border-t-warning">
          <CardBody className="text-center py-8">
            <div className="flex justify-center mb-4 text-warning">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="text-4xl font-extrabold text-text-primary mb-2 line-height-1">{getPercentage(inProgress)}%</div>
            <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider">En Évaluation</div>
            <div className="mt-4 text-xs text-tertiary">{inProgress} projets en cours d'analyse</div>
          </CardBody>
        </Card>
        <Card className="border-t-4 border-t-primary">
          <CardBody className="text-center py-8">
            <div className="flex justify-center mb-4 text-primary">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div className="text-4xl font-extrabold text-text-primary mb-2 line-height-1">
              {submissions.filter(s => s.projectType === 'team').length}
            </div>
            <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Projets en Équipe</div>
            <div className="mt-4 text-xs text-tertiary">Favorise la synergie et la collaboration</div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-full">
          <CardHeader title="Stratification par Filière" />
          <CardBody>
            <div className="space-y-6 pt-2">
              {programs.map(prog => {
                const count = submissions.filter(s => s.program === prog.id).length;
                const percent = getPercentage(count);
                if (count === 0) return null;
                
                return (
                  <div key={prog.id} className="mb-2">
                    <div className="flex justify-between text-sm mb-2 items-end">
                      <span className="font-medium text-text-primary">{prog.name}</span>
                      <span className="font-bold text-secondary">{count} <span className="text-xs font-normal text-tertiary">({percent}%)</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-hover rounded-full overflow-hidden shadow-inner flex">
                      <div 
                        className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card className="h-full">
          <CardHeader title="Secteurs d'Activité Dominants" />
          <CardBody>
             <div className="space-y-6 pt-2">
              {/* Very basic manual grouping for Sector since it's an open text field */}
              {Array.from(new Set(submissions.map(s => s.sector || 'Non spécifié'))).slice(0,6).map((sector, index) => {
                const count = submissions.filter(s => (s.sector || 'Non spécifié') === sector).length;
                const percent = getPercentage(count);
                
                // Cycle through colors
                const colors = ['bg-primary', 'bg-info', 'bg-warning', 'bg-danger', 'bg-success', 'bg-secondary'];
                const colorClass = colors[index % colors.length];
                
                return (
                  <div key={sector} className="mb-2">
                    <div className="flex justify-between text-sm mb-2 items-end">
                      <span className="capitalize font-medium text-text-primary">{sector}</span>
                      <span className="font-bold">{count} <span className="text-xs font-normal text-tertiary">({percent}%)</span></span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-hover rounded-full overflow-hidden shadow-inner flex">
                      <div 
                        className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`} 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatisticsPage;
