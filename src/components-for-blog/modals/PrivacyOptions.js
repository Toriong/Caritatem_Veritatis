import React, { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { FcGlobe, FcLock } from "react-icons/fc";

const PrivacyOptions = ({ setIsPrivate, isPrivate, isEditingList, setWillCheckForChanges }) => {
    const [isPrivacyOptionsOpen, setIsPrivacyOptionsOpen] = useState(false);

    const togglePrivacyOptions = () => {
        setIsPrivacyOptionsOpen(!isPrivacyOptionsOpen);
    };

    const handlePrivacySelection = isPrivate_ => () => {
        setIsPrivate(isPrivate_);
        setIsPrivacyOptionsOpen(false);
        setWillCheckForChanges(true);
    };

    return (
        <div
            id="privacyOptions"
            style={{
                width: isEditingList && '63%'
            }}
        >
            <div
                onClick={togglePrivacyOptions}
            >
                <span>
                    {isPrivate ?
                        <>
                            Private <FcLock />
                        </>
                        :
                        <>
                            Public <FcGlobe />
                        </>
                    }
                </span>
                {isPrivacyOptionsOpen ? <RiArrowDownSLine /> : <RiArrowUpSLine />}
            </div>
            {isPrivacyOptionsOpen &&
                <div>
                    <section
                        style={{
                            background: isPrivate && "#d3d3d3",
                            borderRadius: isPrivate && ".5em"
                        }}
                        onClick={handlePrivacySelection(true)}
                    >
                        <div>
                            <FcLock />
                        </div>
                        <div>
                            <h5>Private</h5>
                            <span>Only you can view</span>
                        </div>
                    </section>
                    <section
                        style={{
                            background: !isPrivate && "#d3d3d3",
                            borderRadius: !isPrivate && ".5em"
                        }}
                        onClick={handlePrivacySelection(false)}
                    >
                        <div>
                            <FcGlobe />
                        </div>
                        <div>
                            <h5>Public</h5>
                            <span>Anybody can view</span>
                        </div>
                    </section>
                </div>
            }
        </div>
    )
}

export default PrivacyOptions
