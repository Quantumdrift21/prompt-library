interface MethodGuide {
    name: string;
    description: string;
    instructions: string;
    bestFor: string[];
}

export const METHOD_GUIDES: Record<string, MethodGuide> = {
    'Distributed Practice': {
        name: 'Distributed Practice (Spaced Repetition)',
        description: 'Spreading study sessions across time intervals.',
        instructions: `Create a spaced repetition schedule and content plan for "${'{topic}'}".
Divide the material into chunks suitable for:
1. Initial Learning (Day 0)
2. First Review (Day 1)
3. Second Review (Day 7)
4. Third Review (Day 30)

For each session, define specific active tasks, not just re-reading.`,
        bestFor: ['Long-term retention', 'Languages', 'Math', 'Science']
    },
    'Active Recall': {
        name: 'Active Recall (Practice Testing)',
        description: 'Repeatedly testing yourself on material.',
        instructions: `Do NOT summarize "${'{topic}'}". Instead, generate a series of diagnostic questions and exercises.
1. Create 5 Direct Recall questions.
2. Create 3 Inference/Application questions.
3. Provide the answers in a separate section at the bottom (hidden unless revealed).
Wait for my answers before providing feedback if this is an interactive session.`,
        bestFor: ['Factual knowledge', 'Licensing exams', 'Long-term retention']
    },
    'Feynman Technique': {
        name: 'Feynman Technique',
        description: 'Explaining concepts in simple language.',
        instructions: `Act as a student who needs to explain "${'{topic}'}" to a 12-year-old.
1. Use simple analogies and everyday language.
2. Avoid jargon; if a technical term is needed, define it immediately.
3. Identify potential "gaps" in understanding where the explanation typically gets confusing.
4. Simplify the explanation further based on those gaps.`,
        bestFor: ['Complex theory', 'Deep understanding', 'Identifying gaps']
    },
    'Pomodoro': {
        name: 'Pomodoro Technique',
        description: 'Time-management using 25-minute focused intervals.',
        instructions: `Break down the study of "${'{topic}'}" into 25-minute "Pomodoro" blocks.
For each block, assign a specific, achievable micro-goal.
Example structure:
- Pomodoro 1: [Goal]
- Break (5m)
- Pomodoro 2: [Goal]
...
Provide a checklist for each block to track progress.`,
        bestFor: ['Procrastination', 'Deep focus', 'Burnout prevention']
    },
    'Mind Mapping': {
        name: 'Mind Mapping',
        description: 'Visual-spatial representation of ideas.',
        instructions: `Generate a text-based structure for a Mind Map of "${'{topic}'}".
Central Node: [Main Topic]
Branch 1: [Key Theme]
  - Sub-branch: [Detail]
  - Keywords: [List]
Branch 2: [Key Theme]
...
Highlight relationships between branches where concepts overlap.`,
        bestFor: ['Visual learners', 'Brainstorming', 'Connecting ideas']
    },
    'Cornell Notes': {
        name: 'Cornell Notes',
        description: 'Systematic note-taking with cues, notes, and summary.',
        instructions: `Provide notes on "${'{topic}'}" structured in the Cornell format:
1. Left Column (Cues/Questions): Generate questions that the notes answer.
2. Right Column (Notes): Key points, definitions, and details.
3. Bottom (Summary): A 2-3 sentence synthesis of the entire topic.`,
        bestFor: ['Lecture notes', 'Textbook study', 'Review']
    },
    'Elaborative Interrogation': {
        name: 'Elaborative Interrogation',
        description: 'Generating explanations for explicitly stated facts.',
        instructions: `For the topic "${'{topic}'}", generate a list of key facts/statements.
For each fact, ask "Why is this true?" or "How does this work?" and provide a detailed, causal explanation.
Connect the new information to prior knowledge (assumed general knowledge).`,
        bestFor: ['Fact retention', 'Causal understanding', 'Science']
    },
    'Interleaving': {
        name: 'Interleaving',
        description: 'Mixing different topics or problem types.',
        instructions: `Create a study plan for "${'{topic}'}" that mixes it with related but distinct concepts (e.g., if Math, mix Algebra/Geometry).
Generate a set of practice problems/questions where the type of problem usually varies from one query to the next, requiring me to identify the correct strategy first.`,
        bestFor: ['Math', 'Problem solving', 'Category discrimination']
    },
    'Rereading': {
        name: 'Rereading (Passive Review)',
        description: 'Re-reading text (Lower effectiveness).',
        instructions: `Provide a structured reading guide for "${'{topic}'}".
Identify the most critical sections to re-read.
Note: Research shows this is less effective than active methods. Suggest one small active step to add to the reading (e.g., "Pause and summarize").`,
        bestFor: ['Basic review', 'Low energy study']
    },
    'Highlighting': {
        name: 'Highlighting/Underlining',
        description: 'Marking key text (Lower effectiveness).',
        instructions: `Provide a substantial text summary of "${'{topic}'}".
Then, simulate "highlighting" by bolding ONLY the absolute most critical keywords and phrases (max 10% of text).
Explain why those specific parts were chosen.`,
        bestFor: ['First pass reading', 'Identifying keywords']
    }
};
