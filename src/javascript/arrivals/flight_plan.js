let moment = require('moment');
moment().format();

import country_codes from '../data/country_codes';
import translations from '../data/translations';
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
const TIME_UPDATE       = 5;

// minutes per language, and translation
const minutesPerLanguage = 1;
const flightCodes = "BREXITDISCOMBOBULATION";
let flightCodeIndex = 0;

let updating = false;
let landing_updated = false;
let landing_prewarn_milliseconds = 20000;
let poem_lines = [];


class FlightPlan {
    constructor(p5DisplaysArea) {
        this.flightsByIndex = [];
        this.flightsByCountryIndex = [];
        this.countryIndexes = [];
        this.firstCountry = "";
        this.lastTransferDate = new Date();
        this.state = PRE_START;
        this.lastIndex = 0;
        this.displaysArea = p5DisplaysArea;
//        this.adjustmentSeconds = 0;
        this.previousAdjustmentSeconds = 0;
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
            // console.log("firstCountry: " + this.firstCountry);
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

    setUpFlightPlan(first_country_code) {
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

        // we ignore zero translation - the original English
        let translationIndex = 1;
        let lastCountryIndex = 49;

        if (first_country_code === "") {

            // set up times in initial flight plan
            for (let country in country_codes) {
                let poemLines = [];
                let poemLinesTranslated = [];
                let randomThreeDigitNumber = Math.floor(Math.random() * (999 - 100 + 1) + 100);
                for (let i = 0; i < translations.length; i++) {
                    poemLines.push(translations[i][translationIndex]);
                    poemLinesTranslated.push(translations[i][translationIndex + 1]);
                }

                let uniqueChars = this.getUniqueChars(poemLines);
                let uniqueCharsEnglish = this.getUniqueChars(poemLinesTranslated);

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
                    poemLines,
                    poemLinesTranslated,
                    flightIndex,
                    uniqueChars,
                    uniqueCharsEnglish
                ), flightIndex);

                next.add((minutesPerLanguage * 2), 'm');          // 12:04:00
                transfer.add((minutesPerLanguage * 2), 'm');      // 12:05:00
                this.countryIndexes = translationIndex;
                translationIndex += 2;
            }

            setInterval(
                this.updateFlightPlan.bind(this),
                1000
            );
        } else {
            let first_country = "";
            let translationIndex = 1;
            let firstCountryIndex = 1;

            for (let country in country_codes) {
                let this_code = country_codes[country]["code"].toLowerCase();
                if (this_code === first_country_code) {
                    first_country = country;
                    firstCountryIndex = (translationIndex - 1) / 2;
                    lastCountryIndex = (firstCountryIndex - 1) % this.flightsByIndex.length;
                }
                translationIndex += 2;
            }
            // console.log("first_country = " + first_country);

            // reset flight times so that first country is coming up and
            // lastCountryIndex is top row (country before in the index)

            for (let i = firstCountryIndex; i < firstCountryIndex + 25; i++) {
                let flightIndex = i % this.flightsByIndex.length;
                let nextDate = moment(next);            // 12:02:00
                let transferDate = moment(transfer);    // 12:03:00

                // only use already landed for top row (last country in index)
                if (flightIndex === lastCountryIndex) {
                    nextDate = moment(alreadyLanded);               // 12:00:00
                    transferDate = moment(alreadyLandedTransfer);   // 12:01:00
                }

                this.flightsByIndex[flightIndex].setNextDate(nextDate);
                this.flightsByIndex[flightIndex].setTransferDate(transferDate);
                next.add((minutesPerLanguage * 2), 'm');          // 12:04:00
                transfer.add((minutesPerLanguage * 2), 'm');      // 12:05:00
                translationIndex += 2;
            }

            landing_updated = false;
            this.setFirstCountry(first_country);
            this.setState(PRE_START);
            this.displayFlightPlan();

        }
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

