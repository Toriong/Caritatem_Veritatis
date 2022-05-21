import React, { useEffect, useContext } from 'react'
import { UserInfoContext } from '../../../provider/UserInfoProvider';

const Finish = ({ setAreNavButtonsShown }) => {
    const { _user } = useContext(UserInfoContext);
    const [user, setUser] = _user;
    useEffect(() => {
        setAreNavButtonsShown(false);
        let _user = JSON.parse(localStorage.getItem('user'));
        _user = {
            ..._user,
            isNew: false
        };
        localStorage.setItem('user', JSON.stringify(_user));
        setTimeout(() => {
            setUser({
                ...user,
                isNew: false
            });
            window.location.reload();
        }, 3000);
    }, [])

    return (
        <><div>
            <h1>Your profile is now finished!</h1>
            <span>Enjoy reading our blog!</span>
            <div>
                {/* BUG ON THE UI: apply margin-top */}
                <span className="emoji">🎊</span>
            </div>
        </div>
        </>
    )
}

export default Finish;
