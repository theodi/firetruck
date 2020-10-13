import selection from "../utils";

let moment = require('moment');
moment().format();

import language_sequence from '../data/sequence';
import translations from '../data/translations';
import Flight from './flight';
import country_codes from "../data/country_codes";

/**
 * Flight Plan (Lost)
 *
 * class and functions for setting up, displaying and updating the flight plan
 */

// states
const PRE_VERSES        = -1;
const START             = 0;
const FIRST_VERSE       = 1;
const FIRST_VERSE_END   = 2;
const SECOND_VERSE      = 3;
const SECOND_VERSE_END  = 4;
const THIRD_VERSE       = 3;
const THIRD_VERSE_END   = 4;
const FOURTH_VERSE      = 3;
const FOURTH_VERSE_END  = 4;
const ENDED             = 4;

const flightCodes = "BREXITDISCOMBOBULATION";
let flightCodeIndex = 0;
let updating = false;
let poem_lines = [];

class FlightPlan {
    constructor(p5DisplaysArea) {
        this.flight = null;//new Flight();
        this.state = PRE_VERSES;
        this.displaysArea = p5DisplaysArea;
    }

    /*
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
*/
    getState() {
        return this.state;
    }

    setState(value) {
        this.state = value;
    }


/*
    getFirstArrivalIndex() {
        return this.flightsByCountryIndex[this.firstCountry];
    }

    getLastIndex() {
        return this.lastIndex;
    }

    getLastTransferDate() {
        return this.lastTransferDate;
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
    }*/

    setUpFlightPlan() {

        // get the names of the four countries
        let four_countries = selection(language_sequence, 4);
        console.log(four_countries);

        // get the translation indexes for the four countries, from the country_codes
        let four_countries_indexes = [0, 0, 0, 0];
        for (let j = 0; j < four_countries.length; j++) {
            console.log(language_sequence.indexOf(four_countries[j]));
            four_countries_indexes[j] = language_sequence.indexOf(four_countries[j])
        }
        console.log(four_countries_indexes);

        // original English - translations [0][0], [1][0]
        // German             translations [[1
        let translationIndex = 0;
        let poemLines = [];

        // i = 0 is just the language
        for (let i = 1; i < translations.length; i++) {
            if (i < 5)              { translationIndex = (four_countries_indexes[0] + 1) * 2; }
            if (i >= 5 && i < 9)    { translationIndex = (four_countries_indexes[1] + 1) * 2; }
            if (i >= 9 && i < 13)   { translationIndex = (four_countries_indexes[2] + 1) * 2; }
            if (i >= 13 && i < 17)  { translationIndex = (four_countries_indexes[3] + 1) * 2; }
            console.log(translationIndex);

            poemLines.push(translations[i][translationIndex]);
        }
        console.log(poemLines);

        let uniqueChars = this.getUniqueChars(poemLines);
        this.flight = new Flight(
            four_countries,
            four_countries_indexes,
            poemLines,
            uniqueChars,
        );
    }


    updateFlightPlan() {
        // main loop
        if (updating === false) {
            updating = true;

            switch (this.getState()) {
                case PRE_VERSES:
                    // set up initial character set to be used for first language
                    this.displaysArea.updateCharacterSet(this.flight);
                    this.setState(START);
                    break;
                case START:
                    // set landing in early
//                    this.landingInLanguage(momentNow, arrivals[0].getNextDate(), arrivals[0].country);

//                    if (now > arrivals[0].getNextDate()) {
//                        this.setState(ARRIVED);
//                    }

                    break;
/*                case ARRIVED:
                    landing_updated = false;

                    // show poem translation to language
                    this.updatePoemLines(false);

                    // then change state
                    this.setState(ARRIVED_SHOWING);
                    break;
                case ARRIVED_SHOWING:
                    this.landingInLanguage(momentNow, transferTime, 'English');

                    // see if we've got to transfer date
                    if (now > transferTime) {
                        this.setState(TRANSFER);
                    }
                    break;
                case TRANSFER:
                    landing_updated = false;
                    // show poem translation back to English
                    this.updatePoemLines(true);
                    this.setState(TRANSFER_SHOWING);
                    break;
                case TRANSFER_SHOWING:
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

 */
            }
            updating = false;
        }
    }


    displayFlightPlan() {
        // let arrivals = this.getThreeArrivals();
        // for (let arrival_number = 1; arrival_number <= 3; arrival_number++) {
        //     let arrival = arrivals[arrival_number - 1];
        //     // clone top arrival time for calculations
        //     let topArrivalTime = moment(arrivals[0].getNextDate());         // 12:01
        //     let arrivalTime = moment(arrival.getNextDate());                // 12:01        12:03       12:05
        //     let arrivalHour = arrivalTime.hours();
        //     let arrivalMinutes = arrivalTime.minutes();
        //
        //     if (arrival_number > 1) {
        //         topArrivalTime = topArrivalTime.add(minutesPerLanguage * 2 * (arrival_number - 1), 'minutes');
        //     }
        //
        //     let topArrivalTimeDate = moment(topArrivalTime);
        //
        //     // set new arrival time if current arrival is before it should be
        //     if (arrivalTime.isBefore(topArrivalTimeDate)) {
        //         arrivalTime = topArrivalTimeDate;
        //         arrivalHour = arrivalTime.hours();
        //         arrivalMinutes = arrivalTime.minutes();
        //         this.setFlightNextDate(arrivalTime, arrival.getFlightIndex());
        //         arrival.setNextDate(arrivalTime);
        //         topArrivalTime = topArrivalTime.add(minutesPerLanguage, 'minutes');
        //         let transferTime = new Date(topArrivalTime);
        //         this.setFlightTransferDate(transferTime, arrival.getFlightIndex());
        //         arrival.setTransferDate(transferTime);
        //     }
        //
        //     if (arrivalHour < 10)       {   arrivalHour = "0" + arrivalHour;        }
        //     if (arrivalMinutes < 10)    {  arrivalMinutes = "0" + arrivalMinutes;   }
        //     $('#time_' + arrival_number).text(arrivalHour + ":" + arrivalMinutes);
        //
        //     let arrivalFlightCodeIndex = (flightCodeIndex + ((arrival_number - 1) * 2)) % flightCodes.length;
        //     $('#flight_' + arrival_number).text(
        //         flightCodes.substr(arrivalFlightCodeIndex, 2) + " " + arrival.code
        //     );
        //
        //     let $flagSpan = $('#flag_' + arrival_number);
        //     $flagSpan.removeClass();
        //     $flagSpan.addClass('flag-icon');
        //     $flagSpan.addClass('flag-icon-' + arrival.country_code.toLowerCase());
        //
        //     $('#capital_' + arrival_number).text(arrival.capital);
        // }
    }



    /*
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

     */

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
