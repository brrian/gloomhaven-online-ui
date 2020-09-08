import React, { FC, useEffect, useState } from 'react';
import { useStore } from '../../store';
import AttackReveal from './AttackReveal';
import { AttackReveal as IAttackReveal } from './models';

const AttackDeck: FC = () => {
  const { session, peers } = useStore();

  const [attackReveal, setAttackReveal] = useState<IAttackReveal>();

  useEffect(() => {
    const handleAttackReveal = (payload: IAttackReveal) => {
      setAttackReveal(payload);
    };

    peers.subscribe('revealAttack', handleAttackReveal);

    return () => {
      peers.unsubscribe('revealAttack', handleAttackReveal);
    };
  }, [peers]);

  const handleAttackClick = () => {
    const attackReveal = {
      cardKey: 'crit|crit|continue',
      user: session.name,
    } as IAttackReveal;

    setAttackReveal(attackReveal);

    peers.emitEvent('revealAttack', attackReveal);
  };

  const handleAttackRevealComplete = () => {
    setAttackReveal(undefined);
  };

  return (
    <>
      <button
        onClick={handleAttackClick}
        style={{
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
          right: 0,
        }}
      >
        Attack
      </button>
      <AttackReveal
        attackReveal={attackReveal}
        onComplete={handleAttackRevealComplete}
      />
    </>
  );
};

export default AttackDeck;
