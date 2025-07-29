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
    completeChallenge: (success: boolean) => void;
}

export const OSShakeContext = createContext<OSShakeContextType | undefined>(undefined);

interface OSShakeProviderProps {
    children: React.ReactNode;
}

export const OSShakeProvider: React.FC<OSShakeProviderProps> = ({ children }) => {
    const [isOSShaking, setIsOSShaking] = useState(false);
    const [jumpscareScheduled, setJumpscareScheduled] = useState(false);
    const [showWinScreen, setShowWinScreen] = useState(false);
    const [winScreenMessage, setWinScreenMessage] = useState("");
    const [challengeCount, setChallengeCount] = useState(0);
    const [isChallengeActive, setIsChallengeActive] = useState(false);

    const challengeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (challengeIntervalRef.current) {
            clearInterval(challengeIntervalRef.current);
            challengeIntervalRef.current = null;
        }

        let shakeIntervalDuration = 0;
        if (challengeCount >= 1 && challengeCount < 3) {
            shakeIntervalDuration = 5000;
        } else if (challengeCount >= 3 && challengeCount < 5) {
            shakeIntervalDuration = 3000;
        } else if (challengeCount >= 5) {
            shakeIntervalDuration = 1000;
        }

        if (shakeIntervalDuration > 0 && !isChallengeActive && !jumpscareScheduled && !showWinScreen) {
            challengeIntervalRef.current = setInterval(() => {
                setIsOSShaking(true);
                setTimeout(() => {
                    setIsOSShaking(false);
                }, 500);
            }, shakeIntervalDuration);
        } else {
            setIsOSShaking(false);
        }

        return () => {
            if (challengeIntervalRef.current) {
                clearInterval(challengeIntervalRef.current);
            }
        };
    }, [challengeCount, isChallengeActive, jumpscareScheduled, showWinScreen]);

    const completeChallenge = useCallback((success: boolean) => {
        console.log(`OSShakeContext: completeChallenge called. Success: ${success}`);
        setIsChallengeActive(false);
        if (success) {
            setChallengeCount(prevCount => prevCount + 1);
            console.log(`OSShakeContext: Challenge successful. New count: ${challengeCount + 1}`);
        } else {
            console.log("OSShakeContext: Challenge failed. Scheduling jumpscare.");
            setJumpscareScheduled(true);
        }
    }, [setIsChallengeActive, setChallengeCount, setJumpscareScheduled]);

    const resetGameSession = useCallback(() => {
        console.log("OSShakeContext: resetGameSession called.");
        setChallengeCount(0);
        setIsChallengeActive(false);
        setIsOSShaking(false);
        setJumpscareScheduled(false);
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
        setIsOSShaking(false);
        setIsChallengeActive(false);
        setJumpscareScheduled(false);
        resetGameSession();
    }, [setShowWinScreen, setWinScreenMessage, setIsOSShaking, setIsChallengeActive, setJumpscareScheduled, resetGameSession]);


    const contextValue = {
        isOSShaking, setIsOSShaking,
        jumpscareScheduled, setJumpscareScheduled,
        showWinScreen, winScreenMessage, triggerWinScreen,
        resetGameSession,
        challengeCount, setChallengeCount,
        isChallengeActive, setIsChallengeActive,
        completeChallenge,
    };

    return (
        <OSShakeContext.Provider value={contextValue}>
            {children}
        </OSShakeContext.Provider>
    );
};