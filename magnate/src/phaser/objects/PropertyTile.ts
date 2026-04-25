import { Tile } from './Tile';
import { IPropertyTile } from '../types/TileTypes';
import { BuildingToken } from './BuildingToken';

export class PropertyTile extends Tile {
    private ownerMarker: Phaser.GameObjects.Polygon | null = null;
    
    private buildings: BuildingToken[] = [];
    private readonly MAX_HOUSES = 4;

    constructor(scene: Phaser.Scene, config: IPropertyTile) {
        super(scene, config);

        const colorBarHeight = 30;
        const width = config.width || 80;
        const height = config.height || 120;
        
        this.setSize(width, height);
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
        // this.input!.cursor = 'pointer';

        const colorBar = this.scene.add.rectangle(0, - (height / 2), width - 3, colorBarHeight, 
            Phaser.Display.Color.HexStringToColor(config.color).color)
            .setOrigin(0.5, 0)
            .setStrokeStyle(2, 0x000000);
        
        this.add(colorBar);

        this.nameText.setStyle({ fontSize: '14px', align: 'center' })
            .setOrigin(0.5, 0)
            .setPosition(0, -20);

        this.add(this.nameText);

        const priceText = this.scene.add.text(0, 45, `${config.price}M`, {
            fontFamily: 'LTSuperior',
            fontSize: '14px',
            color: '#222222',
            align: 'center',
        }).setOrigin(0.5);
        
        this.add(priceText);
    }

    public setOwnerMarker(playerColor: number) {
        if (this.ownerMarker) {
            this.ownerMarker.destroy();
        }
    
        const tileWidth = this.tileConfig.width || 80;
        const tileHeight = this.tileConfig.height || 120;
        
        const w = tileWidth / 2;
        const h = 25; // Height
        const cut = 10; // Depth of the triangle cut
    
        const points = [
            -w, 0,
             w, 0,
             w, h,
             0, h - cut,
            -w, h
        ];
    
        const marker = this.scene.add.polygon(
            0, 
            tileHeight / 2, 
            points, 
            playerColor
        );
    
        marker.setOrigin(0, 0); 
        marker.setStrokeStyle(3, 0xffffff);
        
        this.add(marker);
        this.sendToBack(marker);
        
        this.ownerMarker = marker as any;
    }
    
    public setConstructionLevel(level: number) {
        this.clearBuildings();

        if (level <= 0) return; // Nivel base

        const tileHeight = this.tileConfig.height || 120;
        const posY = -(tileHeight / 2) + 15;

        // Nivel = 5 -> Hotel
        if (level === this.MAX_HOUSES + 1) {
            const hotel = new BuildingToken(this.scene, 0, posY, 'hotel');
            this.add(hotel);
            this.buildings.push(hotel);
        } 
        // Nivel es 1-4, -> dibujamos casas
        else {
            const spacing = 19;
            const totalOccupiedWidth = (level - 1) * spacing;
            const startX = -(totalOccupiedWidth / 2);

            for (let i = 0; i < level; i++) {
                const posX = startX + (i * spacing);
                const house = new BuildingToken(this.scene, posX, posY, 'house');
                this.add(house);
                this.buildings.push(house);
            }
        }
    }
    
    public clearBuildings() {
        this.buildings.forEach(b => b.destroy());
        this.buildings = [];
    }
}
