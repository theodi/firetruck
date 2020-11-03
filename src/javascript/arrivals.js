import displays_sketch from './arrivals/display_sketch';
import updateClock from "./clock";
import FlightPlan from './arrivals/flight_plan';
import anime from 'animejs/lib/anime.es.js';

const p5 = require('p5');

// let clockAdjustmentSeconds = 0;


$(function(){
    let $continue = $('#click_continue');
    $continue.on('click', function(){
        $('#body').show();
        $('#small').hide();
    });

    let $home = $('#home_link');
    let $baggage_reclaim_svg = $('#baggage_reclaim_svg');
    let $lost_luggage_svg = $('#lost_luggage_svg');
    let displaysArea = new p5(displays_sketch, 'displays');
    let flightPlan = new FlightPlan(displaysArea);
    let $globe_td = $('#td_transfer');

    let animateHomeOver = function()      {
        $('#eu_flag').hide();       $('#home_link_rollover').show();
    };
    let animateHomeOut = function()      {
        $('#eu_flag').show();       $('#home_link_rollover').hide();
    }
    let animateBaggageOver = function()      {
        anime({ targets: '#baggage_reclaim_bg', fill: ['#f8e106', '#fff'], easing: 'easeInOutSine', duration: 250  });
    };
    let animateBaggageOut = function()      {
        anime({ targets: '#baggage_reclaim_bg', fill: ['#fff', '#f8e106'], easing: 'easeInOutSine', duration: 250  });
    };
    let animateLuggageOver = function()      {
        anime({ targets: '#lost_luggage_bg', fill: ['#f8e106', '#fff'], easing: 'easeInOutSine', duration: 250  });
    };
    let animateLuggageOut = function()      {
        anime({ targets: '#lost_luggage_bg', fill: ['#fff', '#f8e106'], easing: 'easeInOutSine', duration: 250  });
    };
    let animateGlobeOver = function() {
        $('#globe_svg_div').hide();             $('#globe_svg_rollover_div').show();
    }
    let animateGlobeOut = function() {
        $('#globe_svg_rollover_div').hide();    $('#globe_svg_div').show();
    }
    let showFlags = function() {
        $('#globe_flags').show();
    };
    $globe_td.on('mouseover', animateGlobeOver);
    $globe_td.on('mouseout', animateGlobeOut);
    $globe_td.on('click', showFlags);
    $('body').click(function (event)
    {
        if(!$(event.target).closest('#td_transfer').length)
        {
            $('#globe_flags').hide();
        }
    });
    $home.on('mouseover', animateHomeOver);
    $home.on('mouseout', animateHomeOut);
    $baggage_reclaim_svg.on('mouseover', animateBaggageOver);
    $baggage_reclaim_svg.on('mouseout', animateBaggageOut);
    $lost_luggage_svg.on('mouseover', animateLuggageOver);
    $lost_luggage_svg.on('mouseout', animateLuggageOut);

    let $flag_countries = $('#globe_flags .flight_headers span');
    let selectStartCountry = function() {
        let $thisParent = $(this).parent();
        let $theseSpans = $thisParent.find('span');
        let flagSpan = $theseSpans[0];
        let flagCountry = flagSpan.className.split(" ")[1].substring(10);
        flightPlan.setUpFlightPlan(flagCountry);
    };
    let setYellowText = function() {    $(this).css('color', '#F8E106');    }
    let setWhiteText = function() {    $(this).css('color', '#FFFFFF');    }
    $flag_countries.on('click', selectStartCountry);
    $flag_countries.on('mouseover', setWhiteText);
    $flag_countries.on('mousedown', setWhiteText);
    $flag_countries.on('mouseout', setYellowText);

    flightPlan.setUpFlightPlan("");

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
    setInterval(function() {
        updateClock();
    }, 500);

});

