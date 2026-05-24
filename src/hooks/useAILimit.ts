import { useState, useEffect } from 'react';
import { isDailyLimitReached, getUsage } from '../services/geminiService';
import { USAGE_KEY } from '../services/geminiService';

export const useAILimit = () => {
  const [limitReached, setLimitReached] = useState(isDailyLimitReached());
  const [usageCount, setUsageCount] = useState(getUsage().creditsUsed);

  useEffect(() => {
    const handleStorageChange = () => {
      setLimitReached(isDailyLimitReached());
      setUsageCount(getUsage().creditsUsed);
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('ai-usage-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ai-usage-updated', handleStorageChange);
    };
  }, []);

  return { limitReached, usageCount };
};
