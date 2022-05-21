import React, { useState, useEffect } from 'react';
import { BiDotsHorizontalRounded } from "react-icons/bi";

const ListsOptionsModal = () => {
    const [isListsOptionsModalOpen, setIsListsOptionsModalOpen] = useState(false);

    const toggleListOptionsModal = () => {
        setIsListsOptionsModalOpen(!isListsOptionsModalOpen);
    };

    useEffect(() => {
        if (isListsOptionsModalOpen) {

        }
    }, [isListsOptionsModalOpen])

    return (
        <>
            <BiDotsHorizontalRounded
                onClick={toggleListOptionsModal}
            />
            {isListsOptionsModalOpen &&
                <>
                    <div className="blocker" onClick={toggleListOptionsModal} />
                    <div>
                        <button>Edit</button>
                        <button>Delete</button>
                        <button>Privacy</button>
                    </div>
                </>
            }
        </>
    )
}

export default ListsOptionsModal
