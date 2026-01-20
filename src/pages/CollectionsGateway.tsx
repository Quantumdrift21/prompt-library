import { useAuth } from '../hooks';
import { Collections } from './Collections';
import { CollectionsCuriosityPage } from './CollectionsCuriosityPage';

/**
 * CollectionsGateway - Routes to appropriate component based on auth status.
 * 
 * - Guest users → CuriosityPage (prompts signup)
 * - Logged-in users → Collections (private workspace)
 * 
 * @returns The appropriate component based on authentication state.
 */
export const CollectionsGateway = () => {
    const { user, isLoading } = useAuth();

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="app-loading">
                <div className="app-loading__spinner"></div>
                <span>Loading...</span>
            </div>
        );
    }

    // Route based on auth status
    return user ? <Collections /> : <CollectionsCuriosityPage />;
};
