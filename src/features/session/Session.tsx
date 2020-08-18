import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../store';
import { Ploppable } from '../plops/models';
import Scenario from '../scenario/Scenario';
import { Scenario as IScenario } from './models';

interface SessionRouteParams {
  id: string;
}

const Session: FC = () => {
  const { id } = useParams<SessionRouteParams>();

  const {
    plops: { updatePlop },
    session: {
      joinSessionById,
      scenario,
      subscribe,
      unsubscribe,
      updateScenario,
    },
  } = useStore();

  useEffect(() => {
    const handlePlopUpdated = (plop: Ploppable) => {
      updatePlop(plop.id, plop);
    };

    const handleScenarioUpdated = (scenario: IScenario) => {
      updateScenario(scenario);
    };

    if (!scenario) {
      joinSessionById(id);
    } else {
      subscribe('plopUpdated', handlePlopUpdated);
      subscribe('scenarioUpdated', handleScenarioUpdated);
    }

    return () => {
      unsubscribe('plopUpdated', handlePlopUpdated);
      unsubscribe('scenarioUpdated', handleScenarioUpdated);
    };
  }, [
    id,
    joinSessionById,
    scenario,
    subscribe,
    unsubscribe,
    updatePlop,
    updateScenario,
  ]);

  return scenario ? <Scenario /> : <div>no scenario</div>;
};

export default observer(Session);
