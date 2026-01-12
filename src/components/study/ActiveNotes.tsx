import { FileEdit, Download, Copy } from 'lucide-react';
import './ActiveNotes.css';

interface ActiveNotesProps {
    content: string;
    onChange: (content: string) => void;
    onCopyFromPreview: () => void;
}

export const ActiveNotes = ({ content, onChange, onCopyFromPreview }: ActiveNotesProps) => {
    return (
        <div className="active-notes">
            <div className="notes-header">
                <h2><FileEdit className="icon-3d icon-3d-purple" style={{ marginRight: 8, verticalAlign: 'middle' }} /> Active Notes</h2>
                <div className="notes-actions">
                    <button
                        className="btn-icon"
                        onClick={onCopyFromPreview}
                        title="Copy Prompt to Notes"
                    >
                        <Download size={16} style={{ marginRight: 4 }} /> Import Prompt
                    </button>
                    <button
                        className="btn-icon"
                        onClick={() => navigator.clipboard.writeText(content)}
                        title="Copy Notes to Clipboard"
                    >
                        <Copy size={16} />
                    </button>
                </div>
            </div>

            <textarea
                className="notes-textarea"
                placeholder="Synthesize your learnings here. Use this space to rewrite answers in your own words..."
                value={content}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};
