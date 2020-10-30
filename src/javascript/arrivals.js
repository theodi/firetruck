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

    let leftMouseButtonOnlyDown = false;

    function setLeftButtonState(e) {
        leftMouseButtonOnlyDown = e.buttons === undefined
            ? e.which === 1
            : e.buttons === 1;
    }

    document.body.onmousedown = setLeftButtonState;
    document.body.onmousemove = setLeftButtonState;
    document.body.onmouseup = setLeftButtonState;

    let $home = $('#home_link');
    let $baggage_reclaim_svg = $('#baggage_reclaim_svg');
    let $lost_luggage_svg = $('#lost_luggage_svg');
    let displaysArea = new p5(displays_sketch, 'displays');
    let flightPlan = new FlightPlan(displaysArea);
    let $pointLeft = $('#point_left_div');
    let $pointRight = $('#point_right_div');

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
    let animatePointLeftOver = function()       {
        let currentFill = $('#point_left_path').attr('fill');
        if (currentFill !== '#ffffff' && currentFill !== "rgba(255,255,255,1)") {
            anime({ targets: '#point_left_path', fill: [currentFill, '#ffffff'], easing: 'easeInOutSine', duration: 50  });
        }
    }
    let animatePointLeftOut = function()       {
        let currentFill = $('#point_left_path').attr('fill');
        if (currentFill !== "rgba(248,225,6,1)") {
            anime({ targets: '#point_left_path', fill: [currentFill, '#f8e106'], easing: 'easeInOutSine', duration: 50  });
        }
    }
    let animatePointRightOver = function()       {
        let currentFill = $('#point_right_path').attr('fill');
        if (currentFill !== '#ffffff' && currentFill !== "rgba(255,255,255,1)") {
            anime({ targets: '#point_right_path', fill: [currentFill, '#ffffff'], easing: 'easeInOutSine', duration: 50  });
        }
    }
    let animatePointRightOut = function()       {
        let currentFill = $('#point_right_path').attr('fill');
        if (currentFill !== "rgba(248,225,6,1)") {
            anime({ targets: '#point_right_path', fill: [currentFill, '#f8e106'], easing: 'easeInOutSine', duration: 50  });
        }
    }
    // let increaseTime = function() {
    //     clockAdjustmentSeconds += 60;
    //     console.log("up:   clockAdjustmentSeconds = " + clockAdjustmentSeconds);
    // };
    // let decreaseTime = function () {
    //     clockAdjustmentSeconds -= 60;
    //     console.log("down: clockAdjustmentSeconds = " + clockAdjustmentSeconds);
    // }

    $home.on('mouseover', animateHomeOver);
    $home.on('mouseout', animateHomeOut);
    $baggage_reclaim_svg.on('mouseover', animateBaggageOver);
    $baggage_reclaim_svg.on('mouseout', animateBaggageOut);
    $lost_luggage_svg.on('mouseover', animateLuggageOver);
    $lost_luggage_svg.on('mouseout', animateLuggageOut);

    $pointLeft.on('mouseover', animatePointLeftOver);
    $pointLeft.on('mouseout', animatePointLeftOut);
    $pointLeft.on('mouseleave', animatePointLeftOut);
    // $pointLeft.on('click', decreaseTime);

    $pointRight.on('mouseover', animatePointRightOver);
    $pointRight.on('mouseout', animatePointRightOut);
    $pointRight.on('mouseleave', animatePointRightOut);
    // $pointRight.on('click', increaseTime);

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
    updateClock() ;//clockAdjustmentSeconds);
    flightPlan.updateFlightPlan();

    // update clock, once every half second
    setInterval(function() {
        updateClock();//clockAdjustmentSeconds)
        // flightPlan.setAdjustmentSeconds(clockAdjustmentSeconds);
    }, 500);

});

