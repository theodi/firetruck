import selection from "../utils";

let moment = require('moment');
moment().format();

import language_sequence from '../data/sequence';
import translations from '../data/translations';
import Flight from './flight';

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

let updating = false;

class FlightPlan {
    constructor(p5DisplaysArea) {
        this.loadingFlight = null;
        this.clickToStartFlight = null;
        this.flight = null;
        this.state = PRE_VERSES;
        this.displaysArea = p5DisplaysArea;
    }

    getState() {
        return this.state;
    }

    setState(value) {
        this.state = value;
    }

    setUpFlightPlan() {

        // get the names of the four countries
        let sequence = language_sequence;
        sequence.unshift("English");

        let four_countries = selection(sequence, 4);

        // get the translation indexes for the four countries, from the country_codes
        let four_countries_indexes = [0, 0, 0, 0];
        for (let j = 0; j < four_countries.length; j++) {
            four_countries_indexes[j] = sequence.indexOf(four_countries[j])
        }

        // original English - translations [0][0], [1][0]
        // German             translations [[1
        let translationIndex = 0;
        let poemLines = [];

        // i = 0 is just the language for reference in the translations file
        for (let i = 1; i < translations.length; i++) {
            if (i < 5)              { translationIndex = four_countries_indexes[0] * 2; }
            if (i >= 5 && i < 9)    { translationIndex = four_countries_indexes[1] * 2; }
            if (i >= 9 && i < 13)   { translationIndex = four_countries_indexes[2] * 2; }
            if (i >= 13 && i < 17)  { translationIndex = four_countries_indexes[3] * 2; }
            poemLines.push(translations[i][translationIndex]);
        }

        let uniqueChars = this.getUniqueChars(poemLines);
        this.flight = new Flight(
            poemLines,
            uniqueChars,
            four_countries,
            four_countries_indexes,
        );

        poemLines = [
            "","","",
            "                    Loading......",
            "","","","","","","","","","","","",
        ];
        uniqueChars = this.getUniqueChars(poemLines);
        this.loadingFlight = new Flight(
            poemLines,
            uniqueChars
        );
        poemLines = [
            "","","",
            "                    Click or tap to start ...",
            "","","","","","","","","","","","",
        ];
        uniqueChars = this.getUniqueChars(poemLines);
        this.clickToStartFlight = new Flight(
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
                    this.displaysArea.updateCharacterSet(this.loadingFlight);
                    this.setState(START);
                    break;
                case START:

                   // if (now > arrivals[0].getNextDate()) {
                   //     this.setState(ARRIVED);
                   // }

                    break;

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
