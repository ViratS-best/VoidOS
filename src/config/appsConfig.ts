import { AppsConfig, browser, calculator, fileExplorer, settings, terminal, textEditor } from "prozilla-os";

// Set the default homepage for the browser app using windowOptions
browser.windowOptions = {
    ...(browser.windowOptions || {}),
    url: "https://www.google.com/search?igu=1&q=whats up?"
};

export const appsConfig = new AppsConfig({
    apps: [
        fileExplorer.setName("File Explorer")
            .setDescription("Application for browsing files."),
        terminal.setName("Terminal"),
        textEditor.setName("Text Editor"),
        browser
            .setName("Web Browser")
            .setDescription("Browse the web with this browser app."),
        calculator.setName("Calculator")
            .setDescription("Perform calculations with this calculator app."),
        settings.setName("Settings")
            .setDescription("Configure system settings.")
    ]
});
