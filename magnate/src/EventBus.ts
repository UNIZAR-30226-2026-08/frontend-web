import { Events } from 'phaser';

export const EventBus = new Events.EventEmitter();



if (typeof window !== 'undefined') {
    (window as any).PhaserEventBus = EventBus;
}