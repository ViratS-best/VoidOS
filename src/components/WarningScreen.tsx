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
    const inputRef = useRef<HTMLInputElement>(null); // ADD THIS REF
    const [inputEnabled, setInputEnabled] = useState(false);

    // Auto-scroll to bottom whenever output changes
    useEffect(() => {
        if (terminalOutputRef.current) {
            terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
        }
    }, [output]);

    // REMOVE THE AUTO-FOCUS EFFECT

    // New: Enable input and focus on first click anywhere in terminal or input
    const handleTerminalClick = () => {
        if (!inputEnabled) {
            setInputEnabled(true);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        } else {
            inputRef.current?.focus();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (inputEnabled) setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!inputEnabled) return;
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
        <div className={styles.terminalContainer} onClick={handleTerminalClick}>
            <div className={styles.terminalOutput} ref={terminalOutputRef}>
                {output.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
            <div className={styles.terminalInputLine}>
                <span className={styles.terminalPrompt}>{prompt}</span>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.terminalInput}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    spellCheck="false"
                    tabIndex={0}
                    autoFocus={false}
                    placeholder={inputEnabled ? "" : "Click to activate"}
                    style={!inputEnabled ? { opacity: 0.5, pointerEvents: "auto", cursor: "pointer" } : {}}
                    onClick={handleTerminalClick}
                />
            </div>
        </div>
    );
};