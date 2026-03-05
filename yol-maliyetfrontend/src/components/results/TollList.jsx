import { useState } from 'react';
import { TOLL_TYPE_ICONS } from '../../utils/constants';
import './../../styles/components/tolllist.css';

export default function TollList({ tolls }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!tolls || tolls.length === 0) {
        return (
            <div className="toll-list-empty">
                <span className="toll-list-empty-icon">✅</span>
                <span>Geçiş ücreti yok</span>
            </div>
        );
    }

    const totalCost = tolls.reduce((sum, toll) => sum + toll.price, 0);

    return (
        <div className="toll-list">
            <button
                className={`toll-list-toggle ${isOpen ? 'toll-list-toggle-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                aria-expanded={isOpen}
                aria-label="Geçiş ücretleri listesini aç/kapat"
            >
                <span className="toll-list-toggle-label">
                    <span className="toll-list-icon">🛣️</span>
                    Geçiş Ücretleri ({tolls.length})
                </span>
                <span className="toll-list-toggle-right">
                    <span className="toll-list-total price-small">{totalCost.toLocaleString('tr-TR')}₺</span>
                    <span className={`toll-list-chevron ${isOpen ? 'toll-list-chevron-open' : ''}`}>▾</span>
                </span>
            </button>

            {isOpen && (
                <div className="toll-list-items">
                    {tolls.map((toll, index) => (
                        <div key={toll.code || index} className="toll-item" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="toll-item-info">
                                <span className="toll-item-icon">{TOLL_TYPE_ICONS[toll.type] || '🛣️'}</span>
                                <div className="toll-item-details">
                                    <span className="toll-item-name">{toll.name}</span>
                                    <span className="toll-item-type">
                                        {toll.type === 'bridge' ? 'Köprü' : toll.type === 'tunnel' ? 'Tünel' : 'Otoyol'}
                                    </span>
                                </div>
                            </div>
                            <span className="toll-item-price price-small">{toll.price.toLocaleString('tr-TR')}₺</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
