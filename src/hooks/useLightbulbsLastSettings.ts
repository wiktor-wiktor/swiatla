import { useLocalStorage } from './useLocalStorage';

export const useLightbulbsLastSettings = () => {
  const [lightbulbsLastSettings, setLightbulbsLastSettings] = useLocalStorage<{
    [key: number]: { bri: number; caption: string };
  }>('lightbulbs_settings', {});

  return [lightbulbsLastSettings, setLightbulbsLastSettings] as const;
};
