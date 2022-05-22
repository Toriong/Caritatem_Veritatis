
import React from 'react';
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import history from '../../history/history';
import { UserLocationContext } from '../../provider/UserLocationProvider';

const SearchPostResult = ({ post, setIsSearchResultsDisplayed }) => {
    const { _id, authorUsername, authorIconPath, title, publicationDate, imgUrl } = post;
    const { _elementIds, _isUserViewingPost, _isOnProfile, _areUsersReceived, _isLoadingPostDone, _isUserOnNewStoryPage } = useContext(UserInfoContext);
    const { _isUserOnHomePage } = useContext(UserLocationContext);
    const [elementIds, setElementIds] = _elementIds;
    const [isUserViewingPost, setIsUserViewingPost] = _isUserViewingPost;
    const [isUserOnHomePage, setIsUserOnHomePage] = _isUserOnHomePage;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [areUsersReceived, setAreUsersReceived] = _areUsersReceived;
    const [isLoadingPostDone, setIsLoadingPostDone] = _isLoadingPostDone;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const src = imgUrl ? `http://localhost:3005/postIntroPics/${imgUrl}` : `http://localhost:3005/userIcons/${authorIconPath}`
    const _title = title.length > 20 ? `${title.slice(0, 20)}...` : title;

    const handlePostResultClick = () => {
        setIsUserViewingPost(true);
        setIsUserOnHomePage(false);
        setAreUsersReceived(false);
        setIsLoadingPostDone(false);
        setIsUserOnNewStoryPage(false);
        setIsSearchResultsDisplayed(false)
        history.push(`/${authorUsername}/${title}/${_id}`);
    }

    return (
        <div key={_id} onClick={handlePostResultClick} className='searchedPost'>
            <div>
                <img
                    src={src}
                    onError={event => {
                        console.log('ERROR!')
                        event.target.src = '/philosophersImages/aristotle.jpeg';
                    }}
                />
            </div>
            <div>
                <div>
                    <h2>{_title}</h2>
                    <span>By {authorUsername}</span>
                    <p>{publicationDate}</p>
                </div>
            </div>
        </div>
    );
};

export default SearchPostResult;
