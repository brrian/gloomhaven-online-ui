import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import Scenario from '../scenario/Scenario';

const Session: FC = () => {
  return <Scenario />;
};

export default observer(Session);
