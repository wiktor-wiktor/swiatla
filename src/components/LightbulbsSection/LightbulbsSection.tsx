import { useContext } from 'react';
import { PerformanceContext } from '../../contexts/PerformanceContext';
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
      className={styles.lightbulbPreview}
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

  return (
    <Section className={styles.lightbulbsSection} title="Lightbulbs">
      {performanceState.state.lightbulbs.map((lightbulb) => {
        return <LightbulbPreview key={lightbulb.id} lightbulb={lightbulb} />;
      })}
    </Section>
  );
};
