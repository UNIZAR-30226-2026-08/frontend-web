import { EventBus } from '@/EventBus';

export class GameService {
    private socket: WebSocket | null = null;

    public connectToQueue() {
        const url = 'ws://localhost:8000/ws/queue/public/';  // TODO: dir que pone en el backend
        this.socket = new WebSocket(url);
    }

}