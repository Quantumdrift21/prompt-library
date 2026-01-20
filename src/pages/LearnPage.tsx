import { useState, useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import { CognitiveBuilder } from '../components/study/CognitiveBuilder';
import { ActiveNotes } from '../components/study/ActiveNotes';
import type { StudySessionData, StudyMethod } from '../types/study';
import { MethodSidebar } from '../components/study/MethodSidebar';
import { DarkLayout } from '../components/layout';
import { useAuth } from '../hooks';
import './LearnPage.css';

/**
 * LearnPage component - "Method-First" Study Environment.
 * Layout: 3-Column Grid (Method Sidebar | Cognitive Builder | Active Notes)
 * [Debug: MethodDescription commented out]
 */
export const LearnPage = () => {
    const { user } = useAuth();
    const userName = user?.email?.split('@')[0] || 'Guest';

    // State to hold the current session data from the builder
    const [sessionData, setSessionData] = useState<StudySessionData | null>(null);
    const [notesContent, setNotesContent] = useState('');

    const handleSessionChange = useCallback((data: StudySessionData) => {
        setSessionData(data);
    }, []);

    const handleCopyPreview = () => {
        if (sessionData?.generatedPrompt) {
            const newContent = notesContent
                ? `${notesContent}\n\n---\n\n${sessionData.generatedPrompt}`
                : sessionData.generatedPrompt;
            setNotesContent(newContent);
        }
    };

    // Default to layman/Feynman if no session yet
    const currentMethod: StudyMethod = sessionData?.method || 'Feynman Technique';

    return (
        <DarkLayout userName={userName}>
            <div className="learn-page">
                <div className="learn-container">
                    <header className="learn-header">
                        <h1>
                            <span className="header-icon-wrapper icon-3d-cyan">
                                <BookOpen size={24} />
                            </span>
                            Method-First Learning
                        </h1>
                    </header>

                    <main className="learn-grid">
                        {/* Left: Method Context */}
                        <aside className="method-sidebar">
                            <MethodSidebar method={currentMethod} />
                        </aside>

                        {/* Middle: Inputs */}
                        <section className="builder-section">
                            <CognitiveBuilder onSessionChange={handleSessionChange} />
                        </section>

                        {/* Right: Workspace */}
                        <section className="notes-section">
                            <ActiveNotes
                                content={notesContent}
                                onChange={setNotesContent}
                                onCopyFromPreview={handleCopyPreview}
                            />
                        </section>
                    </main>
                </div>
            </div>
        </DarkLayout>
    );
};
