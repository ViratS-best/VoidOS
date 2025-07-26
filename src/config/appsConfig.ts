import { AppsConfig, browser, calculator, fileExplorer, settings, /* Remove textEditor */ } from "prozilla-os";
// IMPORT YOUR NEW TERMINAL AND TEXT EDITOR APPS
import { myTerminalApp } from "../main";
import { myTextEditorApp } from "../apps/myTextEditorApp"; // NEW IMPORT

// Set the default homepage for the browser app using windowOptions
browser.windowOptions = {
    ...(browser.windowOptions || {}),
    url: "https://www.google.com/search?igu=1&q=whats up?"
};

export const appsConfig = new AppsConfig({
    apps: [
        fileExplorer.setName("File Explorer")
            .setDescription("Application for Browse files."),
        myTerminalApp, // Your custom terminal
        // REMOVE THE OLD TEXT EDITOR APP: textEditor.setName("Text Editor"),
        myTextEditorApp, // YOUR CUSTOM TEXT EDITOR APP HERE
        browser
            .setName("Web Browser")
            .setDescription("Browse the web with this browser app."),
        calculator.setName("Calculator")
            .setDescription("Perform calculations with this calculator app."),
        settings.setName("Settings")
            .setDescription("Configure system settings.")
    ]
});