import displays_sketch from './lost/display_sketch';
import updateClock from "./clock";
import FlightPlan from './lost/flight_plan';
import anime from 'animejs/lib/anime.es.js';

const p5 = require('p5');

$(function(){
    let $home = $('#home_link');
    let $continue = $('#click_continue');
    $continue.on('click', function(){
       $('#body').show();
       $('#small').hide();
    });

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

    let $arrivals_link = $('#arrivals_btn');

    let animateArrivalsOver = function()      {
        this.src = this.src.replace("_btn", "_rollover");
    };
    let animateArrivalsOut = function()      {
        this.src = this.src.replace("_rollover", "_btn");
    };
    $arrivals_link.on('mouseover', animateArrivalsOver);
    $arrivals_link.on('mouseout', animateArrivalsOut);

    let $baggage_link = $('#baggage_reclaim_btn');

    let animateBaggageOver = function()      {
        this.src = this.src.replace("_btn", "_rollover");
    };
    let animateBaggageOut = function()      {
        this.src = this.src.replace("_rollover", "_btn");
    };
    $baggage_link.on('mouseover', animateBaggageOver);
    $baggage_link.on('mouseout', animateBaggageOut);

    let $reload = $('#reload');
    let $audio_switch = $('#audio_switch');

    let animateReloadOver = function()      {
        let currentFill = $('#reload_path').attr('fill');
        if (currentFill !== '#ffffff' && currentFill !== "rgba(255,225,255,1)") {
            anime({targets: '#reload_path', fill: [currentFill, '#fff'], easing: 'easeInOutSine', duration: 250});
        }
    };
    let animateReloadOut = function()      {
        let currentFill = $('#reload_path').attr('fill');
        if (currentFill !== "rgba(248,225,6,1)") {
            anime({targets: '#reload_path', fill: [currentFill, '#f8e106'], easing: 'easeInOutSine', duration: 250});
        }
    }

    $reload.on('mouseover', animateReloadOver);
    $reload.on('mouseout', animateReloadOut);

    let animateAudioOver = function()      {
        let currentFill = $('#audio_path_1').attr('fill');
        let muted = flightPlan.getMuted();
        if (currentFill !== '#ffffff' && currentFill !== "rgba(255,225,255,1)") {
            anime({targets: '#audio_path_1', fill: [currentFill, '#fff'], easing: 'easeInOutSine', duration: 250});
            if (!muted) {
                anime({targets: '#audio_path_2', fill: [currentFill, '#fff'], easing: 'easeInOutSine', duration: 250});
                anime({targets: '#audio_path_3', fill: [currentFill, '#fff'], easing: 'easeInOutSine', duration: 250});
            }
        }
    }
    let animateAudioOut = function()      {
        let currentFill = $('#audio_path_1').attr('fill');
        if (currentFill !== "rgba(248,225,6,1)") {
            let muted = flightPlan.getMuted();
            anime({targets: '#audio_path_1', fill: [currentFill, '#f8e106'], easing: 'easeInOutSine', duration: 250});
            if (!muted) {
                anime({targets: '#audio_path_2', fill: [currentFill, '#f8e106'], easing: 'easeInOutSine', duration: 250});
                anime({targets: '#audio_path_3', fill: [currentFill, '#f8e106'], easing: 'easeInOutSine', duration: 250});
            }
        }
    }

    $audio_switch.on('mouseover', animateAudioOver);
    $audio_switch.on('mouseout', animateAudioOut);
    $audio_switch.on('mouseleave', animateAudioOut);

    let displaysArea = new p5(displays_sketch, 'displays');
    let flightPlan = new FlightPlan(displaysArea);

    flightPlan.setUpFlightPlan();

    $reload.on('click', function()          {
        let muted = flightPlan.getMuted();
        flightPlan.reload(muted);
//        flightPlan.setMuted(muted);
    });
    $audio_switch.on('click', function() {
        flightPlan.toggleAudioMute();
        let muted = flightPlan.getMuted();
        if (muted) {
            anime({ targets: '#audio_path_2', fill: ['#f8e106', '#000'], easing: 'easeInOutSine', duration: 250   });
            anime({ targets: '#audio_path_3', fill: ['#f8e106', '#000'], easing: 'easeInOutSine', duration: 250   });
        } else {
            anime({ targets: '#audio_path_2', fill: ['#000', '#f8e106'], easing: 'easeInOutSine', duration: 250   });
            anime({ targets: '#audio_path_3', fill: ['#000', '#f8e106'], easing: 'easeInOutSine', duration: 250   });
        }
    })

    // flashing colons
    anime({
        targets: 'span.clock_colon',
        color: [{ value: '#F8E106', duration: 250, delay: 250 }, { value: '#000000', duration: 250, delay: 250 }],
        easing: 'easeInOutSine',
        loop: true,
    });

    // set the time and flight plan
    updateClock();

    // update clock, once every half second
    setInterval(updateClock, 500);
});

