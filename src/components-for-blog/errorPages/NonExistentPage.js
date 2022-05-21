import React from 'react'
import history from '../../history/history'
import '../../blog-css/errorPages/clientSideNotifyPage.css'
import { useContext } from 'react'
import { UserInfoContext } from '../../provider/UserInfoProvider'
import { useLayoutEffect } from 'react'

const NonExistentPage = () => {
    const { _isLoadingUserInfoDone } = useContext(UserInfoContext);
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone;
    const isUserSignedIn = !!localStorage.getItem('user')

    const handleRedirectBtnClick = () => {
        const url = isUserSignedIn ? '/Feed' : '/'
        history.push(url);
    };

    useLayoutEffect(() => {
        isUserSignedIn && setIsLoadingUserInfoDone(true);
    }, []);

    return (
        <div className='clientSideNotifyPage'>
            <section>
                <p>
                    {isLoadingUserInfoDone ?
                        "Sorry, this page doesn't exist."
                        :
                        "Sorry, only members have access to the blog."
                    }
                </p>
                <button
                    name='redirectBtn'
                    onClick={handleRedirectBtnClick}
                >
                    <span>
                        {isUserSignedIn ? 'Go to feed' : 'Go to home page'}
                    </span>
                </button>
            </section>
        </div>
    )
}

export default NonExistentPage