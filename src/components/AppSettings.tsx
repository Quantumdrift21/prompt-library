import './AuthModal.css';

interface AppSettingsProps {
    onClose: () => void;
}

export const AppSettings = ({ onClose }: AppSettingsProps) => {
    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <div className="auth-modal__header">
                    <h2>Settings</h2>
                    <button className="auth-modal__close" onClick={onClose}>&times;</button>
                </div>

                <div className="auth-modal__content">
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', margin: '30px 0' }}>
                        ⚙️ Settings and preferences coming soon.
                    </p>
                </div>

                <div className="auth-modal__footer">
                    <button onClick={onClose} className="auth-modal__submit-btn">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
