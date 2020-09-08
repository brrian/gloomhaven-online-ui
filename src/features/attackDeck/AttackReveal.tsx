import React, { FC } from 'react';
import { animated, useTransition } from 'react-spring';
import AttackCard from './AttackCard';
import styles from './AttackReveal.module.scss';
import { AttackReveal as IAttackReveal } from './models';

/*
  1. https://github.com/react-spring/react-spring/issues/1102
*/

interface AttackRevealProps {
  attackReveal?: IAttackReveal;
  onComplete: () => void;
}

const AttackReveal: FC<AttackRevealProps> = ({ attackReveal, onComplete }) => {
  const overlayTransition = useTransition(!!attackReveal, {
    config: {
      duration: attackReveal ? 400 : 200,
    },
    enter: { opacity: 1 },
    from: { opacity: 0 },
    leave: { opacity: 0 },
  });

  return overlayTransition(
    (props, isVisible) =>
      isVisible && (
        <animated.div className={styles.overlay} style={props as any /* 1 */}>
          <AttackCard
            cardKey={attackReveal?.cardKey}
            onComplete={onComplete}
            user={attackReveal?.user}
          />
        </animated.div>
      )
  );
};

export default AttackReveal;
