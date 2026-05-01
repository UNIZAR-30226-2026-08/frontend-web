import { PropertyInfo } from "@/services/types/socket"

export class PropertyModel {
    public id: string;
	public name: string;
    public ownerId: string | null;
    public isMortgaged: boolean;
	public group: number;
	public houseCount: number = 0; // cuantas casas tiene
	public color: string;

	public buyPrice: number = 0;  // lo que cuesta comprar propiedad
	public buildPrice: number = 0; // precio por construir casa
	public rentPrices: number[] = []; // alquileres [base, 1 casa, 2 casas, 3 casas, 4 casas, hotel]

    constructor(data: string | PropertyInfo) {
		if (typeof data === 'string') {
        	this.id = data;
			this.name = "";
			this.color = "";
        	this.houseCount = 0;
        	this.ownerId = null; 
        	this.isMortgaged = false;
			this.group = -1;
		} else {
			this.id = data.square;
			this.name = data.name;
			this.color = data.color;
			this.houseCount = data.houses;
			this.ownerId = data.owner;
			this.isMortgaged = data.mortgage;
			this.group = data.group;
		}
    }
	
	public setMoneyData(moneyData: any) {
        this.buyPrice = moneyData.buy_price || 0;
        this.buildPrice = moneyData.build_price || 0;
        this.rentPrices = moneyData.rent_prices || [];
    }

	// obtener el alquiler actual
	public getCurrentRent(): number {
        if (this.isMortgaged) return 0;
        return this.rentPrices[this.houseCount] || 0;
    }

}
