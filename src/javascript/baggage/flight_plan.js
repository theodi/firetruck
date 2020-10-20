let moment = require('moment');
moment().format();

import country_codes from '../data/country_codes';
import Flight from './flight';

/**
 * Flight Plan
 *
 * class and functions for setting up, displaying and updating the flight plan
 */

// states
const PRE_START         = -1;
const START             = 0;
const ARRIVED           = 1;
const ARRIVED_SHOWING   = 2;
const TRANSFER          = 3;
const TRANSFER_SHOWING  = 4;

// minutes per language, and translation
const minutesPerLanguage = 1;
const flightCodes = "BREXITDISCOMBOBULATION";
let flightCodeIndex = 0;
let updating = false;
let landing_updated = false;

// noinspection JSUnfilteredForInLoop
class FlightPlan {
    constructor()  {
        this.flightsByIndex = [];
        this.flightsByCountryIndex = [];
        this.firstCountry = "";
        this.lastTransferDate = new Date();
        this.state = PRE_START;
        this.lastIndex = 0;
    }

    addFlight(flight, index) {
        this.flightsByIndex[index] = flight;
        this.flightsByCountryIndex[flight.country] = index;

        let flightTransferDate = flight.getTransferDate();
        if (moment(this.lastTransferDate).isBefore(flightTransferDate)) {
            this.lastTransferDate = flightTransferDate;
        }
        if (this.firstCountry === "") {
            this.firstCountry = flight.country;
        }
        if (this.lastIndex < index) {
            this.lastIndex = index;
        }
    }

    getFlight(index) {
        return this.flightsByIndex[index];
    }

    getFirstArrivalIndex() {
        return this.flightsByCountryIndex[this.firstCountry];
    }

    getLastIndex() {
        return this.lastIndex;
    }

    getLastTransferDate() {
        return this.lastTransferDate;
    }

    getState() {
        return this.state;
    }

    setState(value) {
        this.state = value;
    }

    setFirstCountry(value) {
        this.firstCountry = value;
    }

    setFlightNextDate(value, index) {
        this.flightsByIndex[index].setNextDate(value);
    }

    setFlightTransferDate(value, index) {
        this.flightsByIndex[index].setTransferDate(value);
        if (this.lastTransferDate < value) {
            this.lastTransferDate = value;
        }
    }

    setUpFlightPlan() {
        let now = moment();                 // 12:01:23
        let seconds = now.seconds();        // 23
        now.add(1, 'm');        // 12:02:23

        // zero seconds
        now.subtract(seconds, 's');     // 12:02:00

        // create new 'next' Date object
        let next = moment(now);             // 12:02:00

        // top row - already landed, and transfer (in progress)
        let alreadyLanded = moment(now);    // 12:02:00
        let alreadyLandedTransfer = moment(now);    // 12:02:00

        // get initial transfer time
        now.add(minutesPerLanguage, 'm');                           // 12:03:00
        alreadyLandedTransfer.subtract(minutesPerLanguage, 'm');    // 12:01:00
        alreadyLanded.subtract(minutesPerLanguage, 'm');            // 12:01:00
        alreadyLanded.subtract(minutesPerLanguage, 'm');            // 12:00:00

        // create new 'transfer' object
        let transfer = moment(now);                                 // 12:03:00

        // we ignore zero translation - the original
        let translationIndex = 1;
        let lastCountryIndex = 49;

        // set up times in initial flight plan
        for (let country in country_codes) {
            let randomThreeDigitNumber = Math.floor(Math.random() * (999 - 100 + 1) + 100);
            let nextDate = moment(next);            // 12:02:00
            let transferDate = moment(transfer);    // 12:03:00

            // only use already landed for top row (last country in index)
            if (translationIndex === lastCountryIndex) {
                nextDate = moment(alreadyLanded);               // 12:00:00
                transferDate = moment(alreadyLandedTransfer);   // 12:01:00
            }

            let flightIndex = (translationIndex - 1) / 2;
            this.addFlight(new Flight(
                country,
                country_codes[country]["code"],
                randomThreeDigitNumber,
                country_codes[country]["capital"],
                nextDate,
                transferDate,
                flightIndex,
            ), flightIndex);

            next.add((minutesPerLanguage * 2), 'm');          // 12:04:00
            transfer.add((minutesPerLanguage * 2), 'm');      // 12:05:00
            translationIndex += 2;
        }

        setInterval(
            this.updateFlightPlan.bind(this),
            1000
        );

    }

    getNextThreeArrivals() {
        let firstArrivalIndex = this.getFirstArrivalIndex();
        let arrivals = [];
        let lastIndex = this.getLastIndex() + 1; // + 1 for modulus-ing
        arrivals.push(this.getFlight(firstArrivalIndex));
        arrivals.push(this.getFlight((firstArrivalIndex + 1) % lastIndex));
        arrivals.push(this.getFlight((firstArrivalIndex + 2) % lastIndex));
        return arrivals;
    }

