import { useLocalStorage } from './useLocalStorage';

export const useLightbulbsPerformancePositions = () => {
  const [lightbulbsPerformancePositions, setLightbulbsPerformancePositions] =
    useLocalStorage<{
      [key: number]: { x: number; y: number };
    }>('lightbulbs_positions', {});

  return [
    lightbulbsPerformancePositions,
    setLightbulbsPerformancePositions,
  ] as const;
};
