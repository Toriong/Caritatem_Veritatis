import axios from "axios";
import history from "../../../history/history";
import { getTime } from "../getTime";
import { v4 as insertId } from 'uuid';

const userId = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))._id

export const createNewDraft = fns => {
    const { setDraft, setDidUserCreatedDraft } = fns;
    const _id = insertId();
    const newDraft = {
        _id,
        defaultTitle: "Untitled draft",
        creation: {
            _date: getTime().date,
            _time: getTime().time,
            miliSeconds: getTime().miliSeconds
        }
    };
    const package_ = { name: 'addNewDraft', userId, data: newDraft };
    const path = "/users/updateInfo";
    axios.post(path, package_)
        .then(res => {
            const { data, status } = res;
            if (status === 200) {
                console.log(res);
                console.log(`message from server: ${data.message}`)
            } else {
                console.error("Post request FAILED. Check path or server.")
            }
        });
    history.push(`/WritePost/${_id}`);
    setDraft({});
    setDidUserCreatedDraft(true)
};