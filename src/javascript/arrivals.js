import displays_sketch from './fire_truck';
import updateClock from "./clock";
import FlightPlan from './flight_plan';
import anime from 'animejs/lib/anime.es.js';

const p5 = require('p5');

$(function(){

    let displaysArea = new p5(displays_sketch, 'displays');
    let flightPlan = new FlightPlan(displaysArea);

    flightPlan.setUpFlightPlan();

    // display initial flight plan
    flightPlan.displayFlightPlan();

    // flashing colons
    anime({
        targets: 'span.arrivals_colon',
        color: [{ value: '#F8E106', duration: 250, delay: 250 }, { value: '#000000', duration: 250, delay: 250 }],
        easing: 'easeInOutSine',
        loop: true,
    });
    anime({
        targets: 'span#landing',
        color: [{ value: '#FF0000', duration: 500, delay: 0 }, { value: '#222222', duration: 500, delay: 0 }],
        easing: 'easeInOutSine',
        loop: true,
    });

    // set the time and flight plan
    updateClock();
    flightPlan.updateFlightPlan();

    // update clock, once every half second
    setInterval(updateClock, 500);
});

