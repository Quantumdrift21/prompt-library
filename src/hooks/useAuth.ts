import { useState, useEffect } from 'react';
import { authService, type AuthState } from '../services/authService';

/**
 * Hook to subscribe to auth state changes
 */
export const useAuth = (): AuthState => {
    const [state, setState] = useState<AuthState>(authService.getState());

    useEffect(() => {
        return authService.subscribe(setState);
    }, []);

    return state;
};
