import { getTime } from './getTime'

export const computeTimeElapsed = (timeElapsed, msInAYear) => {
    const miliSecsInAMin = 60_000;
    const miliSecsInAHour = 3_600_000;
    const miliSecsInADay = 86_400_000;
    const miliSecsInAMonth = 2_628_000_000;
    const minutes = Math.floor(timeElapsed / miliSecsInAMin);
    const hours = Math.floor(timeElapsed / miliSecsInAHour);
    const days = Math.floor(timeElapsed / miliSecsInADay);
    const months = Math.floor(timeElapsed / miliSecsInAMonth);
    const years = Math.floor(timeElapsed / msInAYear);

    return { minutes, hours, days, months, years };
};

export const getTimeElapsedText = (minutes, hours, days, months, years, onMessages) => {
    let text;
    if (minutes < 1 && minutes >= 0) {
        text = !onMessages ? "less than a minute ago" : '1 min'
    } else if (minutes >= 1 && minutes < 60) {
        text = minutes === 1 ? !onMessages ? "a minute ago" : '1 min' : !onMessages ? `${minutes} minutes ago` : `${minutes} mins`;
    } else if (minutes >= 60 && hours < 24) {
        text = hours === 1 ? !onMessages ? "about an hour ago" : '1 hr' : !onMessages ? `about ${hours} hours ago` : `${hours} hrs`
    } else if (days >= 1 && days < 30) {
        text = days === 1 ? !onMessages ? "about a day ago" : '1d' : !onMessages ? `about ${days} days ago` : `${days} ds`;
    } else if (days >= 30 && (months < 12 && months >= 1)) {
        text = months === 1 ? !onMessages ? "about a month ago" : '1m' : !onMessages ? `about ${months} months ago` : `${months} mons`;
    } else if (years >= 1) {
        text = years === 1 ? !onMessages ? "about a year ago" : '1y' : !onMessages ? `about ${years} years ago` : `${years} yrs`;
    }

    return text;
}


export const getDraftInfo = draft => {
    const { msOfCurrentYear, miliSeconds: currentMs } = getTime();
    const { timeOfLastEdit, creation, publicationDate } = draft;
    const creationMs = publicationDate?.miliSeconds ?? creation?.miliSeconds;
    const timeElapsed = currentMs - creationMs;
    const { minutes: sinceCreationMins, hours: sinceCreationHours, days: sinceCreationDays, months: sinceCreationMonths, years: sinceCreationYears } = computeTimeElapsed(timeElapsed, msOfCurrentYear);
    let sinceLastEdit_;
    if (timeOfLastEdit) {
        const timeElapsedLastEdit = currentMs - timeOfLastEdit.miliSeconds;
        const { minutes: lastEditMins, hours: lastEditHours, days: lastEditDays, months: lastEditMonths, years: lastEditYears } = computeTimeElapsed(timeElapsedLastEdit, msOfCurrentYear);
        sinceLastEdit_ = getTimeElapsedText(lastEditMins, lastEditHours, lastEditDays, lastEditMonths, lastEditYears);
    }
    return draft.timeOfLastEdit ?
        sinceLastEdit_
        :
        // if blank document, use the time since it was created to get the time elapsed
        getTimeElapsedText(sinceCreationMins, sinceCreationHours, sinceCreationDays, sinceCreationMonths, sinceCreationYears)
};

