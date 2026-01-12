export type KnowledgeLevel = 'Beginner' | 'Intermediate' | 'Expert';

export type StudyGoal = 'Summarize' | 'Quiz Me' | 'Deep Dive' | 'Find Gaps';

export type StudyMethod = 'Feynman' | 'Active Recall' | 'Cornell' | 'Blurting' | 'Leitner';

export interface StudySessionData {
    topic: string;
    knowledgeLevel: KnowledgeLevel;
    goal: StudyGoal;
    method: StudyMethod;
    generatedPrompt: string; // The preview
    activeNotes: string; // The right-pane content
}

export const STUDY_METHODS: Record<StudyMethod, { label: string; description: string }> = {
    Feynman: {
        label: 'Feynman Technique',
        description: 'Simplifies complex topics by explaining them in plain language (like to a 12-year-old).'
    },
    'Active Recall': {
        label: 'Active Recall',
        description: 'Tests your memory by generating questions instead of just reading.'
    },
    Cornell: {
        label: 'Cornell Method',
        description: 'Organizes notes into structured cues, main notes, and a summary.'
    },
    Blurting: {
        label: 'Blurting',
        description: 'You dump your knowledge first, then the AI organizes and fills gaps.'
    },
    Leitner: {
        label: 'Leitner System',
        description: 'Uses spaced repetition concepts to focus on what you struggle with.'
    }
};
