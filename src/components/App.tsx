// src/components/App.tsx
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Desktop, ModalsView, ProzillaOS, Taskbar, WindowsView } from "prozilla-os";
import { appsConfig } from "../config/appsConfig";
import { desktopConfig } from "../config/desktopConfig";
import { WarningScreen } from './WarningScreen';
import { OSShakeContext, OSShakeProvider } from '../context/OSShakeContext';
import styles from './App.module.css';
import { WinScreen } from './WinScreen';
import { TypingChallenge } from './TypingChallenge';

// --- Configuration Constants ---
const JUMPSCARE_GIF_URL = "https://i.pinimg.com/originals/c0/7f/97/c07f97f3234f1820d0388f1a62377a9a.gif";
const JUMPSCARE_GIF_DURATION_MS = 2500;
const FADE_TO_JUMPSCARE_DELAY_MS = 1000;
const POST_JUMPSCARE_RESET_DELAY_MS = 1000;
const UNSETTLING_AMBIENT_AUDIO = "/audio/unsettling_hum.mp3";
const JUMPSCARE_AUDIO = "/audio/scream_jumpscare.mp3";
const GHOSTLY_IMAGE_URL = "/images/ghostly_face.png";
const CHALLENGE_TRIGGER_DELAY_MS = 20000;
const CHALLENGES_BEFORE_BOSS = 5;

