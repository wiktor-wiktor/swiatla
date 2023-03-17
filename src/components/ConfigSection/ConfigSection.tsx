import Section from '../../layout/Section';
import { useContext } from 'react';
import { PerformanceContext } from '../../contexts/PerformanceContext';
import { ACTIONS } from '../../reducers/performanceReducer';

import styles from './config-section.module.scss';
import LightbulbDiscoveryService from '../../services/LightbulbDiscoveryService';

export const ConfigSection = () => {
  const performanceState = useContext(PerformanceContext);

  const handleConnectButtonClick = async () => {
    await LightbulbDiscoveryService.connectToHub(
      performanceState.state.config.hubIP,
    );
  };

  return (
    <Section className={styles.configSection} title="Config">
      <label htmlFor="hubIP">Hub IP</label>
      <input
        id="hubIP"
        type="text"
        value={performanceState.state.config.hubIP}
        onChange={(e) => {
          performanceState.dispatch({
            type: ACTIONS.SET_HUB_IP,
            payload: e.target.value,
          });
        }}
      />
      <input type="button" value="Connect" onClick={handleConnectButtonClick} />
    </Section>
  );
};
