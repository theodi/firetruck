import displays_sketch from './lost/display_sketch';
import updateClock from "./clock";
import FlightPlan from './lost/flight_plan';
import anime from 'animejs/lib/anime.es.js';

import * as Tone from 'tone';

const p5 = require('p5');

$(function(){
    let $home_link = $('#home_link')
    $home_link.on('mouseover', function()   {   $('#eu_flag').hide();     $('#home_link_rollover').show();      });
    $home_link.on('mouseout', function()    {   $('#eu_flag').show();     $('#home_link_rollover').hide();      });
    $home_link.on('mouseleave', function()  {   $('#eu_flag').show();     $('#home_link_rollover').hide();      });

    let $reload = $('#reload');
    let $reload_svg = $('#reload_svg');
    let $reload_rollover = $('#reload_svg_rollover');
    let $audio_switch = $('#audio_switch');
    let $audio_on = $('#audio_on_svg');
    let $audio_on_rollover = $('#audio_on_rollover_svg');
    let $audio_off = $('#audio_off_svg');
    let $audio_off_rollover = $('#audio_off_rollover_svg');

    $reload.on('mouseover', function()      {   $reload_svg.hide();     $reload_rollover.show();      });
    $reload.on('mouseout', function()       {   $reload_svg.show();     $reload_rollover.hide();      });
    $reload.on('mouseleave', function()     {   $reload_svg.show();     $reload_rollover.hide();      });
    $audio_switch.on('mouseover', function()      {
        $audio_on.hide();
        $audio_on_rollover.show();
    });
    $audio_switch.on('mouseout', function()       {
        $audio_on.show();
        $audio_on_rollover.hide();      });
    $audio_switch.on('mouseleave', function()     {
        $audio_on.show();
        $audio_on_rollover.hide();
    });
    //$audio_off.on('mouseover', function()      {   $audio_off.hide();     $audio_off_rollover.show();      });
    //$audio_off.on('mouseout', function()       {   $audio_off.show();     $audio_off_rollover.hide();      });
    //$audio_off.on('mouseleave', function()     {   $audio_off.show();     $audio_off_rollover.hide();      });

    let displaysArea = new p5(displays_sketch, 'displays');
    let flightPlan = new FlightPlan(displaysArea);

    flightPlan.setUpFlightPlan();
    flightPlan.loadAudio();

    //attach a click listener to a play button
    /*
    document.querySelector('button')?.addEventListener('click', async () => {
        await Tone.start()
        console.log('audio is ready')

        const sampler = new Tone.Sampler({
            urls: {
                A1: "A1.mp3",
                A2: "A2.mp3",
            },
            baseUrl: "https://tonejs.github.io/audio/casio/",
            onload: () => {
                sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
            }
        }).toDestination();
    })*/

    // display initial flight plan
    // flightPlan.displayFlightPlan();

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

