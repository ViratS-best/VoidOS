// src/components/WinScreen.tsx
import React, { useContext, useEffect } from 'react'; // Import useEffect
import styles from './WinScreen.module.css';
import { OSShakeContext } from '../context/OSShakeContext';

export const WinScreen: React.FC = () => {
    const { winScreenMessage, resetGameSession } = useContext(OSShakeContext)!;

    // Handles the button click for mouse users
    const handleResetClick = () => {
        console.log("WinScreen: Button clicked, calling resetGameSession.");
        resetGameSession(); // Resets game, including random codes
        // Optional: Reload the page to ensure fresh state for ProzillaOS
        // Be cautious with reload, resetGameSession should ideally handle full reset
        // window.location.reload(); // Consider if this is truly needed or if resetGameSession is enough
    };

    // Handles the 'Enter' key press for keyboard users
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                console.log("WinScreen: Enter pressed, calling resetGameSession.");
                resetGameSession(); // Call the reset function from context
                // Optional: Reload the page
                // window.location.reload(); // Again, consider if this is truly needed
            }
        };

        // Add event listener when the component mounts
        window.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [resetGameSession]); // Depend on resetGameSession from context

    return (
        <div className={styles.winScreenOverlay}>
            <div className={styles.winScreenContent}>
                <h1 className={styles.title}>YOU WIN!</h1>
                <p className={styles.message}>{winScreenMessage}</p>

                {/* New line for the keyboard instruction */}
                <p className={styles.enterPrompt}>PRESS ENTER TO RESTART</p>
            </div>
        </div>
    );
};