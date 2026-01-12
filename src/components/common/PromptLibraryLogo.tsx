
import './PromptLibraryLogo.css';

interface PromptLibraryLogoProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export const PromptLibraryLogo = ({ size = 'medium', className = '' }: PromptLibraryLogoProps) => {
    const getSizeClass = () => {
        switch (size) {
            case 'small': return 'text-sm px-6 py-2';
            case 'large': return 'text-2xl px-12 py-5';
            default: return 'text-base px-10 py-3';
        }
    };

    return (
        <div className={`logo-tech-container ${getSizeClass()} ${className}`}>
            <span className="logo-tech-text">
                <span className="text-orange">Prompt_</span>
                <span className="text-teal">Library</span>
                <span className="logo-tech-cursor">_</span>
            </span>
        </div>
    );
};
