import { useUI } from '../../contexts/UIContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const colors = {
    success: 'border-success-500 bg-success-50',
    error: 'border-danger-500 bg-danger-50',
    warning: 'border-warning-500 bg-warning-50',
    info: 'border-primary-500 bg-primary-50',
};

const iconColors = {
    success: 'text-success-500',
    error: 'text-danger-500',
    warning: 'text-warning-500',
    info: 'text-primary-500',
};

export default function ToastContainer() {
    const { toasts, removeToast } = useUI();

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full" aria-live="polite">
            {toasts.map((toast) => {
                const Icon = icons[toast.type] || icons.info;
                return (
                    <div
                        key={toast.id}
                        className={`
              toast-enter flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg
              ${colors[toast.type] || colors.info}
            `}
                        role="alert"
                    >
                        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColors[toast.type] || iconColors.info}`} />
                        <div className="flex-1 min-w-0">
                            {toast.title && (
                                <p className="font-semibold text-surface-900 text-sm">{toast.title}</p>
                            )}
                            {toast.message && (
                                <p className="text-surface-600 text-sm mt-0.5">{toast.message}</p>
                            )}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 rounded-lg hover:bg-black/5 text-surface-400 flex-shrink-0"
                            aria-label="Dismiss"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
