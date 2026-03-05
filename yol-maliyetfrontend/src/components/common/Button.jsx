import './../../styles/components/button.css';

export default function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    type = 'button',
    ariaLabel,
    className = '',
    ...props
}) {
    const handleClick = (e) => {
        if (disabled || loading) return;

        // Ripple effect
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.className = 'btn-ripple';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

        onClick?.(e);
    };

    return (
        <button
            type={type}
            className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''} ${className}`}
            onClick={handleClick}
            disabled={disabled || loading}
            aria-label={ariaLabel}
            {...props}
        >
            {loading ? (
                <span className="btn-spinner" aria-hidden="true">
                    <span className="spinner-dot" />
                    <span className="spinner-dot" />
                    <span className="spinner-dot" />
                </span>
            ) : children}
        </button>
    );
}
