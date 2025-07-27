// src/context/OSShakeContext.tsx
import { createContext } from 'react';

interface OSShakeContextType {
  setIsOSShaking: React.Dispatch<React.SetStateAction<boolean>>;
  initiateJumpscareSequence: () => void;
  isOSShaking: boolean;
  // Re-introducing: State to track if jumpscare has been scheduled
  jumpscareScheduled: boolean;
  setJumpscareScheduled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OSShakeContext = createContext<OSShakeContextType>({
  setIsOSShaking: () => {},
  initiateJumpscareSequence: () => {},
  isOSShaking: false,
  // Provide default values for the new state
  jumpscareScheduled: false,
  setJumpscareScheduled: () => {},
});