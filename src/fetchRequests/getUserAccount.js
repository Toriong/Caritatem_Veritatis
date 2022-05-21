
export const getUserAccount = async package_ => {
    const package__ = JSON.stringify(package_);
    try {
        // review this code!!!
        const path = `/users/${package__}`;
        const promise = await fetch(path);
        const user = await promise.json();

        return user
    } catch (error) {
        console.error("getUserAccount, error message: ", error)
    }
}



