import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import '../blog-css/errorPage.css'
import { ErrorPageContext } from '../provider/ErrorPageProvider'

const ErrorPage = ({ doesUserNotExist }) => {
    const { _didErrorOccur, _isOnUserProfile, _isOnPost } = useContext(ErrorPageContext)
    const [isOnUserProfile, setIsOnUserProfile] = _isOnUserProfile;
    const [didErrorOccur, setDidErrorOccur] = _didErrorOccur;
    const [isOnPost, setIsOnPost] = _isOnPost

    useEffect(() => () => {
        setDidErrorOccur(false);
        setIsOnPost(false);
        setIsOnUserProfile(false)
    }, []);

    return (
        <div className='errorPage'>
            <div>
                <h1>404</h1>
                {(isOnUserProfile || doesUserNotExist) &&
                    <p>This user doesn't exist.</p>
                }
                {isOnPost &&
                    <p>This post doesn't exist.</p>
                }
                {(!isOnPost && !isOnUserProfile && didErrorOccur && !doesUserNotExist) &&
                    <p>This page doesn't exist.</p>
                }
            </div>
        </div>
    )
}

export default ErrorPage