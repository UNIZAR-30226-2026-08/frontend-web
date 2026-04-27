export class PropertyModel {
    id;
    name;
    ownerId;
    isMortgaged;
    group;
    houseCount = 0; // cuantas casas tiene
    color;
    buyPrice = 0; // lo que cuesta comprar propiedad
    buildPrice = 0; // precio por construir casa
    rentPrices = []; // alquileres [base, 1 casa, 2 casas, 3 casas, 4 casas, hotel]
    constructor(data) {
        if (typeof data === 'string') {
            this.id = data;
            this.name = "";
            this.color = "";
            this.houseCount = 0;
            this.ownerId = null;
            this.isMortgaged = false;
            this.group = -1;
        }
        else {
            this.id = data.square;
            this.name = data.name;
            this.color = data.color;
            this.houseCount = data.houses;
            this.ownerId = data.owner;
            this.isMortgaged = data.mortgage;
            this.group = data.group;
        }
    }
    setMoneyData(moneyData) {
        this.buyPrice = moneyData.buy_price || 0;
        this.buildPrice = moneyData.build_price || 0;
        this.rentPrices = moneyData.rent_prices || [];
    }
    // obtener el alquiler actual
    getCurrentRent() {
        if (this.isMortgaged)
            return 0;
        return this.rentPrices[this.houseCount] || 0;
    }
}
