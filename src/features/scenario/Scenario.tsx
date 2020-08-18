import { sample } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import React, { FC, useRef, useState, WheelEvent } from 'react';
import { animated, config, to, useSpring } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import assets from '../../assets.json';
import { useStore } from '../../store';
import { Ploppable } from '../plops/models';
import Plopper from '../plops/Plopper';
import Plops from '../plops/Plops';
import Asset from './Asset';
import styles from './Scenario.module.scss';

const Scenario: FC = () => {
  // Temporary start
  const { plops, session } = useStore();

  const createRandomTile = () => {
    const tile = sample(assets.tiles);
    if (tile) {
      plops.createPlopper(tile);
    }
  };
  // Temporary end

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

  const handlePlop = (plop: Ploppable) => {
    session.placeAsset(plop);
  };

  const handlePlopUpdate = (plop: Ploppable) => {
    session.emitEvent('updatePlop', { plop });
  };

  return (
    <div {...bind()} className={styles.session} onWheel={handleContainerWheel}>
      <div style={{ position: 'absolute' }}>
        <button onClick={createRandomTile}>Create tile</button>
      </div>
      {plops.activePlop && (
        <Plopper
          isDragging={isDragging}
          mapX={x.get()}
          mapY={y.get()}
          onPlop={handlePlop}
          onPlopUpdate={handlePlopUpdate}
          scale={scale.get()}
        />
      )}
      <animated.div className={styles.map} style={{ scale, x, y }}>
        <Plops />
        {session.scenario &&
          Object.values(session.scenario.assets).map(asset => (
            <Asset key={asset.id} {...asset} />
          ))}
      </animated.div>
    </div>
  );
};

export default observer(Scenario);
