import axios from "axios";
import moment from "moment";
import { getTime } from "./getTime";


const sendListToServer = (newPostSaved, signedInUserId) => {
    const path = '/users/updateInfo';
    const package_ =
    {
        name: 'saveIntoReadingList',
        signedInUserId,
        newPostSaved,
        listName: 'Read later'
    }
    axios.post(path, package_)
        .then(res => {
            const { status, data } = res;
            if (status === 200) {
                console.log(`Message from server: ${data}`);
            }
        })
        .catch(error => { console.error(`Error message saving reading list: ${error}`) });
}




// export const handleBookMarkClick = () => {
//     // update the db first, then update the ui.
//     const savedAt = {
//         date: moment().format("MMM Do YYYY"),
//         time: moment().format('h:mm a'),
//         miliSeconds: getTime().miliSeconds
//     }
//     const newPostSaved = { postId, savedAt, isIntroPicPresent: !!imgUrl };
//     // if the read later field exists in the readingList state, then add the post to it, 
//     if (!isBookMarkWhite && readingLists?.["Read later"]?.list) {
//         const { ["Read later"]: readLater } = readingLists;
//         const { list: _list } = readLater;
//         // GOAL: update the reading list locally
//         updateReadingListInDB(readingLists, newPostSaved).then(status => {
//             if (status === 200) {
//                 const _readingLists = {
//                     ...readingLists,
//                     ["Read later"]: {
//                         ...readLater,
//                         list: _list.length ? [..._list, newPostSaved] : [newPostSaved]
//                     }
//                 };
//                 setReadingLists(_readingLists);
//             }
//         });
//         // const package_ =
//         // {
//         //     name: 'saveIntoReadingList',
//         //     signedInUserId,
//         //     newPostSaved,
//         //     listName: 'Read later'
//         // }
//         // axios.post(path, package_).then(res => {
//         //     const { status, data } = res;
//         //     if (status === 200) {
//         //         console.log(`Message from server: ${data}`);
//         //     }
//         // });
//         setIsBookMarkWhite(true);
//         // if the reading list doesn't exist (if null is stored into reading list then create the following object and store it into the state of readingLists: {"Read later": { postId, savedAt, isIntroPicPresent: !!imgUrl }})
//     } else if (!isBookMarkWhite) {
//         console.log("berries");
//         updateReadingListInDB(readingLists, newPostSaved).then(status => {
//             if (status === 200) {
//                 const _readingLists = readingLists ?
//                     {
//                         ...readingLists,
//                         ['Read later']: {
//                             isPrivate: true,
//                             createdAt: savedAt,
//                             list: [newPostSaved]
//                         }
//                     }
//                     :
//                     {
//                         ['Read later']: {
//                             isPrivate: true,
//                             createdAt: savedAt,
//                             list: [newPostSaved]
//                         }
//                     }
//                 setReadingLists(_readingLists);
//                 setIsBookMarkWhite(true);
//             }
//         })
//         // axios.post(path, package_).then(res => {
//         //     const { status } = res || {};
//         //     if (status === 200) {
//         //     }
//         // })
//         //     .catch(error => {
//         //         if (error) {
//         //             console.error(`Error message 169: `, error);
//         //             throw error;
//         //         }
//         //     });
//     };
//     setSelectedPost({ id: postId, isIntroPicPresent: !!imgUrl });
// };