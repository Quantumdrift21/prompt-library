import React from 'react';
import type { StudyMethod } from '../../types/study';
import { BookOpen } from 'lucide-react';
import './MethodDescription.css';

interface MethodSidebarProps {
    method: StudyMethod;
}

const METHOD_DETAILS: Record<StudyMethod, {
    icon: React.ElementType;
    color: string;
    tagline: string;
    howItWorks: string[];
    bestFor: string[];
}> = {
    'Active Recall': {
        icon: BookOpen,
        color: 'icon-3d-orange',
        tagline: 'Test your memory, don\'t just reread.',
        howItWorks: [
            'Generate questions based on your topic.',
            'Attempt to answer them without looking at notes.',
            'Review the answers to identify gaps.'
        ],
        bestFor: ['Exam Prep', 'Memorization', 'Long-term Retention']
    },
    'Feynman Technique': {
        icon: BookOpen,
        color: 'icon-3d-cyan',
        tagline: 'If you can\'t explain it simply, you don\'t understand it.',
        howItWorks: [
            'Explain the concept in simple terms (as if to a child).',
            'Identify areas where your explanation falters.',
            'Review source material to simplify further.'
        ],
        bestFor: ['Complex Concepts', 'Deep Understanding', 'Identifying Gaps']
    },
    'Cornell Notes': {
        icon: BookOpen,
        color: 'icon-3d-purple',
        tagline: 'Structured note-taking for efficient review.',
        howItWorks: [
            'Divide notes into Cues (Left), Notes (Right), Summary (Bottom).',
            'Record key points in the main area.',
            'After class, write questions in the cue column and summarize.'
        ],
        bestFor: ['Lectures', 'Textbook Reading', 'Structured Review']
    },
    'Distributed Practice': {
        icon: BookOpen,
        color: 'icon-3d-green',
        tagline: 'Space your study to hack the forgetting curve.',
        howItWorks: [
            'Study material in short sessions over many days.',
            'Increase intervals between reviews (1 day, 3 days, 1 week).',
            'Focus on older material that is about to be forgotten.'
        ],
        bestFor: ['Long-term Retention', 'Languages', 'Definitions']
    },
    'Pomodoro': {
        icon: BookOpen,
        color: 'icon-3d-pink',
        tagline: 'Focus intensely, then rest.',
        howItWorks: [
            'Set a timer for 25 minutes of deep work.',
            'Take a 5-minute break completely away from work.',
            'After 4 cycles, take a longer 15-30 minute break.'
        ],
        bestFor: ['Procrastination', 'Burnout Prevention', 'Coding']
    },
    'Mind Mapping': {
        icon: BookOpen,
        color: 'icon-3d-cyan',
        tagline: 'Visualize connections between ideas.',
        howItWorks: [
            'Start with the main concept in the center.',
            'Branch out into major themes.',
            'Use keywords and images to connect related sub-ideas.'
        ],
        bestFor: ['Visual Learners', 'Brainstorming', 'Overviews']
    },
    'Elaborative Interrogation': {
        icon: BookOpen,
        color: 'icon-3d-orange',
        tagline: 'Ask "Why?" until you understand the core.',
        howItWorks: [
            'Take a statement of fact.',
            'Ask yourself "Why is this true?" or "How does this work?".',
            'Generate an explanation connecting it to what you already know.'
        ],
        bestFor: ['Deep Facts', 'Causal Relationships', 'Science']
    },
    'Interleaving': {
        icon: BookOpen,
        color: 'icon-3d-purple',
        tagline: 'Mix it up to learn strategies, not just rote steps.',
        howItWorks: [
            'Mix different types of problems in one session.',
            'Force yourself to identifying the CORRECT strategy first.',
            'Avoid doing "blocks" of the same problem type.'
        ],
        bestFor: ['Math', 'Physics', 'Problem Solving']
    },
    'Rereading': {
        icon: BookOpen,
        color: 'icon-3d-gray',
        tagline: 'Good for familiarity, bad for mastery.',
        howItWorks: [
            'Review the text again.',
            'Use only for initial exposure or very difficult passages.',
            'Combine with active methods for actual learning.'
        ],
        bestFor: ['First Exposure', 'Low Energy', 'Basic Review']
    },
    'Highlighting': {
        icon: BookOpen,
        color: 'icon-3d-gray',
        tagline: 'Use sparingly to mark key signposts.',
        howItWorks: [
            'Read the text first without marking.',
            'Go back and mark only the top 10% critical info.',
            'Never highlight without understanding first.'
        ],
        bestFor: ['First Pass', 'Identifying Keywords']
    }
};

export const MethodSidebar: React.FC<MethodSidebarProps> = ({ method }) => {
    const details = METHOD_DETAILS[method];

    if (!details) {
        return <div className="method-description">Unknown Method: {method}</div>;
    }

    const Icon = details.icon;

    return (
        <div className="method-description">
            <div className="method-header">
                <div className={`method-icon-wrapper ${details.color}`}>
                    <Icon size={24} className="icon-3d" />
                </div>
                <h3>{method}</h3>
            </div>

            <p className="method-tagline">{details.tagline}</p>

            <div className="method-section">
                <h4>How it works</h4>
                <ul>
                    {details.howItWorks.map((step, i) => (
                        <li key={i}>{step}</li>
                    ))}
                </ul>
            </div>

            <div className="method-section">
                <h4>Best For</h4>
                <div className="tags-container">
                    {details.bestFor.map((tag, i) => (
                        <span key={i} className="method-tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};
