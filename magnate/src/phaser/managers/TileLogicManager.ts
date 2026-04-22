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
            const propConfig = tile.tileConfig as IPropertyTile;
            // TODO: Vendrá del backend?
            const rentValues = {base: 50, house1: 200, house2: 300, house3: 400, house4: 500, hotel: 800};
            const playersData = allPlayers.map(p => ({
                id: p.model.id,
                name: p.model.name,
                color: '#' + p.model.color.toString(16).padStart(6, '0'),
            }));
            console.log("EL dueño es;", propConfig.ownerId);
            console.log("Soy el jugador con id:", player.id);
            EventBus.emit('show-property-card', {
                id: propConfig.id,
                name: propConfig.name,
                headerColor: propConfig.color || '#FFFFFF', 
                price: 100,
                rent: rentValues,
                mortgage: 100,
                housePrice: 20,
                players: playersData, // Para los resultados de la subasta
                playerName: player.name,
                playerColor: '#' + player.color.toString(16).padStart(6, '0'),
				isMortgaged: false, 		// Pruebecitas TODO JULIA
				constructionLevel: 'house1',	// Pruebecitas TODO JULIA
                ownerId: propConfig.ownerId,
                playerId: player.id
            });
        }

		else if (tile instanceof ServerTile) {
			const rent = {one:50,all:100}
			const tileConfig = tile.tileConfig as IServerTile;
			EventBus.emit('show-service-card', {
                id: tileConfig.id,
				title: tileConfig.name,
				typeName: 'Servidor',
				image:'images/server.png', // TODO override tileConfig.icon
				price: 80,
				rent: rent,
				mortgage: 100,
				isMortgaged: false,	// Pruebecitas TODO JULIA
				isAvailable: true,
				hasAll: 'all',
                playerName: player.name,
                playerColor: '#' + player.color.toString(16).padStart(6, '0'),
			});
		}

		else if (tile instanceof BridgeTile) {
			const rent = {one:50,all:100}
			const tileConfig = tile.tileConfig as IServerTile;
			EventBus.emit('show-service-card', {
                id: tileConfig.id,
				title: tileConfig.name,
				typeName: 'Puente',
				image:'icons/bridge.svg', // TODO override tileConfig.icon
				price: 80,
				rent: rent,
				mortgage: 100,
				isMortgaged: false,	// Pruebecitas TODO JULIA
				isAvailable: true,
				hasAll: 'one',
                playerName: player.name,
                playerColor: '#' + player.color.toString(16).padStart(6, '0'),
			});
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
