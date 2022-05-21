import React, { useEffect, useState } from 'react'
import axios from 'axios';
import FollowAndMessageBtns from './FollowAndMessageBtns';
import { useContext } from 'react';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { useParams } from 'react-router';
import history from '../history/history';

// GOAL: display the correct user followers onto the dom for the side navbar

const UserSideNavBar = ({ blogPostsVals, userBeingViewed, fns }) => {
    const { userName } = useParams();
    const { userFirstName, userLastName, userIconPath, followers, following, _id, isFollowed, isOnReadingListPage } = userBeingViewed
    const { setFollowers, setUserProfile, setIsOnFollowersPage, setIsOnFollowingPage } = fns;
    const { isLoadingDone, users } = blogPostsVals;
    const { iconPath, firstName, lastName, following: _following, username: usernameOfCurrentUser } = JSON.parse(localStorage.getItem('user'));
    const isOnOwnProfile = userName === usernameOfCurrentUser;
    const followAndMessageBtnsVals = { userBeingViewed: { _id, isFollowed: isFollowed }, following, isMessageBtnOn: true };
    const followAndMessageBtnsFns = { setFollowers, setUserBeingViewed: setUserProfile }

    const goTo = destination => () => {
        const pathArray = destination.split("/");
        if ('followers' === pathArray[pathArray.length - 1]) {
            setIsOnFollowingPage(false);
            setIsOnFollowersPage(true);
        } else {
            setIsOnFollowersPage(false);
            setIsOnFollowingPage(true);
        }
        history.push(destination)
    }

    // GOAL: make the reading list main page for different user responsive for above 768px
    const userHomePageSideBarCss = isOnReadingListPage ? 'userHomePageSideBar onReadingListPage' : 'userHomePageSideBar'

    return (
        <div className={userHomePageSideBarCss}>
            <section>
                <img
                    src={`http://localhost:3005/userIcons/${userIconPath || (isOnOwnProfile && iconPath)}`}
                    alt={"user_icon"}
                    onError={event => {
                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                        // event.target.src = "https://img.icons8.com/ios-glyphs/30/000000/user--v1.png";
                    }}
                />
            </section>
            <section className="userNames">
                <div>
                    <span><b>{`${userFirstName ?? firstName} ${userLastName ?? lastName}`}</b></span>
                    <span><i> {`@${userName}`}</i></span>
                </div>
            </section>
            <section>
                {!isOnOwnProfile && <FollowAndMessageBtns values={followAndMessageBtnsVals} fns={followAndMessageBtnsFns} />}
            </section>
            <section>
                <div />
            </section>
            <section>
                <div>
                    {isLoadingDone && <span onClick={goTo(`/${userName}/followers`)}>Followers {`(${followers?.length ?? 0})`}</span>}
                    <section className="followingAndFollowerContainer">
                        {!isLoadingDone ?
                            <span>Loading followers, please wait...</span>
                            :
                            (followers?.length && users.length) ?
                                followers.map(({ userId, _id: idOfUser }) => {
                                    const { iconPath } = users.find(({ _id }) => _id === (userId ?? idOfUser)) ?? {}
                                    return (
                                        <img
                                            src={`http://localhost:3005/userIcons/${iconPath}`}
                                            alt={"user_icon"}
                                            onError={event => {
                                                console.log('ERROR!')
                                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png";
                                            }}
                                        />
                                    )
                                }
                                )
                                :
                                <span>{isOnOwnProfile ? 'You have ' : `${userName} has `} no followers.</span>
                        }
                    </section>
                </div>
                <div>
                    <span onClick={following?.length && goTo(`/${userName}/following`)}>Following {isLoadingDone && `(${following?.length ?? 0})`}</span>
                    <section className="followingAndFollowerContainer">
                        {!isLoadingDone ?
                            <span>Loading following, please wait...</span>
                            :
                            (((!isOnOwnProfile && following?.length) || (isOnOwnProfile && _following?.length)) && users.length) ?
                                following.map(({ userId, _id: idOfUser }) => {
                                    const { iconPath } = users.find(({ _id }) => _id === (userId ?? idOfUser)) ?? {};
                                    return (
                                        <img
                                            src={`http://localhost:3005/userIcons/${iconPath}`}
                                            alt={"user_icon"}
                                            onError={event => {
                                                console.log('ERROR!')
                                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png";
                                            }}
                                        />
                                    )
                                }
                                )
                                :
                                <span>{isOnOwnProfile ? 'You are ' : `${userName} is `} currently following nobody.</span>
                        }
                    </section>
                </div>
            </section>
        </div>
    )
}

export default UserSideNavBar
