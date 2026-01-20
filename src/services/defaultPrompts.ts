import type { Prompt } from '../types';
import { getCurrentTimestamp } from '../utils';

/**
 * Generate a deterministic ID from a title string.
 * This ensures default prompts always have the same ID across loads.
 */
const generateDeterministicId = (title: string): string => {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40);
    return `default-${slug}`;
};

const createDefaultPrompt = (title: string, content: string, tags: string[]): Prompt => {
    const now = getCurrentTimestamp();
    return {
        id: generateDeterministicId(title),
        title,
        content,
        tags: [...tags, 'starter'],
        favorite: false,
        created_at: now,
        updated_at: now,
        user_id: 'guest', // Will be overwritten
        deleted_at: null
    };
};

export const DEFAULT_PROMPTS: Prompt[] = [
    // --- 1. WRITING (5 Prompts) ---
    createDefaultPrompt(
        "Clarify & Edit Text",
        "Please edit the following text for clarity, flow, and conciseness. Maintain the original tone but fix any grammar issues:\n\n[PASTE TEXT]",
        ['writing', 'editing']
    ),
    createDefaultPrompt(
        "Professional Email Rewrite",
        "Rewrite this draft email to be more professional, polite, and direct. Keep it concise.\n\nContext: [CONTEXT]\nDraft: [DRAFT]",
        ['writing', 'email', 'business']
    ),
    createDefaultPrompt(
        "Blog Post Outline",
        "Create a detailed outline for a blog post about [TOPIC]. Include a catchy title, introduction with a hook, main body points with H2/H3 headers, and a conclusion with a call to action.",
        ['writing', 'content']
    ),
    createDefaultPrompt(
        "Creative Story Starter",
        "Write the opening paragraph for a story involving [CHARACTER] who creates [OBJECT] in a [SETTING]. Establish a mysterious tone.",
        ['writing', 'creative']
    ),
    createDefaultPrompt(
        "Tone Adjuster",
        "Rewrite the following text to sound more [ADJECTIVE, e.g., enthusiastic, empathetic, authoritative]:\n\n[TEXT]",
        ['writing', 'tone']
    ),

    // --- 2. CODING (5 Prompts) ---
    createDefaultPrompt(
        "Code Review Assistant",
        "Review the following code for: 1. Logic bugs 2. Security vulnerabilities 3. Performance improvements 4. Stylistic consistency.\n\nCode:\n```\n[CODE]\n```",
        ['coding', 'review']
    ),
    createDefaultPrompt(
        "Unit Test Generator",
        "Generate comprehensive unit tests for this function using [FRAMEWORK]. Include edge cases and happy paths.\n\nCode:\n```\n[CODE]\n```",
        ['coding', 'testing']
    ),
    createDefaultPrompt(
        "Explain Error Message",
        "I'm getting this error: `[ERROR_MESSAGE]`. Explain what it means and suggest 3 possible fixes.",
        ['coding', 'debugging']
    ),
    createDefaultPrompt(
        "SQL Query Builder",
        "Write an efficient SQL query to select [DATA] from tables [TABLES] where [CONDITIONS].",
        ['coding', 'database']
    ),
    createDefaultPrompt(
        "Code Refactor",
        "Refactor the following code to be more readable and efficient. Explain your changes.\n\nCode:\n```\n[CODE]\n```",
        ['coding', 'refactor']
    ),

    // --- 3. PRODUCTIVITY (5 Prompts) ---
    createDefaultPrompt(
        "Meeting Summary",
        "Summarize these meeting notes into: 1. Key Decisions 2. Action Items (with owners) 3. Open Questions.\n\nNotes: [NOTES]",
        ['productivity', 'meeting']
    ),
    createDefaultPrompt(
        "SMART Goal Setter",
        "Help me turn this vague goal into a SMART goal (Specific, Measurable, Achievable, Relevant, Time-bound).\n\nGoal: [GOAL]",
        ['productivity', 'planning']
    ),
    createDefaultPrompt(
        "Daily Standup Update",
        "Draft a daily standup update based on: Yesterday I did [YESTERDAY]. Today I will do [TODAY]. Blockers: [BLOCKERS].",
        ['productivity', 'agile']
    ),
    createDefaultPrompt(
        "Project Roadmap",
        "Create a high-level 3-month roadmap for [PROJECT]. Break it down into phases: Research, Development, Testing, Launch.",
        ['productivity', 'planning']
    ),
    createDefaultPrompt(
        "Prioritization Matrix",
        "I have these tasks: [TASKS]. Help me prioritize them using the Eisenhower Matrix (Urgent vs Important).",
        ['productivity', 'planning']
    ),

    // --- 4. LEARNING (5 Prompts) ---
    createDefaultPrompt(
        "Socratic Tutor",
        "Act as a Socratic tutor. I want to learn about [TOPIC]. Don't give me the answer, but ask me guiding questions to help me figure it out.",
        ['learning', 'education']
    ),
    createDefaultPrompt(
        "Language Practice",
        "Have a conversation with me in [LANGUAGE] at a [LEVEL] level. Correct my mistakes gently at the end of each response.",
        ['learning', 'language']
    ),
    createDefaultPrompt(
        "Simplify Complex Topic",
        "Explain [TOPIC] to me like I'm 12 years old. Use analogies and avoid jargon.",
        ['learning', 'education']
    ),
    createDefaultPrompt(
        "Study Plan Generator",
        "Create a 4-week study plan to learn [SKILL]. I have [TIME] hours per week available.",
        ['learning', 'planning']
    ),
    createDefaultPrompt(
        "Key Concept Extraction",
        "Extract the top 5 key concepts and definitions from the following text:\n\n[TEXT]",
        ['learning', 'summary']
    ),

    // --- 5. GENERAL (5 Prompts) ---
    createDefaultPrompt(
        "Gift Ideas",
        "Suggest 5 unique gift ideas for a [PERSON] who loves [INTERESTS]. Budget is [BUDGET].",
        ['general', 'shopping']
    ),
    createDefaultPrompt(
        "Recipe Generator",
        "I have these ingredients: [INGREDIENTS]. Suggest a recipe I can make. Mention strict dietary restrictions: [RESTRICTIONS].",
        ['general', 'cooking']
    ),
    createDefaultPrompt(
        "Travel Itinerary",
        "Create a 3-day itinerary for a trip to [DESTINATION]. I enjoy [INTERESTS] and reliable food spots.",
        ['general', 'travel']
    ),
    createDefaultPrompt(
        "Email Response",
        "Draft a polite decline to this invitation: [INVITATION DETAILS].",
        ['general', 'email']
    ),
    createDefaultPrompt(
        "Motivational Boost",
        "Give me a motivational quote and a short pep talk for someone struggling with [CHALLENGE].",
        ['general', 'motivation']
    )
];
