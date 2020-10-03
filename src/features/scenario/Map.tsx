import cc from 'classcat';
import { observer } from 'mobx-react-lite';
import React, { FC, ReactNode, useRef, useState, WheelEvent } from 'react';
import { animated, config, to, useSpring } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import Plops from '../plops/Plops';
import { Asset as IAsset, Assets } from '../session/models';
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
  onAssetMove: (asset: IAsset) => void;
}

const Map: FC<MapProps> = ({ assets, children, onAssetMove }) => {
  const [isDragging, setIsDragging] = useState(false);

  const mapInitialDragCoords = useRef([0, 0]);

  const [{ scale, x, y }, set] = useSpring(() => ({
    config: config.stiff,
    scale: 0.6,
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

  const handleContainerWheel = ({
    clientX,
    clientY,
    deltaY,
  }: WheelEvent<HTMLDivElement>) => {
    const zoomDelta = Math.max(Math.min(20, deltaY), -20) * 0.01;

    const prevScale = scale.get();

    const newScale = Math.min(Math.max(0.4, prevScale + zoomDelta), 1);

    const mouseX = (clientX - x.get()) / prevScale;
    const mouseY = (clientY - y.get()) / prevScale;

    set({
      scale: newScale,
      x: clientX - mouseX * newScale,
      y: clientY - mouseY * newScale,
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
          <Asset
            asset={asset}
            className={cc({
              [styles.asset]: true,
              [styles.inTransit]: asset.inTransit,
            })}
            key={asset.id}
            onDoubleClick={onAssetMove}
          />
        ))}
      </animated.div>
    </div>
  );
};

export default observer(Map);
