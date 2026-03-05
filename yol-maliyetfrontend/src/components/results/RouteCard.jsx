import Badge from '../common/Badge';
import TollList from './TollList';
import CostBreakdown from './CostBreakdown';
import SaveBadge from './SaveBadge';
import { ROUTE_LABELS } from '../../utils/constants';
import { formatCurrency, formatDistance, formatDuration, formatSpeed, formatFuel } from '../../utils/formatters';
import './../../styles/components/routecard.css';

export default function RouteCard({ route, index, fastestAvgCost }) {
    const labelInfo = ROUTE_LABELS[route.label] || ROUTE_LABELS.alternative;
    const { fuelDetails, tolls, tollCost, totalCostRange, distanceKm, durationMin, description } = route;

    // Calculate savings compared to fastest route
    const savings = route.label === 'cheapest' && fastestAvgCost
        ? fastestAvgCost - totalCostRange.avg
        : 0;

    return (
        <div
            className={`route-card route-card-${route.label}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Header Area */}
            <div className="route-card-header">
                <div className="route-card-header-main">
                    <div className="route-card-header-left">
                        <Badge label={labelInfo.label} variant={route.label} icon={labelInfo.icon} />
                        {savings > 0 && <SaveBadge amount={savings} />}
                    </div>
                    <p className="route-card-description">{description}</p>
                </div>

                {/* Stats Row */}
                <div className="route-card-stats">
                    <div className="route-stat" title="Mesafe">
                        <span className="route-stat-icon">📏</span>
                        <span className="route-stat-value">{formatDistance(distanceKm)}</span>
                    </div>
                    <div className="route-stat" title="Süre">
                        <span className="route-stat-icon">⏱️</span>
                        <span className="route-stat-value">{formatDuration(durationMin)}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid (Fuel & Tolls) */}
            <div className="route-card-main-grid">
                {/* Fuel Info */}
                <div className="route-cost-block">
                    <span className="route-cost-block-title">⛽ YAKIT MALİYETİ</span>
                    <span className="route-cost-block-value">{formatCurrency(fuelDetails?.avg?.fuelCost)}</span>
                    <span className="route-cost-block-detail">
                        {formatFuel(fuelDetails?.avg?.fuelUsed)} · {formatSpeed(fuelDetails?.averageSpeed)}
                    </span>
                </div>

                {/* Toll List Accordion */}
                <TollList tolls={tolls} />
            </div>

            {/* Cost Analytics & Range */}
            <div className="route-card-footer">
                {/* Cost Breakdown Chart (Visuals) */}
                {tollCost > 0 && fuelDetails?.avg && (
                    <CostBreakdown
                        fuelCost={fuelDetails.avg.fuelCost}
                        tollCost={tollCost}
                        totalCost={totalCostRange.avg}
                    />
                )}

                {/* Dynamic Range Bar */}
                <div className="route-card-range">
                    <div className="range-labels">
                        <span className="range-min">{formatCurrency(totalCostRange.min)}</span>
                        <span className="range-avg">
                            <span className="range-avg-marker">▲</span>
                            {formatCurrency(totalCostRange.avg)} <span style={{ fontSize: '0.6em', opacity: 0.6 }}>ORTALAMA</span>
                        </span>
                        <span className="range-max">{formatCurrency(totalCostRange.max)}</span>
                    </div>
                    <div className="range-bar">
                        <div
                            className="range-bar-fill"
                            style={{
                                '--fill-start': `${((totalCostRange.min / totalCostRange.max) * 100).toFixed(1)}%`,
                                '--fill-avg': `${((totalCostRange.avg / totalCostRange.max) * 100).toFixed(1)}%`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
