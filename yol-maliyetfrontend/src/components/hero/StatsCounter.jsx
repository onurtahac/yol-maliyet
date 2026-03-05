import { useEffect, useState, useRef } from 'react';
import { HERO_STATS } from '../../utils/constants';
import './../../styles/components/statscounter.css';

export default function StatsCounter() {
    const [counts, setCounts] = useState(HERO_STATS.map(() => 0));
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    animateCounters();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [hasAnimated]);

    const animateCounters = () => {
        const duration = 2000;
        const fps = 60;
        const totalFrames = (duration / 1000) * fps;
        let frame = 0;

        const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);

            setCounts(HERO_STATS.map(stat => Math.round(eased * stat.value)));

            if (frame >= totalFrames) {
                clearInterval(timer);
                setCounts(HERO_STATS.map(stat => stat.value));
            }
        }, 1000 / fps);
    };

    return (
        <div className="stats-grid" ref={ref}>
            {HERO_STATS.map((stat, index) => (
                <div key={index} className="stat-card">
                    <span className="stat-card-icon">{stat.icon}</span>
                    <span className="stat-card-number">
                        {counts[index]}{stat.suffix}
                    </span>
                    <span className="stat-card-label">{stat.label}</span>
                </div>
            ))}
        </div>
    );
}
