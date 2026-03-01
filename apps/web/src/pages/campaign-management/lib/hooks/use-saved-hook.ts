import { useEffect, useState } from 'react';

export const useSavedSteps = (storageKey: string, step: any) => {
  const [savedSteps, setSavedSteps] = useState<{ step: number; status: 'processed' }[]>([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const savedStepsData = Object.keys(parsed).map((key) => ({
          step: +key,
          status: 'processed' as const,
        }));
        setSavedSteps(savedStepsData);
      }
    } catch {
      // Silently handle parse errors
    }
  }, [step, storageKey]);

  return savedSteps;
};
