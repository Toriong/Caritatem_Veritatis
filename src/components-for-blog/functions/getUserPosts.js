import axios from "axios"



export const getUserPosts = signedInUserId => {
    const blogPostPackage = JSON.stringify({
        name: "getPublishedDrafts",
        signedInUserId
    })
    const blogPostsPath = `/blogPosts/${blogPostPackage}`;

    return axios.get(blogPostsPath).then(res => {
        console.log("res", res);
        const { status, data: posts } = res;
        if (status === 200) {
            return posts;
        }
    }).catch(error => {
        console.error('Error in getting posts of user: ', error);
    })
}