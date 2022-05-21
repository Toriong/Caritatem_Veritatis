// ST = standard time 


export const convertToStandardTime = time => {
    const _time = time.split(':'); // convert to array
    const hours = Number(_time[0]);
    const minutes = Number(_time[1]);
    // calculate
    let timeValue;

    if ((hours >= 10) && (hours <= 12)) {
        timeValue = `${hours}`;
    } else if ((hours > 0) && (hours <= 9)) {
        timeValue = `0${hours}`;
    } else if (hours > 12) {
        const _hours = (hours - 12);
        timeValue = ((_hours > 0) && (_hours <= 9)) ? `${_hours}` : `${_hours}`;
    } else if (hours == 0) {
        timeValue = "12";
    }

    timeValue += (minutes < 10) ? `:0${minutes}` : `:${minutes}`;  // get minutes
    timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
    console.log('timeValue: ', timeValue);
    return timeValue;
};


