import { useState } from 'react';
import { authService } from '../services/authService';
import './AuthModal.css';

interface AuthModalProps {
    onClose: () => void;
}

export const AuthModal = ({ onClose }: AuthModalProps) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const result = mode === 'login'
            ? await authService.signIn(email, password)
            : await authService.signUp(email, password);

        setIsLoading(false);

        if (result.error) {
            setError(result.error.message);
        } else {
            onClose();
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <header className="auth-modal__header">
                    <h2>{mode === 'login' ? 'Log In' : 'Sign Up'}</h2>
                    <button className="auth-modal__close" onClick={onClose}>✕</button>
                </header>

                <form className="auth-modal__form" onSubmit={handleSubmit}>
                    {error && <p className="auth-modal__error">{error}</p>}

                    <div className="auth-modal__field">
                        <label htmlFor="auth-email">Email</label>
                        <input
                            id="auth-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="auth-modal__field">
                        <label htmlFor="auth-password">Password</label>
                        <input
                            id="auth-password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-modal__submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : mode === 'login' ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <p className="auth-modal__switch">
                    {mode === 'login' ? (
                        <>
                            Don't have an account?{' '}
                            <button onClick={() => setMode('signup')}>Sign up</button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button onClick={() => setMode('login')}>Log in</button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};
