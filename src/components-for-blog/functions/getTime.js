// GOAL: have  the start date encapsulate the dummy date. So if the dummy date is some day in 2020 have the startDate for the getTime function be in 2019

//thoughts vomit
// startDate currently is getting me the start date of the current year
// THE PROBLEM: what if it has bee over a year, and thus it is a new year. Hence what will be stored into startDate will be the date of the new year, and therefore this date will not inlcude the date of the article since it was it last edited 

// get a date from the past

// DON'T NEED ALL INFO BELOW, EDIT SOME OUT
export const getTime = () => {
    const miliSecsInAMonth = 2_628_000_000;
    let today = new Date();
    let month = (today.getMonth() + 1);
    if (month.toString().length === 1) {
        month = `0${month}`;
    }
    let year = today.getFullYear();
    let day = today.getDate();
    if (day.toString().length === 1) {
        day = `0${day}`;
    }
    let date = month + "/" + day + "/" + year;
    let minutes = today.getMinutes()
    if (minutes.toString().length === 1) {
        minutes = `0${minutes}`;
    }
    const hours = today.getHours();
    let seconds = today.getSeconds();
    if (seconds.toString().length === 1) {
        seconds = `0${seconds}`;
    }
    const time = hours + ":" + minutes + ` ${hours > 12 ? 'pm' : 'am'}`
    const miliSeconds = Date.now();
    const miliSecsInAMin = 60_000;
    const firstDayOfYear = new Date(today.getFullYear(), 0, 0);
    const lastDay = new Date(today.getFullYear(), 11, 31);
    const msOfCurrentYear = (lastDay - firstDayOfYear) + ((lastDay.getTimezoneOffset() - firstDayOfYear.getTimezoneOffset()) * miliSecsInAMin);
    const pastDay = miliSeconds - (msOfCurrentYear * 2);
    const pastDay2 = miliSeconds - (miliSecsInAMonth * 3);
    const pastDay1 = miliSeconds - (msOfCurrentYear * 2);

    return {
        date,
        time,
        miliSeconds
    };
}