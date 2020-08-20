import { observer } from 'mobx-react-lite';
import React, { FC, ReactNode, useRef, useState, WheelEvent } from 'react';
import { animated, config, to, useSpring } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import Plops from '../plops/Plops';
import { Assets } from '../session/models';
import Asset from './Asset';
import styles from './Map.module.scss';

interface MapRenderProps {
  isDragging: boolean;
  scale: number;
  x: number;
  y: number;
}

interface MapProps {
  assets: Assets;
  children: (props: MapRenderProps) => ReactNode;
}

const Map: FC<MapProps> = ({ assets, children }) => {
  const [isDragging, setIsDragging] = useState(false);

  const mapInitialDragCoords = useRef([0, 0]);

  const [{ scale, x, y }, set] = useSpring(() => ({
    config: config.stiff,
    scale: 0.35,
    x: 0,
    y: 0,
  }));

  const bind = useDrag(
    ({ dragging, first, last, movement: [mx, my] }) => {
      if (first) {
        setIsDragging(dragging);

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

      if (last) {
        setTimeout(() => {
          setIsDragging(false);
        }, 100);
      }
    },
    { filterTaps: true }
  );

  const handleContainerWheel = ({ deltaY }: WheelEvent<HTMLDivElement>) => {
    const zoomDelta = deltaY * 0.008;
    const newScale = scale.get() + zoomDelta;

    set({
      scale: Math.min(Math.max(0.2, newScale), 1),
      immediate: true,
    });
  };

  return (
    <div
      {...bind()}
      className={styles.container}
      onWheel={handleContainerWheel}
    >
      {children({
        isDragging,
        scale: scale.get(),
        x: x.get(),
        y: y.get(),
      })}
      <animated.div className={styles.map} style={{ scale, x, y }}>
        <Plops />
        {Object.values(assets).map(asset => (
          <Asset key={asset.id} {...asset} />
        ))}
      </animated.div>
    </div>
  );
};

export default observer(Map);
