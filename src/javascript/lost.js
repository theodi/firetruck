import displays_sketch from './lost/display_sketch';
import updateClock from "./clock";
import FlightPlan from './lost/flight_plan';
import anime from 'animejs/lib/anime.es.js';

const p5 = require('p5');

$(function(){
    let $home_link = $('#home_link')
    $home_link.on('mouseover', function()   {   $('#eu_flag').hide();     $('#home_link_rollover').show();      });
    $home_link.on('mouseout', function()    {   $('#eu_flag').show();     $('#home_link_rollover').hide();      });
    $home_link.on('mouseleave', function()  {   $('#eu_flag').show();     $('#home_link_rollover').hide();      });

    let $reload = $('#reload');
    let $audio_switch = $('#audio_switch');

    let animateReloadOver = function()      {
        anime({ targets: '#reload_path', fill: ['#f8e106', '#fff'], easing: 'easeInOutSine', duration: 250  });
    };
    let animateReloadOut = function()      {
        anime({ targets: '#reload_path', fill: ['#fff', '#f8e106'], easing: 'easeInOutSine', duration: 250  });
    }

    $reload.on('mouseover', animateReloadOver);
    $reload.on('mouseout', animateReloadOut);

    let animateAudioOver = function()      {
        let muted = flightPlan.getMuted();
        anime({ targets: '#audio_path_1', fill: ['#f8e106', '#fff'], easing: 'easeInOutSine', duration: 250   });
        if (!muted) {
            anime({ targets: '#audio_path_2', fill: ['#f8e106', '#fff'], easing: 'easeInOutSine', duration: 250   });
            anime({ targets: '#audio_path_3', fill: ['#f8e106', '#fff'], easing: 'easeInOutSine', duration: 250   });
        }
    }
    let animateAudioOut = function()      {
        let muted = flightPlan.getMuted();
        anime({ targets: '#audio_path_1', fill: ['#fff', '#f8e106'], easing: 'easeInOutSine', duration: 250   });
        if (!muted) {
            anime({targets: '#audio_path_2', fill: ['#fff', '#f8e106'], easing: 'easeInOutSine', duration: 250});
            anime({targets: '#audio_path_3', fill: ['#fff', '#f8e106'], easing: 'easeInOutSine', duration: 250});
        }
    }

    $audio_switch.on('mouseover', animateAudioOver);
    $audio_switch.on('mouseout', animateAudioOut);

    let displaysArea = new p5(displays_sketch, 'displays');
    let flightPlan = new FlightPlan(displaysArea);

    flightPlan.setUpFlightPlan();

    $reload.on('click', function()          {
        flightPlan.stopAudio();
        flightPlan.setUpFlightPlan();
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
    flightPlan.updateFlightPlan();

    // update clock, once every half second
    setInterval(updateClock, 500);
});

