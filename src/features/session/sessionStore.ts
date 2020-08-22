import { decorate, observable } from 'mobx';
import { Ploppable } from '../plops/models';
import {
  Handler,
  JoinedSession,
  Scenario,
  Session,
  Subscriptions,
} from './models';

export default class SessionStore {
  public connection?: WebSocket;

  public id?: string;

  public scenario?: Scenario;

  private subscriptions: Subscriptions = {};

  public createSession = async (): Promise<void> => {
    if (!this.connection) {
      await this.createConnection();
    }

    this.emitEvent('createSession');
  };

  public emitEvent = (action: string, payload: any = {}): void => {
    this.connection?.send(
      JSON.stringify({
        action,
        payload: {
          sessionId: this.id,
          ...payload,
        },
      })
    );
  };

  public initializeSession = (session: Session): void => {
    this.id = session.id;

    this.scenario = session.scenario;
  };

  public joinSessionById = async (sessionId: string): Promise<void> => {
    await this.createConnection();

    const handleSessionJoined = ({ session }: JoinedSession) => {
      this.initializeSession(session);

      this.unsubscribe('sessionJoined', handleSessionJoined);
    };

    this.subscribe('sessionJoined', handleSessionJoined);

    this.emitEvent('joinSession', { sessionId });
  };

  public placeAsset = (plop: Ploppable): void => {
    if (this.scenario) {
      this.scenario.assets[plop.id] = {
        ...plop,
        inTransit: false,
      };

      if (plop.clonedFromAsset) {
        delete this.scenario.assets[plop.clonedFromAsset];
      }

      this.emitEvent('updateScenario', {
        scenario: this.scenario,
      });
    }
  };

  public subscribe = (action: string, handler: Handler): void => {
    if (!this.subscriptions[action]) {
      this.subscriptions[action] = [];
    }

    this.subscriptions[action].push(handler);
  };

  public updateAsset = (id: string, updates: Partial<Ploppable>): void => {
    if (this.scenario) {
      this.scenario.assets[id] = {
        ...this.scenario.assets[id],
        ...updates,
      };

      this.emitEvent('updateScenario', {
        scenario: this.scenario,
      });
    }
  };

  public unsubscribe = (action: string, handler: Handler): void => {
    if (!this.subscriptions[action]) {
      return;
    }

    this.subscriptions[action] = this.subscriptions[action].filter(
      subscribedHandler => subscribedHandler !== handler
    );
  };

  public updateScenario = (scenario: Scenario): void => {
    this.scenario = scenario;
  };

  private createConnection = (): Promise<void> => {
    return new Promise(resolve => {
      if (!process.env.REACT_APP_WEBSOCKET_ENDPOINT) {
        throw new Error(
          'Env variable REACT_APP_WEBSOCKET_ENDPOINT is not defined'
        );
      }

      this.connection = new WebSocket(process.env.REACT_APP_WEBSOCKET_ENDPOINT);

      this.connection.addEventListener('open', () => resolve(), {
        once: true,
      });

      this.connection.addEventListener('message', event => {
        try {
          const { action, payload } = JSON.parse(event.data);

          this.notifySubscriptions(action, payload);
        } catch (error) {
          console.error(`Unable to notify subscriptions: "${error.message}"`);
        }
      });
    });
  };

  private notifySubscriptions = (action: string, payload: any) => {
    const handlers = this.subscriptions[action];

    if (!handlers) {
      return;
    }

    for (const handler of handlers) {
      handler(payload);
    }
  };
}

decorate(SessionStore, {
  connection: observable,
  scenario: observable,
});
