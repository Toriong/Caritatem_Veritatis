import React, { useEffect, useState } from 'react'
import '../../blog-css/modals/nameChatGroup.css'

const NameChatInputAndSubmit = ({ _groupName, handleSubmit }) => {
    const [groupName, setGroupName] = useState(_groupName ?? "");
    const handleOnChange = event => {
        setGroupName(event.target.value)
    }

    useEffect(() => {
        console.log('groupName: ', groupName)
    })

    return (
        <>
            <section>
                <input placeholder="Enter name" type='text' defaultValue={groupName} onChange={event => { handleOnChange(event) }} />
            </section>
            <section>
                <button>Cancel</button>
                <button type='submit' disabled={(_groupName ?? "") === groupName} onClick={event => { handleSubmit(event, groupName) }}>Confirm changes</button>
            </section>
        </>
    )
}

export default NameChatInputAndSubmit