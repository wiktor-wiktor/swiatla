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

const App = () => {
  const [state, dispatch] = useReducer(performanceReducer, INITIAL_STATE);

  useEffect(() => {
    const assureHubConnected = async () => {
      await LightbulbDiscoveryService.connectToHub(state.config.hubIP);

      LightbulbDiscoveryService.discoverLightbulbs().then((lightbulbs) => {
        lightbulbs.forEach((lightbulb) => {
          dispatch({ type: ACTIONS.ADD_LIGHTBULB, payload: lightbulb });
        });
      });
    };

    assureHubConnected();
  }, []);

  return (
    <PerformanceContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <MainContainer>
          <LightbulbsSection />
          <Section title="Groups"></Section>
          <Section title="Timeline"></Section>
          <Section title="Performance preview"></Section>
          <ConfigSection />
        </MainContainer>
      </div>
    </PerformanceContext.Provider>
  );
};

export default App;
