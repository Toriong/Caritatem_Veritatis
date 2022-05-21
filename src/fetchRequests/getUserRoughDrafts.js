
export const getUserRoughDrafts = async (package_) => {
    const package__ = JSON.stringify(package_);
    try {
        const path = `/users/${package__}`;
        const promise = await fetch(path);
        // console.log(promise);
        const roughDrafts = await promise.json();
        // console.log(roughDrafts);

        return roughDrafts
    } catch (error) {
        console.error("error message: ", error)
    }
};

export const getAllUsers = async (package_) => {
    try {
        const usersPath = "/users";

    } catch {

    }
}