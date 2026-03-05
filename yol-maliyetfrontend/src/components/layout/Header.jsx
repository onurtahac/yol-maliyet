import './../../styles/components/header.css';

export default function Header() {
    return (
        <header className="header">
            <div className="header-inner">
                <a href="/" className="header-logo" aria-label="Ana sayfa">
                    <span className="header-logo-icon">🚗</span>
                    <span className="header-logo-text">
                        Yol Ne Kadar<span className="header-logo-dot">?</span>
                    </span>
                </a>
                <nav className="header-nav">
                    <a href="#calculator" className="header-nav-link">Hesapla</a>
                </nav>
            </div>
        </header>
    );
}
