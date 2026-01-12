import { STUDY_METHODS, type StudyMethod } from '../../types/study';
import './MethodSelector.css';

interface MethodSelectorProps {
    value: StudyMethod;
    onChange: (method: StudyMethod) => void;
}

export const MethodSelector = ({ value, onChange }: MethodSelectorProps) => {
    return (
        <div className="study-method-selector">
            <label htmlFor="method-select" className="method-select-label">Study Method</label>
            <select
                id="method-select"
                className="method-select"
                value={value}
                onChange={(e) => onChange(e.target.value as StudyMethod)}
            >
                {Object.entries(STUDY_METHODS).map(([key, { label }]) => (
                    <option key={key} value={key}>
                        {label}
                    </option>
                ))}
            </select>

            <div className="method-description">
                {STUDY_METHODS[value].description}
            </div>
        </div>
    );
};
