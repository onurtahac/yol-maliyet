import RouteCard from './RouteCard';
import Loader from '../common/Loader';
import { CITIES, VEHICLE_TYPES, FUEL_TYPES } from '../../utils/constants';
import './../../styles/components/resultspanel.css';

export default function ResultsPanel({ data, loading, error, activeRouteIndex, onRouteChange }) {
    if (loading) {
        return (
            <div className="results-panel loading">
                <Loader count={3} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="results-panel error">
                <div className="results-error glass-card">
                    <span className="results-error-icon">⚠️</span>
                    <p className="results-error-text">{error}</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { from, to, vehicleType, routes } = data;
    const vehicleLabel = VEHICLE_TYPES.find(v => v.value === vehicleType)?.label || vehicleType;
    const fromLabel = CITIES.find(c => c.value === from?.toLowerCase())?.label || from;
    const toLabel = CITIES.find(c => c.value === to?.toLowerCase())?.label || to;
    const fuelTypeLabel = routes?.[0]?.fuelDetails?.fuelTypeName || '';

    // Get fastest route avg cost for savings calculation
    const fastestRoute = routes?.find(r => r.label === 'fastest');
    const fastestAvgCost = fastestRoute?.totalCostRange?.avg;

    return (
        <section className="results-panel">
            {/* Results Header */}
            <div className="results-header">
                <h2 className="results-title">
                    <span className="results-route">{fromLabel}</span>
                    <span className="results-arrow">→</span>
                    <span className="results-route">{toLabel}</span>
                </h2>
                <div className="results-meta">
                    <span className="results-meta-item">{vehicleLabel}</span>
                    <span className="results-meta-divider">·</span>
                    <span className="results-meta-item">{fuelTypeLabel}</span>
                </div>
            </div>

            {/* Route Cards */}
            <div className="results-cards">
                {routes?.map((route, index) => (
                    <div
                        key={route.label}
                        onClick={() => onRouteChange(index)}
                        className={`route-card-wrapper ${index === activeRouteIndex ? 'active' : ''}`}
                    >
                        <RouteCard
                            route={route}
                            index={index}
                            fastestAvgCost={fastestAvgCost}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
