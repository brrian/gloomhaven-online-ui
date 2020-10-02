import { omit } from 'lodash-es';
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

  public name? = process.env.REACT_APP_DEFAULT_USER;

  private heartBeatInterval?: number;

  private retries = 0;

  private subscriptions: Subscriptions = {};

  public createSession = async (): Promise<void> => {
    if (!this.connection) {
      await this.createConnection();
    }

    this.emitEvent('createSession', { name: this.name });
  };

  public destroyAsset = (id: string): void => {
    if (this.scenario?.assets[id]) {
      delete this.scenario.assets[id];

      this.emitEvent('updateScenario', {
        scenario: this.scenario,
      });
    }
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

    this.emitEvent('joinSession', {
      name: this.name,
      sessionId,
    });
  };

  public placeAsset = (plop: Ploppable): void => {
    if (this.scenario) {
      this.scenario.assets[plop.id] = {
        ...omit(plop, 'clonedFromAsset'),
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
    if (this.scenario && !!this.scenario.assets[id]) {
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

      const handleConnectionOpen = () => {
        this.retries = 0;

        const timeout = 1000 * 55; // 55 seconds

        this.heartBeatInterval = window.setInterval(() => {
          this.emitEvent('ping');
        }, timeout);

        resolve();
      };

      if (!this.name) {
        this.name = window.prompt('Insert name') ?? 'Anonymous User';
      }

      this.connection = new WebSocket(process.env.REACT_APP_WEBSOCKET_ENDPOINT);

      this.connection.addEventListener('open', handleConnectionOpen, {
        once: true,
      });

      this.connection.addEventListener('close', this.handleConnectionClose);

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

  private handleConnectionClose = () => {
    if (this.heartBeatInterval) {
      window.clearInterval(this.heartBeatInterval);
    }

    if (this.retries <= 10) {
      this.retries += 1;

      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('Attempting to reconnect WebSocket connection...');

        this.createConnection();
      }, this.retries * 5000);
    } else {
      // eslint-disable-next-line no-console
      console.log(
        'Unable to reconnect WebSocket connection. Please refresh the page.'
      );
    }
  };

  private notifySubscriptions = (action: string, payload: any): void => {
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
  name: observable,
  scenario: observable,
});
