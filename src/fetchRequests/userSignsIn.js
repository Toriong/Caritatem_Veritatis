
const userSignsIn = async userInfo => {
    const { userName, password } = userInfo;
    try {
        const path = `/users/${userName}`;
        const promise = await fetch(path);
        const user = await promise.json();

        return user;
    } catch (error) {
        console.error("error message: ", error);
    }
}




