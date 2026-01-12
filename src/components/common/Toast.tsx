import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './Toast.css';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

/**
 * Toast notification component for displaying feedback messages.
 *
 * @param message - The message to display.
 * @param type - The type of toast (success, error, info).
 * @param isVisible - Whether the toast is visible.
 * @param onClose - Callback to close the toast.
 * @param duration - Auto-dismiss duration in ms (default: 3000).
 */
export const Toast = ({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        if (isVisible && duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const icons = {
        success: <CheckCircle size={20} />,
        error: <XCircle size={20} />,
        info: <AlertCircle size={20} />
    };

    return (
        <div className={`toast toast--${type}`}>
            <span className="toast__icon">{icons[type]}</span>
            <span className="toast__message">{message}</span>
            <button className="toast__close" onClick={onClose}>×</button>
        </div>
    );
};