// This component is the entry point of your application
const AppContent = () => {
    const [showWarningScreen, setShowWarningScreen] = useState(true);
    const [isOSActive, setIsOSActive] = useState(false);
    const [isFadingToWhite, setIsFadingToWhite] = useState(false);
    const [showJumpscare, setShowJumpscare] = useState(false);
    const [showGlitchOverlay, setShowGlitchOverlay] = useState(false);
    const [showFlashOverlay, setShowFlashOverlay] = useState(false);
    const [flashType, setFlashType] = useState<'black' | 'white'>('black');
    const [showGhostlyOverlay, setShowGhostlyOverlay] = useState(false);
    const [isCursorDistorted, setIsCursorDistorted] = useState(false);
    const [prozillaOSKey, setProzillaOSKey] = useState(0);

    const [challengeDisplayKey, setChallengeDisplayKey] = useState(0);

    const ambientEffectIntervalsRef = useRef<NodeJS.Timeout[]>([]);
    const jumpscareTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const gameProgressionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const ambientAudioRef = useRef<HTMLAudioElement>(null);
    const jumpscareAudioRef = useRef<HTMLAudioElement>(null);

    const {
        isOSShaking,
        setIsOSShaking,
        jumpscareScheduled,
        setJumpscareScheduled,
        showWinScreen,
        winScreenMessage,
        resetGameSession,
        isChallengeActive,
        setIsChallengeActive,
        challengeCount,
        triggerWinScreen,
    } = useContext(OSShakeContext)!;


    const clearAllHorrorTimersAndResetStates = useCallback(() => {
        console.log("App.tsx cleanup: Clearing all horror intervals and resetting states.");
        ambientEffectIntervalsRef.current.forEach(clearInterval);
        ambientEffectIntervalsRef.current = [];
        jumpscareTimeoutsRef.current.forEach(clearTimeout);
        jumpscareTimeoutsRef.current = [];

        if (gameProgressionTimeoutRef.current) {
            clearTimeout(gameProgressionTimeoutRef.current);
            gameProgressionTimeoutRef.current = null;
        }

        setIsOSShaking(false);
        setIsFadingToWhite(false);
        setShowJumpscare(false);
        setShowGlitchOverlay(false);
        setShowFlashOverlay(false);
        setShowGhostlyOverlay(false);
        setIsCursorDistorted(false);
        if (document.body.classList.contains(styles.distortedCursor)) {
            document.body.classList.remove(styles.distortedCursor);
        }

        if (ambientAudioRef.current) {
            ambientAudioRef.current.pause();
            ambientAudioRef.current.currentTime = 0;
            console.log("Ambient audio paused and reset.");
        }
        if (jumpscareAudioRef.current) {
            jumpscareAudioRef.current.pause();
            jumpscareAudioRef.current.currentTime = 0;
        }
        setIsChallengeActive(false); 
        console.log("All horror timers cleared and states reset.");
    }, [setIsOSShaking, setIsChallengeActive]);

    const initiateJumpscareSequenceLocal = useCallback(() => {
        console.log("App.tsx: Executing full initiateJumpscareSequenceLocal (visuals & audio)!");
        
        clearAllHorrorTimersAndResetStates();
        setIsFadingToWhite(true);

        const fadeToJumpscareTimeout = setTimeout(() => {
            setShowJumpscare(true);
            if (jumpscareAudioRef.current) {
                jumpscareAudioRef.current.volume = 1.0;
                jumpscareAudioRef.current.play().catch(e => console.error("Jumpscare audio play failed:", e));
            }

            const hideJumpscareTimeout = setTimeout(() => {
                setShowJumpscare(false);
                if (jumpscareAudioRef.current) {
                    jumpscareAudioRef.current.pause();
                    jumpscareAudioRef.current.currentTime = 0;
                }

                const resetToWarningTimeout = setTimeout(() => {
                    setShowWarningScreen(true);
                    setIsOSActive(false);
                    setProzillaOSKey(prev => prev + 1);
                    setIsFadingToWhite(false);
                    resetGameSession();
                    setChallengeDisplayKey(0);
                    console.log("App.tsx: Full OS reset to Warning Screen after jumpscare.");
                }, POST_JUMPSCARE_RESET_DELAY_MS);
                jumpscareTimeoutsRef.current.push(resetToWarningTimeout);

            }, JUMPSCARE_GIF_DURATION_MS);
            jumpscareTimeoutsRef.current.push(hideJumpscareTimeout);

        }, FADE_TO_JUMPSCARE_DELAY_MS);
        jumpscareTimeoutsRef.current.push(fadeToJumpscareTimeout);

    }, [clearAllHorrorTimersAndResetStates, resetGameSession]);

    useEffect(() => {
        if (jumpscareScheduled) {
            console.log("App.tsx: Detected jumpscareScheduled is TRUE from context. Initiating local sequence.");
            initiateJumpscareSequenceLocal();
        }
    }, [jumpscareScheduled, initiateJumpscareSequenceLocal]);

    const scheduleNextGameEvent = useCallback(() => {
        clearAllHorrorTimersAndResetStates();
        setChallengeDisplayKey(prevKey => prevKey + 1);

        if (challengeCount >= CHALLENGES_BEFORE_BOSS) {
            console.log(`App.tsx: ${challengeCount} challenges completed. Initiating FINAL BOSS FIGHT!`);
            gameProgressionTimeoutRef.current = setTimeout(() => {
                setIsChallengeActive(true);
                setIsOSShaking(false);
                console.log("App.tsx: Boss fight activated!");
            }, 3000);
        } else {
            console.log(`App.tsx: Scheduling next challenge (Challenge ${challengeCount + 1} of ${CHALLENGES_BEFORE_BOSS}) to appear in ${CHALLENGE_TRIGGER_DELAY_MS / 1000} seconds.`);
            gameProgressionTimeoutRef.current = setTimeout(() => {
                setIsChallengeActive(true);
                setIsOSShaking(false);
                console.log("App.tsx: Challenge activated!");
            }, CHALLENGE_TRIGGER_DELAY_MS);
        }
    }, [challengeCount, setIsChallengeActive, setIsOSShaking, clearAllHorrorTimersAndResetStates]);


    const handleStartOS = useCallback(() => {
        console.log("App.tsx: Starting full OS normally.");
        setShowWarningScreen(false);
        setIsOSActive(true);
        resetGameSession();
        setChallengeDisplayKey(0);

        if (ambientAudioRef.current) {
            ambientAudioRef.current.volume = 0;
            ambientAudioRef.current.play().catch(e => console.error("Ambient audio priming failed:", e));
            ambientAudioRef.current.pause();
        }
        if (jumpscareAudioRef.current) {
            jumpscareAudioRef.current.volume = 0;
            jumpscareAudioRef.current.play().catch(e => console.error("Jumpscare audio priming failed:", e));
            jumpscareAudioRef.current.pause();
        }

        scheduleNextGameEvent();
    }, [resetGameSession, scheduleNextGameEvent]);

    useEffect(() => {
        if (!isChallengeActive && !jumpscareScheduled && !showWinScreen && isOSActive) {
            const debounceTimer = setTimeout(() => {
                console.log(`App.tsx: Challenge just completed/failed. Scheduling next game event. Current count: ${challengeCount}`);
                scheduleNextGameEvent();
            }, 500);

            return () => clearTimeout(debounceTimer);
        }
    }, [isChallengeActive, jumpscareScheduled, showWinScreen, isOSActive, challengeCount, scheduleNextGameEvent, triggerWinScreen]);

    useEffect(() => {
        console.log("App.tsx useEffect [isOSShaking] running. isOSShaking:", isOSShaking);
        
        ambientEffectIntervalsRef.current.forEach(clearInterval);
        ambientEffectIntervalsRef.current = [];
        console.log("App.tsx: Cleared all ambient effect intervals.");

        if (!isOSShaking) {
            if (!jumpscareScheduled) { 
                setShowGlitchOverlay(false);
                setShowFlashOverlay(false);
                setShowGhostlyOverlay(false);
                setIsCursorDistorted(false);
                if (document.body.classList.contains(styles.distortedCursor)) {
                    document.body.classList.remove(styles.distortedCursor);
                }
            }
            if (ambientAudioRef.current) {
                ambientAudioRef.current.pause();
                ambientAudioRef.current.currentTime = 0;
            }
        }

        if (isOSShaking && !jumpscareScheduled) {
            console.log("App.tsx: Ambient horror effects are now ACTIVATED!");
            if (ambientAudioRef.current) {
                ambientAudioRef.current.volume = 0.4;
                ambientAudioRef.current.loop = true;
                ambientAudioRef.current.play().catch(e => console.error("Ambient audio play failed:", e));
                const volumeInterval = setInterval(() => {
                    if (ambientAudioRef.current) {
                        const newVolume = Math.min(1.0, Math.max(0.2, ambientAudioRef.current.volume + (Math.random() - 0.5) * 0.2));
                        ambientAudioRef.current.volume = newVolume;
                    }
                }, 200);
                ambientEffectIntervalsRef.current.push(volumeInterval);
            }
            const glitchInterval = setInterval(() => {
                setShowGlitchOverlay(true);
                setTimeout(() => { setShowGlitchOverlay(false); }, 50);
            }, Math.random() * (700 - 300) + 300);
            ambientEffectIntervalsRef.current.push(glitchInterval);
            const flashInterval = setInterval(() => {
                const type = Math.random() > 0.5 ? 'black' : 'white';
                setFlashType(type);
                setShowFlashOverlay(true);
                setTimeout(() => { setShowFlashOverlay(false); }, 75);
            }, Math.random() * (1500 - 800) + 800);
            ambientEffectIntervalsRef.current.push(flashInterval);
            const ghostlyOverlayInterval = setInterval(() => {
                setShowGhostlyOverlay(true);
                setTimeout(() => { setShowGhostlyOverlay(false); }, 150);
            }, Math.random() * (3000 - 1000) + 1000);
            ambientEffectIntervalsRef.current.push(ghostlyOverlayInterval);
            const cursorInterval = setInterval(() => {
                const shouldDistort = Math.random() > 0.3;
                setIsCursorDistorted(shouldDistort);
            }, Math.random() * (500 - 200) + 200);
            ambientEffectIntervalsRef.current.push(cursorInterval);
        }

        return () => {
            console.log("App.tsx useEffect [isOSShaking] cleanup function running (return).");
            ambientEffectIntervalsRef.current.forEach(clearInterval);
            ambientEffectIntervalsRef.current = [];
            setShowGlitchOverlay(false);
            setShowFlashOverlay(false);
            setShowGhostlyOverlay(false);
            setIsCursorDistorted(false);
            if (document.body.classList.contains(styles.distortedCursor)) {
                document.body.classList.remove(styles.distortedCursor);
            }
            if (ambientAudioRef.current) {
                ambientAudioRef.current.pause();
                ambientAudioRef.current.currentTime = 0;
            }
        };
    }, [isOSShaking, jumpscareScheduled, setIsOSShaking]);

    useEffect(() => {
        if (isCursorDistorted) {
            document.body.classList.add(styles.distortedCursor);
        } else {
            document.body.classList.remove(styles.distortedCursor);
        }
    }, [isCursorDistorted]);

    useEffect(() => {
        return () => {
            console.log("App.tsx Component Unmounting: Performing final cleanup.");
            clearAllHorrorTimersAndResetStates();
        };
    }, [clearAllHorrorTimersAndResetStates]);

    useEffect(() => {
        if (showWinScreen) {
            console.log("App.tsx: showWinScreen is true, WinScreen should be visible.");
            clearAllHorrorTimersAndResetStates();
            setIsOSActive(false);
        }
    }, [showWinScreen, clearAllHorrorTimersAndResetStates]);

    return (
        <div className={`${styles.appContainer} ${isOSShaking ? styles.osShakeActive : ''}`}>
            {showWarningScreen ? (
                <WarningScreen onStart={handleStartOS} />
            ) : (
                <>
                    <ProzillaOS
                        key={prozillaOSKey}
                        systemName="VoidOS"
                        tagLine=""
                        config={{
                            apps: appsConfig,
                            desktop: desktopConfig,
                        }}
                    >
                        <Taskbar/>
                        <WindowsView/>
                        <ModalsView/>
                        <Desktop/>
                    </ProzillaOS>
                    <audio ref={ambientAudioRef} src={UNSETTLING_AMBIENT_AUDIO} preload="auto" />
                    <audio ref={jumpscareAudioRef} src={JUMPSCARE_AUDIO} preload="auto" />

                    {isFadingToWhite && (<div className={styles.whiteFadeOverlay}></div>)}
                    {isOSShaking && (<div className={styles.vignetteOverlay}></div>)}
                    {showGlitchOverlay && (<div className={styles.glitchOverlay}></div>)}
                    {showFlashOverlay && (
                        <div className={`${styles.flashOverlay} ${flashType === 'black' ? styles.flashBlack : styles.flashWhite}`}></div>
                    )}
                    {showGhostlyOverlay && isOSShaking && (
                        <div className={styles.ghostlyOverlay} style={{ backgroundImage: `url(${GHOSTLY_IMAGE_URL})` }}></div>
                    )}
                    {isOSShaking && (
                        <div className={styles.goodbyeScrollTextOverlay}>
                            <div className={styles.goodbyeScrollText}>
                                Goodbye...
                            </div>
                        </div>
                    )}

                    {isChallengeActive && (
                        <>
                            <TypingChallenge
                                key={challengeDisplayKey}
                                isBossFight={challengeCount >= CHALLENGES_BEFORE_BOSS}
                            />
                        </>
                    )}

                    {showJumpscare && (
                        <div className={styles.jumpscareOverlay}>
                            <img
                                src={JUMPSCARE_GIF_URL}
                                alt="Jumpscare"
                                className={styles.jumpscareImage}
                            />
                        </div>
                    )}

                    {showWinScreen && (
                        <WinScreen />
                    )}
                </>
            )}
        </div>
    );
};

// Main App component with the OSShakeProvider wrapper
export function App() {
    return (
        <OSShakeProvider>
            <AppContent />
        </OSShakeProvider>
    );
}