    getFiveArrivals() {
        let firstArrivalIndex = this.getFirstArrivalIndex();
        let arrivals = [];
        let lastIndex = this.getLastIndex() + 1; // + 1 for modulus-ing
        arrivals.push(this.getFlight((firstArrivalIndex - 1 + lastIndex) % lastIndex));
        arrivals.push(this.getFlight(firstArrivalIndex));
        arrivals.push(this.getFlight((firstArrivalIndex + 1) % lastIndex));
        arrivals.push(this.getFlight((firstArrivalIndex + 2) % lastIndex));
        arrivals.push(this.getFlight((firstArrivalIndex + 3) % lastIndex));
        return arrivals;
    }

    updateFlightPlan() {
        // main loop
        if (updating === false) {
            updating = true;
            let arrivals = this.getNextThreeArrivals();
            let now = new Date();
            let momentNow = moment(now);
            let transferTime = arrivals[0].getTransferDate();
            let nextDateTime = arrivals[1].getNextDate();

            switch (this.getState()) {
                case PRE_START:
                    this.setState(START);
                    break;
                case START:
                    if (now > arrivals[0].getNextDate()) {
                        this.setState(ARRIVED);
                    }

                    break;
                case ARRIVED:
                    landing_updated = false;

                    // then change state
                    this.setState(ARRIVED_SHOWING);
                    break;
                case ARRIVED_SHOWING:
                    // see if we've got to transfer date
                    if (now > transferTime) {
                        this.setState(TRANSFER);
                    }
                    break;
                case TRANSFER:
                    landing_updated = false;
                    this.setState(TRANSFER_SHOWING);
                    break;
                case TRANSFER_SHOWING:
                    if (now > nextDateTime) {
                        // if second plane has arrived, hide transfer, and update plane times
                        flightCodeIndex += 2;
                        if (flightCodeIndex >= flightCodes.length) {
                            flightCodeIndex = 0;
                        }
                        this.setFirstCountry(arrivals[1].country);
                        this.setState(ARRIVED);
                        this.displayFlightPlan();
                    }
                    break;
            }
            updating = false;
        }
    }

    displayFlightPlan() {
        let arrivals = this.getFiveArrivals();
        for (let arrival_number = 1; arrival_number <= 5; arrival_number++) {
            let arrival = arrivals[arrival_number - 1];
            // clone top arrival time for calculations
            let topArrivalTime = moment(arrivals[0].getNextDate());         // 12:01
            let arrivalTime = moment(arrival.getNextDate());                // 12:01        12:03       12:05
            let arrivalHour = arrivalTime.hours();
            let arrivalMinutes = arrivalTime.minutes();

            if (arrival_number > 1) {
                topArrivalTime = topArrivalTime.add(minutesPerLanguage * 2 * (arrival_number - 1), 'minutes');
            }

            let topArrivalTimeDate = moment(topArrivalTime);

            // set new arrival time if current arrival is before it should be
            if (arrivalTime.isBefore(topArrivalTimeDate)) {
                arrivalTime = topArrivalTimeDate;
                arrivalHour = arrivalTime.hours();
                arrivalMinutes = arrivalTime.minutes();
                this.setFlightNextDate(arrivalTime, arrival.getFlightIndex());
                arrival.setNextDate(arrivalTime);
                topArrivalTime = topArrivalTime.add(minutesPerLanguage, 'minutes');
                let transferTime = new Date(topArrivalTime);
                this.setFlightTransferDate(transferTime, arrival.getFlightIndex());
                arrival.setTransferDate(transferTime);
            }

            if (arrivalHour < 10)       {   arrivalHour = "0" + arrivalHour;        }
            if (arrivalMinutes < 10)    {  arrivalMinutes = "0" + arrivalMinutes;   }
            $('#time_' + arrival_number).text(arrivalHour + ":" + arrivalMinutes);
            $('.ticker_time_' + arrival_number).text(arrivalHour + ":" + arrivalMinutes);

            let arrivalFlightCodeIndex = (flightCodeIndex + ((arrival_number - 1) * 2)) % flightCodes.length;
            let flightCode = flightCodes.substr(arrivalFlightCodeIndex, 2) + " " + arrival.code;

            $('#flight_' + arrival_number).text(flightCode);
            $('.ticker_flight_' + arrival_number).text(flightCode);

            let $flagSpan = $('#flag_' + arrival_number);
            $flagSpan.removeClass();
            $flagSpan.addClass('flag-icon');
            $flagSpan.addClass('flag-icon-' + arrival.country_code.toLowerCase());

            $('#capital_' + arrival_number).text(arrival.capital);
            $('.ticker_capital_' + arrival_number).text(arrival.capital);
        }
    }
}

export default FlightPlan;
