var moment = require('moment');
moment().format();

function updateClock(clockAdjustmentSeconds = 0) {

    let now = moment().add(clockAdjustmentSeconds, 'seconds');
    let hour = now.hours();
    let minute = now.minutes();
    let second = now.seconds();

    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }

    // set time on clock
    $('#clock_hour').text(hour);
    $('#clock_minute').text(minute);
    $('#clock_second').text(second);

}

export default updateClock;
