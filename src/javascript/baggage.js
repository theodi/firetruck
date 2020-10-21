// import displays_sketch from './baggage/display_sketch';
import updateClock from "./clock";
import FlightPlan from './baggage/flight_plan';
import anime from 'animejs/lib/anime.es.js';

// const p5 = require('p5');

$(function(){

    let $home = $('#home_span')
    let $home_2 = $('#home_span_2');

    let animateHomeOver = function()    {   $('#eu_flag').hide();   $('#home_link_rollover').show();    };
    let animateHomeOut = function()     {   $('#eu_flag').show();   $('#home_link_rollover').hide();    };
    let animateHomeOver_2 = function()    {   $('#eu_flag_2').hide();   $('#home_link_rollover_2').show();    };
    let animateHomeOut_2 = function()     {   $('#eu_flag_2').show();   $('#home_link_rollover_2').hide();    };

    $home.on('mouseover', animateHomeOver);
    $home.on('mouseout', animateHomeOut);
    $home_2.on('mouseover', animateHomeOver_2);
    $home_2.on('mouseout', animateHomeOut_2);

    //let displaysArea = new p5(displays_sketch, 'displays');
    let flightPlan = new FlightPlan();//displaysArea);

    flightPlan.setUpFlightPlan();


    // initialize
    let $width = $('#belt').width();
    let $baggages = $('#baggages');
    let $scrollWidth = $baggages.outerWidth();
    $baggages.css({'right': -$scrollWidth + 'px'});

    // animate
    function scroll() {
        $('#baggages').animate({
            right: $width
        }, 50000, 'linear', function() {
            $('#baggages').css({'right': -$scrollWidth + 'px'});
            scroll();
        });
    }
    scroll();


    let $bag_roll = $('.bag_roll');
    let animateBaggageOver = function()      {

        let this_id = this.id;
        anime({ targets: '#' + this_id, fill: ['#000', '#f8e106'], easing: 'easeInOutSine', duration: 50   });
    }
    let animateBaggageOut = function()      {
        let this_id = this.id;
        anime({ targets: '#' + this_id, fill: ['#f8e106', '#000'], easing: 'easeInOutSine', duration: 50   });
    }

    $bag_roll.on('mouseover', animateBaggageOver);
    $bag_roll.on('mouseout', animateBaggageOut);


    // set the time and flight plan
////    updateClock();
//
    // flashing colons
    anime({
        targets: 'span.clock_colon',
        color: [{ value: '#F8E106', duration: 250, delay: 250 }, { value: '#000000', duration: 250, delay: 250 }],
        easing: 'easeInOutSine',
        loop: true,
    });

    // set the time and flight plan
    updateClock();

    flightPlan.updateFlightPlan();

    // display initial flight plan
    flightPlan.displayFlightPlan();

    // update clock, once every half second
    setInterval(updateClock, 500);


});

