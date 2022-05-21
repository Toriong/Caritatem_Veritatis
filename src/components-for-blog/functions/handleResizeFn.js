

// GOAL: if the is user is on the mobile, then turn off  the side bar conversation bar

export const handleViewPortResize = (setIsOnSelectedChat, setIsOnMobile, isChatOn) => () => {
    const isOnMobile = window.innerWidth <= 768;
    if (isOnMobile && isChatOn) {
        setIsOnSelectedChat(true);
        console.log('setIsOnMobile: ', setIsOnMobile)
        setIsOnMobile && setIsOnMobile(true);
    } else {
        setIsOnSelectedChat(false);
        setIsOnMobile && setIsOnMobile(false);
    }
};