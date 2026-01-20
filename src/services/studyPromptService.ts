import type { StudySessionData } from '../types/study';
import { STUDY_TECHNIQUES } from '../data/studyTechniques';
import { AI_MODELS } from '../data/aiModels';

export const studyPromptService = {
    generateMetaPrompt(data: StudySessionData): string {
        const { topic, method, goal, knowledgeLevel, aiModel } = data;

        // 1. Get the Core Method Data
        // Default to Feynman if method not found
        const technique = STUDY_TECHNIQUES[method] || STUDY_TECHNIQUES['Feynman Technique'];

        // 2. Build the "Context" section for the AI
        // This injects the scientific nuance from the guide
        let context = `
**Study Technique**: ${technique.name}
**Scientific Basis**: ${technique.scientificContext}
**Mechanism**: ${technique.mechanism}

**Instructions for the AI Tutor**:
${technique.instructions.replace(/{topic}/g, topic || 'the topic')}
`;

        // 3. Goal Adjustments (Add specific sub-goals)
        let goalInstructions = '';
        if (goal === 'Quiz Me') {
            goalInstructions = `\n\n**Additional Goal**: Create a quiz to test my understanding after the main activity.`;
        } else if (goal === 'Find Gaps') {
            goalInstructions = `\n\n**Additional Goal**: Explicitly identify potential misconceptions or gaps in my understanding.`;
        } else if (goal === 'Deep Dive') {
            goalInstructions = `\n\n**Additional Goal**: Provide advanced details and theoretical underpinnings.`;
        } else if (goal === 'Summarize') {
            goalInstructions = `\n\n**Additional Goal**: Conclude with a concise one-paragraph summary.`;
        }
        context += goalInstructions;

        // 4. Knowledge Level & Constraints
        const constraints = `
- **Target Audience Level**: ${knowledgeLevel}
- **Tone**: Educational, Encouraging, but rigorously accurate.
- **Format**: Clear, structured Markdown. Use bolding for key terms.
`;

        // 5. Wrap with AI Model Template
        const selectedModel = AI_MODELS.find(m => m.id === aiModel) || AI_MODELS[0];

        // Construct the final prompt using the model's template
        return selectedModel.template(
            'Expert Tutor and Study Guide', // Role
            `Help me study "${topic || 'the topic'}" using the ${method} method.`, // Task
            context.trim(), // Context
            constraints.trim() // Constraints
        );
    }
};
