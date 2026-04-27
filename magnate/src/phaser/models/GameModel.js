import { PlayerModel } from './PlayerModel';
import { PropertyModel } from './PropertyModel';
// TODO: esto es de momento, se queja porque el fichero esta en javaScript
// @ts-ignore 
import { fetchUserNamePiece } from '@/api/userServices';
import boardConfig from '../../../public/data/board.json';
import moneyConfig from '../../../public/data/money.json';
export class GameModel {
    gameId = "";
    // public active_phase_player: string = "waiting-for-players";	// sup. ID
    // public active_turn_player: string = "waiting-for-players";	// sup. ID
    active_phase_player = 0; // sup. ID
    active_turn_player = 0; // sup. ID
    phase = "business"; // other than roll the dices
    streak = 0; // nº of doubles hits 3 -> go to jail
    parking_money = 0;
    current_turn = 0; // round number
    isPaused = false; // otro para isFinished?
    boardProperties = {}; // Record es como un diccionario https://typescriptutorial.com/es/diccionarios/
    players = {};
    orderedPlayers = [];
    currentFantasyEvent = null;
    updateState(new_state) {
        this.active_phase_player = new_state.active_phase_player;
        this.active_turn_player = new_state.active_turn_player;
        this.phase = new_state.phase;
        this.streak = new_state.streak;
        this.parking_money = new_state.parking_money;
        this.current_turn = new_state.current_turn;
        if (this.phase !== 'choose_fantasy') { // si salimos de la fase, limpiamos
            this.currentFantasyEvent = null;
        }
        // Players
        this.orderedPlayers.forEach((playerId) => {
            this.setPlayerBalance(playerId, new_state.money[playerId] || 0);
            this.updatePlayerPosition(playerId, new_state.positions[playerId]);
            const player = this.getPlayer(playerId);
            if (player) {
                player.jailRemainingTurns = new_state.jail_remaining_turns[playerId] || 0;
            }
        });
        new_state.property_relationships.forEach((propInfo) => {
            const propId = String(propInfo.square).padStart(3, '0');
            this.setPropertyOwner(propId, propInfo.owner ? String(propInfo.owner) : null);
            this.setPropertyHouses(propId, propInfo.houses || 0);
            this.setPropertyMortgaged(propId, propInfo.mortgage || false);
        });
    }
    async populate(new_state) {
        // Initial setting
        this.gameId = new_state.id;
        this.active_phase_player = new_state.active_phase_player;
        this.active_turn_player = new_state.active_turn_player;
        this.phase = new_state.phase;
        this.streak = new_state.streak;
        this.parking_money = new_state.parking_money;
        this.current_turn = new_state.current_turn;
        this.isPaused = false; // TODO ?
        this.orderedPlayers = new_state.ordered_players.map(id => String(id));
        const colorPalette = boardConfig.playerColors.map(c => parseInt(c.replace('#', '0x')));
        const peticiones = this.orderedPlayers.map((playerId, index) => {
            return new Promise((resolve) => {
                fetchUserNamePiece(playerId, (data) => {
                    // En cuanto llega el username, creamos el PlayerModel con el nombre real y su color
                    const finalName = (data && data.username) ? data.username : "Jugador";
                    const playerColor = colorPalette[index % colorPalette.length];
                    const playerMoney = new_state.money[playerId];
                    const player = new PlayerModel(playerId, finalName, playerColor, playerMoney);
                    player.currentTileId = String(new_state.positions[playerId]).padStart(3, '0');
                    player.jailRemainingTurns = new_state.jail_remaining_turns[playerId] || 0;
                    player.properties = new_state.property_relationships.filter(p => String(p.owner) === playerId).map(p => p.square);
                    this.players[playerId] = player;
                    resolve();
                });
            });
        });
        await Promise.all(peticiones);
        boardConfig.tiles.forEach((tile) => {
            // Solo procesamos casillas de tipo propiedad, servidor o puente
            if (!["property", "server", "bridge"].includes(tile.type))
                return;
            const propId = String(tile.id).padStart(3, '0');
            const model = new PropertyModel(propId);
            model.name = tile.name;
            const moneyData = moneyConfig.tiles.find((t) => t.id === propId);
            if (moneyData) {
                model.setMoneyData(moneyData);
            }
            // Asignación de grupos y colores
            if (tile.type === "server") {
                model.group = 13;
            }
            else if (tile.type === "bridge") {
                model.group = 14;
            }
            else {
                model.group = tile.group;
                const groupData = boardConfig.groups.find((g) => g.group === tile.group);
                if (groupData) {
                    model.color = groupData.color;
                }
            }
            this.boardProperties[propId] = model;
        });
        new_state.property_relationships.forEach((p) => {
            const propId = String(p.square).padStart(3, '0');
            const property = this.boardProperties[propId];
            if (property) {
                property.ownerId = p.owner ? String(p.owner) : null;
                property.houseCount = p.houses || 0;
                property.isMortgaged = p.mortgage || false;
                // Actualizar la lista de propiedades del jugador
                if (property.ownerId && this.players[property.ownerId]) {
                    if (!this.players[property.ownerId].properties.includes(propId)) {
                        this.players[property.ownerId].properties.push(propId);
                    }
                }
            }
        });
    }
    // ---- FUNCIONES PLAYERS ----
    get myId() {
        const id = localStorage.getItem('myId');
        return id ? String(id) : "";
    }
    isMyTurn() {
        const activePlayer = String(this.active_turn_player);
        const me = this.myId;
        return activePlayer === me;
    }
    getPlayer(playerId) {
        return this.players[playerId];
    }
    getPlayerName(playerId) {
        const player = this.players[playerId];
        return player ? player.name : `Jugador ${playerId}`;
    }
    getPlayerColor(playerId) {
        const player = this.players[playerId];
        if (!player)
            return '#ffffff';
        return `#${player.color.toString(16).padStart(6, '0')}`;
    }
    getPlayerBalance(playerId) {
        const player = this.getPlayer(playerId);
        return player?.balance ?? 0;
    }
    getPlayerProperties(playerId) {
        const player = this.getPlayer(playerId);
        return player?.properties ?? [];
    }
    getPlayerPosition(playerId) {
        const player = this.getPlayer(playerId);
        return player?.currentTileId ?? "000";
    }
    getCurrentTurnPlayerId() {
        return String(this.active_turn_player);
    }
    setParkingMoney(money) {
        this.parking_money += money;
    }
    getParkingMoney() {
        return this.parking_money;
    }
    //---- Funciones propiedades
    getProperty(propertyId) {
        return this.boardProperties[propertyId];
    }
    getPropertyHouses(propertyId) {
        return this.boardProperties[propertyId]?.houseCount ?? 0;
    }
    isPropertyMortgaged(propertyId) {
        return this.boardProperties[propertyId]?.isMortgaged ?? false;
    }
    getPropertyOwnerId(propertyId) {
        return this.boardProperties[propertyId]?.ownerId ?? null;
    }
    isPropertyOwned(propertyId) {
        const owner = this.getPropertyOwnerId(propertyId);
        return owner !== null && owner !== "";
    }
    // ---- Modificaciones
    setPropertyOwner(propertyId, newOwnerId) {
        const property = this.getProperty(propertyId);
        if (!property)
            return;
        const oldOwnerId = property.ownerId;
        // Quitar la propiedad al antiguo dueño si existía
        if (oldOwnerId && this.players[oldOwnerId]) {
            this.players[oldOwnerId].properties = this.players[oldOwnerId].properties.filter(id => id !== propertyId);
            this.players[oldOwnerId].emitUpdate();
        }
        // Asignar el nuevo dueño en la propiedad
        property.ownerId = newOwnerId;
        // Añadir la propiedad a la lista del nuevo dueño
        if (newOwnerId && this.players[newOwnerId]) {
            if (!this.players[newOwnerId].properties.includes(propertyId)) {
                this.players[newOwnerId].properties.push(propertyId);
            }
            this.players[newOwnerId].emitUpdate();
        }
    }
    setPropertyHouses(propertyId, houses) {
        const property = this.getProperty(propertyId);
        if (property) {
            property.houseCount = houses;
        }
    }
    setPropertyMortgaged(propertyId, isMortgaged) {
        const property = this.getProperty(propertyId);
        if (property) {
            property.isMortgaged = isMortgaged;
        }
    }
    // ---- Modificaciones de Jugadores (Balance)
    updatePlayerBalance(playerId, amount) {
        const player = this.getPlayer(playerId);
        if (player) {
            player.balance += amount;
        }
    }
    setPlayerBalance(playerId, amount) {
        const player = this.getPlayer(playerId);
        if (player) {
            player.balance = amount;
        }
    }
    updatePlayerPosition(playerId, newTileId) {
        const player = this.getPlayer(playerId);
        if (player) {
            player.currentTileId = String(newTileId).padStart(3, '0');
        }
    }
    getCountOwnedInGroup(groupId, playerId) {
        if (!playerId)
            return 0;
        return Object.values(this.boardProperties).filter(prop => prop.group === groupId && prop.ownerId === playerId).length;
    }
    // Returns all properties belonging to a specific color group.
    _getPropertiesInGroup(groupId) {
        return Object.values(this.boardProperties).filter(prop => prop.group === groupId);
    }
    // Checks if a player owns every property in a color group.
    ownsFullGroup(groupId, playerId) {
        const group = this._getPropertiesInGroup(groupId);
        if (group.length === 0)
            return false;
        return group.every(prop => String(prop.ownerId) === playerId);
    }
    // Checks if a property can be mortgaged.
    canMortgage(propertyId, playerId) {
        const prop = this.getProperty(propertyId);
        if (!prop || String(prop.ownerId) !== playerId || prop.isMortgaged)
            return false;
        const group = this._getPropertiesInGroup(prop.group);
        // You cannot mortgage a property if ANY property in that group has houses
        for (const prop of group) {
            if (prop.houseCount > 0)
                return false;
        }
        return true;
    }
    // ---- Funciones para ver si se puede construir casas
    // Calculates how many houses you can add to a property
    getMaxAddableHouses(propId, playerId, housePrice) {
        const targetProp = this.getProperty(propId);
        // must exist, not be mortgaged, and max 5
        if (!targetProp || targetProp.isMortgaged || targetProp.houseCount >= 5)
            return 0;
        // You must own the full group to build
        if (!this.ownsFullGroup(targetProp.group, playerId))
            return 0;
        const group = this._getPropertiesInGroup(targetProp.group);
        let minOtherHouses = 5;
        for (const p of group) {
            // Cannot build if ANY property in the group is mortgaged
            if (p.isMortgaged)
                return 0;
            if (p.id !== propId) {
                if (p.houseCount < minOtherHouses)
                    minOtherHouses = p.houseCount;
            }
        }
        // Strict building (Uniform). You can't have more than +1 house than the minimum in the street
        const maxByRule = (minOtherHouses + 1) - targetProp.houseCount;
        const money = this.getPlayerBalance(playerId);
        const maxByMoney = Math.floor(money / housePrice);
        const finalMax = Math.min(maxByRule, maxByMoney);
        // Clamp result between 0 and the remaining space until 5 (Hotel)
        return Math.max(0, Math.min(finalMax, 5 - targetProp.houseCount));
    }
    canBuildOneMore(propId, playerId) {
        const prop = this.getProperty(propId);
        if (!prop)
            return false;
        return this.getMaxAddableHouses(propId, playerId, prop.buildPrice) > 0;
    }
    // Comprueba si se puede quitar una casa de esta propiedad
    canSellOneMore(propId) {
        return this.getMaxRemovableHouses(propId) > 0;
    }
    // Calculates how many houses you can sell following the uniform rule.
    getMaxRemovableHouses(propId) {
        const targetProp = this.getProperty(propId);
        if (!targetProp || targetProp.houseCount <= 0)
            return 0;
        const group = this._getPropertiesInGroup(targetProp.group);
        let maxOtherHouses = 0;
        for (const p of group) {
            if (p.id !== propId) {
                if (p.houseCount > maxOtherHouses)
                    maxOtherHouses = p.houseCount;
            }
        }
        // You can't have less than -1 house than the maximum in the street
        const maxByRule = targetProp.houseCount - (maxOtherHouses - 1);
        return Math.max(0, Math.min(maxByRule, targetProp.houseCount));
    }
    // para cartas fantasía
    setFantasyEvent(type, value = null) {
        this.currentFantasyEvent = {
            type: type,
            value: value
        };
    }
    getFantasyEvent() {
        return this.currentFantasyEvent;
    }
    clearFantasyEvent() {
        this.currentFantasyEvent = null;
    }
}
