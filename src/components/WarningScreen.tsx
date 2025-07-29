// src/components/WarningScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './WarningScreen.module.css';

interface WarningScreenProps {
    onStart: () => void; // This function will be called to tell App.tsx to start the OS
}

export const WarningScreen: React.FC<WarningScreenProps> = ({ onStart }) => {
    const username = "system"; // A generic system user for the warning terminal
    const hostname = "console";
    const prompt = `${username}@${hostname}:~$ `;

    const [input, setInput] = useState('');
    const [output, setOutput] = useState([
        "WARNING!",
        "THIS OS CONTAINS UNSTABLE SOFTWARE... FLASHING LIGHTS!",
        "PROCEED WITH CAUTION.",
        "",
        "Welcome to the VoidOS Initialization Console.",
        "Type 'help' to proceed."
    ]);
    const terminalOutputRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom whenever output changes
    useEffect(() => {
        if (terminalOutputRef.current) {
            terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
        }
    }, [output]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput(''); // Clear input after command
        }
    };

    const handleCommand = (commandLine: string) => {
        const trimmedLowerCommand = commandLine.trim().toLowerCase();
        let newOutput = [...output, prompt + commandLine]; // Add user's command to output

        switch (trimmedLowerCommand) {
            case 'help':
                newOutput.push("--- Console Commands ---");
                newOutput.push("start - Initiate VoidOS.");
                newOutput.push("help  - Display this message.");
                newOutput.push("------------------------");
                break;
            case 'start':
                newOutput.push("Initiating VoidOS... Please standby.");
                // Call the prop to tell App.tsx to switch screens
                setTimeout(() => { // Small delay for message to appear before switch
                    onStart();
                }, 500);
                break;
            case '': // Allow empty command to just show a new prompt line
                break;
            default:
                newOutput.push(`Command not recognized: '${commandLine}'. Type 'help'.`);
                break;
        }
        setOutput(newOutput); // Update the terminal output
    };

    return (
        <div className={styles.terminalContainer}>
            <div className={styles.terminalOutput} ref={terminalOutputRef}>
                {output.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
            <div className={styles.terminalInputLine}>
                <span className={styles.terminalPrompt}>{prompt}</span>
                <input
                    type="text"
                    className={styles.terminalInput}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck="false"
                />
            </div>
        </div>
    );
};