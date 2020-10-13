import selection from "../utils";

let moment = require('moment');
moment().format();

import language_sequence from '../data/sequence';
import translations from '../data/translations';
import Flight from './flight';

import * as Tone from 'tone';

/**
 * Flight Plan (Lost)
 *
 * class and functions for setting up, displaying and updating the flight plan
 */

// states
const PRE_VERSES        = -1;
const LOADING_AUDIO     = 0;
const AUDIO_READY       = 1;
const WAITING_FOR_CLICK = 2;

const FIRST_VERSE       = 10;
const FIRST_VERSE_END   = 11;
const SECOND_VERSE      = 12;
const SECOND_VERSE_END  = 13;
const THIRD_VERSE       = 14;
const THIRD_VERSE_END   = 15;
const FOURTH_VERSE      = 16;
const FOURTH_VERSE_END  = 17;
const ENDED             = 18;

let updating = false;

class FlightPlan {
    constructor(p5DisplaysArea) {
        this.loadingFlight = null;
        this.clickToStartFlight = null;
        this.flight = null;
        this.state = PRE_VERSES;
        this.displaysArea = p5DisplaysArea;
        this.audioTracks = [];
        this.interval;
    }

    getState() {
        return this.state;
    }

    setState(value) {
        this.state = value;
    }

    setUpFlightPlan() {

        // get the names of the four countries
        let four_countries = selection(language_sequence, 4);

        // get the translation indexes for the four countries, from the country_codes
        let four_countries_indexes = [0, 0, 0, 0];
        for (let j = 0; j < four_countries.length; j++) {
            four_countries_indexes[j] = language_sequence.indexOf(four_countries[j])
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
        this.interval = setInterval(
            this.updateFlightPlan.bind(this),
            3000
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
                    this.setState(LOADING_AUDIO);
                    break;
                case LOADING_AUDIO:
                    break;
                case AUDIO_READY:
                    this.displaysArea.updateCharacterSet(this.clickToStartFlight);
                    this.setState(WAITING_FOR_CLICK);
                    clearInterval(this.interval);
                    this.interval = setInterval(
                        this.updateFlightPlan.bind(this),
                        1000
                    );
                    break;
                case WAITING_FOR_CLICK:
                    // console.log(new Date());
                    break;

            }
            updating = false;
        }
    }


    displayFlightPlan() {

    }

    loadAudio() {

        let fourCountries = this.flight?.getFourCountries();

        const sampler = new Tone.Sampler({
            urls: {
                A1: "BMMFT_AUDIO_AirportAtmos.mp3",
                C1: "BMMFT_AUDIO_" + fourCountries[0] + "_V1.mp3",
                D1: "BMMFT_AUDIO_" + fourCountries[1] + "_V2.mp3",
                E1: "BMMFT_AUDIO_" + fourCountries[2] + "_V3.mp3",
                F1: "BMMFT_AUDIO_" + fourCountries[3] + "_V4.mp3",
            },
            baseUrl: "/mp3/",
            onload: () => {
                this.setState(AUDIO_READY);
//                sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
            }
        }).toDestination();
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
