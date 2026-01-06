import { useState, useEffect } from 'react';
import { syncService } from '../services/syncService';

interface SyncStatus {
    lastSyncAt: string | null;
    isSyncing: boolean;
    error: string | null;
}

/**
 * Hook to subscribe to sync status changes
 */
export const useSync = (): SyncStatus => {
    const [status, setStatus] = useState<SyncStatus>(syncService.getStatus());

    useEffect(() => {
        return syncService.subscribe(setStatus);
    }, []);

    return status;
};
