// src/context/OSShakeContext.tsx
import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';

interface OSShakeContextType {
    isOSShaking: boolean;
    setIsOSShaking: (shake: boolean) => void;
    jumpscareScheduled: boolean;
    setJumpscareScheduled: (scheduled: boolean) => void;
    showWinScreen: boolean;
    winScreenMessage: string;
    triggerWinScreen: (message: string) => void;
    resetGameSession: () => void;
    challengeCount: number;
    setChallengeCount: (count: number) => void;
    isChallengeActive: boolean;
    setIsChallengeActive: (active: boolean) => void;
    completeChallenge: (success: boolean) => void; // MODIFIED: Added 'success' parameter
}

export const OSShakeContext = createContext<OSShakeContextType | undefined>(undefined);

export const OSShakeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOSShaking, setIsOSShaking] = useState(false);
    const [jumpscareScheduled, setJumpscareScheduled] = useState(false);
    const [showWinScreen, setShowWinScreen] = useState(false);
    const [winScreenMessage, setWinScreenMessage] = useState("");
    const [challengeCount, setChallengeCount] = useState(0);
    const [isChallengeActive, setIsChallengeActive] = useState(false);

    const challengeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // This effect handles the OS shaking based on challengeCount
    useEffect(() => {
        // Clear any existing interval to prevent duplicates
        if (challengeIntervalRef.current) {
            clearInterval(challengeIntervalRef.current);
            challengeIntervalRef.current = null;
        }

        // Adjust shake intensity based on challengeCount
        let shakeIntervalDuration = 0; // No shake by default
        if (challengeCount >= 1 && challengeCount < 3) {
            shakeIntervalDuration = 5000; // Moderate shake
        } else if (challengeCount >= 3 && challengeCount < 5) {
            shakeIntervalDuration = 3000; // Stronger shake
        } else if (challengeCount >= 5) { // Boss fight or post-boss
            shakeIntervalDuration = 1000; // Very strong shake / constant
        }

        if (shakeIntervalDuration > 0 && !isChallengeActive && !jumpscareScheduled && !showWinScreen) {
            challengeIntervalRef.current = setInterval(() => {
                setIsOSShaking(true);
                setTimeout(() => {
                    setIsOSShaking(false);
                }, 500); // Shake for 0.5 seconds
            }, shakeIntervalDuration);
        } else {
            setIsOSShaking(false); // Ensure shaking is off if conditions not met
        }

        // Cleanup function for when the component unmounts or dependencies change
        return () => {
            if (challengeIntervalRef.current) {
                clearInterval(challengeIntervalRef.current);
            }
        };
    }, [challengeCount, isChallengeActive, jumpscareScheduled, showWinScreen]); // Dependencies for useEffect

    const completeChallenge = useCallback((success: boolean) => { // MODIFIED: Now accepts 'success'
        console.log(`OSShakeContext: completeChallenge called. Success: ${success}`);
        setIsChallengeActive(false); // Deactivate challenge UI
        if (success) {
            setChallengeCount(prevCount => prevCount + 1);
            console.log(`OSShakeContext: Challenge successful. New count: ${challengeCount + 1}`);
            // No jumpscare on success, App.tsx will handle next challenge.
        } else {
            console.log("OSShakeContext: Challenge failed. Scheduling jumpscare.");
            setJumpscareScheduled(true); // <--- Trigger jumpscare on failure!
            // Do NOT increment challengeCount on failure.
        }
    }, [setIsChallengeActive, setChallengeCount, setJumpscareScheduled]); // Added setJumpscareScheduled to deps

    const resetGameSession = useCallback(() => {
        console.log("OSShakeContext: resetGameSession called.");
        setChallengeCount(0);
        setIsChallengeActive(false);
        setIsOSShaking(false);
        setJumpscareScheduled(false); // Reset jumpscare state on full game reset
        setShowWinScreen(false);
        setWinScreenMessage("");
        if (challengeIntervalRef.current) {
            clearInterval(challengeIntervalRef.current);
            challengeIntervalRef.current = null;
        }
    }, [setChallengeCount, setIsChallengeActive, setIsOSShaking, setJumpscareScheduled, setShowWinScreen, setWinScreenMessage]);

    const triggerWinScreen = useCallback((message: string) => {
        console.log("OSShakeContext: triggerWinScreen called.");
        setShowWinScreen(true);
        setWinScreenMessage(message);
        setIsOSShaking(false); // Stop ambient effects on win
        setIsChallengeActive(false); // Deactivate challenge
        setJumpscareScheduled(false); // Ensure no jumpscare triggers after win
        resetGameSession(); // Optionally reset game state for a clean start after win screen.
    }, [setShowWinScreen, setWinScreenMessage, setIsOSShaking, setIsChallengeActive, setJumpscareScheduled, resetGameSession]);


    const contextValue = {
        isOSShaking, setIsOSShaking,
        jumpscareScheduled, setJumpscareScheduled,
        showWinScreen, winScreenMessage, triggerWinScreen,
        resetGameSession,
        challengeCount, setChallengeCount,
        isChallengeActive, setIsChallengeActive,
        completeChallenge
    };

    return (
        <OSShakeContext.Provider value={contextValue}>
            {children}
        </OSShakeContext.Provider>
    );
};