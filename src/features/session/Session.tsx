import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../../store';
import { SignalEvent } from '../peers/models';
import Scenario from '../scenario/Scenario';
import { JoinedSession } from './models';

interface SessionRouteParams {
  id: string;
}

const Session: FC = () => {
  const { id } = useParams<SessionRouteParams>();

  const { peers, session } = useStore();

  useEffect(() => {
    if (!session.scenario) {
      session.joinSessionById(id);
    }
  }, [id, session]);

  useEffect(() => {
    const handleSessionJoined = ({ connections }: JoinedSession) => {
      for (const connection of connections) {
        peers.createPeer(connection);
      }
    };

    const handleSendSignalRequested = (event: SignalEvent) => {
      session.emitEvent('sendSignal', event);
    };

    const handleReturnSignalRequested = (event: SignalEvent) => {
      session.emitEvent('returnSignal', event);
    };

    peers.subscribe('returnSignalRequested', handleReturnSignalRequested);
    peers.subscribe('sendSignalRequested', handleSendSignalRequested);

    session.subscribe('returnSignalReceived', peers.onReturnSignalReceived);
    session.subscribe('sessionJoined', handleSessionJoined);
    session.subscribe('signalReceived', peers.onSignalReceived);

    return () => {
      peers.unsubscribe('returnSignalRequested', handleReturnSignalRequested);
      peers.unsubscribe('sendSignalRequested', handleSendSignalRequested);

      session.unsubscribe('returnSignalReceived', peers.onReturnSignalReceived);
      session.unsubscribe('sessionJoined', handleSessionJoined);
      session.unsubscribe('signalReceived', peers.onSignalReceived);
    };
  }, [peers, session]);

  return session.scenario ? (
    <div>
      <ul
        style={{
          position: 'absolute',
          top: 75,
          zIndex: 1000,
        }}
      >
        {peers.peerConnections.map(peer => (
          <li key={peer.connectionId}>{peer.connectionId}</li>
        ))}
      </ul>
      <Scenario scenario={session.scenario} />
    </div>
  ) : (
    <div>
      no scenario
      <br />
      <Link to="/">Create session</Link>
    </div>
  );
};

export default observer(Session);
