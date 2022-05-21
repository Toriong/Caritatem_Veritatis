import React, { useState, useContext, useEffect } from 'react';
import WebCamCapture from '../webcam/WebCamCapture'
import BioInput from './WelcomeNewUserSections/BioInput';
import TopicsInput from './WelcomeNewUserSections/TopicInputs';
import ReviewAndSubmit from './WelcomeNewUserSections/ReviewAndSubmit';
import Finish from './WelcomeNewUserSections/Finish';
import { getUserAccount } from '../../fetchRequests/getUserAccount'
import { useDropzone } from 'react-dropzone'
import { UserInfoContext } from '../../provider/UserInfoProvider'
import { CgCamera } from "react-icons/cg";
import { MdCancel, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import '../../blog-css/modals/welcomeNewUser.css'
import axios from 'axios';

const WelcomeNewUser = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const { _user } = useContext(UserInfoContext);
    const [user, setUser] = _user;
    const [data, setData] = useState({
        icon: "",
        bio: "",
        topics: [],
        socialMedia: [{
            id: uuidv4()
        }]
    });
    const [iconSrc, setIconSrc] = useState("");
    const [icon, setIcon] = useState("")
    const [isDragOver, setIsDragOver] = useState(false);
    const [isHoveredOver, setIsHoveredOver] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [sectionIndex, setSectionIndex] = useState(0);
    const [wasEditBtnClicked, setWasEditBtnClicked] = useState(false);
    const [areNavButtonsShown, setAreNavButtonsShown] = useState(true);
    const [readingTopics, setReadingTopics] = useState([]);
    const { username } = JSON.parse(localStorage.getItem('user'));

    // look up the documentation for the useDropzone to get a better understanding of it 

    // create the drop logic for the user's icon
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        multiple: false,
        onDrop: acceptedFiles => {
            // console.log('acceptedFiles: ', acceptedFiles[0]);
            console.log(acceptedFiles)
            const [img] = acceptedFiles;
            const file = acceptedFiles.map(file =>
                Object.assign(file, {
                    icon: URL.createObjectURL(file)
                })
            );
            console.log('file: ', file);
            setData({
                ...data,
                icon: {
                    name: img.path,
                    src: file[0].icon
                }
            });
        }
    });

    const [iconName, setIconName] = useState("");

    const handleIconInput = event => {
        // event.preventDefault();
        // event.stopPropagation();
        // console.log(event.target.files[0]);
        const { files } = event.target;
        console.log('files: ', files)
        for (let image of files) {
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.addEventListener("load", () => {
                setIconSrc(reader.result)
            });
        };
        setData({
            ...data,
            icon: event.target.files[0]
        })
        debugger
    };


    // WHAT IS HAPPENING: 
    // when the user uploads a photo, deletes it, then uploads the same photo in a row, the same photo doesn't get uploaded.

    // WHAT I WANT:
    // when the user uploads the same photo in a row, have the image appear on the ui and the fileName be stored in the state of data 

    // WHY THE BUG IS OCCURRING: 
    useEffect(() => {
        console.log('data: ', data);
    })

    const handleChange = (event) => {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        setData({
            ...data,
            [name]: value
        })
    };

    const handleGoToReviewSecBtnClick = (event) => {
        event.preventDefault();
        setSectionIndex(3);
    }

    const handleMouseOver = () => {
        setIsHoveredOver(true);
    }

    const handleMouseLeave = () => {
        setIsHoveredOver(false);
    }

    const handleHighlight = (event) => {
        console.log("drag enter")
        event.preventDefault()
        setIsDragOver(true);
    }

    const handleUnhighlight = (event) => {
        console.log("drag exit")
        event.preventDefault()
        setIsDragOver(false);
    }

    const deleteIcon = () => {
        // event.stopPropagation()
        // event.preventDefault()
        setIconSrc("")
        setData(data => {
            return {
                ...data,
                icon: ""
            }
        })
    }

    const handleBtnClicked = (event, fn) => {
        event.preventDefault();
        fn(true);
    }

    const handleNavBtnClick = (event, index) => {
        event.preventDefault();
        setSectionIndex(index);
    }



    // GOAL: get the user id on the review and submit page 



    // useEffect(() => {
    //     let _user = JSON.parse(localStorage.getItem('user'))
    //     console.log('_user: ', _user);
    //     const package_ = {
    //         name: 'getUserId',
    //         username: _user.username
    //     }
    //     const path = `/users/${JSON.stringify(package_)}`;
    //     axios.get(path)
    //         .then(res => {
    //             const { status, data } = res;
    //             if (status === 200) {
    //                 const { _id: userId } = data;
    //                 _user = {
    //                     ..._user,
    //                     _id: userId
    //                 };
    //                 localStorage.setItem('user', JSON.stringify(_user));
    //                 setUser(_user);
    //             }
    //         })
    //         .catch(error => console.error(`Error message WelcomeNewUser component: ${error}`))
    // }, []);


    return (
        <>
            <div className={sectionIndex === 4 ? "welcomeNewUser smaller" : "welcomeNewUser"}>
                {!sectionIndex &&
                    <section className='welcomeNewUserSec'>
                        {/* user.username */}
                        {/* ILoveProgramming1997Simba */}
                        <h1>Welcome <span id="userName">{currentUser.username}</span>!</h1>
                        <p>We at <span id="CV">Caritatem Veritatis</span> thank you for becoming a member!
                            We hope that you grow and expand your knowledge with us and we are excited for you to share your thoughts on our blog!</p>
                        <p>Before you go on and philosophize to the world, feel free to customize your profile info below. You can always customize your info later by pressing the user icon in the navigation bar and then pressing on 'Your profile.'  Thanks again!</p>

                        <h5>Upload, choose, or take a photo for your icon: </h5>
                        <div
                            className={isDragOver ? "dropArea highlight" : "dropArea"}
                        >
                            <input
                                type='file'
                                name='image'
                                onChange={event => {
                                    console.log('hello there beef')
                                    handleIconInput(event)
                                }}
                                onClick={event => {
                                    event.target.value = null
                                }}
                            />
                            <p>Drag 'n' drop image here, or click to select image</p>
                            <h6>Your Icon:</h6>
                            {iconSrc ?
                                <div className="iconContainer">
                                    <img
                                        className="userIcon"
                                        src={iconSrc}
                                        alt={"user_icon"}
                                        onMouseOver={handleMouseOver}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                    <div className="overlay">
                                        <MdCancel onClick={deleteIcon} />
                                    </div>
                                </div>
                                :
                                <div className="iconContainer">
                                    <div className="dummieDiv_" />
                                </div>
                            }
                        </div>
                        <section className="otherOptions">
                            <button
                                onClick={event => handleBtnClicked(event, setIsCameraOn)}
                            >
                                Take a photo <CgCamera />
                            </button>
                            {/* <button>See default CV icons</button> */}
                        </section>
                    </section>
                }
                {sectionIndex === 1 &&
                    <section className='bioInputSec'>
                        <section className="aboutYouTitleContainer">
                            <h1>About you</h1>
                        </section>
                        <BioInput
                            handleChange={handleChange}
                            data={data}
                            setData={setData}
                        />
                    </section>
                }
                {sectionIndex === 2 &&
                    <TopicsInput
                        data={data}
                        setData={setData}
                        setWasEditBtnClicked={setWasEditBtnClicked}
                        setReadingTopics={setReadingTopics}
                        readingTopics={readingTopics}
                    />
                }
                {sectionIndex === 3 &&
                    <>
                        <ReviewAndSubmit
                            data={data}
                            setData={setData}
                            setSectionIndex={setSectionIndex}
                            setWasEditBtnClicked={setWasEditBtnClicked}
                            readingTopics={readingTopics}
                            iconSrc={iconSrc}
                        />
                    </>
                }
                {sectionIndex === 4 &&
                    <>
                        <Finish
                            setAreNavButtonsShown={setAreNavButtonsShown}
                        />
                    </>

                }
                {areNavButtonsShown &&
                    <div
                        className="navButtonSec-wrapper"
                        style={{ display: (sectionIndex === 4) && 'none' }}
                    >
                        <section className="navButtonSec">
                            <button
                                disabled={sectionIndex <= 0 && true}
                                onClick={event => handleNavBtnClick(event, sectionIndex - 1)}
                            >
                                <MdKeyboardArrowLeft />
                            </button>
                            <button
                                disabled={sectionIndex >= 3 && true}
                                onClick={event => handleNavBtnClick(event, sectionIndex + 1)}
                            >
                                <MdKeyboardArrowRight />
                            </button>
                        </section>
                        {/* if the user is on mobile, then show 'Review' instead */}
                        {wasEditBtnClicked &&
                            <button onClick={handleGoToReviewSecBtnClick} id="goToReviewSectBtn">
                                <span>Go to 'Review and Complete'</span>
                                <span>Review</span>
                            </button>
                        }
                    </div>
                }
            </div>
            {isCameraOn &&
                <WebCamCapture
                    setIconSrc={setIconSrc}
                    setIsCameraOn={setIsCameraOn}
                    setData={setData}
                    data={data}
                />
            }
        </>
    )
}

export default WelcomeNewUser
