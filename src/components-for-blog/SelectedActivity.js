import React, { useState, useEffect, useContext, useReducer } from 'react'
import { Link, useParams } from 'react-router-dom'
import ActivityDisplayed from './ActivityDisplayed';
import '../blog-css/activitiesPage.css'

// GOAL: change all of the field names that will display all of the activities onto the DOM into 'activities'

const SelectedActivity = ({ activity: _activity, fns }) => {
    const { isPostByUser, publicationDate, activities, likedOn, followedOn, blockedOn, searchedOn } = _activity;
    const dateOfActivities = publicationDate || followedOn || likedOn || blockedOn || searchedOn;

    if (isPostByUser) {
        // selectedActivities = posts;
    }

    const dummyData = Array(7).fill(activities).flat();


    // GOAL: display all of the reading lists onto the ui
    return (
        <>
            {/* make the whole section into the following: {display: flex, flex-direction: column} */}
            <div
                className='selectedActivityContainer'
            >
                {/* display the date in this section */}
                <section>
                    <span>{dateOfActivities}</span>
                </section>
                {/* display the posts in this section. Map them onto the DOM. Have the following: 'the name of the post, the first 50 words of the body, the time that it was posted, the time of the lateset edits, the user icon, and the three dot btn at the end */}
                <section>
                    {activities.map((activity, index) =>
                        <ActivityDisplayed
                            activity={activity}
                            index={index}
                            totalActivities={activities.length}
                            activityType={_activity}
                            fns={fns}
                        />
                    )}
                </section>
            </div>
            {/* {index !== 6 && <div className='activitiesBorder' />} */}
        </>
    )
}

export default SelectedActivity
