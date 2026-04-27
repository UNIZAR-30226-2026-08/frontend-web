import * as Phaser from 'phaser';
export class BuildingToken extends Phaser.GameObjects.Container {
    buildingType;
    bodyRect;
    roofGraphics;
    constructor(scene, x, y, type = 'house') {
        super(scene, x, y);
        this.buildingType = type;
        const config = this.getBuildingConfig(type);
        const shadow = scene.add.rectangle(3, 3, config.width, config.height, 0x000000, 0.3);
        this.bodyRect = scene.add.rectangle(0, 0, config.width, config.height, config.color)
            .setStrokeStyle(2, 0xffffff, 0.6);
        // tejado
        this.roofGraphics = scene.add.graphics();
        this.drawTopDownRoof(config.width, config.height, config.color);
        this.add([shadow, this.bodyRect, this.roofGraphics]);
        this.setDepth(50);
        this.setScale(0);
        scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });
        scene.add.existing(this);
    }
    getBuildingConfig(type) {
        return {
            color: type === 'hotel' ? 0xc1121f : 0x058c42,
            width: type === 'hotel' ? 30 : 16,
            height: type === 'hotel' ? 22 : 18,
        };
    }
    drawTopDownRoof(width, height, color) {
        this.roofGraphics.clear();
        const colorObj = Phaser.Display.Color.IntegerToColor(color);
        const lightColor = colorObj.clone().lighten(15).color;
        const darkColor = colorObj.clone().darken(10).color;
        const w = width / 2;
        const h = height / 2;
        const inset = width * 0.3; // Profundidad del tejado
        // --- Pendiente 1 (Izquierda) - tono claro ---
        this.roofGraphics.fillStyle(lightColor, 1);
        this.roofGraphics.beginPath();
        this.roofGraphics.moveTo(-w, -h);
        this.roofGraphics.lineTo(-w + inset, 0);
        this.roofGraphics.lineTo(-w + inset, h);
        this.roofGraphics.lineTo(-w, h);
        this.roofGraphics.closePath();
        this.roofGraphics.fillPath();
        // --- Pendiente 2 (Derecha) - tono oscuro ---
        this.roofGraphics.fillStyle(darkColor, 1);
        this.roofGraphics.beginPath();
        this.roofGraphics.moveTo(w, -h);
        this.roofGraphics.lineTo(w - inset, 0);
        this.roofGraphics.lineTo(w - inset, h);
        this.roofGraphics.lineTo(w, h);
        this.roofGraphics.closePath();
        this.roofGraphics.fillPath();
        // --- línea central ---
        this.roofGraphics.lineStyle(2, 0xffffff, 0.8);
        this.roofGraphics.beginPath();
        this.roofGraphics.moveTo(-w + inset, 0);
        this.roofGraphics.lineTo(w - inset, 0);
        this.roofGraphics.strokePath();
    }
    upgradeToHotel() {
        if (this.buildingType === 'hotel')
            return;
        this.buildingType = 'hotel';
        const config = this.getBuildingConfig('hotel');
        this.scene.tweens.add({
            targets: this,
            scale: 1.2,
            duration: 200,
            yoyo: true,
            onYoyo: () => {
                this.bodyRect.setSize(config.width, config.height);
                this.bodyRect.setFillStyle(config.color);
                this.drawTopDownRoof(config.width, config.height, config.color);
            }
        });
    }
}
