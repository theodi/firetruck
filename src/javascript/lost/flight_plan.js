import { selection } from "../utils";

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

const FIRST_VERSE           = 10;
const FIRST_VERSE_READING   = 11;
const FIRST_VERSE_END       = 12;
const SECOND_VERSE          = 20;
const SECOND_VERSE_READING  = 21;
const SECOND_VERSE_END      = 22;
const THIRD_VERSE           = 30;
const THIRD_VERSE_READING   = 31;
const THIRD_VERSE_END       = 32;
const FOURTH_VERSE          = 40;
const FOURTH_VERSE_READING  = 41;
const FOURTH_VERSE_END      = 42;
const READY_FOR_RELOAD      = 43;
const WAIT_SIXTY_SECONDS    = 44;
const CHOSE_NEXT_FOUR       = 45;

// constance
const FIRST = 0;
const SECOND = 1;
const THIRD = 2;
const FOURTH = 3;


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
        this.sampler;

        this.backgroundPlayer;
        this.versePlayers = [];
        this.soundsLoaded = 0;
        this.muted = false;
        this.reloadTime = null;
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
            "", " Loading......", "", "",
            "", "", "", "",
            "", "", "", "",
            "", "", "", "",
        ];
        uniqueChars = this.getUniqueChars(poemLines);
        this.loadingFlight = new Flight(
            poemLines,
            uniqueChars
        );
        poemLines = [
            "", " Click or tap to start ...", "", "",
            "", "", "", "",
            "", "", "", "",
            "", "", "", "",
        ];
        uniqueChars = this.getUniqueChars(poemLines);
        this.clickToStartFlight = new Flight(
            poemLines,
            uniqueChars,
        );
        poemLines = [
            "", " Click or tap or hear another mix ...", "", "",
            "", "", "", "",
            "", "", "", "",
            "", "", "", "",
            "", "", "",
        ];
        uniqueChars = this.getUniqueChars(poemLines);
        this.clickToAnotherMix = new Flight(
            poemLines,
            uniqueChars,
        );

        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(
            this.updateFlightPlan.bind(this),
            5000
        );
        this.displaysArea.setHighlightedVerse(0);
        this.soundsLoaded = 0;
        this.setHeads(-1);
        $('.flag_svg').hide();
        $('#country_name').text("");
        this.loadAudio();
        this.setState(PRE_VERSES);
        this.updateFlightPlan();
    }


    updateFlightPlan() {
        let _this = this;
        let $displays = $('#displays');

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
                    if (this.soundsLoaded === 5) {
                        this.setState(AUDIO_READY);
                    }
                    break;
                case AUDIO_READY:
                    this.displaysArea.updateCharacterSet(this.clickToStartFlight);
                    clearInterval(this.interval);
                    this.interval = setInterval(
                        this.updateFlightPlan.bind(this),
                        500
                    );

                    $displays.on('click', function() {
                        Tone.start()
                        _this.displaysArea.updateCharacterSet(_this.flight);
                        _this.setState(FIRST_VERSE);
                    });

                    this.setState(WAITING_FOR_CLICK);
                    break;
                case WAITING_FOR_CLICK:
                    break;
                case FIRST_VERSE:
                    this.backgroundPlayer.start();
                    this.playVerseAndSelectCountryImages(FIRST);
                    this.setState(FIRST_VERSE_READING);
                    break;
                case FIRST_VERSE_READING:
                    if (this.versePlayers[FIRST].state === 'stopped') {
                        this.setState(FIRST_VERSE_END);
                    }
                    break;
                case FIRST_VERSE_END:
                    // remove yellow head while we know
                    this.setState(SECOND_VERSE);
                    break;

                case SECOND_VERSE:
                    this.playVerseAndSelectCountryImages(SECOND);
                    this.setState(SECOND_VERSE_READING);
                    break;
                case SECOND_VERSE_READING:
                    if (this.versePlayers[SECOND].state === 'stopped') {
                        this.setState(SECOND_VERSE_END);
                    }
                    break;
                case SECOND_VERSE_END:
                    // remove yellow head while we know
                    this.setState(THIRD_VERSE);
                    break;

                case THIRD_VERSE:
                    this.playVerseAndSelectCountryImages(THIRD);
                    this.setState(THIRD_VERSE_READING);
                    break;
                case THIRD_VERSE_READING:
                    if (this.versePlayers[THIRD].state === 'stopped') {
                        this.setState(THIRD_VERSE_END);
                    }
                    break;
                case THIRD_VERSE_END:
                    this.setState(FOURTH_VERSE);
                    break;

                case FOURTH_VERSE:
                    this.playVerseAndSelectCountryImages(FOURTH);
                    this.setState(FOURTH_VERSE_READING);
                    break;
                case FOURTH_VERSE_READING:
                    if (this.versePlayers[FOURTH].state === 'stopped') {
                        this.setState(FOURTH_VERSE_END);
                    }
                    break;
                case FOURTH_VERSE_END:
                    // remove yellow head while we know
                    this.setState(READY_FOR_RELOAD);
                    break;

                case READY_FOR_RELOAD:
                    this.setHeads(-1);
                    this.displaysArea.updateCharacterSet(this.clickToAnotherMix);
                    this.reloadTime = moment().add(60, 'seconds');
                    this.setState(WAIT_SIXTY_SECONDS);

                    $displays.on('click', function() {
                        _this.reload();
                    });

                    break;
                case WAIT_SIXTY_SECONDS:
                    if(moment() > this.reloadTime) {
                        this.setState(CHOSE_NEXT_FOUR);
                    }
                    break;
                case CHOSE_NEXT_FOUR:
                    this.reload();
                    break;
            }
            updating = false;
        }
    }

    playVerseAndSelectCountryImages(verse) {
        let country_indexes = this.flight?.getFourCountriesIndexes();
        let fourCountries = this.flight?.getFourCountries();
        let $face = $('#td_head_' + (country_indexes[verse] + 1) + ' img');

        this.setHeads((country_indexes[verse] + 1));
        $face.addClass('selected_head');

        $('.flag_svg').hide();
        let $flagSVG = $('#flag_svg_' + (country_indexes[verse] + 1));
        $flagSVG.show();

        $('#country_name').text(fourCountries[verse]).show();

        this.versePlayers[verse].start();
        this.displaysArea.setHighlightedVerse(verse);
    }

    setHeads(headNumber) {
        let $all_heads = $('.td_head img');
        $all_heads.removeClass('poem_head');
        $all_heads.removeClass('selected_head');

        if (headNumber !== -1) {
            let fourCountriesIndexes = this.flight?.getFourCountriesIndexes();

            // set opacities
            for (let i = 1; i <= 26; i++) {
                let headOnehundred = false;
                for (let j = 0; j < 4; j++) {
                    if (fourCountriesIndexes[j] === (i - 1)) {
                        headOnehundred = true;
                    }
                }

                let $face = $('#td_head_' + i + ' img');
                if (headOnehundred === true) {
                    $face.addClass('poem_head');
                }
            }
        }

        // yellow heads
        for(let i = 1; i <= 26; i++) {
            let $headimg = $('#td_head_' + i + ' img');
            let headsrc = $headimg.attr('src')
            let yelindex = headsrc.indexOf('_yel');
            if (yelindex !== -1) {
                $headimg.attr('src', headsrc.substring(0, yelindex) + headsrc.substring(yelindex+4));
            } else {
                if (i === headNumber) {
                    let dotindex = headsrc.indexOf('.');
                    $headimg.attr('src', headsrc.substring(0, dotindex) + '_yel' + headsrc.substring(dotindex));
                }
            }
        }
    }

    loadAudio() {

        let fourCountries = this.flight?.getFourCountries();
        this.backgroundPlayer = new Tone.Player({url:"/mp3/BMMFT_AUDIO_AirportAtmos.mp3", onload: () => this.soundsLoaded++ }).toDestination();
        this.backgroundPlayer.loop = true;
        this.versePlayers[0] = new Tone.Player({url: "/mp3/BMMFT_AUDIO_" + fourCountries[0] + "_V1.mp3", onload: () => this.soundsLoaded++ }).toDestination();
        this.versePlayers[1] = new Tone.Player({url: "/mp3/BMMFT_AUDIO_" + fourCountries[1] + "_V2.mp3", onload: () => this.soundsLoaded++ }).toDestination();
        this.versePlayers[2] = new Tone.Player({url: "/mp3/BMMFT_AUDIO_" + fourCountries[2] + "_V3.mp3", onload: () => this.soundsLoaded++ }).toDestination();
        this.versePlayers[3] = new Tone.Player({url: "/mp3/BMMFT_AUDIO_" + fourCountries[3] + "_V4.mp3", onload: () => this.soundsLoaded++ }).toDestination();
    }

    toggleAudioMute() {
        this.muted = !this.muted;
        console.log("muted = " + this.muted);
        // if (this.muted) {
        // .fadeOut();//
        // }
        this.backgroundPlayer.mute = this.muted;
        this.versePlayers[0].mute = this.muted;
        this.versePlayers[1].mute = this.muted;
        this.versePlayers[2].mute = this.muted;
        this.versePlayers[3].mute = this.muted;
    }

    getMuted() {
        return this.muted;
    }

    stopAudio(){
        this.backgroundPlayer.stop();
        this.versePlayers[0].stop();
        this.versePlayers[1].stop();
        this.versePlayers[2].stop();
        this.versePlayers[3].stop();
    }

    reload() {
        this.stopAudio();
        this.setUpFlightPlan();
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
