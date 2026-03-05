import StatsCounter from './StatsCounter';
import '../../styles/components/herosection.css';

export default function HeroSection() {
    return (
        <section className="hero-section">
            {/* Background decorations */}
            <div className="hero-grid" aria-hidden="true" />
            <div className="hero-road-line" aria-hidden="true" />

            {/* Content */}
            <div className="hero-content">
                <span className="hero-floating-icon" aria-hidden="true">🚗</span>

                <h1 className="hero-title">
                    <span className="hero-title-main">Yol Ne Kadar<span className="hero-title-dot">?</span></span>
                </h1>

                <p className="hero-subtitle">
                    Türkiye'deki otoyol, köprü ve tünel geçiş ücretlerini + yakıt maliyetini
                    anında hesaplayın.
                </p>

                <StatsCounter />
            </div>

            {/* Scroll indicator */}
            <div className="hero-scroll" aria-hidden="true">
                <span className="hero-scroll-text">Keşfet</span>
                <div className="hero-scroll-line" />
            </div>
        </section>
    );
}
