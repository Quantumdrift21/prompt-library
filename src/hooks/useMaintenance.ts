import { useState, useEffect, useCallback } from 'react';
import {
    maintenanceService,
    type MaintenanceReport,
    type CleanupResult
} from '../services/maintenanceService';

interface UseMaintenanceReturn {
    isAnalyzing: boolean;
    isCleaningUp: boolean;
    progress: number;
    progressMessage: string;
    report: MaintenanceReport | null;
    cleanupResult: CleanupResult | null;
    error: string | null;
    analyze: () => Promise<void>;
    removeDuplicates: () => Promise<void>;
    deepClean: () => Promise<void>;
    reset: () => void;
}

export const useMaintenance = (): UseMaintenanceReturn => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCleaningUp, setIsCleaningUp] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [report, setReport] = useState<MaintenanceReport | null>(null);
    const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to progress updates
    useEffect(() => {
        const unsubscribe = maintenanceService.subscribe((p, msg) => {
            setProgress(p);
            setProgressMessage(msg);
        });
        return unsubscribe;
    }, []);

    const analyze = useCallback(async () => {
        setIsAnalyzing(true);
        setError(null);
        setReport(null);
        setCleanupResult(null);

        try {
            const result = await maintenanceService.analyze();
            setReport(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    const removeDuplicates = useCallback(async () => {
        if (!report) {
            setError('Run analysis first');
            return;
        }

        setIsCleaningUp(true);
        setError(null);
        setCleanupResult(null);

        try {
            const result = await maintenanceService.removeDuplicates(report);
            setCleanupResult(result);
            // Re-analyze after cleanup
            const newReport = await maintenanceService.analyze();
            setReport(newReport);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Cleanup failed');
        } finally {
            setIsCleaningUp(false);
        }
    }, [report]);

    const deepClean = useCallback(async () => {
        setIsCleaningUp(true);
        setError(null);
        setCleanupResult(null);

        try {
            const result = await maintenanceService.deepClean();
            setCleanupResult(result);
            // Re-analyze after cleanup
            const newReport = await maintenanceService.analyze();
            setReport(newReport);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Deep clean failed');
        } finally {
            setIsCleaningUp(false);
        }
    }, []);

    const reset = useCallback(() => {
        setReport(null);
        setCleanupResult(null);
        setError(null);
        setProgress(0);
        setProgressMessage('');
    }, []);

    return {
        isAnalyzing,
        isCleaningUp,
        progress,
        progressMessage,
        report,
        cleanupResult,
        error,
        analyze,
        removeDuplicates,
        deepClean,
        reset
    };
};
