import './../../styles/components/loader.css';

export default function Loader({ count = 3 }) {
    return (
        <div className="skeleton-container" aria-busy="true" aria-label="Yükleniyor">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="skeleton-header">
                        <div className="skeleton-badge" />
                        <div className="skeleton-line skeleton-line-sm" />
                    </div>
                    <div className="skeleton-body">
                        <div className="skeleton-line skeleton-line-lg" />
                        <div className="skeleton-line skeleton-line-md" />
                        <div className="skeleton-stats">
                            <div className="skeleton-stat" />
                            <div className="skeleton-stat" />
                            <div className="skeleton-stat" />
                        </div>
                    </div>
                    <div className="skeleton-footer">
                        <div className="skeleton-bar" />
                    </div>
                </div>
            ))}
        </div>
    );
}
