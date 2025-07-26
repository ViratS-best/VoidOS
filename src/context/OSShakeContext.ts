// src/context/OSShakeContext.ts
import { createContext } from 'react';

// Define the type for the context value
interface OSShakeContextType {
    setIsOSShaking: (active: boolean) => void;
}

// Create the context with a default (dummy) value.
// This default is only used if a component tries to consume the context
// without a Provider above it in the React tree.
export const OSShakeContext = createContext<OSShakeContextType>({
    setIsOSShaking: () => console.warn('setIsOSShaking not provided by OSShakeContext.Provider'),
});