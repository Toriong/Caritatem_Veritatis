import axios from 'axios';
import React from 'react';
import TagSelections from './TagSelections';

const SelectTagsForm = ({ closeModal, allTags }) => {
    const { topics: likedTags, _id: signedInUserId } = JSON.parse(localStorage.getItem('user'));
    let _allTags = allTags.map(tag => {
        const isTagLiked = likedTags.includes(tag._id);
        if (isTagLiked) {
            console.log('tag was liked')
            return {
                ...tag,
                isLiked: true
            }
        };

        return {
            ...tag,
            isLiked: false
        };
    })

    _allTags = _allTags.sort((topicA, topicB) => {
        const { topic: topicA_ } = topicA;
        const { topic: topicB_ } = topicB;
        return topicA_.toLowerCase() === topicB_.toLowerCase() ? 0 : topicA_.toLowerCase() < topicB_.toLowerCase() ? -1 : 1;
    });

    const handleSubmit = (event, setAllTags) => {
        event.preventDefault();
        const path = '/users/updateInfo';
        const likedTagIds = setAllTags.filter(({ isLiked }) => isLiked).map(({ _id }) => _id);
        const package_ = {
            name: 'updateUserProfile',
            userId: signedInUserId,
            field: 'topics',
            data: likedTagIds
        };
        axios.post(path, package_)
            .then(res => {
                const { status, data } = res;
                if (status === 200) {
                    console.log('From server: ', data);
                    let _user = JSON.parse(localStorage.getItem('user'));
                    _user = {
                        ..._user,
                        topics: likedTagIds
                    }
                    localStorage.setItem('user', JSON.stringify(_user));
                    closeModal();
                }
            })
            .catch(error => {
                console.error('An error has occurred in updating the tags of user: ', error);
            })
    }

    console.log('_allTags: ', _allTags)
    return (
        <div className="modal selectTags">
            <h1>Select Tags:</h1>
            <form
                action="#"
                onSubmit={handleSubmit}
            >
                <TagSelections closeModal={closeModal} _allTags={_allTags} handleSubmit={handleSubmit} />
            </form>
        </div>
    )
}

export default SelectTagsForm
