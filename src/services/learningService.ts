/**
 * Learning Service - Manages lesson progress persistence.
 * Uses localStorage for offline-first storage.
 */

import { lessons } from '../data/lessons';

// --- Types ---

export interface LessonProgress {
    lessonId: string;
    currentQuestionIndex: number;
    answeredQuestions: Set<string>;
    correctAnswers: Set<string>;
    score: number;
    startedAt: string;
    completedAt: string | null;
}

export interface LearningProgress {
    userId: string;
    level: number;
    levelName: string;
    totalScore: number;
    highScore: number;
    currentStreak: number;
    longestStreak: number;
    lastPlayedAt: string | null;
    completedLessons: string[];
    lessonProgress: Record<string, LessonProgress>;
}

// --- Level Definitions ---

const LEVELS = [
    { minScore: 0, name: 'Beginner' },
    { minScore: 50, name: 'Novice' },
    { minScore: 150, name: 'Apprentice' },
    { minScore: 300, name: 'Intermediate' },
    { minScore: 500, name: 'Advanced' },
    { minScore: 750, name: 'Expert' },
    { minScore: 1000, name: 'Master' },
];

// --- Storage Keys ---

const STORAGE_KEY = 'learning_progress';

// --- Helper Functions ---

/**
 * Calculates level based on total score.
 */
const calculateLevel = (totalScore: number): { level: number; levelName: string } => {
    let level = 1;
    let levelName = LEVELS[0].name;

    for (let i = 0; i < LEVELS.length; i++) {
        if (totalScore >= LEVELS[i].minScore) {
            level = i + 1;
            levelName = LEVELS[i].name;
        }
    }

    return { level, levelName };
};

/**
 * Calculates streak based on last played date.
 */
