import { decorate, observable } from 'mobx';
import Peer, { SignalData } from 'simple-peer';
import { Handler, PeerConnection, SignalEvent, Subscriptions } from './models';

export default class PeersStore {
  public peerConnections: PeerConnection[] = [];

  private subscriptions: Subscriptions = {};

  public createPeer = (targetConnection: string): void => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
    });

    peer.on('signal', signal => {
      this.notifySubscriptions('sendSignalRequested', {
        signal,
        targetConnection,
      });
    });

    peer.on('data', this.handleDataReceived);

    this.peerConnections.push({
      connectionId: targetConnection,
      peer,
    });
  };

  public emitEvent = (action: string, payload: any = {}): void => {
    for (const peerConnection of this.peerConnections) {
      try {
        peerConnection.peer.send(JSON.stringify({ action, payload }));
      } catch (error) {
        this.peerConnections = this.peerConnections.filter(
          ({ connectionId }) => connectionId !== peerConnection.connectionId
        );
      }
    }
  };

  public onReturnSignalReceived = ({
    connectionId,
    signal,
  }: SignalEvent): void => {
    const peerConnection = this.peerConnections.find(
      peerConnection => peerConnection.connectionId === connectionId
    );

    peerConnection?.peer.signal(signal);
  };

  public onSignalReceived = ({ connectionId, signal }: SignalEvent): void => {
    this.addPeer(connectionId, signal);
  };

  public subscribe = (action: string, handler: Handler): void => {
    if (!this.subscriptions[action]) {
      this.subscriptions[action] = [];
    }

    this.subscriptions[action].push(handler);
  };

  public unsubscribe = (action: string, handler: Handler): void => {
    if (!this.subscriptions[action]) {
      return;
    }

    this.subscriptions[action] = this.subscriptions[action].filter(
      subscribedHandler => subscribedHandler !== handler
    );
  };

  private addPeer = (targetConnection: string, signal: SignalData) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
    });

    peer.on('signal', signal => {
      this.notifySubscriptions('returnSignalRequested', {
        signal,
        targetConnection,
      });
    });

    peer.on('data', this.handleDataReceived);

    peer.signal(signal);

    this.peerConnections.push({
      connectionId: targetConnection,
      peer,
    });
  };

  private handleDataReceived = (data: Uint8Array) => {
    const { action, payload } = JSON.parse(data.toString());

    this.notifySubscriptions(action, payload);
  };

  private notifySubscriptions = (action: string, payload: any = {}) => {
    const handlers = this.subscriptions[action];

    if (!handlers) {
      return;
    }

    for (const handler of handlers) {
      handler(payload);
    }
  };
}

decorate(PeersStore, {
  peerConnections: observable,
});
