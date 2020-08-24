import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { useStore } from '../../store';
import { Ploppable } from '../plops/models';
import Plopper from '../plops/Plopper';
import PlopSelector from '../plops/PlopSelector';
import { Asset, Scenario as IScenario } from '../session/models';
import Map from './Map';
import styles from './Scenario.module.scss';

interface ScenarioProps {
  scenario: IScenario;
}

const Scenario: FC<ScenarioProps> = ({ scenario }) => {
  const { peers, plops, session } = useStore();

  useEffect(() => {
    const handleScenarioUpdated = (scenario: IScenario) => {
      session.updateScenario(scenario);
    };

    const handlePlopDestroyed = (id: string) => {
      plops.destroyPlop(id);
    };

    const handlePlopUpdated = (plop: Ploppable) => {
      plops.updatePlop(plop.id, plop);
    };

    peers.subscribe('plopDestroyed', handlePlopDestroyed);
    peers.subscribe('plopUpdated', handlePlopUpdated);
    session.subscribe('scenarioUpdated', handleScenarioUpdated);

    return () => {
      peers.unsubscribe('plopDestroyed', handlePlopDestroyed);
      peers.unsubscribe('plopUpdated', handlePlopUpdated);
      session.unsubscribe('scenarioUpdated', handleScenarioUpdated);
    };
  }, [peers, plops, session]);

  const handleAssetMove = ({ assetId, id, rotation, type, x, y }: Asset) => {
    session.updateAsset(id, {
      inTransit: true,
    });

    plops.createPlopper(type, assetId, {
      clonedFromAsset: id,
      x,
      y,
      rotation,
    });
  };

  const handlePlop = (plop: Ploppable) => {
    session.placeAsset(plop);
  };

  const handlePlopDestroy = (id: string) => {
    peers.emitEvent('plopDestroyed', id);
  };

  const handlePlopUpdate = (plop: Ploppable) => {
    peers.emitEvent('plopUpdated', plop);
  };

  return (
    <Map assets={scenario.assets} onAssetMove={handleAssetMove}>
      {({ isDragging, scale, x, y }) => (
        <>
          <div className={styles.ploppers}>
            <PlopSelector className={styles.select} label="tile" type="tiles" />
            <PlopSelector
              className={styles.select}
              label="monster"
              type="monsters"
            />
            <PlopSelector
              className={styles.select}
              label="token"
              type="tokens"
            />
            <PlopSelector
              className={styles.select}
              label="class"
              type="classes"
            />
          </div>
          {plops.activePlop && (
            <Plopper
              isDragging={isDragging}
              mapX={x}
              mapY={y}
              onPlop={handlePlop}
              onPlopDestroy={handlePlopDestroy}
              onPlopUpdate={handlePlopUpdate}
              scale={scale}
            />
          )}
        </>
      )}
    </Map>
  );
};

export default observer(Scenario);
