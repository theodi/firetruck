"use strict";

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

const MAX_LINE_LENGTH = 61;

// minutes per language, and translation
const minutesPerLanguage = 1;
const flightCodes = "BREXITDISCOMBOBULATION";
let flightCodeIndex = 0;
let $displays = $('input.display');
let updating = false;
let landing_updated = false;
let landing_prewarn_milliseconds = 20000;
let poem_lines = [];
let animation = false;

class FlightPlan {
    constructor() {
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
        if (this.lastTransferDate < flightTransferDate) {
            this.lastTransferDate = new Date(flightTransferDate.getTime());
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
            this.lastTransferDate = new Date(value.getTime());
        }
    }
}

function setUpFlightPlan() {
    let now = new Date();
    let seconds = now.getSeconds();
    now.addMinutes(1);

    // zero seconds
    now.addSeconds(-seconds);

    // create new 'next' Date object
    let next = new Date(now.getTime());
    let alreadyLanded = new Date(now.getTime());
    let alreadyLandedTransfer = new Date(now.getTime());

    // get initial transfer time
    now.addMinutes(minutesPerLanguage);
    alreadyLandedTransfer.addMinutes(-minutesPerLanguage);
    alreadyLanded.addMinutes(-minutesPerLanguage);
    alreadyLanded.addMinutes(-minutesPerLanguage);

    // create new 'transfer' Date object
    let transfer = new Date(now.getTime());

    // we ignore zero translation - the original
    let translationIndex = 1;
    let lastCountryIndex = 49;

    for (let country in country_codes ) {
        let poemLines = [];
        let poemLinesTranslated = [];
        let randomThreeDigitNumber = Math.floor(Math.random()*(999-100+1)+100);
        for (let i = 0; i < translations.length; i++) {
            poemLines.push(translations[i][translationIndex]);
            poemLinesTranslated.push(translations[i][translationIndex + 1]);
        }

        let uniqueChars = getUniqueChars(poemLines);
        let uniqueCharsEnglish = getUniqueChars(poemLinesTranslated);

        let nextDate = new Date(next.getTime());
        let transferDate = new Date(transfer.getTime());
        if (translationIndex === lastCountryIndex) {
            nextDate = new Date(alreadyLanded.getTime());
            transferDate = new Date(alreadyLandedTransfer.getTime());
        }
        let flightIndex = (translationIndex - 1) / 2;
        flightPlan.addFlight(new Flight(
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

        next.addMinutes(minutesPerLanguage * 2);
        transfer.addMinutes(minutesPerLanguage * 2);
        translationIndex += 2;
    }
}

function getNextThreeArrivals() {
    let firstArrivalIndex = flightPlan.getFirstArrivalIndex();
    let arrivals = [];
    let lastIndex = flightPlan.getLastIndex() + 1; // + 1 for modulus-ing
    arrivals.push(flightPlan.getFlight(firstArrivalIndex));
    arrivals.push(flightPlan.getFlight((firstArrivalIndex + 1) % lastIndex));
    arrivals.push(flightPlan.getFlight((firstArrivalIndex + 2) % lastIndex));
    return arrivals;
}

function getThreeArrivals() {
    let firstArrivalIndex = flightPlan.getFirstArrivalIndex();
    let arrivals = [];
    let lastIndex = flightPlan.getLastIndex() + 1; // + 1 for modulus-ing
    arrivals.push(flightPlan.getFlight((firstArrivalIndex - 1 + lastIndex) % lastIndex));
    arrivals.push(flightPlan.getFlight(firstArrivalIndex));
    arrivals.push(flightPlan.getFlight((firstArrivalIndex + 1) % lastIndex));
    return arrivals;
}

function updateFlightPlan() {
    // main loop
    if (updating===false) {
        updating = true;
        let arrivals = getNextThreeArrivals();
        let now = new Date();
        let momentNow = moment(now);
        let transferTime = arrivals[0].getTransferDate();
        let nextDateTime = arrivals[1].getNextDate();

        switch (flightPlan.getState()){
            case PRE_START:
                // set up initial character set to be used for first language
                updateCharacterSet(arrivals[0].getUniqueCharacters(),false, arrivals[0].country);
                flightPlan.setState(START);
                break;
            case START:
                // set landing in early
                landingInLanguage(momentNow, arrivals[0].getNextDate(),  arrivals[0].country);

                if (now > arrivals[0].getNextDate()) {
                    flightPlan.setState(ARRIVED);
                }

                break;
            case ARRIVED:
                landing_updated = false;

                // show poem translation to language
                updatePoemLines(false);

                // then change state
                flightPlan.setState(ARRIVED_SHOWING);
                break;
            case ARRIVED_SHOWING:
                landingInLanguage(momentNow, transferTime, 'English');

                // see if we've got to transfer date
                if (now > transferTime) {
                    flightPlan.setState(TRANSFER);
                }
                break;
            case TRANSFER:
                landing_updated = false;
                // show poem translation back to English
                updatePoemLines(true);
                flightPlan.setState(TRANSFER_SHOWING);
                break;
            case TRANSFER_SHOWING:
                landingInLanguage(momentNow, nextDateTime, arrivals[1].country);

                if (now > nextDateTime) {
                    // if second plane has arrived, hide transfer, and update plane times
                    flightCodeIndex += 2;
                    if (flightCodeIndex >= flightCodes.length) {
                        flightCodeIndex = 0;
                    }
                    flightPlan.setFirstCountry(arrivals[1].country);
                    flightPlan.setState(ARRIVED);
                    displayFlightPlan();
                }
                break;
        }
        updating = false;
    }
}

function landingInLanguage(momentNow, nextDateTime, country) {
    let momentNextDateTime = moment(nextDateTime);

    if (momentNow > momentNextDateTime - landing_prewarn_milliseconds && !landing_updated) {
        let arrivalHour = nextDateTime.getHours();
        let arrivalMinutes = nextDateTime.getMinutes();
        if(arrivalHour < 10) {
            arrivalHour = "0" + arrivalHour
        }

        if (arrivalMinutes < 10) {
            arrivalMinutes = "0" + arrivalMinutes;
        }
        let landing = "";
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

function displayFlightPlan() {
    let arrivals = getThreeArrivals();
    for (let arrival_number = 1; arrival_number <= 3; arrival_number++) {
        let arrival = arrivals[arrival_number - 1];
        let topArrivalTime = moment(new Date(arrivals[0].getNextDate()));
        let arrivalTime = arrival.getNextDate();
        let arrivalHour = arrivalTime.getHours();
        let arrivalMinutes = arrivalTime.getMinutes();
        // console.log(new Date().getHours(), new Date().getMinutes(),
        //     "topArrivalTime:", new Date(topArrivalTime).getHours(), new Date(topArrivalTime).getMinutes(),
        //     arrival.country, arrivalTime.getHours(), arrivalTime.getMinutes() );
        if (arrival_number > 1) {
            topArrivalTime = topArrivalTime.add(minutesPerLanguage * 2 * (arrival_number - 1), 'minutes');
        }

        let topArrivalTimeDate = new Date(topArrivalTime);
        if (arrivalTime.getTime() !== topArrivalTimeDate.getTime()) {
            // console.log("arrival_number = " + arrival_number + ", topArrivalTimeDate = " + topArrivalTimeDate);
            // console.log("arrival_number = " + arrival_number + ", arrivalTime = " + arrivalTime);
            arrivalTime = topArrivalTimeDate;
            arrivalHour = arrivalTime.getHours();
            arrivalMinutes = arrivalTime.getMinutes();
            flightPlan.setFlightNextDate(arrivalTime, arrival.getFlightIndex());
            arrival.setNextDate(arrivalTime);
            topArrivalTime = topArrivalTime.add(minutesPerLanguage, 'minutes');
            let transferTime = new Date(topArrivalTime);
            flightPlan.setFlightTransferDate(transferTime, arrival.getFlightIndex());
            arrival.setTransferDate(transferTime);
            // console.log("arrival.country = " + arrival.country + ", arrival.getNextDate() = " + arrival.getNextDate());
            // console.log("arrival.country = " + arrival.country + ", arrival.getTransferDate() = " + arrival.getTransferDate());
        }

        if(arrivalHour < 10) {
            arrivalHour = "0" + arrivalHour
        }
        if(arrivalMinutes < 10) {
            arrivalMinutes = "0" + arrivalMinutes
        }
        $('#time_' + arrival_number).text(arrivalHour + ":" + arrivalMinutes);

        let arrivalFlightCodeIndex = (flightCodeIndex + ((arrival_number - 1) * 2)) % flightCodes.length;
        $('#flight_' + arrival_number).text(
            flightCodes.substr( arrivalFlightCodeIndex, 2) +
            " " + arrival.code
        );

        let $flagSpan = $('#flag_' + arrival_number);
        $flagSpan.removeClass();
        $flagSpan.addClass('flag-icon');
        $flagSpan.addClass('flag-icon-'+arrival.country_code.toLowerCase());

        $('#capital_' + arrival_number).text(arrival.capital);
    }
}

function updatePoemLines(translation) {
    let firstArrivalIndex = flightPlan.getFirstArrivalIndex();
    let arrival = flightPlan.getFlight(firstArrivalIndex);

    if (translation) {
        poem_lines = arrival.getPoemLinesTranslated();
    } else {
        poem_lines = arrival.getPoemLines();
    }
    updateCharacterSet(arrival.getUniqueCharacters(translation), translation, arrival.country);
}


function getUniqueCharsArray(lineOfChars) {
    return lineOfChars.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('');
}

function getUniqueChars(poem_lines) {
    let flapper_chars = [' ', ];
    for (let i = 0; i < poem_lines.length; i++) {
        let line_chars = getUniqueCharsArray(poem_lines[i]);

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