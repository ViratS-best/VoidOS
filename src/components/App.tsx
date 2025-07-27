// prozilla-os/src/components/App.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Desktop, ModalsView, ProzillaOS, Taskbar, WindowsView } from "prozilla-os";
import { appsConfig } from "../config/appsConfig";
import { desktopConfig } from "../config/desktopConfig";
import { WarningScreen } from './WarningScreen';
import { OSShakeContext } from '../context/OSShakeContext';
import styles from './App.module.css';

const JUMPSCARE_GIF_URL = "https://i.pinimg.com/originals/c0/7f/97/c07f97f3234f1820d0388f1a62377a9a.gif";
const JUMPSCARE_GIF_DURATION_MS = 2500; // Duration the GIF is shown
const FADE_TO_JUMPSCARE_DELAY_MS = 1000; // Delay after fade to white before jumpscare appears
const POST_JUMPSCARE_RESET_DELAY_MS = 1000; // How long to wait after jumpscare before resetting to warning screen

const UNSETTLING_AMBIENT_AUDIO = "/audio/unsettling_hum.mp3";
const JUMPSCARE_AUDIO = "/audio/scream_jumpscare.mp3";
const GHOSTLY_IMAGE_URL = "/images/ghostly_face.png";

export function App() {
    const [showWarningScreen, setShowWarningScreen] = useState(true);
    const [isOSActive, setIsOSActive] = useState(false);
    const [isOSShaking, setIsOSShaking] = useState(false); // Controls ambient horror effects
    const [isFadingToWhite, setIsFadingToWhite] = useState(false);
    const [showJumpscare, setShowJumpscare] = useState(false);
    const [showGlitchOverlay, setShowGlitchOverlay] = useState(false);
    const [showFlashOverlay, setShowFlashOverlay] = useState(false);
    const [flashType, setFlashType] = useState<'black' | 'white'>('black');
    const [showGhostlyOverlay, setShowGhostlyOverlay] = useState(false);
    const [isCursorDistorted, setIsCursorDistorted] = useState(false);

    // State for jumpscare scheduling, managed by App and set via Context
    const [jumpscareScheduled, setJumpscareScheduled] = useState(false);

    const [resetCounter, setResetCounter] = useState(0); // Forces ProzillaOS re-mount

    // Refs for intervals and timeouts
    const ambientEffectIntervalsRef = useRef<NodeJS.Timeout[]>([]); // To store all ambient horror intervals
    const jumpscareTimeoutsRef = useRef<NodeJS.Timeout[]>([]); // To store timeouts related to the jumpscare sequence

    const ambientAudioRef = useRef<HTMLAudioElement>(null);
    const jumpscareAudioRef = useRef<HTMLAudioElement>(null);

    // --- Helper function to clear all active timers and reset relevant states ---
    const clearAllHorrorTimersAndResetStates = useCallback(() => {
        console.log("App.tsx cleanup: Clearing all horror intervals and resetting states.");

        // Clear all ambient horror intervals
        ambientEffectIntervalsRef.current.forEach(clearInterval);
        ambientEffectIntervalsRef.current = [];

        // Clear all jumpscare-related timeouts
        jumpscareTimeoutsRef.current.forEach(clearTimeout);
        jumpscareTimeoutsRef.current = [];

        // Reset all states related to horror effects EXPLICITLY
        setIsOSShaking(false); // Crucial: ensure shaking is off immediately
        setIsFadingToWhite(false);
        setShowJumpscare(false);
        setShowGlitchOverlay(false); // Ensure glitch overlay is hidden
        setShowFlashOverlay(false); // Ensure flash overlay is hidden
        setShowGhostlyOverlay(false); // Ensure ghostly overlay is hidden
        setIsCursorDistorted(false); // Ensure cursor distortion is removed
        if (document.body.classList.contains(styles.distortedCursor)) {
            document.body.classList.remove(styles.distortedCursor);
        }

        // Reset jumpscareScheduled state on full cleanup
        setJumpscareScheduled(false);

        // Pause and reset audio
        if (ambientAudioRef.current) {
            ambientAudioRef.current.pause();
            ambientAudioRef.current.currentTime = 0;
            console.log("Ambient audio paused and reset.");
        }
        if (jumpscareAudioRef.current) {
            jumpscareAudioRef.current.pause();
            jumpscareAudioRef.current.currentTime = 0;
        }
        console.log("All horror timers cleared and states reset.");
    }, []); // No dependencies, as it only operates on refs and state setters

    // --- Function to initiate the full jumpscare sequence ---
    const initiateJumpscareSequence = useCallback(() => {
        console.log("App.tsx: Calling initiateJumpscareSequence!");

        // This is the key change: call clearAllHorrorTimersAndResetStates BEFORE any state updates
        // related to the jumpscare. This ensures all ambient effects are immediately killed.
        clearAllHorrorTimersAndResetStates();

        // 2. Start the fade to white
        setIsFadingToWhite(true);

        // 3. Schedule the jumpscare appearance after the fade
        const fadeToJumpscareTimeout = setTimeout(() => {
            setShowJumpscare(true); // Show the jumpscare image
            if (jumpscareAudioRef.current) {
                jumpscareAudioRef.current.volume = 1.0;
                jumpscareAudioRef.current.play().catch(e => console.error("Jumpscare audio play failed:", e));
            }

            // 4. Schedule hiding the jumpscare and preparing for reset
            const hideJumpscareTimeout = setTimeout(() => {
                setShowJumpscare(false); // HIDE the jumpscare image
                if (jumpscareAudioRef.current) {
                    jumpscareAudioRef.current.pause();
                    jumpscareAudioRef.current.currentTime = 0;
                }
                setIsFadingToWhite(false); // Hide the white fade overlay

                // 5. Schedule full OS reset after a short delay
                const resetToWarningTimeout = setTimeout(() => {
                    setShowWarningScreen(true);
                    setIsOSActive(false);
                    setResetCounter(prev => prev + 1); // Forces ProzillaOS re-mount
                    clearAllHorrorTimersAndResetStates(); // Final cleanup after reset
                    console.log("App.tsx: Full OS reset to Warning Screen.");
                }, POST_JUMPSCARE_RESET_DELAY_MS);
                jumpscareTimeoutsRef.current.push(resetToWarningTimeout);

            }, JUMPSCARE_GIF_DURATION_MS);
            jumpscareTimeoutsRef.current.push(hideJumpscareTimeout);

        }, FADE_TO_JUMPSCARE_DELAY_MS);
        jumpscareTimeoutsRef.current.push(fadeToJumpscareTimeout);

    }, [clearAllHorrorTimersAndResetStates]); // Depend on the cleanup function itself

    // --- Context value for children ---
    const osShakeContextValue = React.useMemo(() => ({
        setIsOSShaking,
        initiateJumpscareSequence, // Make this available to child components
        isOSShaking,
        jumpscareScheduled, // Pass jumpscareScheduled state
        setJumpscareScheduled, // Pass jumpscareScheduled setter
    }), [setIsOSShaking, initiateJumpscareSequence, isOSShaking, jumpscareScheduled, setJumpscareScheduled]);

    // --- Handlers ---
    const handleStartOS = () => {
        console.log("App.tsx: Starting full OS normally.");
        setShowWarningScreen(false);
        setIsOSActive(true);
    };

    // --- EFFECTS ---

    // Effect for Controlling Ambient Horror Effects (when isOSShaking changes)
    // This now only activates/deactivates ambient effects based on `isOSShaking` state.
    // `isOSShaking` will be set by MyTerminalApp OR MyTextEditorApp.
    useEffect(() => {
        console.log("App.tsx useEffect [isOSShaking] running. isOSShaking:", isOSShaking);

        // Always clear intervals on state change to prevent duplicates or lingering effects
        ambientEffectIntervalsRef.current.forEach(clearInterval);
        ambientEffectIntervalsRef.current = [];
        console.log("App.tsx: Cleared all ambient effect intervals (due to isOSShaking change).");

        // Explicitly reset global glitch/flash/ghostly states here when turning off shaking
        if (!isOSShaking) {
            setShowGlitchOverlay(false);
            setShowFlashOverlay(false);
            setShowGhostlyOverlay(false);
            setIsCursorDistorted(false);
            if (document.body.classList.contains(styles.distortedCursor)) {
                document.body.classList.remove(styles.distortedCursor);
            }
            if (ambientAudioRef.current) { // Ensure ambient audio also stops
                ambientAudioRef.current.pause();
                ambientAudioRef.current.currentTime = 0;
            }
        }

        if (isOSShaking) {
            console.log("App.tsx: Ambient horror effects are now ACTIVATED!");

            // Start ambient audio
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

            // Start glitch interval (global overlay)
            const glitchInterval = setInterval(() => {
                setShowGlitchOverlay(true);
                setTimeout(() => { setShowGlitchOverlay(false); }, 50);
            }, Math.random() * (700 - 300) + 300);
            ambientEffectIntervalsRef.current.push(glitchInterval);

            // Start flash interval (global overlay)
            const flashInterval = setInterval(() => {
                const type = Math.random() > 0.5 ? 'black' : 'white';
                setFlashType(type);
                setShowFlashOverlay(true);
                setTimeout(() => { setShowFlashOverlay(false); }, 75);
            }, Math.random() * (1500 - 800) + 800);
            ambientEffectIntervalsRef.current.push(flashInterval);

            // Start ghostly overlay interval
            const ghostlyOverlayInterval = setInterval(() => {
                setShowGhostlyOverlay(true);
                setTimeout(() => { setShowGhostlyOverlay(false); }, 150);
            }, Math.random() * (3000 - 1000) + 1000);
            ambientEffectIntervalsRef.current.push(ghostlyOverlayInterval);

            // Start cursor distortion interval
            const cursorInterval = setInterval(() => {
                const shouldDistort = Math.random() > 0.3;
                setIsCursorDistorted(shouldDistort);
            }, Math.random() * (500 - 200) + 200);
            ambientEffectIntervalsRef.current.push(cursorInterval);

        }

        // Cleanup function for this effect (runs on unmount or when isOSShaking changes)
        return () => {
            console.log("App.tsx useEffect [isOSShaking] cleanup function running (return).");
            ambientEffectIntervalsRef.current.forEach(clearInterval);
            ambientEffectIntervalsRef.current = [];
            // Also explicitly turn off states in cleanup
            setShowGlitchOverlay(false);
            setShowFlashOverlay(false);
            setShowGhostlyOverlay(false);
            setIsCursorDistorted(false);
            if (document.body.classList.contains(styles.distortedCursor)) {
                document.body.classList.remove(styles.distortedCursor);
            }
            if (ambientAudioRef.current) { // Ensure ambient audio also stops
                ambientAudioRef.current.pause();
                ambientAudioRef.current.currentTime = 0;
            }
        };
    }, [isOSShaking]);


    // Effect for applying/removing distorted cursor class, separate for clarity
    useEffect(() => {
        if (isCursorDistorted) {
            document.body.classList.add(styles.distortedCursor);
        } else {
            document.body.classList.remove(styles.distortedCursor);
        }
    }, [isCursorDistorted]);


    // Global cleanup for when App component unmounts
    useEffect(() => {
        return () => {
            console.log("App.tsx Component Unmounting: Performing final cleanup.");
            clearAllHorrorTimersAndResetStates();
        };
    }, [clearAllHorrorTimersAndResetStates]);


    return (
        <div className={`${styles.appContainer} ${isOSShaking ? styles.osShakeActive : ''}`}>
            {showWarningScreen ? (
                <WarningScreen onStart={handleStartOS} />
            ) : (
                <OSShakeContext.Provider value={osShakeContextValue}>
                    <ProzillaOS
                        key={resetCounter} // Key to force re-mount when resetCounter changes
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
                </OSShakeContext.Provider>
            )}

            <audio ref={ambientAudioRef} src={UNSETTLING_AMBIENT_AUDIO} preload="auto" />
            <audio ref={jumpscareAudioRef} src={JUMPSCARE_AUDIO} preload="auto" />

            {/* Overlays */}
            {isFadingToWhite && <div className={styles.whiteFadeOverlay}></div>}
            {isOSShaking && <div className={styles.vignetteOverlay}></div>}

            {showGlitchOverlay && <div className={styles.glitchOverlay}></div>}

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

            {showJumpscare && (
                <div className={styles.jumpscareOverlay}>
                    <img
                        src={JUMPSCARE_GIF_URL}
                        alt="Jumpscare"
                        className={styles.jumpscareImage}
                    />
                </div>
            )}
        </div>
    );
}