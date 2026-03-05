import { useState } from 'react';
import CitySelect from './CitySelect';
import VehicleSelector from './VehicleSelector';
import FuelConfig from './FuelConfig';
import SwapButton from './SwapButton';
import Button from '../common/Button';
import { VEHICLE_TYPES } from '../../utils/constants';
import './../../styles/components/routeform.css';

export default function RouteForm({ onSubmit, loading }) {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [vehicleType, setVehicleType] = useState('car');
    const [fuelType, setFuelType] = useState('benzin');
    const [fuelConsumption, setFuelConsumption] = useState(7);

    const handleVehicleChange = (type) => {
        setVehicleType(type);
        const vehicle = VEHICLE_TYPES.find(v => v.value === type);
        if (vehicle) {
            setFuelConsumption(vehicle.defaultConsumption);
        }
    };

    const handleSwap = () => {
        console.log('Swapping:', from, '->', to);
        const temp = from;
        setFrom(to);
        setTo(temp);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!from || !to || !vehicleType) return;

        onSubmit({
            from,
            to,
            vehicleType,
            fuelType,
            fuelConsumption,
        });
    };

    const isValid = from && to && vehicleType;

    return (
        <section className="route-form-section" id="calculator">
            <div className="route-form-container glass-card">
                <h2 className="route-form-title">Rotanızı Hesaplayın</h2>

                <form onSubmit={handleSubmit} className="route-form">
                    {/* City Selection Row */}
                    <div className="route-form-cities">
                        <CitySelect
                            id="city-from"
                            label="Nereden"
                            value={from}
                            onChange={setFrom}
                            placeholder="İl veya ilçe ara..."
                        />
                        <SwapButton onSwap={handleSwap} />
                        <CitySelect
                            id="city-to"
                            label="Nereye"
                            value={to}
                            onChange={setTo}
                            placeholder="İl veya ilçe ara..."
                        />
                    </div>

                    {/* Vehicle Selector */}
                    <VehicleSelector value={vehicleType} onChange={handleVehicleChange} />

                    {/* Fuel Config */}
                    <FuelConfig
                        fuelType={fuelType}
                        onFuelTypeChange={setFuelType}
                        consumption={fuelConsumption}
                        onConsumptionChange={setFuelConsumption}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        disabled={!isValid}
                        ariaLabel="Maliyet hesapla"
                    >
                        <span className="btn-calc-icon">🔍</span>
                        HESAPLA
                    </Button>
                </form>
            </div>
        </section>
    );
}
