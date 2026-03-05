import { useState } from 'react';
import './../../styles/components/swapbutton.css';

export default function SwapButton({ onSwap }) {
    const [rotated, setRotated] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setRotated(prev => !prev);
        onSwap();
    };

    return (
        <button
            type="button"
            className={`swap-button ${rotated ? 'is-rotated' : ''}`}
            onClick={handleClick}
            aria-label="Nereden ve nereye şehirlerini değiştir"
        >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 16L3 12M3 12L7 8M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 8L21 12M21 12L17 16M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
            </svg>
        </button>
    );
}
