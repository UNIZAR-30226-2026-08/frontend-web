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
	public group: number;

    constructor(data: string | PropertyInfo) {
		if (typeof data === 'string') {
        	this.id = data;
        	this.houseCount = 0;
        	this.ownerId = null; 
        	this.isMortgaged = false;
			this.group = -1;
		} else {
			this.id = data.square;
			this.houseCount = data.houses;
			this.ownerId = data.owner;
			this.isMortgaged = data.mortgage;
			this.group = data.group;
		}
    }

}
