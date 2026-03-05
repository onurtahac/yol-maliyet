import './../../styles/components/savebadge.css';
import { formatCurrency } from '../../utils/formatters';

export default function SaveBadge({ amount }) {
    if (!amount || amount <= 0) return null;

    return (
        <span className="save-badge">
            <span className="save-badge-icon">💚</span>
            <span className="save-badge-text">{formatCurrency(Math.round(amount))} TASARRUF!</span>
        </span>
    );
}
