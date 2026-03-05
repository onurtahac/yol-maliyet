import { VEHICLE_TYPES } from '../../utils/constants';
import './../../styles/components/vehicleselector.css';

export default function VehicleSelector({ value, onChange }) {
    return (
        <div className="vehicle-selector">
            <label className="vehicle-selector-label">Araç Tipi</label>
            <div className="vehicle-grid">
                {VEHICLE_TYPES.map((vehicle) => (
                    <button
                        key={vehicle.value}
                        className={`vehicle-card ${value === vehicle.value ? 'vehicle-card-selected' : ''}`}
                        onClick={() => onChange(vehicle.value)}
                        aria-label={`${vehicle.label} seç`}
                        aria-pressed={value === vehicle.value}
                        type="button"
                    >
                        <span className="vehicle-card-icon">{vehicle.icon}</span>
                        <span className="vehicle-card-label">{vehicle.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
