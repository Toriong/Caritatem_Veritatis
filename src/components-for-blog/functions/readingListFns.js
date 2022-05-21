import axios from "axios";
import moment from "moment";
import { getTime } from "./getTime";

const user = localStorage.getItem('user')
const userId = user && JSON.parse(user);


export const updateReadingListInDB = (readingLists, newPostSaved) => {
    const path = '/users/updateInfo';
    const package_ = readingLists !== null ?
        {
            name: 'saveIntoReadingList',
            signedInUserId: userId,
            newPostSaved,
            listName: 'Read later'
        }
        :
        {
            name: 'saveIntoReadingList',
            signedInUserId: userId,
            isPrivate: true,
            wasListCreated: true,
            newPostSaved,
            listName: 'Read later'
        };
    return axios.post(path, package_)
        .then(res => {
            return res?.status;
        })
        .catch(error => {
            if (error) {
                console.error(`Error in updating the reading list of user in the db: `, error);
            }
        });
}


export const handleBookMarkClick = ({ vals, fns }) => {
    const { readingLists, isBookMarkWhite, postId, imgUrl } = vals;
    const { setReadingLists, setIsBookMarkWhite, setSelectedPost, setIsAModalOn } = fns;
    // update the db first, then update the ui.
    const savedAt = {
        date: moment().format("MMM Do YYYY"),
        time: moment().format('h:mm a'),
        miliSeconds: getTime().miliSeconds
    }
    const newPostSaved = { postId, savedAt, isIntroPicPresent: !!imgUrl };
    // if the read later field exists in the readingList state, then add the post to it, 
    if (!isBookMarkWhite && readingLists?.["Read later"]?.list) {
        const { ["Read later"]: readLater } = readingLists;
        const { list: _list } = readLater;
        // GOAL: update the reading list locally
        updateReadingListInDB(readingLists, newPostSaved).then(status => {
            if (status === 200) {
                const _readingLists = {
                    ...readingLists,
                    ["Read later"]: {
                        ...readLater,
                        list: _list.length ? [..._list, newPostSaved] : [newPostSaved]
                    }
                };
                setReadingLists(_readingLists);
                setIsBookMarkWhite(true);
            }
        });
    } else if (!isBookMarkWhite) {
        console.log("berries");
        updateReadingListInDB(readingLists, newPostSaved).then(status => {
            if (status === 200) {
                const _readingLists = readingLists ?
                    {
                        ...readingLists,
                        ['Read later']: {
                            isPrivate: true,
                            createdAt: savedAt,
                            list: [newPostSaved]
                        }
                    }
                    :
                    {
                        ['Read later']: {
                            isPrivate: true,
                            createdAt: savedAt,
                            list: [newPostSaved]
                        }
                    }
                setReadingLists(_readingLists);
                setIsBookMarkWhite(true);
            }
        })
    };
    setIsAModalOn(true)
    setSelectedPost({ id: postId, isIntroPicPresent: !!imgUrl });
};