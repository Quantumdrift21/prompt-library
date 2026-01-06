import { supabase, isSupabaseConfigured } from './supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
}

class AuthService {
    private listeners: Set<(state: AuthState) => void> = new Set();
    private currentState: AuthState = {
        user: null,
        session: null,
        isLoading: true,
    };

    constructor() {
        this.init();
    }

    private async init() {
        if (!isSupabaseConfigured() || !supabase) {
            this.currentState = { user: null, session: null, isLoading: false };
            this.notifyListeners();
            return;
        }

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        this.currentState = {
            user: session?.user || null,
            session,
            isLoading: false,
        };
        this.notifyListeners();

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
            this.currentState = {
                user: session?.user || null,
                session,
                isLoading: false,
            };
            this.notifyListeners();
        });
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.currentState));
    }

    subscribe(listener: (state: AuthState) => void): () => void {
        this.listeners.add(listener);
        // Immediately call with current state
        listener(this.currentState);
        return () => this.listeners.delete(listener);
    }

    getState(): AuthState {
        return this.currentState;
    }

    async signUp(email: string, password: string): Promise<{ error: AuthError | null }> {
        if (!supabase) return { error: { message: 'Supabase not configured' } as AuthError };

        const { error } = await supabase.auth.signUp({ email, password });
        return { error };
    }

    async signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
        if (!supabase) return { error: { message: 'Supabase not configured' } as AuthError };

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    }

    async signOut(): Promise<{ error: AuthError | null }> {
        if (!supabase) return { error: null };

        const { error } = await supabase.auth.signOut();
        return { error };
    }

    isAuthenticated(): boolean {
        return !!this.currentState.user;
    }

    getUserId(): string | null {
        return this.currentState.user?.id || null;
    }
}

// Singleton instance
export const authService = new AuthService();
