// import displays_sketch from './baggage/display_sketch';
import updateClock from "./clock";
// import FlightPlan from './baggage/flight_plan';
import anime from 'animejs/lib/anime.es.js';

// const p5 = require('p5');

$(function(){



    /*

    let displaysArea = new p5(displays_sketch, 'displays');
    let flightPlan = new FlightPlan(displaysArea);

    flightPlan.setUpFlightPlan();


    // set the time and flight plan
    updateClock();
*/
    // flashing colons
    anime({
        targets: 'span.clock_colon',
        color: [{ value: '#F8E106', duration: 250, delay: 250 }, { value: '#000000', duration: 250, delay: 250 }],
        easing: 'easeInOutSine',
        loop: true,
    });

    // set the time and flight plan
    updateClock();
    /*
        flightPlan.updateFlightPlan();

    // update clock, once every half second
    setInterval(updateClock, 500);*/


});

