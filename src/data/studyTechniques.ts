import type { StudyMethod } from '../types/study';

export interface StudyTechniqueData {
    name: string;
    effectiveness: 'Highest' | 'High' | 'Moderate' | 'Low';
    effectSize: string;
    description: string;
    mechanism: string;
    bestFor: string[];
    scientificContext: string;
    instructions: string;
}

export const STUDY_TECHNIQUES: Record<StudyMethod, StudyTechniqueData> = {
    'Active Recall': {
        name: 'Active Recall (Practice Testing)',
        effectiveness: 'Highest',
        effectSize: 'd = 0.84',
        description: 'Repeatedly testing yourself on material rather than passively reviewing it.',
        mechanism: 'Retrieval effort strengthens neural pathways and memory traces more effectively than passive exposure.',
        bestFor: ['Factual knowledge', 'Licensing exams', 'Long-term retention', 'Transfer to new problems'],
        scientificContext: 'Research (Karpicke & Blunt, 2011) shows that students who read once and recalled outperformed those who read four times. Engages the medial prefrontal cortex and hippocampus for memory integration.',
        instructions: `Do NOT simply summarize the topic "{topic}". Instead, generate a purely active testing session.
1. create 5 "Direct Recall" questions that test core facts.
2. Create 3 "Inference/Application" questions that require applying the concept to a novel scenario.
3. Place all answers at the very bottom of the response, separated by a distinct header, so I can test myself first.
4. If the topic allows, include a "Scenario Challenge" where I must solve a specific problem using the knowledge.`
    },
    'Distributed Practice': {
        name: 'Distributed Practice (Spaced Repetition)',
        effectiveness: 'High',
        effectSize: 'd = 0.71',
        description: 'Spreading study sessions across time intervals rather than massing practice.',
        mechanism: 'The "spacing effect" allows for some forgetting, which makes re-consolidation harder and thus stronger (consolidation facilitation).',
        bestFor: ['Long-term retention', 'Languages', 'Mathematics', 'Complex procedural knowledge'],
        scientificContext: 'Meta-analysis of 254 studies confirms this as one of the most robust learning effects in psychology. Optimal spacing for 7-day retention is 1 day; for long-term is ~21 days.',
        instructions: `Design a comprehensive Spaced Repetition Schedule for mastering "{topic}".
1. Break the topic into 4 distinct "Knowledge Chunks" suitable for separate sessions.
2. Create a schedule:
   - Day 0: Initial Learning (Deep dive into Chunk 1 & 2)
   - Day 1: First Review (Active recall of Chunk 1 & 2 + Learn Chunk 3)
   - Day 3: Second Review (Mix of all Chunks)
   - Day 7: Final Integration
3. For EACH session, define a specific "Active Output" task (e.g., "Draw a diagram from memory", "Solve 5 problems"), avoiding passive re-reading.`
    },
    'Feynman Technique': {
        name: 'Feynman Technique',
        effectiveness: 'High',
        effectSize: 'd > 0.70 (est)',
        description: 'Explaining complex concepts in simple language as if teaching a novice.',
        mechanism: 'Forces identification of knowledge gaps (metacognition) and simplifies cognitive schemas.',
        bestFor: ['Complex theory', 'Deep understanding', 'Identifying gaps', 'Interview prep'],
        scientificContext: 'Based on the "protégé effect" where teaching materials yields better retention than studying for a test. Simplification reduces cognitive load.',
        instructions: `Act as a rigorous Feynman Technique tutor for "{topic}".
1. First, provide a "Concept Simplification": Explain the core idea using only the 1000 most common words in English.
2. Use a concrete, everyday analogy to explain the mechanism.
3. Identify 3 common "Illusion of Competence" traps—specific nuances people usually misunderstand about this topic.
4. Challenge me: Ask me to explain a specific sub-component back to you as if I were teaching a 12-year-old.`
    },
    'Pomodoro': {
        name: 'Pomodoro Technique',
        effectiveness: 'Moderate',
        effectSize: 'd ≈ 0.60',
        description: 'Time-management using 25-minute focused work intervals followed by 5-minute breaks.',
        mechanism: 'Combats "cognitive drift" and fatigue. The pre-commitment to a short block reduces procrastination anxiety.',
        bestFor: ['Procrastination', 'Deep focus', 'Burnout prevention', 'Coding/Writing'],
        scientificContext: 'Studies show 20% lower fatigue and 59% improvement in focus duration. Aligns with human attention span limits (~25-30 mins).',
        instructions: `Create a structured Pomodoro Study Plan for "{topic}".
1. Break the topic into exactly 4 focused tasks that can each be done in 25 minutes.
2. Task 1: Foundation/Core Concepts.
3. Task 2: Deep Dive/Application.
4. Task 3: Practice/Testing.
5. Task 4: Synthesis/Review.
6. For each block, provide a specific "Definition of Done" criteria so I know exactly when to stop.`
    },
    'Mind Mapping': {
        name: 'Mind Mapping',
        effectiveness: 'High',
        effectSize: 'g = 0.73',
        description: 'Visual-spatial technique using nodes and branches to represent relationships.',
        mechanism: 'Utilizes "Dual Coding Theory"—combining verbal and visual processing to increase memory pathways.',
        bestFor: ['Visual learners', 'Brainstorming', 'Connecting ideas', 'Project planning'],
        scientificContext: 'Meta-analysis shows medium-to-large effects on critical thinking. Superior for long-term retention compared to text notes.',
        instructions: `Generate a hierarchical Mind Map structure for "{topic}".
1. **Central Node**: The Core Concept of "{topic}".
2. **Level 1 Branches** (Major Themes): Identify 5-7 distinct pillars of this topic.
3. **Level 2 Branches** (Details): For each pillar, list 3-4 keywords or sub-concepts.
4. **Connections**: Explicitly list 3 "Cross-Links" where branch A relates to branch B (e.g., "Concept X affects Concept Y because...").
5. Format this using indentation or a mermaid.js diagram script if possible.`
    },
    'Cornell Notes': {
        name: 'Cornell Notes',
        effectiveness: 'Moderate',
        effectSize: 'd ≈ 0.65',
        description: 'Systematic note-taking system with cues, detailed notes, and summaries.',
        mechanism: 'Promotes "active synthesis" and "question generation" during the note-taking process.',
        bestFor: ['Lecture notes', 'Textbook study', 'Review', 'History/Science'],
        scientificContext: 'Studies show Cornell users score 10-12% higher. Effectiveness comes from the required review/summarization steps.',
        instructions: `Generate a Cornell Note-taking scaffolding for "{topic}".
1. **Cue Column (Left)**: Generate 7-10 high-value "Test Questions" that cover the material (e.g., "Why does X happen?", "What is the relationship between Y and Z?").
2. **Notes Column (Right)**: Provide a structured, bulleted outline of the key facts corresponding to those questions.
3. **Summary (Bottom)**: Write a strict 3-sentence synthesis of the entire topic.
4. **Action Item**: Identify one concept that is "fuzzy" and requires re-reading.`
    },
    'Elaborative Interrogation': {
        name: 'Elaborative Interrogation',
        effectiveness: 'Moderate',
        effectSize: 'd = 0.60',
        description: 'generating explanations for explicitly stated facts, asking "Why?" and "How?".',
        mechanism: 'Integrates new information with existing prior knowledge, creating a "web" of understanding.',
        bestFor: ['Fact retention', 'Causal understanding', 'Science', 'History'],
        scientificContext: 'Highly effective (76% improvement) for factual learning. Works by leveraging the "why" curiosity to deepen encoding.',
        instructions: `Apply Elaborative Interrogation to "{topic}".
1. Identify 5 foundational facts or assertions about this topic.
2. For EACH fact, turn it into a "Why" or "How" question (e.g., "Why is it true that...?").
3. Provide a detailed, causal explanation for each, connecting it to *prior general knowledge*.
4. Point out a "Counter-Intuitive" aspect: something that seems wrong but is actually true, and explain why.`
    },
    'Interleaving': {
        name: 'Interleaving',
        effectiveness: 'Moderate',
        effectSize: 'd = 0.60',
        description: 'Mixing different topics or problem types during study.',
        mechanism: 'Improves "discriminative contrast"—learning to tell *which* strategy to use, not just *how* to use it.',
        bestFor: ['Math', 'Problem solving', 'Category discrimination', 'Physics'],
        scientificContext: 'Students often feel they are learning slower (performance dip) but retention and transfer are significantly higher (retention boost).',
        instructions: `Design an Interleaved Practice set for "{topic}".
1. Identify 2-3 *related but distinct* concepts that are easily confused with "{topic}" (e.g., if topic is "Permutations", include "Combinations").
2. Create a mixed list of 10 practice problems/scenarios where these concepts are shuffled randomly.
3. Do NOT label which concept applies to which problem.
4. Ask me to first *identify the correct strategy/concept* for each problem, before solving it.`
    },
    'Rereading': {
        name: 'Rereading (Passive Review)',
        effectiveness: 'Low',
        effectSize: 'd = 0.50',
        description: 'Reviewing text again. Generally less effective than active methods.',
        mechanism: 'Passive exposure. Can create "fluency illusion" (thinking you know it because it looks familiar).',
        bestFor: ['First pass reading', 'Low energy study', 'Basic familiarity'],
        scientificContext: 'Effect size is significantly lower than active recall. Useful only as a primer.',
        instructions: `Create a "Active Reading Guide" for "{topic}" to make rereading more effective.
1. Identify the 3 most complex paragraphs/sections that *require* re-reading.
2. For each section, provide a specific "Search Query": what specific answer should I be looking for?
3. Add a "Pause & Reflect" trigger: "After reading section X, close the book and recite the main point."`
    },
    'Highlighting': {
        name: 'Highlighting/Underlining',
        effectiveness: 'Low',
        effectSize: 'd = 0.44',
        description: 'Marking key concepts. Widespread but often ineffective.',
        mechanism: 'Can lead to "processing isolation"—focusing on individual items rather than relationships.',
        bestFor: ['First pass reading', 'Identifying keywords'],
        scientificContext: 'Often negatively correlated with performance if used excessively. Only effective if selective.',
        instructions: `Provide a textual summary of "{topic}" suitable for highlighting.
1. Write a 300-word overview.
2. BOLD only the top 10% most critical keywords (simulating effective highlighting).
3. Explain *why* you chose those specific words to highlight.
4. Warn me about 3 "Distractor Details"—interesting facts that are NOT core to the concept and should NOT be highlighted.`
    }
};
