// src/services/dorkGeneratorService.ts

export interface DorkLink {
    label: string;
    description: string;
    url: string;
    icon: 'file-text' | 'presentation' | 'book-open' | 'users' | 'graduation-cap';
}

interface DorkTemplate {
    label: string;
    description: string;
    icon: DorkLink['icon'];
    query: (topic: string) => string;
}

const DORK_TEMPLATES: DorkTemplate[] = [
    {
        label: 'University PDFs',
        description: 'Find academic PDFs from .edu domains',
        icon: 'graduation-cap',
        query: (topic) => `filetype:pdf site:edu "${topic}"`
    },
    {
        label: 'Lecture Slides',
        description: 'Find PowerPoint presentations',
        icon: 'presentation',
        query: (topic) => `filetype:ppt OR filetype:pptx "${topic}" lecture OR notes`
    },
    {
        label: 'Course Syllabi',
        description: 'Find university course outlines',
        icon: 'book-open',
        query: (topic) => `filetype:pdf site:edu "${topic}" syllabus OR "course outline"`
    },
    {
        label: 'Research Papers',
        description: 'Find papers on Google Scholar',
        icon: 'file-text',
        query: (topic) => `site:scholar.google.com "${topic}"`
    },
    {
        label: 'Reddit Discussions',
        description: 'Find community recommendations',
        icon: 'users',
        query: (topic) => `site:reddit.com "best resource" OR "recommend" "${topic}"`
    }
];

export const dorkGeneratorService = {
    generateLinks(topic: string): DorkLink[] {
        if (!topic || topic.trim().length === 0) {
            return [];
        }
        const safeTopic = topic.trim();
        return DORK_TEMPLATES.map(template => ({
            label: template.label,
            description: template.description,
            icon: template.icon,
            url: `https://www.google.com/search?q=${encodeURIComponent(template.query(safeTopic))}`
        }));
    }
};
