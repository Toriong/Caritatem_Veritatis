
const user = localStorage.getItem('user');
let userId;
if (user) {
    const { _id } = JSON.parse(user);
    userId = _id;
};

// packageNames: 'getNotifications', 'getActivities'

export const getUserInfo = async (type, packageName, data = {}) => {
    // goal: GET THE PREVIOUS LIST NAME OF THE SELECTED LIST
    // GET THE id of the user
    // get the list name
    // send them to the server 
    const { listName } = data;
    const package_ = {
        name: packageName,
        [type]: true,
        listName,
        userId: userId
    };
    const path = `/users/${JSON.stringify(package_)}`;
    try {
        const response = await fetch(path);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        if (error) {
            console.error('An error has occurred in getting notifications of user: ', error);
        }
    }
};

