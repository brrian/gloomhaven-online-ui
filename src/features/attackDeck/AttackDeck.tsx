import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import { useStore } from '../../store';
import AttackReveal from './AttackReveal';
import { AttackReveal as IAttackReveal, DeckState } from './models';

const AttackDeck: FC = () => {
  const { attackDeck, session, peers } = useStore();

  const getDeckState = (): DeckState => ({
    blessings: attackDeck.blessings,
    curses: attackDeck.curses,
    remaining: attackDeck.deck.length,
    shouldShuffle: attackDeck.shouldShuffle,
    total: attackDeck.deck.length + attackDeck.used.length,
  });

  // Store the delayed deck state in order to prevent revealing any details
  // before the animation has finished running.
  const [delayedDeckState, setDelayedDeckState] = useState(getDeckState());

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

  const handleDrawClick = () => {
    const attackReveal = {
      cardKey: attackDeck.draw(),
      user: session.name,
    } as IAttackReveal;

    setAttackReveal(attackReveal);

    peers.emitEvent('revealAttack', attackReveal);
  };

  const handleAttackRevealComplete = () => {
    setAttackReveal(undefined);

    updateDeckState();
  };

  const handleBlessClick = () => {
    attackDeck.addBless();

    updateDeckState();
  };

  const handleCurseClick = () => {
    attackDeck.addCurse();

    updateDeckState();
  };

  const handleResetClick = () => {
    attackDeck.reset();

    updateDeckState();
  };

  const handleShuffleClick = () => {
    attackDeck.shuffle();

    updateDeckState();
  };

  const updateDeckState = () => {
    setDelayedDeckState(getDeckState());
  };

  const {
    blessings,
    curses,
    remaining,
    shouldShuffle,
    total,
  } = delayedDeckState;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          bottom: 0,
          right: 0,
          padding: 16,
          textAlign: 'right',
        }}
      >
        <p>
          <span>({`${remaining}/${total}`})</span>{' '}
          <button onClick={handleDrawClick}>Draw</button>
        </p>
        <p>
          {shouldShuffle && (
            <span
              style={{
                position: 'relative',
                top: 1,
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                backgroundColor: 'red',
                width: 18,
                height: 18,
                borderRadius: '50%',
                marginRight: 8,
              }}
            >
              !
            </span>
          )}
          <button onClick={handleShuffleClick}>Shuffle</button>
        </p>
        <p>
          <span>({blessings})</span>{' '}
          <button onClick={handleBlessClick}>Add bless</button>
        </p>
        <p>
          <span>({curses})</span>{' '}
          <button onClick={handleCurseClick}>Add curse</button>
        </p>
        <p>
          <button onClick={handleResetClick}>Reset</button>
        </p>
      </div>
      <AttackReveal
        attackReveal={attackReveal}
        onComplete={handleAttackRevealComplete}
      />
    </>
  );
};

export default observer(AttackDeck);
