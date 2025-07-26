// prozilla-os/src/components/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Desktop, ModalsView, ProzillaOS, Taskbar, WindowsView } from "prozilla-os";
import { appsConfig } from "../config/appsConfig";
import { desktopConfig } from "../config/desktopConfig";
import { WarningScreen } from './WarningScreen';
import { OSShakeContext } from '../context/OSShakeContext';
import styles from './App.module.css';

// Define the URL and estimated duration of the jumpscare GIF
const JUMPSCARE_GIF_URL = "https://i.pinimg.com/originals/c0/7f/97/c07f97f3234f1820d0388f1a62377a9a.gif";
const JUMPSCARE_GIF_DURATION_MS = 2500; // Estimated duration for the GIF to play (2.5 seconds)

export function App() {
    const [showWarningScreen, setShowWarningScreen] = useState(true);
    const [isOSShaking, setIsOSShaking] = useState(false);
    const [isFadingToWhite, setIsFadingToWhite] = useState(false);
    // NEW STATE: Controls whether the jumpscare GIF is currently displayed
    const [showJumpscare, setShowJumpscare] = useState(false);
    // NEW STATE: Used as a key to force ProzillaOS to completely remount, resetting its state
    const [resetCounter, setResetCounter] = useState(0);

    // Refs to hold timeout IDs for proper cleanup and sequence management
    const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const jumpscareTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const resetToWarningScreenTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleStartOS = () => {
        console.log("Starting full OS...");
        setShowWarningScreen(false);
    };

    // Main useEffect to orchestrate the entire sequence: shake -> fade -> jumpscare -> reset
    useEffect(() => {
        // Helper function to clear all active timeouts to prevent unintended triggers
        const clearAllTimeouts = () => {
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            if (jumpscareTimeoutRef.current) clearTimeout(jumpscareTimeoutRef.current);
            if (resetToWarningScreenTimeoutRef.current) clearTimeout(resetToWarningScreenTimeoutRef.current);
            fadeTimeoutRef.current = null;
            jumpscareTimeoutRef.current = null;
            resetToWarningScreenTimeoutRef.current = null;
        };

        if (isOSShaking) {
            clearAllTimeouts(); // Clear any existing sequence if the shake state changes

            // Step 1: Schedule the fade to white to START after 5 seconds of shaking
            fadeTimeoutRef.current = setTimeout(() => {
                setIsFadingToWhite(true); // This triggers the 10-second fade animation

                // Step 2: Schedule the jumpscare to APPEAR when the fade is COMPLETE (10 seconds after fade starts)
                jumpscareTimeoutRef.current = setTimeout(() => {
                    setShowJumpscare(true); // Jumpscare GIF is now displayed

                    // Step 3: Schedule the full OS reset after the GIF has played for its estimated duration
                    resetToWarningScreenTimeoutRef.current = setTimeout(() => {
                        setShowWarningScreen(true);     // Bring back the initial warning screen
                        setIsOSShaking(false);          // Reset shaking state
                        setIsFadingToWhite(false);      // Reset fade state
                        setShowJumpscare(false);        // Hide jumpscare
                        setResetCounter(prev => prev + 1); // Increment key to force ProzillaOS to remount (clean reset)
                    }, JUMPSCARE_GIF_DURATION_MS); // Duration to display the jumpscare GIF

                }, 10000); // This is the duration of the `fadeInWhite` CSS animation (from its start to full opacity)
            }, 5000); // This is the delay (in ms) from when shaking begins until the fade-to-white starts

        } else {
            // If OS stops shaking (e.g., user scrolls up in text editor, or closes it before the sequence completes)
            clearAllTimeouts(); // Stop any pending sequence
            setIsFadingToWhite(false); // Hide the fade overlay
            setShowJumpscare(false);   // Hide the jumpscare
            // We do NOT reset `showWarningScreen` here; the OS only resets back to the warning screen
            // after the entire jumpscare sequence has naturally completed.
        }

        // Cleanup function for the whole effect chain: crucial to prevent memory leaks and unexpected behavior
        return () => clearAllTimeouts();
    }, [isOSShaking]); // This effect re-runs only when the `isOSShaking` state changes

    return (
        // Apply the shaking class to the main app container
        <div className={`${styles.appContainer} ${isOSShaking ? styles.osShakeActive : ''}`}>
            {showWarningScreen ? (
                <WarningScreen onStart={handleStartOS} />
            ) : (
                <OSShakeContext.Provider value={{ setIsOSShaking }}>
                    <ProzillaOS
                        key={resetCounter} // NEW: Use `key` prop to force ProzillaOS to remount and reset its internal state
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

            {/* Conditional overlay for the fade-to-white effect */}
            {isFadingToWhite && <div className={styles.whiteFadeOverlay}></div>}

            {/* NEW: Conditional overlay for the jumpscare GIF. It should appear on top of everything. */}
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