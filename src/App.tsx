import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { SESSION_PAGE } from './constants';
import { Session } from './features/session/models';
import { useSessionStore } from './store';

const App: FC = () => {
  const history = useHistory();

  const {
    connection,
    createSession,
    initializeSession,
    subscribe,
    unsubscribe,
  } = useSessionStore();

  useEffect(() => {
    const handleSessionCreated = (payload: Session) => {
      initializeSession(payload);

      history.push(`/${SESSION_PAGE}/${payload.id}`);
    };

    subscribe('sessionCreated', handleSessionCreated);

    return () => {
      unsubscribe('sessionCreated', handleSessionCreated);
    };
  }, [connection, history, initializeSession, subscribe, unsubscribe]);

  useEffect(() => {
    createSession();
  }, [createSession]);

  const handleCreateClick = () => {
    if (connection) {
      return;
    }

    createSession();
  };

  return (
    <div>
      <button onClick={handleCreateClick}>Create session</button>
    </div>
  );
};

export default observer(App);
