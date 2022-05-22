import React, { useState } from 'react'

// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { UserInfoProvider } from '../provider/UserInfoProvider';
import { BlogInfoProvider } from '../provider/BlogInfoProvider';
import { UserLocationProvider } from '../provider/UserLocationProvider';
// do more research on this using history like this
import history from '../history/history';
import Navbar from './Navbar'
import Home from './Home'
import ThePhilosophers from './ThePhilosophers';
import Theism from './Theism';
import Morality from './Morality';
import Metaphysics from './Metaphysics';
import Politics from './Politics';
import HumanNature from './HumanNature';
import Quizes from './Quizes';
import Books from './Books';
import AboutUs from './AboutUs';
import AboutTheFounder from './AboutTheFounder'
import Contact from './Contact'
import Feed from '../components-for-blog/Feed';
import WritePost from '../components-for-blog/WritePost';
import MyStories from '../components-for-blog/MyStories'
import UserHomePage from '../components-for-blog/UserHomePage';
import PostViewerPage from '../components-for-blog/PostViewerPage';
import AboutUser from '../components-for-blog/AboutUser';
import SettingsMain from '../components-for-blog/Settings/SettingsMain';
import Followers from '../components-for-blog/Followers';
import ReadingLists from '../components-for-blog/ReadingLists';
import SelectedReadingList from '../components-for-blog/SelectedReadingList';
import NotificationsPage from '../components-for-blog/NotificationsPage';
import Activities from '../components-for-blog/Activities';
import SearchPage from '../components-for-blog/SearchPage';
import MessageChannel from '../components-for-blog/modals/messaging/MessageChannel';
import Messenger from '../components-for-blog/Messenger';
import { ModalInfoProvider } from '../provider/ModalInfoProvider';
import DeleteUserAndPostContainer from '../components-for-blog/DeleteUserAndPostContainer';
import { ErrorPageProvider } from '../provider/ErrorPageProvider';
import { NavMenuMobileProvider } from '../provider/NavMenuMobileProvider';
import BottomNavBar from '../components-for-blog/navBars/BottomNavbar';
import WelcomeNewUserParentComp from '../components-for-blog/WelcomeNewUserParentComp';
import { useLayoutEffect } from 'react';
import { alertUser } from '../components-for-blog/functions/alertUser';
import NonExistentPage from '../components-for-blog/errorPages/NonExistentPage';
import ErrorPage from '../components-for-blog/ErrorPage';
import PageUnderConstruction from '../components-for-blog/errorPages/PageUnderConstruction';
import { MessengerPageProvider } from '../provider/MessengerPageProvider';
import UserNavModalMobileParentComp from '../components-for-blog/ParentComponents/UserNavModalMobileParentComp';





// WHY DOES THE PLACEMENT OF THE ROUTE MATTERS WHEN SETTING UP PAGES 

