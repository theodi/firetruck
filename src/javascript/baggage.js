// import displays_sketch from './baggage/display_sketch';
import updateClock from "./clock";
import FlightPlan from './baggage/flight_plan';
import anime from 'animejs/lib/anime.es.js';
import youtube_urls from "./data/youtube";
import translations from './data/translations';

$(function(){
    let $continue = $('#click_continue');
    $continue.on('click', function(){
        $('#body').show();
        $('#small').hide();
    });

    // Replace the 'ytplayer' element with an <iframe> and
    // YouTube player after the API code downloads.
    let player;
    let player_ready = false;
    let video_country_id = "";
    let englishPlayed = false;

    let $ytwrap = $('#ytwrap');

    let $home = $('#home_link')
    let $home_2 = $('#home_link_2');

    let animateHomeOver = function()    {   $('#eu_flag').hide();   $('#home_link_rollover').show();    };
    let animateHomeOut = function()     {   $('#eu_flag').show();   $('#home_link_rollover').hide();    };
    let animateHomeOver_2 = function()    {   $('#eu_flag_2').hide();   $('#home_link_rollover_2').show();    };
    let animateHomeOut_2 = function()     {   $('#eu_flag_2').show();   $('#home_link_rollover_2').hide();    };

    $home.on('mouseover', animateHomeOver);
    $home.on('mouseout', animateHomeOut);
    $home_2.on('mouseover', animateHomeOver_2);
    $home_2.on('mouseout', animateHomeOut_2);

    let $arrivals_link = $('#arrivals_btn');

    let animateArrivalsOver = function()      {
        this.src = this.src.replace("_btn", "_rollover");
    };
    let animateArrivalsOut = function()      {
        this.src = this.src.replace("_rollover", "_btn");
    };
    $arrivals_link.on('mouseover', animateArrivalsOver);
    $arrivals_link.on('mouseout', animateArrivalsOut);

    let $lost_luggage_link = $('#lost_luggage_btn');

    let animateLostLuggageOver = function()      {
        this.src = this.src.replace("_btn", "_rollover");
    };
    let animateLostLuggageOut = function()      {
        this.src = this.src.replace("_rollover", "_btn");
    };
    $lost_luggage_link.on('mouseover', animateLostLuggageOver);
    $lost_luggage_link.on('mouseout', animateLostLuggageOut);


    let flightPlan = new FlightPlan();

    flightPlan.setUpFlightPlan();


    // initialize
    let $width = $('#belt').width();
    let $baggages = $('#baggages');
    let $scrollWidth = $baggages.outerWidth();
    $baggages.css({'right': -$scrollWidth + 'px'});

    // animate
    function scroll() {
        $baggages.animate({
            right: $width
        }, 170000, 'linear', function() {
            $baggages.css({'right': -$scrollWidth + 'px'});
            scroll();
        });
    }
    /*150000*/
    scroll();


    let $bag_roll = $('.bag_roll');
    let animateBaggageOver = function()      {
        let this_id = this.id;
        let currentFill = $('#' + this_id).attr('fill');

        if (currentFill !== "rgba(248,225,6,1)")         {
            anime({ targets: '#' + this_id, fill: [currentFill, '#f8e106'], easing: 'easeInOutSine', duration: 50   });
        }
    }
    let animateBaggageOut = function()      {
        let this_id = this.id;
        let currentFill = $('#' + this_id).attr('fill');

        if (currentFill !== '#000000' && currentFill !== "rgba(0,0,0,1)") {
            anime({targets: '#' + this_id, fill: [currentFill, '#000'], easing: 'easeInOutSine', duration: 50});
        }
    }

    $bag_roll.on('mouseover', animateBaggageOver);
    $bag_roll.on('mouseout', animateBaggageOut);
    $('body').click(function (event)
    {
        if(!$(event.target).closest('.bag_roll').length && !($(event.target).is('#continue')))
        {
            $ytwrap.hide();
            if (player !== undefined) {
                player.pauseVideo();
            }
            $('#ytplayer').hide();
            $('#poem_details_join').hide();
            $('#poem_details').hide();
        }
    });

    $bag_roll.on('click', function() {
        $ytwrap.show();
        video_country_id = this.id;
        englishPlayed = false;
        if (video_country_id.indexOf('-') !== -1){
            // "GB"         2
            // "GB-3"       4
            // "GB-WLS"     5
            // "GB-WLS-3"   7

            if (video_country_id.length !== 6) {
                video_country_id = video_country_id.substring(0, video_country_id.lastIndexOf('-'));
            }
        }
        let video_id = youtube_urls[video_country_id]['video'];
        // noinspection JSJQueryEfficiency
        let $ytplayer = $('#ytplayer');

        $ytplayer.show();
        if (player) {
            player.loadVideoById({
                'videoId': video_id,
            });
        } else {
            player = new YT.Player('ytplayer', {
                height: '720',
                width: '1280',
                videoId: video_id,
                playerVars: {
                    'autoplay': 1,
                    'controls': 0,
                    'fs' : 0,
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
        showTextCountryAndFlag(video_country_id, false);

        function onPlayerStateChange(event) {
            if (event.data === YT.PlayerState.ENDED) {
                playNext();
            }
        }
        function playNext() {

            if (!englishPlayed) {
                video_id = youtube_urls[video_country_id]['video_en'];
                player.loadVideoById({
                    'videoId': video_id,
                });
                showTextCountryAndFlag(video_country_id, true);

                englishPlayed = true;
            } else {
                let $ytplayer = $('#ytplayer');
                $ytplayer.hide();
                let $ytwrap = $('#ytwrap');
                $ytwrap.hide();
                $('#poem_details_join').hide();
                $('#poem_details').hide();

                $('#poem_text').hide();
                $('#poem_country').hide();
                $('.flag_svg').hide();
                englishPlayed = false;
            }
        }

        function showTextCountryAndFlag(country_id, english) {

            let translation_index = youtube_urls[country_id]['translation_index'];
            let translation_country = youtube_urls[country_id]['country'];

            let poem_text = "";
            if (english) {
                translation_index = translation_index + 1;
            }
            for(let i = 1; i < translations.length; i++) {
                poem_text += translations[i][translation_index] + "<br>";
            }
            $('#poem_content').html(poem_text);
            $('#poem_text').show();
            $('#poem_country').text(translation_country).show();

            $('.flag_svg').hide();

            let flagIndex = 0;
            // English is 0, and doesn't have a 2nd (english) version
            if (translation_index > 0) {
                flagIndex = Math.floor((translation_index + 1) / 2) + 1;
            } else {
                flagIndex = 1;
            }

            let $flagSVG = $('#flag_svg_' + flagIndex);
            $flagSVG.show();

            $('#poem_details_join').show();
            $('#poem_details').show();
        }
    });

    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // Load the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    function onYouTubePlayerAPIReady() {
        player_ready = true;
    }

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

