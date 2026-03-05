import './../../styles/components/footer.css';

export default function Footer({ className }) {
    return (
        <footer className={`footer ${className || ''}`}>
            <div className="footer-bar-inner">
                <div className="footer-section main-brand">
                    <span className="footer-logo">🚗 Yol Ne Kadar<span className="footer-dot">?</span></span>
                    <span className="footer-tagline">Türkiye'nin ücretli yol maliyet hesaplayıcısı</span>
                </div>

                <div className="footer-section credits">
                    <span className="footer-copyright">
                        © {new Date().getFullYear()} Yol Ne Kadar? — Tüm hakları saklıdır.
                    </span>
                </div>

                <div className="footer-section disclaimer">
                    <span className="footer-disclaimer">
                        Fiyatlar tahmini olup gerçek maliyetler farklılık gösterebilir.
                    </span>
                </div>
            </div>
        </footer>
    );
}
