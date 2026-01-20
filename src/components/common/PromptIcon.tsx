import React from 'react';
import {
    Terminal,
    Brain,
    Layers,
    MessageSquare,
    Sparkles,
    Code,
    PenTool,
    Ghost,
    Bot,
    Briefcase,
    Search,
    Database,
    FileText
} from 'lucide-react';
import './PromptIcon.css';

interface PromptIconProps {
    type: string;
    tags?: string[];
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const PromptIcon: React.FC<PromptIconProps> = ({
    type,
    tags = [],
    size = 'md',
    className = ''
}) => {
    // Normalize type
    const normalizedType = type?.toLowerCase().replace(/\s/g, '') || 'default';

    const getIcon = () => {
        // Check tags first for specific icons
        if (tags && tags.length > 0) {
            const lowerTags = tags.map(t => t.toLowerCase());

            if (lowerTags.includes('python') || lowerTags.includes('debugging')) return <Code />;
            if (lowerTags.includes('business') || lowerTags.includes('marketing')) return <Briefcase />;
            if (lowerTags.includes('seo')) return <Search />;
            if (lowerTags.includes('data') || lowerTags.includes('json') || lowerTags.includes('extraction')) return <Database />;
            if (lowerTags.includes('documentation') || lowerTags.includes('technical')) return <FileText />;
        }

        if (normalizedType.includes('system')) return <Terminal />;
        if (normalizedType.includes('chain')) return <Brain />; // Chain of Thought
        if (normalizedType.includes('few')) return <Layers />; // Few-Shot
        if (normalizedType.includes('role')) return <Ghost />; // Roleplay
        if (normalizedType.includes('coding') || normalizedType.includes('dev')) return <Code />;
        if (normalizedType.includes('write') || normalizedType.includes('blog')) return <PenTool />;
        if (normalizedType.includes('chat')) return <MessageSquare />;
        if (normalizedType.includes('assistant')) return <Bot />;
        return <Sparkles />;
    };

    // Determine color theme based on type (matching badges)
    const getThemeClass = () => {
        if (normalizedType.includes('system')) return 'theme-purple';
        if (normalizedType.includes('chain')) return 'theme-teal';
        if (normalizedType.includes('few')) return 'theme-green';
        if (normalizedType.includes('role')) return 'theme-pink';
        return 'theme-orange';
    };

    return (
        <div className={`prompt-icon prompt-icon--${size} ${getThemeClass()} ${className}`}>
            <div className="prompt-icon__inner">
                {getIcon()}
            </div>
        </div>
    );
};
