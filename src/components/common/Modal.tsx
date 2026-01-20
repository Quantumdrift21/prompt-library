import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) => {
    const [mounted, setMounted] = useState(false);
    const [active, setActive] = useState(false);

    // Handle mounting for animation
    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            // Small delay to allow DOM render before adding active class for transition
            requestAnimationFrame(() => setActive(true));

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            setActive(false);
            const timer = setTimeout(() => {
                setMounted(false);
            }, 300); // Match CSS transition duration

            // Restore body scroll
            document.body.style.overflow = '';

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!mounted) return null;

    return createPortal(
        <div className={`modal-backdrop ${active ? 'active' : ''}`} onClick={onClose}>
            <div
                className={`modal-container modal-${size} ${active ? 'active' : ''}`}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="modal-header">
                    {title && <h2 className="modal-title">{title}</h2>}
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