const Pages = () => {
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);

    const handleStorageChange = () => {
        if (localStorage.getItem('user') || !localStorage.getItem('user')) {
            window.location.reload();
        }
    }

    useLayoutEffect(() => {
        const _isUserSignedIn = !!localStorage.getItem('user');
        if (_isUserSignedIn) {
            setIsUserSignedIn(true);
        } else {
            setIsUserSignedIn(false);
        }



        window.addEventListener('storage', handleStorageChange)
    }, []);


    return (
        <Router
            history={history}
        >
            <BlogInfoProvider>
                <NavMenuMobileProvider>
                    <UserLocationProvider>
                        <UserInfoProvider>
                            <ModalInfoProvider>
                                <ErrorPageProvider>
                                    <MessengerPageProvider>
                                        <Navbar />
                                        <Switch>
                                            <Route exact path="/" component={Home} />
                                            <Route exact path="/ThePhilosophers" component={PageUnderConstruction} />
                                            <Route exact path="/more" component={PageUnderConstruction} />
                                            <Route exact path="/about" component={PageUnderConstruction} />
                                            <Route exact path="/Apologetics" component={PageUnderConstruction} />
                                            <Route exact path="/Theism" component={PageUnderConstruction} />
                                            <Route exact path="/Settings" render={() => isUserSignedIn ? <SettingsMain /> : <NonExistentPage />} />
                                            <Route exact path="/Settings/:section" render={() => isUserSignedIn ? <SettingsMain /> : <NonExistentPage />} />
                                            <Route exact path="/Morality" component={PageUnderConstruction} />
                                            <Route exact path="/Metaphysics" component={PageUnderConstruction} />
                                            <Route exact path="/Politics" component={PageUnderConstruction} />
                                            <Route exact path="/HumanNature" component={PageUnderConstruction} />
                                            <Route exact path="/Quizes" component={PageUnderConstruction} />
                                            <Route exact path="/Books" component={PageUnderConstruction} />
                                            <Route exact path="/AboutUs" component={PageUnderConstruction} />
                                            <Route exact path="/AboutTheFounder" render={PageUnderConstruction} />
                                            <Route exact path="/Contact" render={() => isUserSignedIn ? <Contact /> : <NonExistentPage />} />
                                            <Route exact path="/Feed" render={() => isUserSignedIn ? <Feed /> : <NonExistentPage />} />
                                            <Route exact path="/search/" render={() => isUserSignedIn ? <SearchPage /> : <NonExistentPage />} />
                                            <Route path="/search/:searchType" render={() => isUserSignedIn ? <SearchPage /> : <NonExistentPage />} />
                                            <Route exact path="/:userName/messenger/" render={() => isUserSignedIn ? <Messenger /> : <NonExistentPage />} />
                                            <Route exact path="/:userName/messenger/:chatId" render={() => isUserSignedIn ? <Messenger /> : <NonExistentPage />} />
                                            <Route exact path="/:userName/readingLists/:listName" render={() => isUserSignedIn ? <SelectedReadingList /> : <NonExistentPage />} />
                                            <Route exact path="/:userName/activities/" render={() => isUserSignedIn ? <Activities /> : <NonExistentPage />} />
                                            <Route exact path="/:userName/notifications" render={() => isUserSignedIn ? <NotificationsPage /> : <NonExistentPage />} />
                                            <Route exact path="/WritePost/:draftId" render={() => isUserSignedIn ? <WritePost /> : <NonExistentPage />} />
                                            <Route exact path="/:userName/MyStories" render={() => isUserSignedIn ? <MyStories /> : <NonExistentPage />} />
                                            <Route exact path="/:userName" render={() => isUserSignedIn ? <UserHomePage /> : <NonExistentPage />} />
                                            {/* why I am not using exact for this case? */}
                                            <Route path="/:userName/activities/:type" render={() => isUserSignedIn ? <Activities /> : <NonExistentPage />} />
                                            <Route exact path="/:userName/about" render={() => isUserSignedIn ? <AboutUser /> : <NonExistentPage />} />
                                            <Route exact path="/:userName/readingLists" render={() => isUserSignedIn ? <ReadingLists /> : <NonExistentPage />} />
                                            <Route exact path="/:userName/:title/:id" render={() => isUserSignedIn ? <PostViewerPage /> : <NonExistentPage />} />
                                            <Route exact path="/error" component={ErrorPage} />
                                            <Route exact path="/:userName/followers" render={() => <Followers />} />
                                            <Route exact path="/:userName/following" render={() => <Followers />} />
                                            {/* <Route exact path="*" render={() => isUserSignedIn ? <NonExistentPage /> : <NonExistentPage />} /> */}
                                        </Switch>
                                        <BottomNavBar />
                                        <DeleteUserAndPostContainer />
                                        <WelcomeNewUserParentComp />
                                        <MessageChannel />
                                        <UserNavModalMobileParentComp />
                                    </MessengerPageProvider>
                                </ErrorPageProvider>
                            </ModalInfoProvider>
                        </UserInfoProvider>
                    </UserLocationProvider>
                </NavMenuMobileProvider>
            </BlogInfoProvider>
        </Router>
    )
}

export default Pages
