import type { StudySessionData } from '../types/study';

export const studyPromptService = {
    generateMetaPrompt(data: StudySessionData): string {
        const { topic, method, goal, knowledgeLevel } = data;

        let instructions = '';

        // Method-specific instructions
        switch (method) {
            case 'Feynman':
                instructions = `Explain the topic "${topic}" as if I am a 12-year-old. Avoid jargon where possible, or explain it simply if necessary. Focus on analogies and simple logic.`;
                break;
            case 'Active Recall':
                instructions = `Do NOT summarize "${topic}". Instead, ask me 5 diagnostic questions to test my understanding. Wait for my answers before providing feedback.`;
                break;
            case 'Cornell':
                instructions = `Provide notes on "${topic}" structured in the Cornell logic: 
1. Key Cues/Questions (left column equivalent)
2. Detailed Notes (right column equivalent)
3. Summary (bottom row equivalent) at the end.`;
                break;
            case 'Blurting':
                instructions = `I will provide my raw thoughts on "${topic}". Please organize them into a logical hierarchy, correct any misconceptions, and fill in missing key gaps.`;
                break;
            case 'Leitner':
                instructions = `Create a set of flashcards for "${topic}". Present them one by one. If I get it wrong, tell me to review it sooner. If I get it right, tell me to review it later.`;
                break;
        }

        // Goal adjustments
        if (goal === 'Quiz Me' && method !== 'Active Recall') {
            instructions += `\n\nAdditionally, include a short quiz at the end.`;
        } else if (goal === 'Find Gaps') {
            instructions += `\n\nFocus specifically on common misconceptions and advanced nuances I might be missing.`;
        }

        // Knowledge Level adjustments
        instructions += `\n\nTarget Audience Level: ${knowledgeLevel}.`;

        return instructions;
    }
};