    getThreeArrivals() {
        let firstArrivalIndex = this.getFirstArrivalIndex();
        let arrivals = [];
        let lastIndex = this.getLastIndex() + 1; // + 1 for modulus-ing
        arrivals.push(this.getFlight((firstArrivalIndex - 1 + lastIndex) % lastIndex));
        arrivals.push(this.getFlight(firstArrivalIndex));
        arrivals.push(this.getFlight((firstArrivalIndex + 1) % lastIndex));
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
                    // console.log("PRE_START");

                    // set up initial character set to be used for first language
                    this.updateCharacterSet(arrivals[0].getUniqueCharacters(), false, arrivals[0].country);
                    this.setState(START);
                    break;
                case START:
                    // console.log("START");
                    // set landing in early
                    this.landingInLanguage(momentNow, arrivals[0].getNextDate(), arrivals[0].country);

                    if (now > arrivals[0].getNextDate()) {
                        this.setState(ARRIVED);
                    }

                    break;
                case ARRIVED:
                    // console.log("ARRIVED");
                    landing_updated = false;

                    // show poem translation to language
                    this.updatePoemLines(false);

                    // then change state
                    this.setState(ARRIVED_SHOWING);
                    break;
                case ARRIVED_SHOWING:
                    // console.log("ARRIVED_SHOWING");
                    this.landingInLanguage(momentNow, transferTime, 'English');

                    // see if we've got to transfer date
                    if (now > transferTime) {
                        this.setState(TRANSFER);
                    }
                    break;
                case TRANSFER:
                    landing_updated = false;
                    // console.log("TRANSFER");
                    // show poem translation back to English
                    this.updatePoemLines(true);
                    this.setState(TRANSFER_SHOWING);
                    break;
                case TRANSFER_SHOWING:
                    // console.log("TRANSFER_SHOWING");
                    this.landingInLanguage(momentNow, nextDateTime, arrivals[1].country);

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

    updateCharacterSet(characterSet, translation, language) {
        let arrivalIndex = this.getFirstArrivalIndex();
        let currentTranslation = (arrivalIndex * 2) + 1;
        if (translation) {
            currentTranslation = currentTranslation + 1
        }
        this.displaysArea.updateCharacterSet(characterSet, currentTranslation, language);
    }

    landingInLanguage(momentNow, nextDateTime, country) {
        let momentNextDateTime = moment(nextDateTime);

        if (momentNow > momentNextDateTime - landing_prewarn_milliseconds && !landing_updated) {
            let arrivalHour = momentNextDateTime.hours();
            let arrivalMinutes = momentNextDateTime.minutes();
            if (arrivalHour < 10) {
                arrivalHour = "0" + arrivalHour;
            }

            if (arrivalMinutes < 10) {
                arrivalMinutes = "0" + arrivalMinutes;
            }
            let landing;
            if (country === 'English') {
                landing = 'Arriving in ';
            } else {
                landing = 'Landing in ';
            }

            $('#landing').html(landing + ' <span id="landing_language"></span> at <span id="landing_time"></span>');
            $('#landing_language').text(country);
            $('#landing_time').text(arrivalHour + ":" + arrivalMinutes);
            landing_updated = true;
        }

    }

    displayFlightPlan() {
        let arrivals = this.getThreeArrivals();
        for (let arrival_number = 1; arrival_number <= 3; arrival_number++) {
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

            let arrivalFlightCodeIndex = (flightCodeIndex + ((arrival_number - 1) * 2)) % flightCodes.length;
            $('#flight_' + arrival_number).text(
                flightCodes.substr(arrivalFlightCodeIndex, 2) + " " + arrival.code
            );

            let $flagSpan = $('#flag_' + arrival_number);
            $flagSpan.removeClass();
            $flagSpan.addClass('flag-icon');
            $flagSpan.addClass('flag-icon-' + arrival.country_code.toLowerCase());

            $('#capital_' + arrival_number).text(arrival.capital);
        }
    }

    updatePoemLines(translation) {
        let firstArrivalIndex = this.getFirstArrivalIndex();
        let arrival = this.getFlight(firstArrivalIndex);

        if (translation) {
            poem_lines = arrival.getPoemLinesTranslated();
        } else {
            poem_lines = arrival.getPoemLines();
        }
        this.updateCharacterSet(arrival.getUniqueCharacters(translation), translation, arrival.country);
    }

    getUniqueCharsArray(lineOfChars) {
        return lineOfChars.split('').filter(function (item, i, ar) {
            return ar.indexOf(item) === i;
        }).join('');
    }

    getUniqueChars(poem_lines) {
        let flapper_chars = [' ',];
        for (let i = 0; i < poem_lines.length; i++) {
            let line_chars = this.getUniqueCharsArray(poem_lines[i]);

            for (let j = 0; j < line_chars.length; j++) {
                let testChar = line_chars[j];
                if (testChar !== 'ß') {
                    testChar = testChar.toUpperCase();

                }
                if (!flapper_chars.includes(testChar)) {
                    flapper_chars.push(testChar);
                }
            }
        }

        return flapper_chars.sort();
    }
}

export default FlightPlan;
