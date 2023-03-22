import { useEffect, useRef, useState } from 'react';
import styles from './timeline-section.module.scss';
import Section from '../../layout/Section';
import { useContext } from 'react';
import { PerformanceContext } from '../../contexts/PerformanceContext';
import { ACTIONS } from '../../reducers/performanceReducer';

export const TimelineSection = () => {
  const [playbackState, setPlaybackState] = useState<
    'playing' | 'paused' | 'stopped'
  >('stopped');
  const [length, setLength] = useState(24);
  const currentPosition = useRef(0);
  const timelineMatrix = useRef<{ [key: number]: boolean[] }>(
    {} as { [key: number]: boolean[] },
  );

  const performanceState = useContext(PerformanceContext);

  const getMatrixRowForLightbulb = (lightbulbID: number, rowLabel?: string) => {
    if (!timelineMatrix.current[lightbulbID]) {
      timelineMatrix.current[lightbulbID] = new Array(length).fill(false);
    }

    return (
      <div className={styles.row}>
        <div className={styles.rowLabel}>{rowLabel}</div>
        {[...Array(length)].map((_, index) => {
          return (
            <div
              key={`${lightbulbID}-${index}`}
              className={`${styles.cell} ${
                index === currentPosition.current && styles.currentPosition
              } ${timelineMatrix.current[lightbulbID][index] && styles.on}`}
              onClick={() => {
                timelineMatrix.current[lightbulbID][index] =
                  !timelineMatrix.current[lightbulbID][index];
              }}
            ></div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (playbackState === 'playing') {
      const interval = setInterval(() => {
        currentPosition.current = (currentPosition.current + 1) % length;

        performanceState.state.lightbulbs.forEach((lightbulb) => {
          if (timelineMatrix.current[lightbulb.id]) {
            performanceState.dispatch({
              type: ACTIONS.SET_LIGHTBULB_STATE,
              payload: {
                id: lightbulb.id,
                state:
                  timelineMatrix.current[lightbulb.id][currentPosition.current],
              },
            });
          }
        });
      }, 2300);
      return () => clearInterval(interval);
    }
  }, [playbackState, length]);

  return (
    <Section className={styles.timelineSection} title="Timeline">
      <div className={styles.controls}>
        <button
          className={`${styles.controlButton}`}
          onClick={() => {
            setPlaybackState((playbackState) => {
              if (playbackState === 'playing') {
                return 'paused';
              }
              return 'playing';
            });
          }}
        >
          {playbackState === 'playing' ? 'Pause' : 'Play'}
        </button>
        <button
          className={styles.controlButton}
          onClick={() => {
            setPlaybackState('stopped');
            currentPosition.current = 0;
          }}
        >
          Stop
        </button>
      </div>
      <div className={styles.timelineMatrix}>
        <div className={`${styles.row} ${styles.timeLabels}`}>
          <div className={styles.rowLabel}></div>
          {[...Array(length)].map((_, index) => {
            return (
              <div key={index} className={styles.timeLabel}>
                {index}
              </div>
            );
          })}
        </div>
        {performanceState.state.lightbulbs.map((lightbulb) => {
          return getMatrixRowForLightbulb(lightbulb.id, lightbulb.name);
        })}
      </div>
    </Section>
  );
};
