import React, { useState, useEffect } from 'react';

interface IntroOverlayProps {
    theme: string;
}

// ==========================================
// CONFIGURATION
// ==========================================

// Time ranges for idle states (in milliseconds)
const IDLE_TIME = { min: 3000, max: 7000 };
const HOLD_TIME = { min: 1000, max: 2000 };
const PRE_BLINK_DELAY = 1000; // Pause in middle before blinking

// Animation definitions
// All animations are 10 frames.
// Movement animations are ~70ms/frame. Blink is ~100ms/frame.
const ANIM_CONFIG = {
    frames: 10,
    moveDuration: 700,  // 10 frames * 70ms
    blinkDuration: 1000 // 10 frames * 100ms
};

type Direction = 'down' | 'left' | 'right';

const getAssetPath = (path: string) => {
    return process.env.PUBLIC_URL + path;
};

// File mappings
const ASSETS = {
    idle: getAssetPath('/middle.png'),
    blink: getAssetPath('/blink_middle_10.gif'),
    down: {
        move: getAssetPath('/middle_down_10.gif'),
        hold: getAssetPath('/down.png'),
        return: getAssetPath('/down_middle_10.gif')
    },
    left: {
        move: getAssetPath('/middle_left_10.gif'),
        hold: getAssetPath('/left.png'),
        return: getAssetPath('/left_middle_10.gif')
    },
    right: {
        move: getAssetPath('/middle_right_10.gif'),
        hold: getAssetPath('/right.png'),
        return: getAssetPath('/right_middle_10.gif')
    }
};

// Sequence: Left -> Right -> Down
const DIRECTION_SEQUENCE: Direction[] = ['left', 'right', 'down'];

type EyeState =
    | 'IDLE'
    | 'MOVING_OUT'
    | 'HOLDING'
    | 'MOVING_BACK'
    | 'PRE_BLINK_IDLE'
    | 'BLINKING';

const IntroOverlay: React.FC<IntroOverlayProps> = ({ theme }) => {
    const [currentState, setCurrentState] = useState<EyeState>('IDLE');
    const [currentSrc, setCurrentSrc] = useState<string>(ASSETS.idle);
    const [activeDirection, setActiveDirection] = useState<Direction | null>(null);
    const [sequenceIndex, setSequenceIndex] = useState(0);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        switch (currentState) {
            case 'IDLE':
                // Wait randomly then transition to MOVING_OUT
                const idleDelay = Math.random() * (IDLE_TIME.max - IDLE_TIME.min) + IDLE_TIME.min;
                timeoutId = setTimeout(() => {
                    // Pick next direction
                    const dir = DIRECTION_SEQUENCE[sequenceIndex];
                    setSequenceIndex((prev) => (prev + 1) % DIRECTION_SEQUENCE.length);
                    setActiveDirection(dir);

                    // Start moving out
                    setCurrentSrc(ASSETS[dir].move);
                    setCurrentState('MOVING_OUT');
                }, idleDelay);
                break;

            case 'MOVING_OUT':
                // Wait for animation to finish
                timeoutId = setTimeout(() => {
                    if (activeDirection) {
                        setCurrentSrc(ASSETS[activeDirection].hold);
                        setCurrentState('HOLDING');
                    }
                }, ANIM_CONFIG.moveDuration);
                break;

            case 'HOLDING':
                // Hold the position
                const holdDelay = Math.random() * (HOLD_TIME.max - HOLD_TIME.min) + HOLD_TIME.min;
                timeoutId = setTimeout(() => {
                    if (activeDirection) {
                        setCurrentSrc(ASSETS[activeDirection].return);
                        setCurrentState('MOVING_BACK');
                    }
                }, holdDelay);
                break;

            case 'MOVING_BACK':
                // Wait for return animation
                timeoutId = setTimeout(() => {
                    setCurrentSrc(ASSETS.idle);
                    setCurrentState('PRE_BLINK_IDLE');
                }, ANIM_CONFIG.moveDuration);
                break;

            case 'PRE_BLINK_IDLE':
                // Short pause before blinking
                timeoutId = setTimeout(() => {
                    setCurrentSrc(ASSETS.blink);
                    setCurrentState('BLINKING');
                }, PRE_BLINK_DELAY);
                break;

            case 'BLINKING':
                // Wait for blink to finish
                timeoutId = setTimeout(() => {
                    setCurrentSrc(ASSETS.idle);
                    setCurrentState('IDLE');
                }, ANIM_CONFIG.blinkDuration);
                break;
        }

        return () => clearTimeout(timeoutId);
    }, [currentState, activeDirection, sequenceIndex]);

    if (theme === 'premium') return null;

    const eyeSize = '150px';
    const offset = '400px';

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none',
        }}>
            {/* Left Eye */}
            <img
                src={currentSrc}
                alt="Watching Eye"
                style={{
                    position: 'absolute',
                    top: offset,
                    left: '20px',
                    width: eyeSize,
                    height: 'auto',
                    opacity: 1
                }}
            />

            {/* Right Eye */}
            <img
                src={currentSrc}
                alt="Watching Eye"
                style={{
                    position: 'absolute',
                    top: offset,
                    right: '20px',
                    width: eyeSize,
                    height: 'auto',
                    opacity: 1
                }}
            />
        </div>
    );
};

export default IntroOverlay;
