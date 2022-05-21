
const getTime = () => {
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
    let hours = today.getHours();
    if (hours.toString().length === 1) {
        hours = `0${hours}`;
    }
    let seconds = today.getSeconds();
    if (seconds.toString().length === 1) {
        seconds = `0${seconds}`;
    }
    let time = hours + ":" + minutes + ":" + seconds;
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
        miliSeconds,
        msOfCurrentYear,
    };
}

const computeTimeElapsed = (timeElapsed, msInAYear) => {
    const miliSecsInAMin = 60_000;
    const miliSecsInAHour = 3_600_000;
    const miliSecsInADay = 86_400_000;
    const miliSecsInAMonth = 2_628_000_000;
    const minutes = Math.floor(timeElapsed / miliSecsInAMin);
    const hours = Math.floor(timeElapsed / miliSecsInAHour);
    const days = Math.floor(timeElapsed / miliSecsInADay);
    const months = Math.floor(timeElapsed / miliSecsInAMonth);
    const years = Math.floor(timeElapsed / msInAYear);

    return {
        minutes,
        hours,
        days,
        months,
        years
    }
};

const getTimeElapsedText = (minutes, hours, days, months, years) => {
    let text;
    if (minutes < 1 && minutes >= 0) {
        text = "less than a minute ago"
    } else if (minutes >= 1 && minutes < 60) {
        text = minutes === 1 ? "a minute ago" : `${minutes} minutes ago`;
    } else if (minutes >= 60 && hours < 24) {
        text = hours === 1 ? "about an hour ago" : `about ${hours} hours ago`;
    } else if (days >= 1 && days < 30) {
        text = days === 1 ? "about a day ago" : `about ${days} days ago`;
    } else if (days >= 30 && (months < 12 && months >= 1)) {
        text = months === 1 ? "about a month ago" : `about ${months} months ago`;
    } else if (years >= 1) {
        text = years === 1 ? "about a year ago" : `about ${years} years ago`;
    }

    return text;
}

const getDraftInfo = draft => {
    const { msOfCurrentYear, miliSeconds: currentMs } = getTime();
    const timeElapsedCreation = currentMs - draft.creation.miliSeconds;
    const { minutes: sinceCreationMins, hours: sinceCreationHours, days: sinceCreationDays, months: sinceCreationMonths, years: sinceCreationYears } = computeTimeElapsed(timeElapsedCreation, msOfCurrentYear);
    let sinceLastEdit_;
    if (draft.timeOfLastEdit) {
        const timeElapsedLastEdit = currentMs - draft.timeOfLastEdit.miliSeconds;
        const { minutes: lastEditMins, hours: lastEditHours, days: lastEditDays, months: lastEditMonths, years: lastEditYears } = computeTimeElapsed(timeElapsedLastEdit, msOfCurrentYear);
        sinceLastEdit_ = getTimeElapsedText(lastEditMins, lastEditHours, lastEditDays, lastEditMonths, lastEditYears)

    }
    return draft.timeOfLastEdit ?
        {
            sinceLastEdit: sinceLastEdit_,
            sinceCreation: getTimeElapsedText(sinceCreationMins, sinceCreationHours, sinceCreationDays, sinceCreationMonths, sinceCreationYears)
        }
        :
        { sinceCreation: getTimeElapsedText(sinceCreationMins, sinceCreationHours, sinceCreationDays, sinceCreationMonths, sinceCreationYears) };
};



// testing data
let today = new Date();
const currentMs = Date.now();
const miliSecsInAMin = 60_000;
const miliSecsInAHour = 3_600_000;
const miliSecsInAMonth = 2_628_000_000;
const miliSecsInADay = 86_400_000;
const firstDayOfYear = new Date(today.getFullYear(), 0, 0);
const lastDay = new Date(today.getFullYear(), 11, 31);
const msOfCurrentYear = (lastDay - firstDayOfYear) + ((lastDay.getTimezoneOffset() - firstDayOfYear.getTimezoneOffset()) * miliSecsInAMin);
const pastEvent1 = {
    lastEdit: currentMs - (msOfCurrentYear * 2),
    creation: currentMs - (msOfCurrentYear * 3)
};
const pastEvent2 = {
    lastEdit: currentMs - (msOfCurrentYear * 3),
    creation: currentMs - (msOfCurrentYear * 4)
};
const pastEvent3 = {
    lastEdit: currentMs - (miliSecsInAMonth * 3),
    creation: currentMs - (miliSecsInAMonth * 5)
};
const pastEvent4 = {
    lastEdit: currentMs - (miliSecsInADay * 15),
    creation: currentMs - (miliSecsInADay * 28)
};
const pastEvent5 = {
    lastEdit: currentMs - miliSecsInADay,
    creation: currentMs - miliSecsInADay
};
const pastEvent6 = {
    lastEdit: currentMs - (miliSecsInAHour * 5),
    creation: currentMs - (miliSecsInAHour * 10)
};
const pastEvent7 = {
    lastEdit: currentMs - miliSecsInAHour,
    creation: currentMs - miliSecsInAMonth
};
const pastEvent8 = {
    lastEdit: currentMs - (miliSecsInAMin * 35),
    creation: currentMs - (miliSecsInAHour * 5)
}
const pastEvent9 = {
    lastEdit: currentMs - (miliSecsInAMin - 3_000),
    creation: currentMs - miliSecsInAMin
}
const pastEvent10 = {
    lastEdit: currentMs - (msOfCurrentYear * 132),
    creation: currentMs - (msOfCurrentYear * 207)
}


