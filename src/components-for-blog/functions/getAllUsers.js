
import axios from 'axios';


export const getAllUsers = () => {
    const usersPath = "/users";
    console.log("will get all users")
    // make this into a try and catch block
    return axios.get(usersPath)
        .then(res => {
            const { status, data: users } = res;
            if (status === 200) {
                return users;
            }
        })
        .catch(error => {
            console.error("Error in getting all users: ", error);
        });
}


