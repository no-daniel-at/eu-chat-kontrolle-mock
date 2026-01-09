import React from 'react';
import MarqueeHeadline from './MarqueeHeadline';
import IntroText from './IntroText';

interface LandingProps {
    themeConfig: any;
}

const LandingSection: React.FC<LandingProps> = ({ themeConfig }) => {
    return (
        <section style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
        }}>
            <MarqueeHeadline config={themeConfig.headline} />
            <IntroText config={themeConfig.intro} />

            {/* Scroll Indicator */}
            <div style={{
                position: 'absolute',
                bottom: '40px',
                animation: 'bounce 2s infinite'
            }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={themeConfig.intro.fontColor} strokeWidth="1">
                    <path d="M7 13L12 18L17 13M12 6L12 17" />
                </svg>
            </div>
            <style>{`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                }
            `}</style>
        </section>
    );
};

export default LandingSection;
