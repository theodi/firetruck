var moment = require('moment');
moment().format();

function updateClock() {
    let now = moment();//new Date();
    let hour = now.hours();//getHours();
    let minute = now.minutes();//getMinutes();
    let second = now.seconds();//getSeconds();

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

export default updateClock;
