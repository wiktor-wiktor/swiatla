import { useContext, useEffect, useState } from 'react';
import { PerformanceContext } from '../../contexts/PerformanceContext';
import LightbulbDiscoveryService from '../../services/LightbulbDiscoveryService';

import BridgeImage from './assets/bridge.png';
import BridgeButtonClickImage from './assets/bridge-button-click.png';

import styles from './connection-dialog.module.scss';
import { ACTIONS } from '../../reducers/performanceReducer';

export const ConnectionDialog = () => {
  const performanceState = useContext(PerformanceContext);
  const [isConnecting, setIsConnecting] = useState(false);
  const [bridgeButtonClickNeeded, setBridgeButtonClickNeeded] = useState(false);
  const [hubIPInputValue, setHubIPInputValue] = useState('');

  const handleConnect = async () => {
    setIsConnecting(true);
    LightbulbDiscoveryService.connectToHub(hubIPInputValue).then(
      (connectionStatus: string) => {
        setIsConnecting(false);
        console.log(connectionStatus);
        if (connectionStatus === 'bridge button not pressed') {
          setBridgeButtonClickNeeded(true);
        } else if (connectionStatus === 'connected') {
          performanceState.dispatch({
            type: ACTIONS.SET_IS_CONNECTED,
            payload: true,
          });
          performanceState.dispatch({
            type: ACTIONS.SET_USERNAME,
            payload: localStorage.getItem('hue_username') || '',
          });
        }
      },
    );
  };

  const getCurrentInstructionFragment = () => {
    if (bridgeButtonClickNeeded) {
      return (
        <div className={styles.instruction}>
          <img src={BridgeButtonClickImage} alt="Philips Hue bridge button" />
          <p>Press the button on your bridge</p>
        </div>
      );
    } else {
      return (
        <div className={styles.instruction}>
          <img src={BridgeImage} alt="Philips Hue bridge" />
          <p>Type your Bridge's IP address below and press Connect</p>
        </div>
      );
    }
  };

  useEffect(() => {
    const bridgeUserName: string = localStorage.getItem('hue_username') || '';
    if (bridgeUserName) {
      performanceState.dispatch({
        type: 'SET_IS_CONNECTED',
        payload: true,
      });
      performanceState.dispatch({
        type: 'SET_USERNAME',
        payload: bridgeUserName,
      });
      performanceState.dispatch({
        type: 'SET_HUB_IP',
        payload: localStorage.getItem('hue_bridge_ip') || '',
      });
    }
  }, []);

  return (
    <div className={styles.connectionDialog}>
      <h2>Connect</h2>
      {getCurrentInstructionFragment()}
      <label htmlFor="hubIP">Hue Bridge IP address</label>
      <input
        type="text"
        id="hubIP"
        value={hubIPInputValue}
        onChange={(e) => setHubIPInputValue(e.target.value)}
      />
      <button onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? 'Connecting...' : 'Connect'}
      </button>
    </div>
  );
};
