import React, { FC } from 'react';
import { animated, useTransition } from 'react-spring';
import AttackCard from './AttackCard';
import styles from './AttackReveal.module.scss';
import { AttackCard as IAttackCard } from './models';

/*
  1. https://github.com/react-spring/react-spring/issues/1102
*/

interface AttackRevealProps {
  card?: IAttackCard;
  onComplete: () => void;
}

const AttackReveal: FC<AttackRevealProps> = ({ card, onComplete }) => {
  const overlayTransition = useTransition(!!card, {
    config: {
      duration: card ? 400 : 200,
    },
    enter: { opacity: 1 },
    from: { opacity: 0 },
    leave: { opacity: 0 },
  });

  return overlayTransition(
    (props, isVisible) =>
      isVisible && (
        <animated.div className={styles.overlay} style={props as any /* 1 */}>
          <AttackCard card={card} onComplete={onComplete} />
        </animated.div>
      )
  );
};

export default AttackReveal;
