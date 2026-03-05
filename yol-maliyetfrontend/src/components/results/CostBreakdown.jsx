import './../../styles/components/costbreakdown.css';
import { formatCurrency } from '../../utils/formatters';

export default function CostBreakdown({ fuelCost, tollCost, totalCost }) {
    const total = fuelCost + tollCost;
    const fuelPercent = total > 0 ? Math.round((fuelCost / total) * 100) : 0;
    const tollPercent = total > 0 ? 100 - fuelPercent : 0;

    // SVG donut chart values
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const fuelOffset = circumference - (circumference * fuelPercent) / 100;
    const tollOffset = circumference - (circumference * tollPercent) / 100;

    return (
        <div className="cost-breakdown">
            <h4 className="cost-breakdown-title">Maliyet Dağılımı</h4>
            <div className="cost-breakdown-content">
                <div className="cost-breakdown-chart">
                    <svg viewBox="0 0 200 200" className="donut-chart">
                        {/* Background circle */}
                        <circle
                            cx="100" cy="100" r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="20"
                        />
                        {/* Toll segment */}
                        {tollCost > 0 && (
                            <circle
                                cx="100" cy="100" r={radius}
                                fill="none"
                                stroke="#667eea"
                                strokeWidth="20"
                                strokeDasharray={circumference}
                                strokeDashoffset={tollOffset}
                                strokeLinecap="round"
                                transform="rotate(-90 100 100)"
                                className="donut-segment donut-toll"
                                style={{
                                    '--circumference': circumference,
                                    '--target-offset': tollOffset,
                                }}
                            />
                        )}
                        {/* Fuel segment */}
                        <circle
                            cx="100" cy="100" r={radius}
                            fill="none"
                            stroke="var(--color-accent)"
                            strokeWidth="20"
                            strokeDasharray={circumference}
                            strokeDashoffset={fuelOffset}
                            strokeLinecap="round"
                            transform={`rotate(${tollCost > 0 ? -90 + (tollPercent * 3.6) : -90} 100 100)`}
                            className="donut-segment donut-fuel"
                            style={{
                                '--circumference': circumference,
                                '--target-offset': fuelOffset,
                            }}
                        />
                        {/* Center text */}
                        <text x="100" y="92" textAnchor="middle" className="donut-total-label">Toplam</text>
                        <text x="100" y="115" textAnchor="middle" className="donut-total-value">
                            {formatCurrency(totalCost)}
                        </text>
                    </svg>
                </div>

                <div className="cost-breakdown-legend">
                    <div className="cost-legend-item">
                        <span className="cost-legend-dot cost-legend-fuel" />
                        <div className="cost-legend-info">
                            <span className="cost-legend-label">Yakıt</span>
                            <span className="cost-legend-value">{formatCurrency(fuelCost)}</span>
                        </div>
                        <span className="cost-legend-percent">{fuelPercent}%</span>
                    </div>
                    {tollCost > 0 && (
                        <div className="cost-legend-item">
                            <span className="cost-legend-dot cost-legend-toll" />
                            <div className="cost-legend-info">
                                <span className="cost-legend-label">Geçiş Ücreti</span>
                                <span className="cost-legend-value">{formatCurrency(tollCost)}</span>
                            </div>
                            <span className="cost-legend-percent">{tollPercent}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
