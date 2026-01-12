-- =====================================================
-- Public Prompts Table Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =====================================================

-- Create public_prompts table for guest-visible prompts
CREATE TABLE IF NOT EXISTS public_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    preview TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'System Prompt',
    model TEXT NOT NULL DEFAULT 'GPT-4',
    tokens INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    fork_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    author_name TEXT DEFAULT 'Community',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for search
CREATE INDEX IF NOT EXISTS idx_public_prompts_title ON public_prompts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_public_prompts_tags ON public_prompts USING gin(tags);

-- Enable RLS
ALTER TABLE public_prompts ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth required)
CREATE POLICY "Public prompts are viewable by everyone"
    ON public_prompts FOR SELECT
    USING (true);

-- =====================================================
-- Seed Sample Data
-- =====================================================

INSERT INTO public_prompts (title, preview, content, type, model, tokens, rating, rating_count, fork_count, tags) VALUES
('Socratic Python Tutor', 
 'Act as a senior Python engineer. When the user provides code, do not give the answer immediately. Instead, ask guiding questions...', 
 'You are a senior Python engineer with 15 years of experience. When a user shows you code with a problem, do NOT immediately provide the solution. Instead, use the Socratic method to help them discover the issue themselves. Ask questions like: "What do you expect this line to do?" "Have you checked the value of X at this point?" Guide them to the answer.', 
 'System Prompt', 'GPT-4', 450, 4.9, 120, 85, ARRAY['Education', 'Python', 'Debugging']),

('SEO Blog Post Generator', 
 'You are an expert SEO content writer. Generate a comprehensive blog post outline with H1, H2, H3 headers optimized for...', 
 'You are an expert SEO content strategist. Generate blog post outlines optimized for search engines. Include: primary keyword in H1, secondary keywords in H2s, long-tail variations in H3s. Add meta description, estimated word count, and internal linking opportunities.', 
 'Chain-of-Thought', 'Claude 3.5', 380, 4.7, 89, 62, ARRAY['Marketing', 'SEO', 'Writing']),

('Code Review Assistant', 
 'Analyze the provided code for: 1) Security vulnerabilities, 2) Performance issues, 3) Best practice violations...', 
 'You are a code review expert. Analyze code systematically for: 1) Security vulnerabilities (injection, XSS, auth issues), 2) Performance bottlenecks (N+1 queries, memory leaks), 3) Best practice violations (SOLID, DRY, naming). Provide severity ratings and specific fix suggestions.', 
 'System Prompt', 'GPT-4', 520, 4.8, 156, 112, ARRAY['Development', 'Security', 'Review']),

('Data Extraction Pipeline', 
 'Extract structured data from unstructured text. Return valid JSON with the following schema: { entities: [], relations: [] }...', 
 'Extract entities and relationships from text. Return JSON: { "entities": [{"name": "", "type": "", "confidence": 0.0}], "relations": [{"source": "", "target": "", "type": ""}] }. Identify people, organizations, locations, dates, and monetary values.', 
 'Few-Shot', 'Claude 3.5', 290, 4.6, 67, 41, ARRAY['Data', 'JSON', 'Extraction']),

('Technical Documentation Writer', 
 'Generate clear, maintainable documentation for the provided code. Include: Overview, API reference, Usage examples...', 
 'Create comprehensive technical documentation. Structure: 1) Overview (purpose, prerequisites), 2) Installation, 3) Quick Start, 4) API Reference (functions, params, returns), 5) Examples, 6) Troubleshooting. Use clear language, code blocks, and organized headings.', 
 'System Prompt', 'GPT-4', 410, 4.5, 98, 73, ARRAY['Documentation', 'Technical', 'Writing']),

('Persona Roleplay Engine', 
 'You are [CHARACTER_NAME]. Respond in character at all times. Maintain personality traits: [TRAITS]. Never break character...', 
 'Roleplay framework for character personas. Replace [CHARACTER_NAME] and [TRAITS] with specifics. Maintain consistent voice, vocabulary, and mannerisms. Reference character background when relevant. Never acknowledge being an AI while in character.', 
 'Roleplay', 'Llama 3', 180, 4.4, 234, 189, ARRAY['Roleplay', 'Creative', 'Persona']);
