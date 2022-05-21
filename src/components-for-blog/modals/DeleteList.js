import React from 'react'
import { useHistory, useParams } from 'react-router';
import axios from 'axios';
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';

const DeleteList = ({ closeModal }) => {
    const history = useHistory();
    const { listName: _listName } = useParams();
    const { _readingLists } = useContext(UserInfoContext);
    const [readingLists, setReadingLists] = _readingLists;
    const { username, _id: userId } = JSON.parse(localStorage.getItem('user'));

    const handleDeleteListBtnClick = event => {
        event.preventDefault();
        const path = '/users/updateInfo';
        const package_ = {
            name: 'deleteReadingList',
            userId,
            listName: _listName
        };
        axios.post(path, package_).then(res => {
            const { status, data: message } = res;
            if (status === 200) {
                setReadingLists(readingLists => {
                    const { [_listName]: deletedList, ...newReadingLists } = readingLists;
                    debugger
                    return newReadingLists
                });
                alert(message);
                history.push(`/${username}/readingLists`);
            }
        })
    };

    return (
        <div className="modal deleteList">
            <div>
                <header>
                    <h1>Delete this list?</h1>
                </header>
                <section>
                    <button>
                        Cancel
                    </button>
                    <button onClick={event => {
                        handleDeleteListBtnClick(event);
                    }}>
                        CONFIRM DELETION
                    </button>
                </section>
            </div>
        </div>
    )
}

export default DeleteList
