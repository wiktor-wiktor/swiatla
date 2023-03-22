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

const App = () => {
  const [state, dispatch] = useReducer(performanceReducer, INITIAL_STATE);

  const refreshLightbulbsState = () => {
    LightbulbDiscoveryService.discoverLightbulbs(
      state.config.hubIP,
      state.config.username,
    ).then((lightbulbs) => {
      lightbulbs.forEach((lightbulb) => {
        dispatch({ type: ACTIONS.ADD_LIGHTBULB, payload: lightbulb });
      });
    });
  };

  useEffect(() => {
    if (state.isConnected) {
      //refreshLightbulbsState();

      const lightbulbRefreshIntervalID = setInterval(() => {
        refreshLightbulbsState();
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
            <Section title="Performance preview"></Section>
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
