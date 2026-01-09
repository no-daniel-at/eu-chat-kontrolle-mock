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
            {/* Scroll indicator removed - moved to ArrowOverlay */}
        </section>
    );
};

export default LandingSection;
