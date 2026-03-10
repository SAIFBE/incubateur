import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    const overlayRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            contentRef.current?.focus();
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="fixed inset-0"
                ref={overlayRef}
                onClick={onClose}
            />
            <div
                ref={contentRef}
                tabIndex={-1}
                className={`
                    bg-white rounded-[2rem] shadow-2xl w-full ${sizeClasses[size]}
                    flex flex-col relative overflow-hidden transition-all duration-300
                    fade-in max-h-[90vh]`
                }
            >
                {/* Header: Always visible */}
                <div className="flex items-center justify-between p-6 md:px-10 border-b border-surface-100 bg-surface-50/30 backdrop-blur-sm shrink-0">
                    <div className="w-10"></div>
                    <h2 id="modal-title" className="text-xl md:text-2xl font-bold text-surface-900 flex-1 text-center">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-2xl hover:bg-surface-200 text-surface-500 hover:text-surface-900 transition-all duration-200"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body: Scrollable */}
                <div className="p-6 md:p-10 overflow-y-auto grow">
                    {children}
                </div>
            </div>
        </div>
    );
}
