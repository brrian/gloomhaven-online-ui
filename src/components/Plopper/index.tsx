import React, {
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { v4 as uuid } from 'uuid';
import { Asset, Overlays, Ploppable } from '../Session/models';
import styles from './styles.module.scss';

interface PlopperProps {
  asset: Asset;
  isDragging: boolean;
  mapX: number;
  mapY: number;
  onPlop: (item: Ploppable) => void;
  scale: number;
  tempSetOverlays: Dispatch<SetStateAction<Overlays>>;
  tempSetPlopper: Dispatch<SetStateAction<Asset | undefined>>;
}

const Plopper: FC<PlopperProps> = ({
  asset,
  isDragging,
  mapX,
  mapY,
  onPlop,
  scale,
  tempSetOverlays,
  tempSetPlopper,
}) => {
  const rotationIndexRef = useRef(0);

  const plopRef = useRef<Ploppable>({
    ...asset,
    asset: asset.id,
    id: uuid(),
    rotation: 0,
    type: 'tile',
    x: 0,
    y: 0,
  });

  const updateOverlays = useCallback(() => {
    tempSetOverlays(prevOverlays => ({
      ...prevOverlays,
      [plopRef.current.id]: { ...plopRef.current },
    }));
  }, [tempSetOverlays]);

  useEffect(() => {
    updateOverlays();

    const handleKeyDown = ({ key }: KeyboardEvent) => {
      if (key === 'r' || key === 'R') {
        rotationIndexRef.current += key === 'r' ? 1 : -1;

        plopRef.current.rotation = (rotationIndexRef.current * 30) % 360;

        updateOverlays();
      }
    };

    document.body.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    };
  }, [updateOverlays]);

  const handleMouseMove = ({
    clientX,
    clientY,
  }: MouseEvent<HTMLDivElement>) => {
    const x = (clientX - mapX) / scale - asset.width / 2;
    const y = (clientY - mapY) / scale - asset.height / 2;

    plopRef.current.x = x;
    plopRef.current.y = y;

    updateOverlays();
  };

  const handleClick = () => {
    if (!isDragging) {
      onPlop({ ...plopRef.current });

      tempSetOverlays(prevOverlays => {
        delete prevOverlays[plopRef.current.id];
        return prevOverlays;
      });

      tempSetPlopper(undefined);
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    />
  );
};

export default Plopper;
