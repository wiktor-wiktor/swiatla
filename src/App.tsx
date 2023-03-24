import { useEffect, useReducer } from 'react';
import { PerformanceContext } from './contexts/PerformanceContext';
import {
  performanceReducer,
  INITIAL_STATE,
  ACTIONS,
} from './reducers/performanceReducer';

import MainContainer from './layout/MainContainer';
import Section from './layout/Section';
import LightbulbDiscoveryService from './services/LightbulbDiscoveryService';
import { LightbulbsSection } from './components/LightbulbsSection/LightbulbsSection';
import { ConfigSection } from './components/ConfigSection/ConfigSection';
import { ConnectionDialog } from './components/ConnectionDialog/ConnectionDialog';
import { TimelineSection } from './components/TimelineSection/TimelineSection';
import { PerformancePreviewSection } from './components/PerformancePreviewSection/PerormancePreviewSection';
import { useLightbulbsLastSettings } from './hooks/useLightbulbsLastSettings';

const App = () => {
  const [state, dispatch] = useReducer(performanceReducer, INITIAL_STATE);
  const [lightbulbsSettings, setLightbulbsSettings] =
    useLightbulbsLastSettings();

  const refreshLightbulbsState = (full: boolean) => {
    LightbulbDiscoveryService.discoverLightbulbs(
      state.config.hubIP,
      state.config.username,
    ).then((lightbulbs) => {
      lightbulbs.forEach((lightbulb) => {
        let payload = {};
        if (full) {
          payload = {
            id: lightbulb.id,
            name: lightbulb.name,
            caption:
              lightbulbsSettings[lightbulb.id]?.caption || lightbulb.name,
            reachable: lightbulb.reachable,
            state: lightbulb.state,
            brightness: lightbulb.brightness,
          };
        } else {
          payload = {
            id: lightbulb.id,
            name: lightbulb.name,
            reachable: lightbulb.reachable,
            state: lightbulb.state,
            brightness: lightbulb.brightness,
          };
        }

        dispatch({
          type: ACTIONS.ADD_LIGHTBULB,
          payload,
        });
      });
    });
  };

  useEffect(() => {
    if (state.isConnected) {
      //refreshLightbulbsState();

      refreshLightbulbsState(true);
      const lightbulbRefreshIntervalID = setInterval(() => {
        refreshLightbulbsState(false);
      }, 1100);

      return () => {
        clearInterval(lightbulbRefreshIntervalID);
      };
    }
  }, [state.isConnected]);

  return (
    <PerformanceContext.Provider value={{ state, dispatch }}>
      <div className="App">
        {state.isConnected && (
          <MainContainer>
            <PerformancePreviewSection />
            <TimelineSection />
            <LightbulbsSection />
            <Section title="Groups"></Section>
          </MainContainer>
        )}
        {!state.isConnected && <ConnectionDialog />}
      </div>
    </PerformanceContext.Provider>
  );
};

export default App;
