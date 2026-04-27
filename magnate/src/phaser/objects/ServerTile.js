import { Tile } from './Tile';
export class ServerTile extends Tile {
    icon;
    ownerMarker = null;
    mortgageGraphic = null;
    constructor(scene, config) {
        super(scene, config);
        this.icon = this.scene.add.image(0, 5, 'icon_server')
            .setOrigin(0.5)
            .setDisplaySize(60, 60);
        this.add(this.icon);
        const priceText = this.scene.add.text(0, 45, `${config.price}M`, {
            fontFamily: 'LTSuperior',
            fontSize: '14px',
            color: '#222222',
            align: 'center',
        }).setOrigin(0.5);
        this.add(priceText);
    }
    clearOwnerMarker() {
        if (this.ownerMarker) {
            this.ownerMarker.destroy();
            this.ownerMarker = null;
            console.log(`Marcador borrado en casilla ${this.tileConfig.id}`);
        }
    }
    setOwnerMarker(playerColor) {
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
        const marker = this.scene.add.polygon(0, tileHeight / 2, points, playerColor);
        marker.setOrigin(0, 0);
        marker.setStrokeStyle(3, 0xffffff);
        this.add(marker);
        this.sendToBack(marker);
        this.ownerMarker = marker;
    }
    updateMortgageVisual(isMortgaged) {
        const width = this.tileConfig.width || 80;
        const height = this.tileConfig.height || 120;
        if (isMortgaged) {
            if (!this.mortgageGraphic) {
                this.mortgageGraphic = this.scene.add.rectangle(0, 0, width - 2, height - 2, 0xff0000, 0.6);
                this.add(this.mortgageGraphic);
            }
            this.mortgageGraphic.setVisible(true);
            // this.nameText.setColor('#ffffff');
            this.bringToTop(this.nameText);
        }
        else {
            if (this.mortgageGraphic) {
                this.mortgageGraphic.setVisible(false);
            }
            this.nameText.setColor('#222222');
            this.bringToTop(this.nameText);
        }
    }
}
