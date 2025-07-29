import { AppsConfig, browser, calculator, fileExplorer, settings, Vector2 } from "prozilla-os";
import { myTerminalApp } from "../main";
import { myTextEditorApp } from "../apps/myTextEditorApp";
import { myLockedNotesApp } from "../apps/lockedNotesApp";

browser.windowOptions = {
    ...(browser.windowOptions || {}),
    url: "https://www.google.com/search?igu=1&q=whats up?",
    // Corrected: Added a default size to satisfy the type check
    size: {
        x: 1000,
        y: 800
    } as Vector2
};

export const appsConfig = new AppsConfig({
    apps: [
        fileExplorer.setName("File Explorer")
            .setDescription("Application for Browse files."),
        myTerminalApp,
        myTextEditorApp,
        myLockedNotesApp,
        browser
            .setName("Web Browser")
            .setDescription("Browse the web with this browser app."),
        calculator.setName("Calculator")
            .setDescription("Perform calculations with this calculator app."),
        settings.setName("Settings")
            .setDescription("Configure system settings.")
    ]
});