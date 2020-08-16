import { sample } from 'lodash-es';
import React, { FC, useRef, useState, WheelEvent } from 'react';
import { animated, config, to, useSpring } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import assets from '../../assets.json';
import Overlay from '../Overlay';
import Plop from '../Plop';
import Plopper from '../Plopper';
import { Asset, Overlays, Ploppable } from './models';
import styles from './styles.module.scss';

const Session: FC = () => {
  // Temporary start
  const [overlays, setOverlays] = useState<Overlays>({});
  const [plops, setPlops] = useState<Ploppable[]>([]);
  const [plopper, setPlopper] = useState<Asset | undefined>();
  const createRandomPlop = () => {
    const tile = sample(assets.tiles);
    setPlopper(tile);
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
    setPlops(prevPlops => [...prevPlops, plop]);
  };

  return (
    <div {...bind()} className={styles.session} onWheel={handleContainerWheel}>
      <div style={{ position: 'absolute' }}>
        <button onClick={createRandomPlop}>Create tile</button>
      </div>
      {plopper && (
        <Plopper
          asset={plopper}
          isDragging={isDragging}
          mapX={x.get()}
          mapY={y.get()}
          onPlop={handlePlop}
          scale={scale.get()}
          tempSetOverlays={setOverlays}
          tempSetPlopper={setPlopper}
        />
      )}
      <animated.div className={styles.map} style={{ scale, x, y }}>
        {Object.values(overlays).map(overlay => (
          <Overlay key={overlay.id} {...overlay} />
        ))}
        {plops.map(plop => (
          <Plop key={plop.id} {...plop} />
        ))}
      </animated.div>
    </div>
  );
};

export default Session;
