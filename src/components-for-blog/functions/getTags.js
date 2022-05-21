import axios from "axios";



export const getAllTagInfo = () => {
    const url = "http://localhost:3005/tags";
    return fetch(url).then(res => {
        if (res.ok) {
            return res.json()
        } else {
            console.error("Fetched FAILED. Check fetch method.")
        }
    })
}

export const getTagNames = () => {
    const package_ = { name: 'getTagNames' }
    const path = `/tags/${JSON.stringify(package_)}`;
    return axios.get(path)
        .then(res => {
            const { status, data } = res;
            if (status === 200) {
                return data;
            }
        })
        .catch(error => {
            console.error("Failed to get tag names. ", error)
        })
}