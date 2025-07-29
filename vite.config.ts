// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import svgr from 'vite-plugin-svgr'; // <--- ADD this line if you use SVG components

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr() // <--- ADD this if you are using SVGs imported as components
    ],
    server: {
        port: 3000,
    },
    // IMPORTANT: Add the 'base' property for GitHub Pages
    // It should be your repository name, with leading and trailing slashes.
    base: '/VoidOS/', // <--- ADD THIS LINE
    build: {
        outDir: 'dist', // This is Vite's default, good to keep it explicit
    },
})