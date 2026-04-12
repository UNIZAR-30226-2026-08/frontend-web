import { PropertyInfo } from "@/services/types/socket"

export class PropertyModel {
    public id: string;
    public houseCount: number;
    // Es mejor hacer esto que como lo habíamos planteado al principio
    // (meter las propiedades directamente en los jugadores). Si queremos
    // ver de quién es una propiedad, no podemos estar iterando sobre todos
    // los jugadores y todas sus propiedades
    public ownerId: string | null;
    public isMortgaged: boolean;

    constructor(id: string) {
        this.id = id;
        this.houseCount = 0;
        this.ownerId = null; 
        this.isMortgaged = false;
    }

	constructor(prop : PropertyInfo) {
		this.id = prop.square;
		this.houseCount = prop.houses;
		this.ownerId = prop.owner;
		this.isMortgaged = prop.mortgage;
	}
}
