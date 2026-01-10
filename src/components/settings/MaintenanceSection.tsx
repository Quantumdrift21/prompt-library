import { useMaintenance } from '../../hooks';
import './MaintenanceSection.css';

export const MaintenanceSection = () => {
    const {
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
    } = useMaintenance();

    const isWorking = isAnalyzing || isCleaningUp;

    return (
        <section className="settings-section maintenance-section">
            <h2 className="settings-section__title">
                <span>🔧</span> Database Maintenance
            </h2>
            <p className="settings-section__description">
                Clean up duplicate prompts and optimize your library for better performance.
            </p>

            {/* Progress Bar */}
            {isWorking && (
                <div className="maintenance-section__progress">
                    <div className="maintenance-section__progress-bar">
                        <div
                            className="maintenance-section__progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="maintenance-section__progress-text">
                        {progressMessage || 'Working...'}
                    </span>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="maintenance-section__error">
                    ⚠️ {error}
                </div>
            )}

            {/* Cleanup Result */}
            {cleanupResult && (
                <div className={`maintenance-section__result ${cleanupResult.success ? 'success' : 'error'}`}>
                    {cleanupResult.success ? (
                        <>
                            ✅ Cleanup complete! Removed {cleanupResult.deletedCount} duplicate{cleanupResult.deletedCount !== 1 ? 's' : ''}.
                        </>
                    ) : (
                        <>
                            ❌ Cleanup had errors: {cleanupResult.errors.join(', ')}
                        </>
                    )}
                </div>
            )}

            {/* Analysis Report */}
            {report && !cleanupResult && (
                <div className="maintenance-section__report">
                    <h3 className="maintenance-section__report-title">📊 Analysis Report</h3>

                    <div className="maintenance-section__stats">
                        <div className="maintenance-section__stat">
                            <span className="maintenance-section__stat-value">{report.totalPrompts}</span>
                            <span className="maintenance-section__stat-label">Total Prompts</span>
                        </div>
                        <div className="maintenance-section__stat">
                            <span className="maintenance-section__stat-value maintenance-section__stat-value--warning">
                                {report.duplicatesFound}
                            </span>
                            <span className="maintenance-section__stat-label">Duplicates Found</span>
                        </div>
                        <div className="maintenance-section__stat">
                            <span className="maintenance-section__stat-value">{report.stalePrompts}</span>
                            <span className="maintenance-section__stat-label">Stale (90+ days)</span>
                        </div>
                    </div>

                    {report.duplicateGroups.length > 0 && (
                        <div className="maintenance-section__duplicates">
                            <h4>Duplicate Groups:</h4>
                            {report.duplicateGroups.slice(0, 5).map((group, idx) => (
                                <div key={idx} className="maintenance-section__duplicate-group">
                                    <span className="maintenance-section__duplicate-keep">
                                        Keep: "{group.keepPrompt.title}"
                                    </span>
                                    <span className="maintenance-section__duplicate-delete">
                                        Delete {group.deletePrompts.length} duplicate{group.deletePrompts.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                            ))}
                            {report.duplicateGroups.length > 5 && (
                                <span className="maintenance-section__duplicate-more">
                                    ...and {report.duplicateGroups.length - 5} more groups
                                </span>
                            )}
                        </div>
                    )}

                    {report.cleanupActions.length > 0 && (
                        <div className="maintenance-section__actions-list">
                            <h4>Recommended Actions:</h4>
                            <ul>
                                {report.cleanupActions.map((action, idx) => (
                                    <li key={idx}>{action}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="maintenance-section__actions">
                {!report && !cleanupResult && (
                    <button
                        className="maintenance-section__btn maintenance-section__btn--primary"
                        onClick={analyze}
                        disabled={isWorking}
                    >
                        {isAnalyzing ? 'Analyzing...' : '🔍 Analyze Database'}
                    </button>
                )}

                {report && report.duplicatesFound > 0 && !cleanupResult && (
                    <>
                        <button
                            className="maintenance-section__btn maintenance-section__btn--danger"
                            onClick={removeDuplicates}
                            disabled={isWorking}
                        >
                            {isCleaningUp ? 'Cleaning...' : `🗑️ Remove ${report.duplicatesFound} Duplicates`}
                        </button>
                        <button
                            className="maintenance-section__btn maintenance-section__btn--secondary"
                            onClick={reset}
                            disabled={isWorking}
                        >
                            Cancel
                        </button>
                    </>
                )}

                {report && report.duplicatesFound === 0 && !cleanupResult && (
                    <div className="maintenance-section__clean">
                        ✨ No duplicates found! Your library is clean.
                    </div>
                )}

                {cleanupResult && (
                    <button
                        className="maintenance-section__btn maintenance-section__btn--secondary"
                        onClick={reset}
                    >
                        Done
                    </button>
                )}
            </div>

            {/* Quick Actions */}
            <div className="maintenance-section__quick-actions">
                <button
                    className="maintenance-section__quick-btn"
                    onClick={deepClean}
                    disabled={isWorking}
                    title="Analyze and remove duplicates in one step"
                >
                    ⚡ Quick Deep Clean
                </button>
            </div>

            {/* Local Cache Management */}
            <div className="settings-glass-card" style={{ marginTop: '24px' }}>
                <h3 className="settings-glass-card__title">
                    <span>💾</span> Local Cache Management
                </h3>
                <p className="settings-hint" style={{ marginBottom: '1rem' }}>
                    Manage locally stored data in IndexedDB. This affects offline functionality.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        className="settings-btn settings-btn--secondary"
                        onClick={async () => {
                            if (window.confirm('Clear all locally cached prompts? This will re-sync from cloud on next login.')) {
                                try {
                                    const dbs = await indexedDB.databases();
                                    for (const db of dbs) {
                                        if (db.name) indexedDB.deleteDatabase(db.name);
                                    }
                                    alert('Local cache cleared. Refresh the page to re-sync.');
                                } catch (error) {
                                    alert('Failed to clear cache. Try clearing browser data manually.');
                                }
                            }
                        }}
                    >
                        Clear Local Cache
                    </button>
                    <button
                        className="settings-btn settings-btn--secondary"
                        onClick={async () => {
                            if ('storage' in navigator && 'estimate' in navigator.storage) {
                                const estimate = await navigator.storage.estimate();
                                const used = estimate.usage ? (estimate.usage / 1024 / 1024).toFixed(2) : '0';
                                const quota = estimate.quota ? (estimate.quota / 1024 / 1024).toFixed(0) : 'Unknown';
                                alert(`Storage used: ${used} MB / ${quota} MB available`);
                            } else {
                                alert('Storage estimation not supported in this browser.');
                            }
                        }}
                    >
                        Check Storage Usage
                    </button>
                </div>
            </div>
        </section>
    );
};
