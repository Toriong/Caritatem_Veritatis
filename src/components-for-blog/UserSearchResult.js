
import React from 'react';
import moment from 'moment';
import LinesEllipsis from 'react-lines-ellipsis';
import { sendFollowUpdateToServer } from './functions/sendFollowUpdateToServer';
import history from '../history/history';
import { getTime } from './functions/getTime';
import '../blog-css/searchedUserResult.css';
import { useState } from 'react';


// GOAL: the user can do the following: 
// follow the user 
// see the whole entire bio of the user if the bio is long 
// go the home page of the user if the user presses the user's username on the UI
const UserSearchResult = ({ user, fns, isOnSearchPage }) => {
    const { isFollowing, username, bio, iconPath, _id: searchUserId } = user;
    const isBioLong = bio && bio.split(" ").length > 25
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const { setSelectedUser, setFollowing, setSearchInput } = fns;

    const toggleBioModal = () => {
        setSelectedUser(selectedUser => {
            if (!selectedUser.bio) {
                return { bio, username, _id: searchUserId }
            }
            return { bio: "", username: "", _id: "" };
        })
    };

    const goToUserHomePage = () => {
        setSearchInput("");
        history.push(`/${username}/`)
    }

    const updateUserFollowing = (values, fns) => {
        const { setFollowing, setNewFollowing } = fns;
        const { followedUserAt, status, _newFollowing } = values;
        const _userId = _newFollowing._id ?? _newFollowing.authorId;
        if ((status === 200) && followedUserAt) {
            const newFollowing = { userId: _userId, followedUserAt };
            setFollowing(following => following.length ? [...following, newFollowing] : [newFollowing])
        } else if (status === 200) {
            setFollowing(following => following.filter(({ userId }) => userId !== _userId));
        }
        setNewFollowing(_newFollowing);
    }

    const handleFollowBtnClick = () => {
        const followedUserAt = !isFollowing && { time: moment().format('h:mm a'), date: moment().format("MMM Do YYYY"), miliSeconds: getTime().miliSeconds };
        sendFollowUpdateToServer(followedUserAt, searchUserId).then(status => {
            const _newFollowing = { _id: searchUserId, isFollowing: !isFollowing }
            const values = {
                followedUserAt, _newFollowing,
                status: status
            }
            const fns = { setFollowing, setNewFollowing: setSelectedUser }
            updateUserFollowing(values, fns);
        })
    }

    const [isOverBtn, setIsOverBtn] = useState(false);

    const handleMouseOver = () => { setIsOverBtn(true) };

    const handleMouseLeave = () => { setIsOverBtn(false) };

    let searchUserResults;

    if (isOnSearchPage) {
        searchUserResults = 'searchedUserResult onSearchPage'
    } else {
        searchUserResults = 'searchedUserResult'
    }

    return (
        <div key={searchUserId} className={searchUserResults} onClick={() => { if (!isOverBtn) { goToUserHomePage() } }}>
            <section>
                <img
                    src={`http://localhost:3005/userIcons/${iconPath}`}
                    alt={"user_icon"}
                    onError={event => {
                        console.log('ERROR!')
                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png";
                    }}
                />
            </section>
            <section>
                {/* place the username and follow button here */}
                <h3>{username}</h3>
                {/* place bio of user here */}
                {isBioLong ?
                    <LinesEllipsis
                        className='searchResultsUserBio'
                        text={bio}
                        maxLine='2'
                        ellipsis='...'
                        trimRight
                        basedOn='words'
                        onClick={toggleBioModal}
                        style={{ cursor: isBioLong && 'pointer' }}
                    />
                    :
                    <p className='searchResultsUserBio'>{bio}</p>
                }
            </section>
            {(currentUserId !== searchUserId) && <button onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onClick={handleFollowBtnClick}>{isFollowing ? 'following' : 'follow'}</button>}
        </div>
    )
};

export default UserSearchResult;
