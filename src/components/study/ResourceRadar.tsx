// src/components/study/ResourceRadar.tsx
import { Radar, FileText, Presentation, BookOpen, Users, GraduationCap, ExternalLink } from 'lucide-react';
import { dorkGeneratorService, type DorkLink } from '../../services/dorkGeneratorService';
import './ResourceRadar.css';

interface ResourceRadarProps {
    topic: string;
}

const ICON_MAP = {
    'file-text': FileText,
    'presentation': Presentation,
    'book-open': BookOpen,
    'users': Users,
    'graduation-cap': GraduationCap
};

export const ResourceRadar = ({ topic }: ResourceRadarProps) => {
    const links: DorkLink[] = dorkGeneratorService.generateLinks(topic);

    return (
        <div className="resource-radar">
            <div className="radar-header">
                <Radar size={18} className="icon-3d icon-3d-cyan" />
                <h3>Resource Radar</h3>
            </div>
            {links.length > 0 ? (
                <div className="radar-links">
                    {links.map((link, index) => {
                        const IconComponent = ICON_MAP[link.icon];
                        return (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="radar-link"
                            >
                                <IconComponent size={18} className="radar-link-icon" />
                                <div className="radar-link-content">
                                    <div className="radar-link-label">{link.label}</div>
                                    <div className="radar-link-desc">{link.description}</div>
                                </div>
                                <ExternalLink size={14} style={{ opacity: 0.5 }} />
                            </a>
                        );
                    })}
                </div>
            ) : (
                <p className="radar-empty">Enter a topic to find resources</p>
            )}
        </div>
    );
};
