import confetti from 'canvas-confetti';
import React, { FC, useRef } from 'react';
import { animated, useChain, useSpring } from 'react-spring';
import styles from './AttackCard.module.scss';
import { AttackCard as IAttackCard } from './models';

/*
  1. https://github.com/react-spring/react-spring/issues/1102
*/

interface AttackCardProps {
  card?: IAttackCard;
  onComplete: () => void;
}

const AttackCard: FC<AttackCardProps> = ({ card, onComplete }) => {
  // Store the card in a ref, otherwise it disappears during <AttackReveal>'s
  // useTransition un-mount phase.
  const cardRef = useRef(card);

  const { background, main, secondary, showContinue, user } =
    cardRef.current ?? {};

  const isCrit = main ? ['scenario-bless', 'crit'].includes(main) : false;
  const isMiss = main ? ['scenario-curse', 'miss'].includes(main) : false;

  const containerRef = useRef(null);
  const containerProps = useSpring({
    ref: containerRef,
    config: { mass: 8, tension: 600, friction: 100 },
    from: {
      opacity: 0,
      transform:
        'perspective(600px) translateY(100px) scale(0.3) rotateX(-80deg)',
    },
    opacity: 1,
    transform: 'perspective(600px) translate(0) scale(1.0) rotateX(0deg)',
  });

  const flipRef = useRef(null);
  const flipProps = useSpring({
    ref: flipRef,
    from: {
      opacity: 0,
      transform: 'perspective(600px) rotateX(0deg)',
    },
    opacity: 1,
    transform: 'perspective(600px) rotateX(180deg)',
    onStart: () => {
      if (!isCrit) {
        return;
      }

      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 70,
          zIndex: 1001,
        });
      }, 100);
    },
    onRest: () => {
      setTimeout(onComplete, isCrit || isMiss ? 1500 : 600);
    },
  });

  useChain([containerRef, flipRef], [0.2, 1.3]);

  const frontStyles = {
    ...flipProps,
    opacity: flipProps.opacity.to(value => 1 - value),
  } as any; /* 1 */

  const backStyles = {
    ...flipProps,
    transform: flipProps.transform.to(value => `${value} rotateX(180deg)`),
  } as any; /* 1 */

  return (
    <animated.div className={styles.card} style={containerProps as any} /* 1 */>
      <div className={styles.user}>{user}</div>
      <animated.div className={styles.front} style={frontStyles} />
      <animated.div
        className={styles.back}
        data-background={background}
        style={backStyles}
      >
        <img alt="" src={`/assets/attack-deck/${main}.png`} />
        {secondary && (
          <img
            alt=""
            className={styles.secondary}
            src={`/assets/attack-deck/${secondary}.png`}
          />
        )}
        {showContinue && (
          <img
            alt=""
            className={styles.continue}
            src={`/assets/attack-deck/continue.png`}
          />
        )}
      </animated.div>
    </animated.div>
  );
};

export default AttackCard;
