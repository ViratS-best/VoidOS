// src/components/MySettingsApp.tsx
import { WindowProps } from "prozilla-os";
import React, { useState } from 'react';
import styles from "./MySettingsApp.module.css";

// Define the structure for a setting page
interface SettingPage {
    id: 'apps' | 'appearance' | 'storage' | 'about' | 'accounts'; // Added 'accounts'
    name: string;
    icon: string; // Placeholder for icon paths or actual SVG imports
    component: React.FC;
}

// Components for each setting page
const AboutPage: React.FC = () => (
    <div className={styles.settingContentSection}>
        <h2>About VoidOS</h2>
        <p>VoidOS is just an OS...</p>
        <p className={styles.aboutMessage}>There is nothing more here.</p>
    </div>
);

const AccountsPage: React.FC = () => (
    <div className={styles.settingContentSection}>
        <h2>Account Details</h2>
        <p><span className={styles.label}>Name:</span> Jeffery Heckerson</p>
        <p><span className={styles.label}>Password:</span> H***T*I!</p>
        <p className={styles.warningMessage}>(This is not a real password. Real credentials should NEVER be stored or displayed.)</p>
    </div>
);

// Placeholder components for other default sections
const AppsPage: React.FC = () => (
    <div className={styles.settingContentSection}>
        <h2>Apps</h2>
        <p>App management functionality would go here.</p>
    </div>
);
const AppearancePage: React.FC = () => (
    <div className={styles.settingContentSection}>
        <h2>Appearance</h2>
        <p>Appearance settings would go here.</p>
    </div>
);
const StoragePage: React.FC = () => (
    <div className={styles.settingContentSection}>
        <h2>Storage</h2>
        <p>Storage management would go here.</p>
    </div>
);

export function MySettingsApp({ app }: WindowProps) {
    // State to manage which section is active
    const [activeSection, setActiveSection] = useState<SettingPage['id']>('about');

    const settingPages: SettingPage[] = [
        { id: 'apps', name: 'Apps', icon: '/assets/icons/apps.svg', component: AppsPage },
        { id: 'appearance', name: 'Appearance', icon: '/assets/icons/appearance.svg', component: AppearancePage },
        { id: 'storage', name: 'Storage', icon: '/assets/icons/storage.svg', component: StoragePage },
        { id: 'about', name: 'About', icon: '/assets/icons/about.svg', component: AboutPage },
        { id: 'accounts', name: 'Accounts', icon: '/assets/icons/accounts.svg', component: AccountsPage }, // New Accounts page
    ];

    // Placeholder icons. You might need to add these SVGs to your public/assets/icons folder
    // For now, these are just generic names, ProzillaOS might have its own built-in icons you can use.
    // If you see blank icons, you'll need to place actual SVG files at these paths
    // or use direct SVG imports if ProzillaOS supports that for settings panel icons.

    const CurrentPage = settingPages.find(page => page.id === activeSection)?.component || AboutPage;

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.sidebar}>
                {settingPages.map((page) => (
                    <div
                        key={page.id}
                        className={`${styles.sidebarItem} ${activeSection === page.id ? styles.active : ''}`}
                        onClick={() => setActiveSection(page.id)}
                    >
                        {/* You'd typically use an <img /> tag or a dedicated icon component here */}
                        {/* For simplicity, we'll just show the name for now, unless you add icon SVGs */}
                        {/* If you have SVG icons in public/assets/icons/, you can use: */}
                        {/* <img src={page.icon} alt={page.name} className={styles.sidebarIcon} /> */}
                        <div className={styles.sidebarIconPlaceholder}>{page.name.substring(0,2)}</div> {/* Simple placeholder */}
                        <span className={styles.sidebarItemName}>{page.name}</span>
                    </div>
                ))}
            </div>
            <div className={styles.content}>
                <CurrentPage />
            </div>
        </div>
    );
}