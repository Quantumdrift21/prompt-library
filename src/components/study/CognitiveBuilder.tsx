import { useState, useEffect } from 'react';
import { BrainCircuit, ChevronDown, ChevronRight, Cpu } from 'lucide-react';
import type { StudySessionData, KnowledgeLevel, StudyGoal, StudyMethod } from '../../types/study';
import { MethodSelector } from './MethodSelector';
import { studyPromptService } from '../../services/studyPromptService';
import { AI_MODELS } from '../../data/aiModels';
import './CognitiveBuilder.css';

interface CognitiveBuilderProps {
    onSessionChange: (data: StudySessionData) => void;
}

export const CognitiveBuilder = ({ onSessionChange }: CognitiveBuilderProps) => {
    const [topic, setTopic] = useState('');
    const [method, setMethod] = useState<StudyMethod>('Feynman Technique');
    const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>('Beginner');
    const [aiModel, setAiModel] = useState<string>(AI_MODELS[0].id);
    const [goal, setGoal] = useState<StudyGoal>('Summarize');
    const [isAdvanced, setIsAdvanced] = useState(false);

    const [generatedPrompt, setGeneratedPrompt] = useState('');

    // Update prompt whenever inputs change
    useEffect(() => {
        const data: StudySessionData = {
            topic,
            method,
            knowledgeLevel,
            goal,
            aiModel,
            generatedPrompt: '',
            activeNotes: '' // Not managed here, but part of the contract
        };

        const prompt = studyPromptService.generateMetaPrompt(data);
        setGeneratedPrompt(prompt);

        // Notify parent
        onSessionChange({ ...data, generatedPrompt: prompt });
    }, [topic, method, knowledgeLevel, goal, aiModel, onSessionChange]);

    return (
        <div className="cognitive-builder">
            <div className="builder-header">
                <h2>
                    <span className="header-icon-wrapper icon-3d-cyan">
                        <BrainCircuit size={20} />
                    </span>
                    Cognitive Builder
                </h2>
            </div>

            {/* Main Topic Input */}
            <div className="form-group">
                <label className="form-label">Topic</label>
                <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Quantum Entanglement"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />
            </div>

            {/* AI Model Selector - New Addition */}
            <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={14} className="text-secondary" />
                    Target AI Model
                </label>
                <select
                    className="form-input"
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                >
                    {AI_MODELS.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Method Selector */}
            <MethodSelector value={method} onChange={setMethod} />

            {/* Advanced Toggle */}
            <button
                className="toggle-advanced"
                onClick={() => setIsAdvanced(!isAdvanced)}
            >
                {isAdvanced ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span style={{ marginLeft: 6 }}>{isAdvanced ? 'Hide Parameters' : 'Show Parameters'}</span>
            </button>

            {/* Advanced Fields */}
            {isAdvanced && (
                <div className="advanced-fields fade-in">
                    <div className="form-group">
                        <label className="form-label">Knowledge Level</label>
                        <select
                            className="form-input"
                            value={knowledgeLevel}
                            onChange={(e) => setKnowledgeLevel(e.target.value as KnowledgeLevel)}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                        <label className="form-label">Goal</label>
                        <select
                            className="form-input"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value as StudyGoal)}
                        >
                            <option value="Summarize">Summarize</option>
                            <option value="Quiz Me">Quiz Me</option>
                            <option value="Deep Dive">Deep Dive</option>
                            <option value="Find Gaps">Find Gaps</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Preview */}
            <div className="prompt-preview">
                <span className="preview-label">Generated Meta-Prompt</span>
                <div className="preview-content">
                    {topic ? generatedPrompt : '(Enter a topic to see the prompt...)'}
                </div>
            </div>
        </div>
    );
};
