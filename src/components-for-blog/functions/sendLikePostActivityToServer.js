import axios from 'axios';
import { checkIsArrayNotEmpty } from './checkIsArrayNotEmpty';

// packageNames:
// userLikedPost
// userUnLikedPost


export const sendLikePostActivityToServer = (userId_, postId, packageName) => {
    const path = "/users/updateInfo";
    const package_ = {
        name: packageName,
        userId: userId_,
        data: {
            postId
        }
    }
    axios.post(path, package_)
        .then(res => {
            const { status, data } = res;
            if (status == 200) {
                let _user = JSON.parse(localStorage.getItem('user'));
                console.log('is array not empty: ', checkIsArrayNotEmpty(_user, 'activities', 'likes', 'likePostIds'))
                if (_user.activities && _user.activities.likes) {
                    const { likes } = _user.activities;
                    _user = {
                        ..._user,
                        activities: {
                            ..._user.activities,
                            likes: {
                                ...likes,
                                likePostIds: data.isLiked ? ((likes.likePostIds && likes.likePostIds.length) ? [...likes.likePostIds, postId] : [postId]) : likes.likePostIds.filter(_postId => _postId !== postId)
                            }
                        }
                    }
                } else if (_user.activities) {
                    _user = {
                        ..._user,
                        activities: {
                            ..._user.activities,
                            likes: {
                                likePostIds: [postId]
                            }
                        }
                    };
                } else {
                    _user = {
                        ..._user,
                        activities: {
                            likes: {
                                likePostIds: [postId]
                            }
                        }
                    };
                };
                console.log('_user: ', _user);
                debugger
                localStorage.setItem('user', JSON.stringify(_user));
            }
        })
        .catch(err => {
            console.error(`Error message: ${err}`);
        });
}