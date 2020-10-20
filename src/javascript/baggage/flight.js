class Flight {
    constructor(country, country_code, code, capital, nextDate, transferDate, flightIndex) {

        this.country = country;
        this.country_code = country_code;
        this.code = code;
        this.capital = capital;
        this.nextDate = nextDate;
        this.transferDate = transferDate;
        this.flightIndex = flightIndex;
    }

    getNextDate() {
        return this.nextDate;
    }

    getFlightIndex() {
        return this.flightIndex;
    }

    setNextDate(value) {
        this.nextDate = value;
    }

    getTransferDate() {
        return this.transferDate;
    }

    setTransferDate(value) {
        this.transferDate = value;
    }
}

export default Flight;
