
import React from 'react'
import '../../blog-css/modals/kickUser.css'

const UserToKick = ({ handleKickBtnClick, user }) => {
    const { username, _id, iconPath } = user;
    return (
        <div className='userToKick' key={_id}>
            <div>
                <div>
                    <img
                        className="userIcon"
                        src={`http://localhost:3005/userIcons/${iconPath}`}
                        alt={"user_icon"}
                        onError={event => {
                            console.log('ERROR!')
                            event.target.src = '/philosophersImages/aristotle.jpeg';
                        }}
                    />
                </div>
                <div>
                    <span>{username}</span>
                </div>
            </div>
            <div>
                <button onClick={event => { handleKickBtnClick(event, { _id, username }) }}>
                    <span>Kick</span>
                </button>
            </div>

        </div>
    )
}

export default UserToKick