const calculateStreak = (lastPlayedAt: string | null, currentStreak: number): number => {
    if (!lastPlayedAt) return 0;

    const lastPlayed = new Date(lastPlayedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset streak if last played was more than a day ago
    const lastPlayedDate = lastPlayed.toDateString();
    const todayDate = today.toDateString();
    const yesterdayDate = yesterday.toDateString();

    if (lastPlayedDate === todayDate || lastPlayedDate === yesterdayDate) {
        return currentStreak;
    }

    return 0;
};

/**
 * Gets the default learning progress.
 */
const getDefaultProgress = (): LearningProgress => ({
    userId: 'local',
    level: 1,
    levelName: 'Beginner',
    totalScore: 0,
    highScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedAt: null,
    completedLessons: [],
    lessonProgress: {},
});

/**
 * Serializes progress for localStorage (handles Sets).
 */
const serializeProgress = (progress: LearningProgress): string => {
    const serializable = {
        ...progress,
        lessonProgress: Object.fromEntries(
            Object.entries(progress.lessonProgress).map(([key, lp]) => [
                key,
                {
                    ...lp,
                    answeredQuestions: Array.from(lp.answeredQuestions),
                    correctAnswers: Array.from(lp.correctAnswers),
                },
            ])
        ),
    };
    return JSON.stringify(serializable);
};

/**
 * Deserializes progress from localStorage.
 */
const deserializeProgress = (data: string): LearningProgress => {
    const parsed = JSON.parse(data);
    return {
        ...parsed,
        lessonProgress: Object.fromEntries(
            Object.entries(parsed.lessonProgress || {}).map(([key, lp]: [string, any]) => [
                key,
                {
                    ...lp,
                    answeredQuestions: new Set(lp.answeredQuestions || []),
                    correctAnswers: new Set(lp.correctAnswers || []),
                },
            ])
        ),
    };
};

// --- Service ---

export const learningService = {
    /**
     * Gets the current learning progress.
     */
    getProgress(): LearningProgress {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return getDefaultProgress();

            const progress = deserializeProgress(stored);
            // Recalculate streak based on last played date
            progress.currentStreak = calculateStreak(progress.lastPlayedAt, progress.currentStreak);
            return progress;
        } catch (error) {
            console.error('Failed to get learning progress:', error);
            return getDefaultProgress();
        }
    },

    /**
     * Saves learning progress.
     */
    saveProgress(progress: LearningProgress): void {
        try {
            localStorage.setItem(STORAGE_KEY, serializeProgress(progress));
        } catch (error) {
            console.error('Failed to save learning progress:', error);
        }
    },

    /**
     * Starts or resumes a lesson.
     */
    startLesson(lessonId: string): LessonProgress {
        const progress = this.getProgress();

        if (!progress.lessonProgress[lessonId]) {
            progress.lessonProgress[lessonId] = {
                lessonId,
                currentQuestionIndex: 0,
                answeredQuestions: new Set(),
                correctAnswers: new Set(),
                score: 0,
                startedAt: new Date().toISOString(),
                completedAt: null,
            };
        }

        this.saveProgress(progress);
        return progress.lessonProgress[lessonId];
    },

    /**
     * Records an answer for a question.
     */
    answerQuestion(
        lessonId: string,
        questionId: string,
        isCorrect: boolean,
        points: number
    ): LearningProgress {
        const progress = this.getProgress();
        const lessonProgress = progress.lessonProgress[lessonId];

        if (!lessonProgress) {
            throw new Error(`Lesson ${lessonId} not started`);
        }

        // Only score if not already answered
        if (!lessonProgress.answeredQuestions.has(questionId)) {
            lessonProgress.answeredQuestions.add(questionId);

            if (isCorrect) {
                lessonProgress.correctAnswers.add(questionId);
                lessonProgress.score += points;
                progress.totalScore += points;

                // Update streak
                const today = new Date().toDateString();
                const lastPlayed = progress.lastPlayedAt
                    ? new Date(progress.lastPlayedAt).toDateString()
                    : null;

                if (lastPlayed !== today) {
                    progress.currentStreak += 1;
                    if (progress.currentStreak > progress.longestStreak) {
                        progress.longestStreak = progress.currentStreak;
                    }
                }
            }

            // Update high score
            if (progress.totalScore > progress.highScore) {
                progress.highScore = progress.totalScore;
            }

            // Update level
            const { level, levelName } = calculateLevel(progress.totalScore);
            progress.level = level;
            progress.levelName = levelName;

            // Update last played
            progress.lastPlayedAt = new Date().toISOString();
        }

        this.saveProgress(progress);
        return progress;
    },

    /**
     * Moves to the next question.
     */
    nextQuestion(lessonId: string): number {
        const progress = this.getProgress();
        const lessonProgress = progress.lessonProgress[lessonId];
        const lesson = lessons.find(l => l.id === lessonId);

        if (!lessonProgress || !lesson) {
            return 0;
        }

        const nextIndex = lessonProgress.currentQuestionIndex + 1;
        if (nextIndex < lesson.questions.length) {
            lessonProgress.currentQuestionIndex = nextIndex;
        }

        this.saveProgress(progress);
        return lessonProgress.currentQuestionIndex;
    },

    /**
     * Completes a lesson.
     */
    completeLesson(lessonId: string): LearningProgress {
        const progress = this.getProgress();
        const lessonProgress = progress.lessonProgress[lessonId];

        if (lessonProgress && !lessonProgress.completedAt) {
            lessonProgress.completedAt = new Date().toISOString();

            if (!progress.completedLessons.includes(lessonId)) {
                progress.completedLessons.push(lessonId);
            }
        }

        this.saveProgress(progress);
        return progress;
    },

    /**
     * Gets summary stats for dashboard display.
     */
    getDashboardStats(): {
        level: number;
        levelName: string;
        percentComplete: number;
        highScore: number;
        currentStreak: number;
    } {
        const progress = this.getProgress();

        // Calculate total possible progress
        const totalQuestions = lessons.reduce((sum, l) => sum + l.questions.length, 0);
        const answeredQuestions = Object.values(progress.lessonProgress).reduce(
            (sum, lp) => sum + lp.answeredQuestions.size,
            0
        );

        const percentComplete = totalQuestions > 0
            ? Math.round((answeredQuestions / totalQuestions) * 100)
            : 0;

        return {
            level: progress.level,
            levelName: progress.levelName,
            percentComplete,
            highScore: progress.highScore,
            currentStreak: progress.currentStreak,
        };
    },

    /**
     * Resets all learning progress.
     */
    resetProgress(): void {
        localStorage.removeItem(STORAGE_KEY);
    },
};
