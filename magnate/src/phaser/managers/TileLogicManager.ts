import * as Phaser from 'phaser';
import { EventBus } from '@/EventBus';
import { PlayerModel } from '../models/PlayerModel';
import { Tile } from '../objects/Tile';
import { PropertyTile } from '../objects/PropertyTile';
import { FantasyTile } from '../objects/FantasyTile';
import { ServerTile } from '../objects/ServerTile';
import { BridgeTile } from '../objects/BridgeTile';
import { GoToJailTile } from '../objects/GoToJailTile';
import { JailTile } from '../objects/JailTile';
import { ParkingTile } from '../objects/ParkingTile';
import { TramTile } from '../objects/TramTile';
import { StartTile } from '../objects/StartTile';
import { IPropertyTile, IServerTile, ITramTile } from '../types/TileTypes';

import { CornerData } from '@/components/layout/CornerLayout';
import { GameLogicManager } from './GameLogicManager';
import { propEffect } from 'framer-motion';

const CORNER_VISUALS = new Map<Function, CornerData>([
    [GoToJailTile, { image: 'images/bodyguard.png', tileText: 'Ve a Secretaría', buttonText: 'Aceptar', sound: 'jail_door' }],
    [JailTile, { image: 'images/secretary.png', tileText: 'Secretaría', buttonText: 'Comenzar turno', sound: 'jail_turn_in' }],
    [ParkingTile, { image: 'images/caravan.png', tileText: 'Parking Gratuito', buttonText: 'Recoger dinero', sound: 'parking' }],
    [TramTile, { image: 'icons/tram.svg', tileText: 'Tranvía', buttonText: 'Elegir parada', sound: 'tram_bell' }],
]);

interface IBoardScene extends Phaser.Scene {
    sendToSecretary(playerId: string): Promise<void>;
    showToast(message: string, duration?: number): void;
}

export class TileLogicManager {
    private scene: IBoardScene;

    constructor(scene: IBoardScene) {
        this.scene = scene;
    }

    public checkTileLogic(player: PlayerModel, tile: Tile, allPlayers: { model: PlayerModel, token: any }[]) {
        const gameModel = GameLogicManager.getInstance().model;
        const config = tile.tileConfig;
       
        if (tile instanceof FantasyTile) {
            // TODO: Vendrá del backend
            const cartasFantasia = [
                { title: "Concurso de Postales EINA", description: "Ganaste el concurso anual de postales navideñas de la EINA. Tu premio: 150€.", price: 130 },
                { title: "Destino EINA", description: "Ya eres un matemático que solo tiene que ir a la EINA. Avanza a la casilla de salida.", price: 100 }
            ];
            
            const cartaAleatoria = Phaser.Utils.Array.GetRandom(cartasFantasia);

            // Evento hacia react
            EventBus.emit('show-fantasy-card', {
                ...cartaAleatoria,
                playerName: player.name,
                playerColor: '#' + player.color.toString(16).padStart(6, '0')
            });
        }
        
		else if (tile instanceof PropertyTile) {
            
            const idProp = String(tile.tileConfig.id).padStart(3, '0');
            const propModel = gameModel.getProperty(idProp);
            
            if(propModel) {
                EventBus.emit('show-property-card', {
                    id: propModel.id,
                    name: propModel.name,
                    color:propModel.color,
                    buyPrice: propModel.buyPrice,
                    buildPrice: propModel.buildPrice,
                    rentPrices: propModel.rentPrices, 
                    ownerId: propModel.ownerId,
                    player: player,
                    isMortgaged: propModel.isMortgaged,
                    currentRent: propModel.getCurrentRent()
                });
            }
        }


		else if (tile instanceof ServerTile) {
            const idService = String(tile.tileConfig.id).padStart(3, '0');
            const serviceModel = gameModel.getProperty(idService);
            
            if(serviceModel) {
                console.log(serviceModel);
                EventBus.emit('show-service-card', {
                    id: serviceModel.id,
                    name: serviceModel.name,
                    typeName: 'Servidor',
                    image:'images/server.png',
                    buyPrice: serviceModel.buyPrice,
                    rentPrices: serviceModel.rentPrices,
                    isMortgaged: serviceModel.isMortgaged,
                    ownerId: serviceModel.ownerId,
                    player: player,
                });
            }
		}

		else if (tile instanceof BridgeTile) {
			const idService = String(tile.tileConfig.id).padStart(3, '0');
            const serviceModel = gameModel.getProperty(idService);

            if(serviceModel) {
                EventBus.emit('show-service-card', {
                    id: serviceModel.id,
                    name: serviceModel.name,
                    typeName: 'Puente',
                    image:'icons/bridge.svg',
                    buyPrice: serviceModel.buyPrice,
                    rentPrices: serviceModel.rentPrices,
                    isMortgaged: serviceModel.isMortgaged,
                    ownerId: serviceModel.ownerId,
                    player: player,
                });
            }
		}

        else if (tile instanceof GoToJailTile) {
            player.jailRemainingTurns = 1;
            player.emitUpdate();
            this.scene.sendToSecretary(player.id);
        }

		else if (tile instanceof StartTile) {
            player.balance += 200;
            player.emitUpdate(); // TODO: si pasan también se cobra
        }

        else if (tile instanceof JailTile) {
            EventBus.emit('open-jail-overlay', { 
                tileId: tile.tileConfig.id,
                turnCount: player.jailRemainingTurns,
                isPrisoner: player.jailRemainingTurns >= 1 
            });
        }
        
		else {
			const cornerConfig = CORNER_VISUALS.get(tile.constructor);
		        if (cornerConfig) {
                    EventBus.emit('show-corner-tile', {
                        image: cornerConfig.image,
                        tileText: cornerConfig.tileText,
                        buttonText: cornerConfig.buttonText,
                        sound: cornerConfig.sound,
                        id: tile.tileConfig.id,
                    });
                } else {
                    console.warn(`No se ha encontrado: ${tile.constructor.name}`);
                }
		}
    }
}
