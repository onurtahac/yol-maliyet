export default function Container({ children, className = '' }) {
    return (
        <div className={`container ${className}`} style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            padding: '0 var(--container-padding)',
            width: '100%',
        }}>
            {children}
        </div>
    );
}
