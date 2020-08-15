import React, { FC, useRef, WheelEvent } from 'react';
import { animated, config, useSpring, to } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import styles from './styles.module.scss';

const Session: FC = () => {
  const mapInitialDragCoords = useRef([0, 0]);

  const [{ scale, x, y }, set] = useSpring(() => ({
    config: config.stiff,
    scale: 0.35,
    x: 0,
    y: 0,
  }));

  const bind = useDrag(
    ({ dragging, first, movement: [mx, my] }) => {
      if (first) {
        to([x, y], (x, y) => {
          mapInitialDragCoords.current = [x, y];
        });
      }

      if (dragging) {
        const [initialX, initialY] = mapInitialDragCoords.current;

        set({
          x: mx + initialX,
          y: my + initialY,
        });
      }
    },
    { filterTaps: true }
  );

  const handleContainerWheel = ({ deltaY }: WheelEvent<HTMLDivElement>) => {
    const zoomDelta = deltaY * 0.008;
    const newScale = scale.get() + zoomDelta;

    set({
      scale: Math.min(Math.max(0.2, newScale), 1.5),
      immediate: true,
    });
  };

  return (
    <div {...bind()} className={styles.session} onWheel={handleContainerWheel}>
      <animated.div className={styles.map} style={{ x, y, scale }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          hello
        </div>
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 100,
          }}
        >
          world
        </div>
      </animated.div>
    </div>
  );
};

export default Session;
