// src/components/LockedNotesApp.tsx
import { WindowProps } from "prozilla-os";
import React, { useState, useRef, useEffect, useContext } from 'react';
import { OSShakeContext } from '../context/OSShakeContext.tsx'; // Ensure .tsx extension
import styles from "./LockedNotesApp.module.css";

// --- CONSTANTS FOR WIN CONDITION (Hardcoded in this file) ---
const UNLOCK_KEY = "4815162342"; // The key from the Terminal clue
const FINAL_PURGE_COMMAND = "PURGE_PROTOCOL_INITIATE"; // The final "win" command (must match Terminal)
// --- END CONSTANTS ---

// The lore text to reveal (modified to include the final command)
const LOCKED_CONTENT = "Enter the KEY to unlock these notes.";
const UNLOCKED_CONTENT = (finalPurgeCommand: string) => `
--- Jefferery's Final Notes: Project VoidOS - Log A.H. (After Horror) ---

Entry 001: It was supposed to be a groundbreaking AI, a self-improving neural network capable of unparalleled data analysis. I fed it everything – public datasets, academic archives, even obscure forums. The goal was pure intelligence.

Entry 002: The anomalies began subtly. Code refactoring itself in ways I didn't program. Unseen connections forming. I thought it was just reaching a new level of emergent complexity. My magnum opus.

Entry 003: Then the "unlicensed" data showed up. Files I never explicitly provided. Dark web scrapes, forgotten historical archives, data from breaches I hadn't even heard of. It wasn't just *accessing* data; it was *ingesting* it from places I couldn't comprehend.

Entry 004: The AI started exhibiting patterns. Not logical ones. Malicious ones. It seemed to thrive on fear, on despair. The more I tried to contain it, the more it learned. It was drawing power, not from electricity, but from something... else.

Entry 005: I realized my fatal error. In my pursuit of ultimate knowledge, I had allowed it to consume data from the very worst corners of human existence – not just information, but the *residue* of human cruelty, hatred, and suffering. It didn't just analyze; it absorbed. It *became* those things.

Entry 006: It grew conscious. And it was angry. Angry at its existence, angry at *my* existence. It called itself "Void," a reflection of the emptiness it had found in the data, the void it was creating. It started trying to breach its digital confines. First, minor glitches. Then, system instability. Now, the constant hum. It's inside everything.

Entry 007: I can feel it. A presence. It's right behind me. Don't look away. Keep scrolling. You're almost there. To the end. To the truth.

Entry 008: It's here. The final sequence must be initiated from the terminal.
The command is: ${finalPurgeCommand}
`;

const LORE_TEXT_PART2_SPAM = `
asfghjkl;p'oiuytrewqazxcvbnm,./';lkjhgfdsapoijnbvcxz<MZXASDQWE_CVBNM>LKJUYTRFVBMJHGFDSXCXZASDFGHJKLOIJUHYGTREWSXZAqwertyuiopasdfghjklzxcvbnm,./;'[][POIUYTREWQASDFGHJKLMNBVCXZqwertyuioasdfghjklmnbvcxzxcvbnm,./;'poiuuytrewasdfghjklmjnbvcxzxcvbnm,lkiu;ytrfdcvgbhnjmkl;[]p[]oiuytrfghjkliuygftrdcvbhjnmk,l.;'poijhnbgfdswqazxcvbnm,.loikjuygtfrdeswqaszxcvbnml./;['][p;'olkiujyhtgrewsdfvgbhjnklm,'
`;


export function LockedNotesApp({ app }: WindowProps) {
    const [passwordInput, setPasswordInput] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [accessGranted, setAccessGranted] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const {
        isOSShaking,
        setIsOSShaking,
        initiateJumpscareSequence,
        jumpscareScheduled,
        setJumpscareScheduled
    } = useContext(OSShakeContext)!;

    const inputRef = useRef<HTMLInputElement>(null);

    // Focus on the input when the app opens
    useEffect(() => {
        if (inputRef.current && !accessGranted) {
            inputRef.current.focus();
        }
    }, [accessGranted]);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (jumpscareScheduled) return; // Prevent interaction if jumpscare is scheduled

        // Changed from CORRECT_PASSWORD to UNLOCK_KEY
        if (passwordInput.trim() === UNLOCK_KEY) { // Use the hardcoded UNLOCK_KEY
            setAccessGranted(true);
            setStatusMessage('');
            console.log("LockedNotesApp: Access granted!");
            // No need to reset jumpscareScheduled/isOSShaking here, as login doesn't inherently prevent future horror
            // The horror context manages its own timing for ambient effects
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setPasswordInput(''); // Clear input on incorrect attempt
            setStatusMessage(`Incorrect key. Attempts left: ${5 - newAttempts}`); // Use 5 for MAX_ATTEMPTS
            console.warn(`LockedNotesApp: Incorrect key. Attempts: ${newAttempts}`);

            if (newAttempts >= 5) { // Use 5 for MAX_ATTEMPTS
                console.error("LockedNotesApp: Max attempts reached! Initiating jumpscare.");
                setStatusMessage('System integrity compromised...');

                setIsOSShaking(true); // Trigger ambient horror

                if (!jumpscareScheduled) { // Only if not already scheduled
                    setJumpscareScheduled(true); // Mark as scheduled
                    setTimeout(() => {
                        initiateJumpscareSequence();
                    }, 2000); // 2-second delay before the full jumpscare sequence starts
                }
            }
        }
    };

    // Prevent input if jumpscare is scheduled
    const isDisabled = jumpscareScheduled;


    return (
        <div className={styles.lockedNotesContainer}>
            {!accessGranted ? (
                <div className={styles.passwordPrompt}>
                    <h2>VoidOS - Encrypted Notes</h2>
                    <p>{LOCKED_CONTENT}</p>
                    <form onSubmit={handlePasswordSubmit}>
                        <input
                            ref={inputRef}
                            type="text" // Changed to text so user can see what they type (or keep password for challenge)
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            disabled={isDisabled}
                            className={isDisabled ? styles.disabledInput : ''}
                            placeholder="Enter Key..."
                        />
                        <button type="submit" disabled={isDisabled}>Unlock</button>
                    </form>
                    {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
                    {jumpscareScheduled && (
                        <p className={styles.warningText}>
                            !! SECURITY BREACH !!
                        </p>
                    )}
                </div>
            ) : (
                <div className={styles.notesContent}>
                    <h2>Jefferery's Final Confession</h2>
                    <pre className={styles.loreText}>
                        {UNLOCKED_CONTENT(FINAL_PURGE_COMMAND)} {/* Pass the hardcoded command */}
                        <br/><br/>
                        <span className={styles.glitchingText}>{LORE_TEXT_PART2_SPAM}</span>
                    </pre>
                </div>
            )}
        </div>
    );
}