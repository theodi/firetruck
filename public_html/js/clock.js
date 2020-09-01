"use strict";

function updateClock() {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }

    // set time on clock
    $('#arrivals_hour').text(hour);
    $('#arrivals_minute').text(minute);
    $('#arrivals_second').text(second);

}
