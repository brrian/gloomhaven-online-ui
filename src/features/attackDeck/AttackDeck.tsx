import { sample } from 'lodash-es';
import React, { FC, useEffect, useState } from 'react';
import { useStore } from '../../store';
import AttackReveal from './AttackReveal';
import { AttackCard } from './models';

const AttackDeck: FC = () => {
  const { session, peers } = useStore();

  const [attackCard, setAttackCard] = useState<AttackCard>();

  useEffect(() => {
    const handleAttackReveal = (payload: AttackCard) => {
      setAttackCard(payload);
    };

    peers.subscribe('revealAttack', handleAttackReveal);

    return () => {
      peers.unsubscribe('revealAttack', handleAttackReveal);
    };
  }, [peers]);

  const handleAttackClick = () => {
    const main =
      sample(['bless', 'crit', 'curse', 'scenario-curse', 'scenario-bless']) ??
      '';

    const card: AttackCard = {
      main,
      user: session.name,
    };

    setAttackCard(card);

    peers.emitEvent('revealAttack', card);
  };

  const handleAttackRevealComplete = () => {
    setAttackCard(undefined);
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
      <AttackReveal card={attackCard} onComplete={handleAttackRevealComplete} />
    </>
  );
};

export default AttackDeck;
