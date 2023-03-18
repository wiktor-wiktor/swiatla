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

const App = () => {
  const [state, dispatch] = useReducer(performanceReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.isConnected) {
      const lightbulbRefreshIntervalID = setInterval(() => {
        LightbulbDiscoveryService.discoverLightbulbs(
          state.config.hubIP,
          state.config.username,
        ).then((lightbulbs) => {
          lightbulbs.forEach((lightbulb) => {
            dispatch({ type: ACTIONS.ADD_LIGHTBULB, payload: lightbulb });
          });
        });
      }, 100);

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
            <LightbulbsSection />
            <Section title="Groups"></Section>
            <Section title="Timeline"></Section>
            <Section title="Performance preview"></Section>
          </MainContainer>
        )}
        {!state.isConnected && <ConnectionDialog />}
      </div>
    </PerformanceContext.Provider>
  );
};

export default App;
