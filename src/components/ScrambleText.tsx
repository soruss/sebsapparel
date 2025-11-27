import React, { useEffect, useState, useRef } from 'react';

interface ScrambleTextProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
    duration?: number; // Duration in ms
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className, style, duration = 500 }) => {
    const [displayText, setDisplayText] = useState('');
    const intervalRef = useRef<number | null>(null);
    const iterationRef = useRef(0);

    useEffect(() => {
        iterationRef.current = 0;

        // Calculate speed to ensure total duration is ~500ms
        // We want to reveal 1 character every X ms
        // But we also want some "scramble" effect, so let's say we update every 30ms
        // and increment iteration by a calculated amount to finish in time.

        const updateInterval = 30;
        const totalSteps = duration / updateInterval;
        const incrementPerStep = text.length / totalSteps;

        intervalRef.current = window.setInterval(() => {
            setDisplayText(() => {
                const result = text
                    .split('')
                    .map((_, index) => {
                        if (index < iterationRef.current) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join('');

                if (iterationRef.current >= text.length) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    return text; // Ensure final text is correct
                }

                iterationRef.current += incrementPerStep;
                return result;
            });
        }, updateInterval);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [text, duration]);

    return (
        <span className={className} style={style}>
            {displayText}
        </span>
    );
};

export default ScrambleText;
