import React, { useState, createContext } from 'react'


export const UserLocationContext = createContext();




export const UserLocationProvider = props => {
    const [isOnSearchPage, setIsOnSearchPage] = useState(false);
    const [isOnOwnProfile, setIsOnOwnProfile] = useState(false);
    const [isOnSelectedChat, setIsOnSelectedChat] = useState(false);
    const [isOnAboutPage, setIsOnAboutPage] = useState(false);
    const [isUserOnHomePage, setIsUserOnHomePage] = useState(false);
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = useState(false);
    const [isUserOnFeedPage, setIsUserOnFeedPage] = useState(false);
    const [isUserOnSettings, setIsUserOnSettings] = useState(false);
    const [isOnNotificationsPage, setIsOnNotificationsPage] = useState(false);
    const [isOnMessengerPage, setIsOnMessengerPage] = useState(false);
    const [isOnMyStoriesPage, setIsOnMyStoriesPage] = useState(false);

    // const [isOnMessenger, setIsOnMessenger] = useSTate

    return (
        <UserLocationContext.Provider
            value={{
                _isOnSearchPage: [isOnSearchPage, setIsOnSearchPage],
                _isOnOwnProfile: [isOnOwnProfile, setIsOnOwnProfile],
                _isOnSelectedChat: [isOnSelectedChat, setIsOnSelectedChat],
                _isOnAboutPage: [isOnAboutPage, setIsOnAboutPage],
                _isUserOnHomePage: [isUserOnHomePage, setIsUserOnHomePage],
                _isUserOnNewStoryPage: [isUserOnNewStoryPage, setIsUserOnNewStoryPage],
                _isUserOnSettings: [isUserOnSettings, setIsUserOnSettings],
                _isOnNotificationsPage: [isOnNotificationsPage, setIsOnNotificationsPage],
                _isOnMessengerPage: [isOnMessengerPage, setIsOnMessengerPage],
                _isUserOnFeedPage: [isUserOnFeedPage, setIsUserOnFeedPage],
                _isOnMyStoriesPage: [isOnMyStoriesPage, setIsOnMyStoriesPage]
            }}
        >
            {props.children}
        </UserLocationContext.Provider>
    )
}