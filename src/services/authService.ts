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

    async signInWithGoogle(): Promise<{ error: AuthError | null }> {
        if (!supabase) return { error: { message: 'Supabase not configured' } as AuthError };

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        return { error };
    }

    isAuthenticated(): boolean {
        return !!this.currentState.user;
    }

    getUserId(): string | null {
        return this.currentState.user?.id || null;
    }
    async updateProfile(updates: { display_name?: string; bio?: string; full_name?: string; avatar_url?: string }): Promise<{ error: AuthError | null }> {
        if (!supabase) return { error: { message: 'Supabase not configured' } as AuthError };

        // Update auth metadata
        const { error } = await supabase.auth.updateUser({
            data: updates
        });

        // In a real app with a profiles table, we might also update that here:
        // await supabase.from('profiles').update(updates).eq('id', this.currentState.user?.id);

        return { error };
    }

    async updateEmail(email: string): Promise<{ error: AuthError | null }> {
        if (!supabase) return { error: { message: 'Supabase not configured' } as AuthError };

        const { error } = await supabase.auth.updateUser({ email });
        return { error };
    }

    async deleteAccount(): Promise<{ error: Error | null }> {
        if (!supabase) return { error: null };

        // Note: Client-side deletion often requires specific RLS or RPC setup.
        // Assuming a Supabase RPC function 'delete_user' exists or handling via edge case.
        // For standard setup, users often can't delete themselves without server-side code.
        // We will try a standard RPC call if it existed, otherwise return an error for now
        // to prompt "Contact Support" behavior or similar.

        try {
            // Placeholder: Most setups don't allow straight client-side deletion for security.
            // We would call: await supabase.rpc('delete_own_account');
            return { error: new Error("Self-deletion requires server configuration.") };
        } catch (e) {
            return { error: e as Error };
        }
    }

    /**
     * Checks if the current user has completed the onboarding flow.
     * 
     * @returns True if onboarding is complete, false otherwise.
     */
    hasCompletedOnboarding(): boolean {
        const user = this.currentState.user;
        return user?.user_metadata?.onboarding_completed === true;
    }

    /**
     * Marks the onboarding as complete and saves user preferences.
     * 
     * @param preferences - User preferences collected during onboarding.
     * @returns Object with potential error.
     */
    async completeOnboarding(preferences: {
        display_name: string;
        use_case: string
    }): Promise<{ error: AuthError | null }> {
        if (!supabase) return { error: { message: 'Supabase not configured' } as AuthError };

        const { error } = await supabase.auth.updateUser({
            data: {
                ...preferences,
                onboarding_completed: true,
                onboarding_completed_at: new Date().toISOString()
            }
        });

        return { error };
    }
}

// Singleton instance
export const authService = new AuthService();
