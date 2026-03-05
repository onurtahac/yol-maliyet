import { useState, useRef, useEffect, useCallback } from 'react';
import { searchLocations, searchDistricts } from '../../services/turkiyeApi';
import { useDebounce } from '../../hooks/useDebounce';
import './../../styles/components/cityselect.css';

export default function CitySelect({ value, onChange, label, placeholder = 'İl veya ilçe ara...', id }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const debouncedSearch = useDebounce(search, 250);

    // Fetch results when debounced search changes
    useEffect(() => {
        if (!debouncedSearch || debouncedSearch.trim().length < 1) {
            setResults([]);
            return;
        }

        let cancelled = false;
        setLoading(true);

        searchLocations(debouncedSearch)
            .then((data) => {
                if (!cancelled) {
                    setResults(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setResults([]);
                    setLoading(false);
                }
            });

        return () => { cancelled = true; };
    }, [debouncedSearch]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = useCallback((result) => {
        onChange(result.value);
        setSelectedLabel(result.label);
        setIsOpen(false);
        setSearch('');
        setResults([]);
    }, [onChange]);

    const handleInputClick = () => {
        setIsOpen(true);
        setSearch('');
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setSearch('');
        }
    };

    // Update label when value changes externally (e.g. swap)
    useEffect(() => {
        if (value) {
            setSelectedLabel(value);
        } else {
            setSelectedLabel('');
        }
    }, [value]);

    return (
        <div className="city-select" ref={containerRef}>
            <label className="city-select-label" htmlFor={id}>
                <span className="city-select-label-icon">📍</span>
                {label}
            </label>
            <div
                className={`city-select-trigger ${isOpen ? 'city-select-trigger-open' : ''}`}
                onClick={handleInputClick}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                id={id}
            >
                {isOpen ? (
                    <input
                        ref={inputRef}
                        className="city-select-input"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        aria-label={`${label} ara`}
                        autoComplete="off"
                    />
                ) : (
                    <span className={`city-select-value ${!selectedLabel ? 'city-select-placeholder' : ''}`}>
                        {selectedLabel || placeholder}
                    </span>
                )}
                <span className={`city-select-chevron ${isOpen ? 'city-select-chevron-open' : ''}`}>
                    {loading ? (
                        <span className="city-select-spinner" />
                    ) : (
                        '▾'
                    )}
                </span>
            </div>

            {isOpen && (
                <ul className="city-select-dropdown" role="listbox">
                    {loading && results.length === 0 && (
                        <li className="city-select-loading">
                            <span className="city-select-spinner" />
                            Aranıyor...
                        </li>
                    )}

                    {!loading && debouncedSearch && results.length === 0 && (
                        <li className="city-select-empty">
                            <span className="city-select-empty-icon">🔍</span>
                            "{debouncedSearch}" için sonuç bulunamadı
                        </li>
                    )}

                    {!debouncedSearch && !loading && (
                        <li className="city-select-hint">
                            <span className="city-select-hint-icon">💡</span>
                            İl veya ilçe adını yazmaya başlayın
                        </li>
                    )}

                    {results.map((result, index) => (
                        <li
                            key={`${result.type}-${result.id || index}`}
                            className={`city-select-option ${result.value === value ? 'city-select-option-selected' : ''} city-select-option-${result.type}`}
                            onClick={() => handleSelect(result)}
                            role="option"
                            aria-selected={result.value === value}
                        >
                            <span className="city-select-option-icon">
                                {result.type === 'province' ? '🏙️' : '📍'}
                            </span>
                            <div className="city-select-option-content">
                                <span className="city-select-option-name">
                                    {result.type === 'district' ? result.districtName : result.provinceName}
                                </span>
                                {result.type === 'district' && (
                                    <span className="city-select-option-province">{result.provinceName}</span>
                                )}
                            </div>
                            <span className={`city-select-option-badge city-select-badge-${result.type}`}>
                                {result.type === 'province' ? 'İL' : 'İLÇE'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
