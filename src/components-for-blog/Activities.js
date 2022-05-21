import React, { useState, useEffect, useContext } from 'react'
import { BsNewspaper, BsChevronRight, } from "react-icons/bs";
import { BiComment, } from "react-icons/bi";
import { GoThumbsup, GoBook } from "react-icons/go";
import { AiOutlineConsoleSql, AiOutlineUser, } from "react-icons/ai";
import { ImCancelCircle, ImSearch } from "react-icons/im";
import { UserInfoContext } from '../provider/UserInfoProvider'
import { useParams } from 'react-router';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import PreviousVersions from './modals/previousVersions/PreviousVersions';
import PreviousComments from './modals/previousVersions/PreviousComments'
import SelectedActivity from './SelectedActivity';
import history from '../history/history';
import EditVersion from './modals/EditVersion';
import LikesModal from './modals/LikesModal';
import ReadingListNames from './modals/ReadingListNames';
import '../blog-css/activitiesPage.css'

// NOTES:
// put the activities on the same page (in this component)
// create a different component and display the selected activities in that component
// create a state the will get the filter object name so that you can filter onto the dom the selected activity 


// GOAL: make the onClick of the reading list to work when the user is on the activities page main
const Activities = () => {
    const { type } = useParams();
    const { _activities, _isLoadingUserInfoDone } = useContext(UserInfoContext);
    const { _commentToEdit, _isLoadingUserDone } = useContext(BlogInfoContext);
    const [commentToEdit, setCommentToEdit] = _commentToEdit;
    const [isLoadingUserInfoForNavbarDone, setIsLoadingUserInfoForNavbarDone] = _isLoadingUserDone;
    const [activities, setActivities] = _activities;
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [isLoadingDone, setIsLoadingDone] = useState(false);
    const [isPreviousNamesModalOn, setIsPreviousNamesModalOn] = useState(false)
    const [isWillEditVersionModalOn, setIsWillEditVersionModalOn] = useState(false);
    const [isPrevPostsModalOn, setIsPrevPostsModalOn] = useState(false);
    const [isPrevCommentsModalOn, setIsPrevCommentsModalOn] = useState(false);
    const [isTagsModalOn, setIsTagsModalOn] = useState(false);
    const [isWillEditCommentModalOn, setIsWillEditCommentModalOn] = useState(false);
    const [isComment, setIsComment] = useState(false);
    const [previousVersions, setPreviousVersions] = useState([]);
    const [readingListNames, setReadingListNames] = useState([]);
    const activityNames = [{ name: 'Posts', filterField: 'isPostByUser', type: 'Posts' }, { name: 'Comments and replies', filterField: 'isCommentOrReply', type: 'commentsAndReplies' }, { name: 'Likes', filterField: 'isLikes', type: 'likes' }, { name: 'Reading lists', filterField: 'isReadingLists', type: 'ReadingLists' }, { name: 'Following', filterField: 'isFollowing', type: 'Following' }, { name: 'Search history', filterField: 'isSearchedHistory', type: 'searchedHistory' }, { name: 'Block history', filterField: 'areBlockedUsers', type: 'BlockedUsers' }];
    const icons = [<BsNewspaper key='Posts' />, <BiComment key='Comments and replies' />, <GoThumbsup key='Likes' />, <GoBook key='Reading lists' />, <AiOutlineUser key='Following' />, <ImCancelCircle key='Block history' />, <ImSearch key='Search history' />];
    const { username } = JSON.parse(localStorage.getItem('user'));
    let selectedActivities;

    // GOAL: filter in the activities that were chosen
    // get filterField and filterField2 and store them into filter the state of filterFields
    // take the user to the SelectedActivity page
    const handleActivityClick = (event, type) => {
        event.preventDefault();
        history.push(`/${username}/activities/${type}`)
    };

    const closeModal = fn => () => {
        fn(prevVal => prevVal?.length ? [] : false);
    };

    if (type && activities.length) {
        const { filterField } = activityNames.find(({ type: _type }) => type === _type);
        selectedActivities = activities.filter(activity => !!activity[filterField]);
    };



    useEffect(() => {
        if (!isLoadingDone && (activities.length || !activities.length)) {
            setIsLoadingDone(true);
        }
    }, [activities]);

    // WHY DO I HAVE THE FIRST FN EXECUTING?
    useEffect(() => {
        setCommentToEdit(null);
        setIsLoadingUserInfoForNavbarDone(true)
    }, [])

    useEffect(() => {
        console.log('activities: ', activities);
    })
    // created the component SelectedActivity to handle which activity this is to be displayed


    const dummyData = Array(5).fill(selectedActivities).flat();

    return (
        <>
            <div className='activitiesPage'>
                <header>
                    <div>
                        <h1>Activity log</h1>
                    </div>
                </header>
                <section className={type ? 'activityNamesContainer selectedActivity' : 'activityNamesContainer'}>
                    <div>
                        {!type ?
                            activityNames.map((activity, index) => {
                                const { type, name } = activity;
                                const icon = icons.find(({ key }) => key === name);
                                return (
                                    <>
                                        <div
                                            className='activitySection'
                                            onClick={event => {
                                                handleActivityClick(event, type);
                                            }}
                                        >
                                            <section>
                                                <div>
                                                    {icon}
                                                </div>
                                            </section>
                                            <section>
                                                <span>
                                                    {name}
                                                </span>
                                            </section>
                                            <section>
                                                <BsChevronRight />
                                            </section>
                                        </div>
                                        {index !== 6 && <div className='activitiesBorder' />}
                                    </>
                                )
                            })
                            :
                            selectedActivities?.length ?
                                selectedActivities.map(activity =>
                                    <SelectedActivity
                                        activity={activity}
                                        fns={{ setPreviousVersions, setIsPrevPostsModalOn, setSelectedVersion, setReadingListNames, setIsPreviousNamesModalOn, setIsPrevCommentsModalOn }}
                                    />
                                )
                                :
                                !isLoadingDone ? <p>Loading, please wait...</p> : <p>This activity is empty.</p>
                        }
                    </div>
                </section>
            </div>
            {isPrevPostsModalOn &&
                <>
                    <div className='blocker' onClick={closeModal(setIsPrevPostsModalOn)} />
                    <PreviousVersions
                        versions={previousVersions}
                        fns={{ setIsWillEditVersionModalOn, setSelectedVersion, setIsTagsModalOn }}
                    />
                </>
            }
            {isWillEditVersionModalOn &&
                <>
                    <div className='blocker black' onClick={closeModal(setIsWillEditVersionModalOn)} />
                    <EditVersion
                        fns={{ closeModal }}
                        values={{ selectedVersion, type: 'post' }}
                    />
                </>
            }
            {isTagsModalOn &&
                <>
                    <div className='blocker black' onClick={closeModal(setIsTagsModalOn)} />
                    <LikesModal
                        // closeModal={toggleModal(setIsAllTagsModalOn, isAllTagsModalOn)}
                        postTags={selectedVersion.tags}
                    // text={isOnProfile ? "Your" : `${userName}'s`}
                    />
                </>
            }
            {!!readingListNames.length &&
                <>
                    <div className='blocker black' onClick={closeModal(setReadingListNames)} />
                    <ReadingListNames
                        // closeModal={toggleModal(setIsAllTagsModalOn, isAllTagsModalOn)}
                        names={readingListNames}
                    // text={isOnProfile ? "Your" : `${userName}'s`}
                    />
                </>
            }
            {isPrevCommentsModalOn &&
                <>
                    <div className='blocker black' onClick={closeModal(setIsPrevCommentsModalOn)} />
                    <PreviousComments
                        fns={{ closeModal, setIsWillEditCommentModalOn, setIsComment }}
                        prevCommentsAndReplies={previousVersions}
                        type={'post'}
                    />
                </>
            }
            {isWillEditCommentModalOn &&
                <>
                    <div className='blocker black editCommentBlocker' onClick={closeModal(setIsWillEditCommentModalOn)} />
                    <EditVersion
                        values={{ type: 'commentOrReply' }}
                        fns={{ closeModal }}
                    />
                </>
            }
        </>
    )
}
export default Activities
// selectedActivities?.length ?
//     selectedActivities.map(activity =>
//         <SelectedActivity
//             activity={activity}
//             fns={{ setPreviousVersions, setIsPrevPostsModalOn, setSelectedVersion, setReadingListNames, setIsPreviousNamesModalOn, setIsPrevCommentsModalOn }}
//         />
//     )