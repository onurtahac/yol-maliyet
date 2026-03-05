import './../../styles/components/badge.css';

export default function Badge({ label, variant = 'default', icon, pulse = false, className = '' }) {
    return (
        <span className={`badge badge-${variant} ${pulse ? 'badge-pulse' : ''} ${className}`}>
            {icon && <span className="badge-icon">{icon}</span>}
            {label}
        </span>
    );
}
