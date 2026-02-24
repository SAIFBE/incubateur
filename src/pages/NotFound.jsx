import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 fade-in">
            <div className="text-center">
                <div className="text-8xl font-extrabold text-primary-200 mb-4">404</div>
                <h1 className="text-2xl font-bold text-surface-900 mb-3">{t('common.notFound')}</h1>
                <p className="text-surface-500 mb-8">{t('common.notFoundDesc')}</p>
                <Link to="/">
                    <Button icon={Home}>{t('common.backToHome')}</Button>
                </Link>
            </div>
        </div>
    );
}
