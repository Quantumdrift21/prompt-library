import type { Collection } from '../../services/dashboardService';
import './CollectionsCard.css';

interface CollectionsCardProps {
    collections: Collection[];
}

export const CollectionsCard = ({ collections }: CollectionsCardProps) => {
    return (
        <div className="collections-card">
            <div className="collections-card__header">
                <h3 className="collections-card__title">Popular Collections</h3>
                <button className="collections-card__view-all">See All</button>
            </div>

            <div className="collections-card__items">
                {collections.map((collection) => (
                    <div
                        key={collection.id}
                        className={`collections-card__item collections-card__item--${collection.color}`}
                    >
                        <div className="collections-card__item-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>

                        <div className="collections-card__item-info">
                            <span className="collections-card__item-name">{collection.name}</span>
                            <span className="collections-card__item-count">
                                {collection.promptCount} prompts
                            </span>
                        </div>

                        <button className="collections-card__item-btn">View</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
