import { useContext, useRef } from 'react';
import { PerformanceContext } from '../../contexts/PerformanceContext';
import { useLightbulbsPerformancePositions } from '../../hooks/useLightbulbsPerformancePositions';
import Section from '../../layout/Section';
import styles from './performance-preview-section.module.scss';

export const PerformancePreviewSection = () => {
  const performanceState = useContext(PerformanceContext);
  const [lightbulbsPerformancePositions, setLightbulbsPerformancePositions] =
    useLightbulbsPerformancePositions();
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const moveLightbulb = (id: number, x: number, y: number) => {
    console.log('moveLightbulb', id, x, y);
    setLightbulbsPerformancePositions((prev) => ({
      ...prev,
      [id]: {
        x,
        y,
      },
    }));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const id = Number(e.currentTarget.dataset.id);
    e.dataTransfer.setData('id', id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData('id'));
    const { x, y } = previewContainerRef.current!.getBoundingClientRect();
    moveLightbulb(id, e.clientX - x - 53, e.clientY - y - 53);
  };

  return (
    <Section title="Performance preview">
      <div
        className={styles.performancePreview}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        ref={previewContainerRef}
      >
        {performanceState.state.lightbulbs.map((lightbulb) => (
          <div
            key={lightbulb.id}
            style={
              {
                '--x': `${
                  lightbulbsPerformancePositions[lightbulb.id]?.x || 0
                }px`,
                '--y': `${
                  lightbulbsPerformancePositions[lightbulb.id]?.y || 0
                }px`,
              } as React.CSSProperties // trust me bro, it's fine
            }
            draggable
            onDragStart={handleDragStart}
            onClick={() => {
              performanceState.dispatch({
                type: 'SET_LIGHTBULB_STATE',
                payload: {
                  id: lightbulb.id,
                  state: !lightbulb.state,
                },
              });
            }}
            data-id={lightbulb.id}
            className={`${styles.lightbulbPreview} ${
              lightbulb.reachable && styles.reachable
            }`}
          >
            <div
              className={`${styles.stateIndicator} ${
                lightbulb.state && styles.on
              }`}
            ></div>
            <div className={styles.caption}>{lightbulb.caption}</div>
            <div className={styles.name}>( {lightbulb.name} )</div>
          </div>
        ))}
      </div>
    </Section>
  );
};
