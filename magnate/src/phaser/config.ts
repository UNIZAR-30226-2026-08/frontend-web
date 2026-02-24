import * as Phaser from 'phaser';
import { Board } from './scenes/Board';

export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,  // decide si usa WebGL o canvas segun navegador
    parent: 'phaser-container', // ID del div donde se meterá el juego
    backgroundColor: '#222222',
   
    scale: {
        mode: Phaser.Scale.FIT, // Ajusta el juego al contenedor manteniendo proporciones
        width: 1920,
        height: 1080
    },
    
    scene: [Board], // Array de las escenas que tenemos
    physics: {
        default: 'arcade',
        arcade: {
            debug: false   
        }
    }
};