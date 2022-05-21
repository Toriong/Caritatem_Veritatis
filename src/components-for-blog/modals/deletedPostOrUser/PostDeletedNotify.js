import React from 'react'
import { useContext } from 'react'
import { ModalInfoContext } from '../../../provider/ModalInfoProvider'

const PostDeletedNotify = () => {
    const { _isPostDeletedModalOn } = useContext(ModalInfoContext)
    const [, setIsPostDeletedModalOn] = _isPostDeletedModalOn

    const handleCloseButtonClick = event => {
        event.preventDefault();
        setIsPostDeletedModalOn(false)
    }


    return (
        <div className='modal deleteAccount'>
            <div>
                <section>
                    <h1>This post no longer exists.</h1>
                </section>
                <section>
                    <button onClick={event => { handleCloseButtonClick(event) }}>Close</button>
                </section>
            </div>
        </div>
    )
}

export default PostDeletedNotify