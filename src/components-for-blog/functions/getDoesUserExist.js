


export const getDoesUserExist = async (targetUserId, setUserDeletedModal, wasPostClicked) => {
    const package_ = {
        name: 'checkUserExistence',
        userId: targetUserId
    };
    const path = `/users/${JSON.stringify(package_)}`;
    try {
        const res = await fetch(path);
        if (res.ok) {
            const doesUserExist = await res.json();
            if (doesUserExist) {
                console.log('doesUserExist: ', doesUserExist)
                return doesUserExist;
            } else {
                setUserDeletedModal && setUserDeletedModal({ wasPostClicked: wasPostClicked, isOn: true });
                return doesUserExist;
            }
        }
    } catch (error) {
        if (error) {
            console.error('An error has occurred: ', error)
        }
    }
}