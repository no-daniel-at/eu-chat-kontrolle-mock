import React from 'react';

interface ArrowOverlayProps {
    theme: string;
    // We might need color from theme config, or we can deduce it/hardcode defaults for now.
    // The previous arrow used `themeConfig.intro.fontColor`.
    // For simplicity, let's accept an explicit color prop or derive from theme.
    // Given usage in landing section, passing the color is flexible.
    color?: string;
}

const ArrowOverlay: React.FC<ArrowOverlayProps> = ({ theme, color = '#ffffff' }) => {
    // Hide in premium if requested (assuming consistency with eyes)
    if (theme === 'premium') return null;

    return (
        <div style={{
            position: 'absolute', // Scrolls with the page
            top: '96vh', // Position near bottom of initial viewport
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'bounce 2s infinite'
        }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1">
                <path d="M7 13L12 18L17 13M12 6L12 17" />
            </svg>
            <style>{`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                }
            `}</style>
        </div>
    );
};

export default ArrowOverlay;
