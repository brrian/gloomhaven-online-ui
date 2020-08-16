import { observer } from 'mobx-react-lite';
import React, { FC, MouseEvent, useEffect, useRef } from 'react';
import { usePlopsStore } from '../../store';
import { Ploppable } from './models';
import styles from './Plopper.module.scss';

interface PlopperProps {
  isDragging: boolean;
  mapX: number;
  mapY: number;
  onPlop: (item: Ploppable) => void;
  scale: number;
}

const Plopper: FC<PlopperProps> = ({
  isDragging,
  mapX,
  mapY,
  onPlop,
  scale,
}) => {
  const rotationIndexRef = useRef(0);

  const { activePlop, deletePlopById, updatePlop } = usePlopsStore();

  useEffect(() => {
    const handleKeyDown = ({ key }: KeyboardEvent) => {
      if (key === 'r' || key === 'R') {
        rotationIndexRef.current += key === 'r' ? 1 : -1;

        if (activePlop) {
          updatePlop(activePlop.id, {
            rotation: (rotationIndexRef.current * 30) % 360,
          });
        }
      }
    };

    document.body.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePlop, updatePlop]);

  const handleMouseMove = ({
    clientX,
    clientY,
  }: MouseEvent<HTMLDivElement>) => {
    if (activePlop) {
      const x = (clientX - mapX) / scale - activePlop.width / 2;
      const y = (clientY - mapY) / scale - activePlop.height / 2;

      updatePlop(activePlop.id, { x, y });
    }
  };

  const handleClick = () => {
    if (!isDragging && activePlop) {
      onPlop(activePlop);

      deletePlopById(activePlop.id);
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

export default observer(Plopper);
