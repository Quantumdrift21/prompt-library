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
        bestFor: ['Exam Prep', 'Memorization', 'Deep Understanding']
    },
    'Feynman': {
        icon: BookOpen,
        color: 'icon-3d-cyan',
        tagline: 'If you can\'t explain it simply, you don\'t understand it.',
        howItWorks: [
            'Explain the concept in simple terms.',
            'Identify areas where your explanation is shaky.',
            'Review source material to simplify further.'
        ],
        bestFor: ['Complex Concepts', 'Simplification', 'Teaching']
    },
    'Cornell': {
        icon: BookOpen,
        color: 'icon-3d-purple',
        tagline: 'Structured note-taking for efficient review.',
        howItWorks: [
            'Divide notes into Cues, Main Notes, and Summary.',
            'Record key points during study.',
            'Review by covering the notes and using cues.'
        ],
        bestFor: ['Lectures', 'Textbook Reading', 'Structured Review']
    },
    'Blurting': {
        icon: BookOpen,
        color: 'icon-3d-pink',
        tagline: 'Empty your brain to find what sticks.',
        howItWorks: [
            'Read a section of text.',
            'Close the book and write everything you remember.',
            'Compare with the text to find missing details.'
        ],
        bestFor: ['Fact Retention', 'History', 'Vocab']
    },
    'Leitner': {
        icon: BookOpen,
        color: 'icon-3d-green',
        tagline: 'Spaced repetition to hack your forgetting curve.',
        howItWorks: [
            'Use flashcards for key concepts.',
            'Review difficult cards more frequently.',
            'Move mastered cards to less frequent boxes.'
        ],
        bestFor: ['Long-term Retention', 'Languages', 'Definitions']
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
