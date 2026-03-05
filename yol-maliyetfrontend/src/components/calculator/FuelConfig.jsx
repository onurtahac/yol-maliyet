import { FUEL_TYPES } from '../../utils/constants';
import './../../styles/components/fuelconfig.css';

export default function FuelConfig({ fuelType, onFuelTypeChange, consumption, onConsumptionChange }) {
    return (
        <div className="fuel-config">
            {/* Fuel Type Radio */}
            <div className="fuel-type-group">
                <label className="fuel-type-label">Yakıt Türü</label>
                <div className="fuel-type-options">
                    {FUEL_TYPES.map((fuel) => (
                        <label
                            key={fuel.value}
                            className="fuel-type-option"
                        >
                            <input
                                type="radio"
                                name="fuelType"
                                value={fuel.value}
                                checked={fuelType === fuel.value}
                                onChange={(e) => onFuelTypeChange(e.target.value)}
                                className="fuel-type-radio"
                            />
                            <span className="fuel-type-pill">{fuel.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Consumption Slider */}
            <div className="fuel-consumption-group">
                <div className="fuel-consumption-header">
                    <label className="fuel-consumption-label" htmlFor="fuel-consumption">Yakıt Tüketimi</label>
                    <span className="fuel-consumption-value">
                        {consumption.toFixed(1)} <span className="fuel-consumption-unit">L/100km</span>
                    </span>
                </div>
                <div className="fuel-slider-container">
                    <input
                        type="range"
                        id="fuel-consumption"
                        min="1"
                        max="50"
                        step="0.5"
                        value={consumption}
                        onChange={(e) => onConsumptionChange(parseFloat(e.target.value))}
                        className="fuel-slider"
                        aria-label={`Yakıt tüketimi: ${consumption} L/100km`}
                        style={{
                            '--slider-progress': `${((consumption - 1) / (50 - 1)) * 100}%`,
                        }}
                    />
                    <div className="fuel-slider-labels">
                        <span>1</span>
                        <span>50</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
