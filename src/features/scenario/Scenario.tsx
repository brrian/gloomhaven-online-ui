import { sample } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import assets from '../../assets.json';
import { useStore } from '../../store';
import { Ploppable } from '../plops/models';
import Plopper from '../plops/Plopper';
import { Asset, Scenario as IScenario } from '../session/models';
import Map from './Map';

interface ScenarioProps {
  scenario: IScenario;
}

const Scenario: FC<ScenarioProps> = ({ scenario }) => {
  const { peers, plops, session } = useStore();

  // Temporary start
  const createRandomTile = () => {
    const tile = sample(assets.tiles);
    if (tile) {
      plops.createPlopper('tiles', tile.id);
    }
  };

  const createRandomMonster = () => {
    const monster = sample(assets.monsters);
    if (monster) {
      plops.createPlopper('monsters', monster.id);
    }
  };
  // Temporary end

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
          <div style={{ position: 'absolute' }}>
            <button onClick={createRandomTile}>Create tile</button>
            <button onClick={createRandomMonster}>Create monster</button>
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
