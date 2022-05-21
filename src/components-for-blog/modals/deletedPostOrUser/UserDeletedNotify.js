import React from 'react'
import { useContext } from 'react'
import history from '../../../history/history'
import { ModalInfoContext } from '../../../provider/ModalInfoProvider'

const UserDeletedNotify = () => {
    const { _userDeletedModal } = useContext(ModalInfoContext)
    const [userDeletedModal, setUserDeletedModal] = _userDeletedModal;
    const { wasPostClicked } = userDeletedModal || {};
    const isOnFeed = window.location.href === 'http://localhost:3000/Feed'


    const goToFeed = () => { history.replace('/Feed') }

    const handleGoToFeed = event => {
        event.preventDefault()
        goToFeed();
        setUserDeletedModal(null)
    };

    const handleCloseButtonClick = event => {
        event.preventDefault();
        setUserDeletedModal(null)
    }


    return (
        <div className='modal deleteAccount'>
            <div>
                <section>
                    {wasPostClicked &&
                        <h1>This user and post no longer exist.</h1>
                    }
                    {!wasPostClicked &&
                        <h1>{"This user no longer exists."}</h1>
                    }
                </section>
                <section>
                    <button onClick={event => { handleCloseButtonClick(event) }}>Close</button>
                </section>
            </div>
        </div>
    )
}

export default UserDeletedNotify