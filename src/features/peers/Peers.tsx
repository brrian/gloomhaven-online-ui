import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { useStore } from '../../store';
import styles from './Peers.module.scss';

const Peers: FC = () => {
  const { peers, session } = useStore();

  return (
    <div className={styles.container}>
      <div>{session.name}</div>
      {peers.peerConnections.map(connection => (
        <div key={connection.id}>{connection.name}</div>
      ))}
    </div>
  );
};

export default observer(Peers);
