import { Events } from 'phaser';
export const EventBus = new Events.EventEmitter();
if (typeof window !== 'undefined') {
    window.PhaserEventBus = EventBus;
}