// GOAL: have the getDraftInfo function spit out the timeElapsedText for the creation of the pos or the time of the last edit
const test1 = {
    timeOfLastEdit: {
        miliSeconds: pastEvent1.lastEdit
    },
    creation: {
        miliSeconds: pastEvent1.creation
    }
}
const test2 = {
    timeOfLastEdit: {
        miliSeconds: pastEvent2.lastEdit
    },
    creation: {
        miliSeconds: pastEvent2.creation
    }
}
const test3 = {
    timeOfLastEdit: {
        miliSeconds: pastEvent3.lastEdit
    },
    creation: {
        miliSeconds: pastEvent3.creation
    }
}
const test4 = {
    timeOfLastEdit: {
        miliSeconds: pastEvent4.lastEdit
    },
    creation: {
        miliSeconds: pastEvent4.creation
    }
}
const test5 = {
    timeOfLastEdit: {
        miliSeconds: pastEvent5.lastEdit
    },
    creation: {
        miliSeconds: pastEvent5.creation
    }
}
const test6 = {
    timeOfLastEdit: {
        miliSeconds: pastEvent6.lastEdit
    },
    creation: {
        miliSeconds: pastEvent6.creation
    }
}
const test7 = {
    timeOfLastEdit: {
        miliSeconds: pastEvent7.lastEdit
    },
    creation: {
        miliSeconds: pastEvent7.creation
    }
}
const test8 = {
    timeOfLastEdit: {
        miliSeconds: pastEvent8.lastEdit
    },
    creation: {
        miliSeconds: pastEvent8.creation
    }
}
const test9 = {
    timeOfLastEdit: {
        miliSeconds: pastEvent9.lastEdit
    },
    creation: {
        miliSeconds: pastEvent9.creation
    }
}
const test10 = {
    timeOfLastEdit: {
        miliSeconds: pastEvent10.lastEdit
    },
    creation: {
        miliSeconds: pastEvent10.creation
    }
}

const pastEvent11 = {
    creation: currentMs - (miliSecsInAMin * 5)
}
const test11 = {
    creation: {
        miliSeconds: pastEvent11.creation
    }
}
const pastEvent12 = {
    creation: currentMs - (miliSecsInAMin - 3_000)
}
const test12 = {
    creation: {
        miliSeconds: pastEvent12.creation
    }
}
const pastEvent13 = {
    creation: currentMs - (miliSecsInAMonth * 3)
}
const test13 = {
    creation: {
        miliSeconds: pastEvent13.creation
    }
};

const test14 = {
    creation: {
        miliSeconds: 1631807104727
    },
    timeOfLastEdit: {
        miliSeconds: 1631807761916
    }
}


test.skip('get the correct time length since the article was last edited', () => {
    expect(getDraftInfo(test1)).toStrictEqual({ sinceLastEdit: "about 2 years ago", sinceCreation: "about 3 years ago" });
    expect(getDraftInfo(test2)).toStrictEqual({ sinceLastEdit: "about 3 years ago", sinceCreation: "about 4 years ago" });
    expect(getDraftInfo(test3)).toStrictEqual({ sinceLastEdit: "about 3 months ago", sinceCreation: "about 5 months ago" });
    expect(getDraftInfo(test4)).toStrictEqual({ sinceLastEdit: "about 15 days ago", sinceCreation: "about 28 days ago" });
    expect(getDraftInfo(test5)).toStrictEqual({ sinceLastEdit: "about a day ago", sinceCreation: "about a day ago" });
    expect(getDraftInfo(test6)).toStrictEqual({ sinceLastEdit: "about 5 hours ago", sinceCreation: "about 10 hours ago" });
    expect(getDraftInfo(test7)).toStrictEqual({ sinceLastEdit: "about an hour ago", sinceCreation: "about a month ago" });
    expect(getDraftInfo(test8)).toStrictEqual({ sinceLastEdit: "35 minutes ago", sinceCreation: "about 5 hours ago" });
    expect(getDraftInfo(test9)).toStrictEqual({ sinceLastEdit: "less than a minute ago", sinceCreation: "a minute ago" });
    expect(getDraftInfo(test10)).toStrictEqual({ sinceLastEdit: "about 132 years ago", sinceCreation: "about 207 years ago" });
    expect(getDraftInfo(test11)).toStrictEqual({ sinceCreation: "5 minutes ago" });
    expect(getDraftInfo(test12)).toStrictEqual({ sinceCreation: "less than a minute ago" });
    expect(getDraftInfo(test13)).toStrictEqual({ sinceCreation: "about 3 months ago" });
    // current draft data for test14 stored in gtorion97 files
    expect(getDraftInfo(test14)).toStrictEqual({ sinceLastEdit: "about 4 days ago", sinceCreation: "about 4 days ago" });
})
