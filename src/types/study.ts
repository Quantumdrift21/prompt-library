export type KnowledgeLevel = 'Beginner' | 'Intermediate' | 'Expert';

export type StudyGoal = 'Summarize' | 'Quiz Me' | 'Deep Dive' | 'Find Gaps';

export type StudyMethod =
    | 'Feynman Technique'
    | 'Active Recall'
    | 'Distributed Practice'
    | 'Pomodoro'
    | 'Mind Mapping'
    | 'Cornell Notes'
    | 'Elaborative Interrogation'
    | 'Interleaving'
    | 'Rereading'
    | 'Highlighting';

export interface StudySessionData {
    topic: string;
    knowledgeLevel: KnowledgeLevel;
    goal: StudyGoal;
    method: StudyMethod;
    aiModel: string; // Added AI Model ID
    generatedPrompt: string; // The preview
    activeNotes: string; // The right-pane content
}

export const STUDY_METHODS: Record<StudyMethod, { label: string; description: string }> = {
    'Feynman Technique': {
        label: 'Feynman Technique',
        description: 'Simplifies complex topics by explaining them in plain language.'
    },
    'Active Recall': {
        label: 'Active Recall',
        description: 'Tests your memory by generating questions instead of just reading.'
    },
    'Distributed Practice': {
        label: 'Spaced Repetition',
        description: 'Spreading study sessions across time intervals for long-term retention.'
    },
    'Pomodoro': {
        label: 'Pomodoro Technique',
        description: 'Focused 25-minute work intervals with short breaks.'
    },
    'Mind Mapping': {
        label: 'Mind Mapping',
        description: 'Visual-spatial representation of ideas and relationships.',
    },
    'Cornell Notes': {
        label: 'Cornell Notes',
        description: 'Systematic note-taking with cues, detailed notes, and summaries.'
    },
    'Elaborative Interrogation': {
        label: 'Elaborative Interrogation',
        description: 'Generating detailed "why" and "how" explanations for facts.'
    },
    'Interleaving': {
        label: 'Interleaving',
        description: 'Mixing different topics or problem types to improve discrimination.'
    },
    'Rereading': {
        label: 'Rereading (Passive)',
        description: 'Reviewing text again (Note: generally less effective).'
    },
    'Highlighting': {
        label: 'Highlighting',
        description: 'Marking key concepts (Best for first-pass only).'
    }
};
