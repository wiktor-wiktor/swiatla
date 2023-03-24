import { useEffect, useRef, useState } from 'react';
import styles from './timeline-section.module.scss';
import Section from '../../layout/Section';
import { useContext } from 'react';
import { PerformanceContext } from '../../contexts/PerformanceContext';
import { ACTIONS } from '../../reducers/performanceReducer';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const TimelineSection = () => {
  const [playbackState, setPlaybackState] = useState<
    'playing' | 'paused' | 'stopped'
  >('stopped');
  const [length, setLength] = useState(24);
  const currentPosition = useRef(0);

  const [timelineMatrix, setTimelineMatrix] = useLocalStorage(
    'timelineMatrix',
    {} as { [key: number]: boolean[] },
  );

  const performanceState = useContext(PerformanceContext);

  const getMatrixRowForLightbulb = (lightbulbID: number, rowLabel?: string) => {
    let rowData = timelineMatrix[lightbulbID];
    if (!timelineMatrix[lightbulbID]) {
      const newLightbulbRow = new Array(length).fill(false);
      rowData = newLightbulbRow;
      setTimelineMatrix({
        ...timelineMatrix,
        [lightbulbID]: newLightbulbRow,
      });
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
              } ${rowData[index] && styles.on}`}
              onClick={() => {
                const newTimelineMatrix = {
                  ...timelineMatrix,
                  [lightbulbID]: rowData.map((cell, cellIndex) => {
                    if (cellIndex === index) {
                      return !cell;
                    }
                    return cell;
                  }),
                };
                setTimelineMatrix(newTimelineMatrix);
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
          if (timelineMatrix[lightbulb.id]) {
            performanceState.dispatch({
              type: ACTIONS.SET_LIGHTBULB_STATE,
              payload: {
                id: lightbulb.id,
                state: timelineMatrix[lightbulb.id][currentPosition.current],
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
