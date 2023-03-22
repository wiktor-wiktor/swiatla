import Section from '../../layout/Section';
import { useContext } from 'react';
import { PerformanceContext } from '../../contexts/PerformanceContext';
import { ACTIONS } from '../../reducers/performanceReducer';

import styles from './config-section.module.scss';

export const ConfigSection = () => {
  const performanceState = useContext(PerformanceContext);

  return <Section className={styles.configSection} title="Config"></Section>;
};
