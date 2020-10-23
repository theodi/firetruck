import displays_sketch from './arrivals/display_sketch';
import updateClock from "./clock";
import FlightPlan from './arrivals/flight_plan';
import anime from 'animejs/lib/anime.es.js';

const p5 = require('p5');

$(function(){
    let $home = $('#home_link');

    let animateHomeOver = function()      {
        $('#eu_flag').hide();
        $('#home_link_rollover').show();
    };
    let animateHomeOut = function()      {
        $('#eu_flag').show();
        $('#home_link_rollover').hide();
    }

    $home.on('mouseover', animateHomeOver);
    $home.on('mouseout', animateHomeOut);

    let $baggage_reclaim_svg = $('#baggage_reclaim_svg');

    let animateBaggageOver = function()      {
        anime({ targets: '#baggage_reclaim_bg', fill: ['#f8e106', '#fff'], easing: 'easeInOutSine', duration: 250  });
    };
    let animateBaggageOut = function()      {
        anime({ targets: '#baggage_reclaim_bg', fill: ['#fff', '#f8e106'], easing: 'easeInOutSine', duration: 250  });
    };
    $baggage_reclaim_svg.on('mouseover', animateBaggageOver);
    $baggage_reclaim_svg.on('mouseout', animateBaggageOut);

    let $lost_luggage_svg = $('#lost_luggage_svg');

    let animateLuggageOver = function()      {
        anime({ targets: '#lost_luggage_bg', fill: ['#f8e106', '#fff'], easing: 'easeInOutSine', duration: 250  });
    };
    let animateLuggageOut = function()      {
        anime({ targets: '#lost_luggage_bg', fill: ['#fff', '#f8e106'], easing: 'easeInOutSine', duration: 250  });
    };
    $lost_luggage_svg.on('mouseover', animateLuggageOver);
    $lost_luggage_svg.on('mouseout', animateLuggageOut);


    let displaysArea = new p5(displays_sketch, 'displays');
    let flightPlan = new FlightPlan(displaysArea);

    flightPlan.setUpFlightPlan();

    // display initial flight plan
    flightPlan.displayFlightPlan();

    anime({
        targets: 'span.clock_colon',
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

