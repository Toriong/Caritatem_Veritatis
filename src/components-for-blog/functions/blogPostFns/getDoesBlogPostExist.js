


export const getDoesBlogPostExist = async postId => {
    const package_ = { postId: postId };
    const path = `/checkExistencePost/${JSON.stringify(package_)}`;
    try {
        const res = await fetch(path);
        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        if (error) {
            console.error('An error has occurred: ', error);
        }
    }
}



