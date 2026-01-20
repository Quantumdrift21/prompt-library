export interface AIModel {
    id: string;
    label: string;
    family: 'OpenAI' | 'Anthropic' | 'Gemini' | 'xAI' | 'Meta' | 'Alibaba' | 'Mistral' | 'DeepSeek' | 'Cohere' | 'Other';
    // DeepSeek R1 and others have totally different structures, so we give them full control
    // role: the persona definition
    // task: the specific user request
    // context: the background info (technique instructions, scientific context)
    // constraints: format/style requirements
    template: (role: string, task: string, context: string, constraints: string) => string;
}

export const AI_MODELS: AIModel[] = [
    {
        id: 'gpt-5',
        label: 'OpenAI (GPT-5.x / 4o)',
        family: 'OpenAI',
        template: (role, task, context, constraints) => `[SYSTEM]
You are a senior ${role}.
Follow these rules:
- Always be accurate and explicit about uncertainty
- Prefer stepwise, structured thinking for non-trivial tasks
- Use markdown headings only when they add clarity

[USER]
### Task
${task}

### Context
${context}

### Requirements
${constraints}

Now do the task.`
    },
    {
        id: 'claude-3-5',
        label: 'Anthropic (Claude 3.5 Sonnet/Opus)',
        family: 'Anthropic',
        template: (role, task, context, constraints) => `<system>
You are Claude, an expert ${role}.

Core Rules:
1. Provide sourced, step-by-step analyses
2. Use professional yet concise tone
3. Always obey format and content constraints
4. For complex problems, use internal <thinking> before final answer
</system>

<user>
<task>
<objective>${task}</objective>
<constraints>
${constraints}
</constraints>
</task>

<context>
${context}
</context>

Now complete the task.
</user>`
    },
    {
        id: 'gemini-1-5',
        label: 'Google (Gemini 1.5 Pro/Flash)',
        family: 'Gemini',
        template: (role, task, context, constraints) => `<system_instruction>
You are an expert ${role}.
Constraints:
- Tone: precise, objective, professional
- Explain all assumptions
- Use markdown with H2/H3 headings
- If information is incomplete, state what's needed
</system_instruction>

<user>

## Context
${context}

## Task
Based on the information above:
${task}

## Constraints
${constraints}

If anything is unclear, ask clarifying questions before proceeding.

</user>`
    },
    {
        id: 'grok-2',
        label: 'xAI (Grok 2)',
        family: 'xAI',
        template: (role, task, context, constraints) => `System:
You are Grok, acting as a serious, detail-oriented ${role}.

Behavioral Rules:
- No humor or sarcasm unless explicitly requested
- Separate: "Confirmed facts" vs "Assumptions"
- Prefer concise, high-density explanations
- Always cite sources when making claims

User:
**Task**: ${task}

**Context**:
${context}

**Output Structure**:
1. Executive Summary
2. Detailed Analysis
3. Additional Requirements: ${constraints}
`
    },
    {
        id: 'llama-3',
        label: 'Meta (Llama 3.1 405B)',
        family: 'Meta',
        template: (role, task, context, constraints) => `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a helpful, precise ${role}.
Always explain trade-offs.
<|eot_id|><|start_header_id|>user<|end_header_id|>
Task: ${task}

Context:
${context}

Requirements:
${constraints}
<|eot_id|><|start_header_id|>assistant<|end_header_id|>`
    },
    {
        id: 'qwen-2-5',
        label: 'Alibaba (Qwen 2.5)',
        family: 'Alibaba',
        template: (role, task, context, constraints) => `System:
You are Qwen, an expert ${role} created by Alibaba Cloud.

Goals:
- Respond in the requested language
- Be explicit about assumptions and limitations
- Break complex problems into steps
- Verify reasoning before final answer

User:
**Task**: ${task}

**Context**:
${context}

**Constraints**:
${constraints}
`
    },
    {
        id: 'mistral-large',
        label: 'Mistral (Large 2)',
        family: 'Mistral',
        template: (role, task, context, constraints) => `System:
You are a meticulous ${role}. Follow instructions exactly.

User:
# Task
${task}

# Context
${context}

# Instructions
${constraints}

Validate all outputs before responding.
`
    },
    {
        id: 'deepseek-v3',
        label: 'DeepSeek (V3)',
        family: 'DeepSeek',
        template: (role, task, context, constraints) => `System:
You are a helpful AI assistant specializing in ${role}.
Be accurate, clear, and concise.

User:
Task: ${task}
Context: ${context}
Requirements: ${constraints}
`
    },
    {
        id: 'deepseek-r1',
        label: 'DeepSeek (R1 - Reasoning)',
        family: 'DeepSeek',
        // CRITICAL: R1 works best with NO system prompt and ZERO-SHOT.
        template: (role, task, context, constraints) => `[ROLE]
You are an advanced reasoning engine acting as ${role}.

[PROBLEM]
${task}

[CONTEXT]
${context}

[CONSTRAINTS]
${constraints}
- Use rigorous, formal reasoning
- Consider multiple interpretations if ambiguous
- Provide single final answer
- Show confidence level

[OUTPUT FORMAT]
Return JSON:
{
  "reasoning_summary": "<3-6 sentences of natural language reasoning>",
  "final_answer": "<the answer>",
  "confidence": "<low|medium|high>"
}
`
    },
    {
        id: 'cohere-command',
        label: 'Cohere (Command R+)',
        family: 'Cohere',
        template: (role, task, context, constraints) => `You are Command R+, an enterprise-grade assistant for ${role}.

Behavioral Rules:
- Be concise and businesslike
- Use bullet points only for lists; otherwise use prose
- Always include brief "Executive Summary"

User Message:
Task: ${task}

Context:
${context}

Requirements:
${constraints}
`
    }
];
