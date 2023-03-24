import { useContext, useEffect } from 'react';
import { PerformanceContext } from '../../contexts/PerformanceContext';
import { useLightbulbsLastSettings } from '../../hooks/useLightbulbsLastSettings';
import Section from '../../layout/Section';
import { ACTIONS } from '../../reducers/performanceReducer';
import { lightbulb } from '../../types';

import styles from './lightbulbs-section.module.scss';

const LightbulbPreview = ({ lightbulb }: { lightbulb: lightbulb }) => {
  const performanceState = useContext(PerformanceContext);

  const handleClick = () => {
    performanceState.dispatch({
      type: ACTIONS.SET_LIGHTBULB_STATE,
      payload: {
        id: lightbulb.id,
        state: !lightbulb.state,
      },
    });
  };

  return (
    <div
      onClick={handleClick}
      key={lightbulb.id}
      className={`${styles.lightbulbPreview} ${
        lightbulb.reachable && styles.reachable
      }`}
    >
      <div
        className={`${styles.stateIndicator} ${lightbulb.state && styles.on}`}
      ></div>
      <div className={styles.name}>{lightbulb.name}</div>
    </div>
  );
};

export const LightbulbsSection = () => {
  const performanceState = useContext(PerformanceContext);
  const [lightbulbsLastSettings, setLightbulbsLastSettings] =
    useLightbulbsLastSettings();

  return (
    <Section className={styles.lightbulbsSection} title="Lightbulbs">
      <div className={styles.lightbulbsTable}>
        {performanceState.state.lightbulbs.map((lightbulb) => {
          return (
            <div className={styles.row} key={lightbulb.id}>
              <div className={styles.cell}>{lightbulb.id}</div>
              <div className={styles.cell}>{lightbulb.name}</div>
              <div className={styles.cell}>
                <input
                  className={styles.bulbCaptionInput}
                  type="text"
                  value={
                    lightbulb.caption ||
                    lightbulbsLastSettings[lightbulb.id]?.caption ||
                    ''
                  }
                  onChange={(e) => {
                    performanceState.dispatch({
                      type: ACTIONS.SET_LIGHTBULB_CAPTION,
                      payload: {
                        id: lightbulb.id,
                        caption: e.target.value,
                      },
                    });
                    setLightbulbsLastSettings({
                      ...lightbulbsLastSettings,
                      [lightbulb.id]: {
                        ...lightbulbsLastSettings[lightbulb.id],
                        caption: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className={styles.cell}>
                {lightbulb.state ? 'on' : 'off'}
              </div>
              <div className={styles.cell}>
                {lightbulb.reachable ? 'reachable' : 'unreachable'}
              </div>
              <div className={styles.cell}>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={lightbulb.brightness}
                  onChange={(e) => {
                    performanceState.dispatch({
                      type: ACTIONS.SET_LIGHTBULB_BRIGHTNESS,
                      payload: {
                        id: lightbulb.id,
                        brightness: parseInt(e.target.value),
                      },
                    });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
