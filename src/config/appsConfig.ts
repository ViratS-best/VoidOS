// src/config/appsConfig.ts
import { AppsConfig, browser, calculator, fileExplorer, settings } from "prozilla-os";
// IMPORT YOUR NEW TERMINAL AND TEXT EDITOR APPS
import { myTerminalApp } from "../main"; // Assuming you have a custom terminal defined in main.ts/main.tsx
import { myTextEditorApp } from "../apps/myTextEditorApp"; // Import your custom text editor app instance

// Set the default homepage for the browser app using windowOptions
browser.windowOptions = {
    ...(browser.windowOptions || {}),
    url: "https://www.google.com/search?igu=1&q=whats up?" // Example, you can change this
};

export const appsConfig = new AppsConfig({
    apps: [
        fileExplorer.setName("File Explorer")
            .setDescription("Application for Browse files."),
        myTerminalApp, // CORRECT: Pass the App instance directly
        myTextEditorApp, // CORRECT: Pass the App instance directly
        browser
            .setName("Web Browser")
            .setDescription("Browse the web with this browser app."),
        calculator.setName("Calculator")
            .setDescription("Perform calculations with this calculator app."),
        settings.setName("Settings")
            .setDescription("Configure system settings.")
    ]
});