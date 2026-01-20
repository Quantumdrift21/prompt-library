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

        // Account deletion requires server-side implementation for security.
        // This prevents malicious client-side deletion attempts.
        // To implement: Create a Supabase Edge Function 'delete-account' that:
        // 1. Verifies the user's identity
        // 2. Deletes associated data (prompts, settings, storage files)
        // 3. Deletes the auth user

        return {
            error: new Error(
                "Account deletion is not available from the app. " +
                "Please contact support at support@example.com to request account deletion."
            )
        };
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
