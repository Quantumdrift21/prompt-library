/**
 * Lesson data and types for Learn Prompting feature.
 * Contains lesson structures, question types, and sample content.
 */

// --- Question Types ---

export interface McqOption {
    id: string;
    text: string;
}

export interface McqQuestion {
    type: 'mcq';
    id: string;
    question: string;
    options: McqOption[];
    correctOptionId: string;
    explanation: string;
    points: number;
}

export interface WritingQuestion {
    type: 'writing';
    id: string;
    prompt: string;
    task: string;
    hints: string[];
    exampleAnswer: string;
    rubric: string[];
    points: number;
}

export type Question = McqQuestion | WritingQuestion;

// --- Lesson Structure ---

export interface Lesson {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedMinutes: number;
    questions: Question[];
}

// --- Sample Lessons ---

export const lessons: Lesson[] = [
    {
        id: 'lesson-1',
        title: 'Introduction to Prompting',
        description: 'Learn the fundamentals of writing effective AI prompts.',
        difficulty: 'beginner',
        estimatedMinutes: 10,
        questions: [
            {
                type: 'mcq',
                id: 'q1-1',
                question: 'What is the most important aspect of writing an effective AI prompt?',
                options: [
                    { id: 'a', text: 'Using as many words as possible' },
                    { id: 'b', text: 'Being clear and specific' },
                    { id: 'c', text: 'Using technical jargon' },
                    { id: 'd', text: 'Writing in all caps' },
                ],
                correctOptionId: 'b',
                explanation: 'Clear and specific prompts help the AI understand exactly what you need, leading to better responses.',
                points: 10,
            },
            {
                type: 'mcq',
                id: 'q1-2',
                question: 'Which of these is a good example of providing context in a prompt?',
                options: [
                    { id: 'a', text: '"Write something"' },
                    { id: 'b', text: '"I need help"' },
                    { id: 'c', text: '"As a marketing manager, I need to write an email to announce our new product launch to employees"' },
                    { id: 'd', text: '"Do the thing"' },
                ],
                correctOptionId: 'c',
                explanation: 'Providing role context (marketing manager), task (write email), and purpose (announce product) helps the AI generate relevant content.',
                points: 10,
            },
            {
                type: 'writing',
                id: 'q1-3',
                prompt: 'You want the AI to write a haiku about programming.',
                task: 'Write a prompt that asks for a haiku about programming. Be specific about the format and tone.',
                hints: [
                    'Mention the haiku format (5-7-5 syllables)',
                    'Specify the topic clearly',
                    'Consider asking for a specific tone (humorous, reflective, etc.)',
                ],
                exampleAnswer: 'Write a haiku poem about programming in the traditional 5-7-5 syllable format. Make it reflective and capture the essence of debugging code.',
                rubric: [
                    'Mentions haiku format',
                    'Specifies programming topic',
                    'Includes tone or style guidance',
                ],
                points: 20,
            },
            {
                type: 'mcq',
                id: 'q1-4',
                question: 'What does "chain of thought" prompting mean?',
                options: [
                    { id: 'a', text: 'Asking the AI to think step by step' },
                    { id: 'b', text: 'Sending multiple messages in a row' },
                    { id: 'c', text: 'Using chains in your prompt' },
                    { id: 'd', text: 'Thinking about the AI' },
                ],
                correctOptionId: 'a',
                explanation: 'Chain of thought prompting asks the AI to break down its reasoning into steps, often leading to more accurate and logical responses.',
                points: 10,
            },
            {
                type: 'mcq',
                id: 'q1-5',
                question: 'Which is the best way to get a specific output format from an AI?',
                options: [
                    { id: 'a', text: 'Hope the AI guesses the format you want' },
                    { id: 'b', text: 'Explicitly describe the format (e.g., "respond as a bullet list")' },
                    { id: 'c', text: 'Use emojis to indicate format' },
                    { id: 'd', text: 'Ask twice' },
                ],
                correctOptionId: 'b',
                explanation: 'Explicitly describing the desired output format ensures the AI structures its response according to your needs.',
                points: 10,
            },
            {
                type: 'writing',
                id: 'q1-6',
                prompt: 'You need the AI to summarize a long article for a busy executive.',
                task: 'Write a prompt that asks for a summary suitable for a busy executive. Consider format, length, and focus.',
                hints: [
                    'Executives prefer concise summaries',
                    'Key points and action items are valuable',
                    'Consider bullet points or numbered lists',
                ],
                exampleAnswer: 'Summarize this article in a brief executive summary format. Use 3-5 bullet points highlighting the key takeaways and any recommended actions. Keep the total length under 150 words.',
                rubric: [
                    'Mentions target audience (executive)',
                    'Specifies concise format',
                    'Includes length or structure guidance',
                ],
                points: 20,
            },
            {
                type: 'mcq',
                id: 'q1-7',
                question: 'What is "few-shot prompting"?',
                options: [
                    { id: 'a', text: 'Giving the AI a few examples of what you want' },
                    { id: 'b', text: 'Asking a short question' },
                    { id: 'c', text: 'Taking screenshots of prompts' },
                    { id: 'd', text: 'Using the AI only a few times' },
                ],
                correctOptionId: 'a',
                explanation: 'Few-shot prompting involves providing a few examples of the desired input-output format to help the AI understand the pattern you want.',
                points: 10,
            },
            {
                type: 'mcq',
                id: 'q1-8',
                question: 'When should you break a complex task into multiple prompts?',
                options: [
                    { id: 'a', text: 'Never, always use one prompt' },
                    { id: 'b', text: 'When the task has multiple distinct steps or requires different types of output' },
                    { id: 'c', text: 'Only on Tuesdays' },
                    { id: 'd', text: 'When the AI refuses to respond' },
                ],
                correctOptionId: 'b',
                explanation: 'Complex tasks often benefit from being broken into smaller, focused prompts that each handle a specific part of the work.',
                points: 10,
            },
            {
                type: 'writing',
                id: 'q1-9',
                prompt: 'You want the AI to help you brainstorm names for a new coffee shop.',
                task: 'Write a prompt that asks for creative coffee shop name ideas. Include constraints or themes if desired.',
                hints: [
                    'Specify the vibe (cozy, modern, quirky)',
                    'Mention location or target audience if relevant',
                    'Ask for a specific number of suggestions',
                ],
                exampleAnswer: 'Generate 10 creative name ideas for a cozy, book-themed coffee shop in a college town. Names should be memorable, easy to spell, and evoke a warm, studious atmosphere.',
                rubric: [
                    'Specifies number of ideas',
                    'Includes theme or style',
                    'Provides relevant context',
                ],
                points: 20,
            },
            {
                type: 'mcq',
                id: 'q1-10',
                question: 'What is a good practice before submitting a prompt?',
                options: [
                    { id: 'a', text: 'Just send it immediately' },
                    { id: 'b', text: 'Review for clarity, check if you provided enough context, and ensure the task is specific' },
                    { id: 'c', text: 'Add more emojis' },
                    { id: 'd', text: 'Make it longer' },
                ],
                correctOptionId: 'b',
                explanation: 'Taking a moment to review your prompt for clarity and completeness often leads to better AI responses on the first try.',
                points: 10,
            },
        ],
    },
];

/**
 * Gets a lesson by its ID.
 *
 * @param lessonId - The lesson ID to find.
 * @returns The lesson or undefined if not found.
 */
export const getLessonById = (lessonId: string): Lesson | undefined => {
    return lessons.find(l => l.id === lessonId);
};

/**
 * Gets all available lessons.
 *
 * @returns Array of all lessons.
 */
export const getAllLessons = (): Lesson[] => {
    return lessons;
};

/**
 * Calculates the total possible score for a lesson.
 *
 * @param lesson - The lesson to calculate score for.
 * @returns Total points possible.
 */
export const getTotalPossibleScore = (lesson: Lesson): number => {
    return lesson.questions.reduce((sum, q) => sum + q.points, 0);
};
