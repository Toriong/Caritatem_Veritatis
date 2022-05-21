import React, { useState, useEffect, useCallback, useRef } from 'react'
import Webcam from "react-webcam";
import '../../blog-css/webCam.css'



const WebCamCapture = ({ setIconSrc, setIsCameraOn, setData, data, setIsEditIconModalOpen }) => {
    const webcamRef = useRef(null);
    const videoConstraints = {
        facingMode: "user",
        height: '2000px'
    }

    const { _id: userId } = JSON.parse(localStorage.getItem('user'));
    const [timeLeft, setTimeLeft] = useState(null);
    const [willCapturePhoto, setWillCapturePhoto] = useState(false);

    const handleCaptureBtnClick = event => {
        event.preventDefault();
        setWillCapturePhoto(true);
    }

    const closeWebCam = event => {
        event.preventDefault();
        if (!timeLeft) {
            setIsEditIconModalOpen && setIsEditIconModalOpen(false)
            setIsCameraOn && setIsCameraOn(false);
        }
    }

    const changeDataURLtoFile = (dataUrl, filename) => {
        let arr = dataUrl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            size = bstr.length,
            u8arr = new Uint8Array(size);
        let extname = mime.split("/")[mime.split("/").length - 1];
        while (size--) {
            u8arr[size] = bstr.charCodeAt(size);
        }

        return new File([u8arr], `${filename}.${extname}`, { type: mime });
    }


    useEffect(() => {
        if (willCapturePhoto) {
            console.log("capturing photo")
            let countDown = 5000;
            setTimeLeft(countDown / 1000)
            const intervalTimer = setInterval(() => {
                countDown = countDown - 1000;
                console.log(countDown);
                if (countDown === -1000) {
                    // in order display the preview of the image on the client side, use image src
                    const imageSrc = webcamRef.current.getScreenshot();
                    // in order to upload the image onto the server 
                    const imageFile = changeDataURLtoFile(imageSrc, `${userId}-userIcon`);
                    console.log("imageFile: ", imageFile);
                    setIconSrc(imageSrc);
                    if (data) {
                        setData({
                            ...data,
                            icon: imageFile
                        })
                    } else {
                        setData(imageFile);
                    }
                    clearInterval(intervalTimer)
                    setIsCameraOn(false);
                } else {
                    setTimeLeft(countDown / 1000);
                }
            }, 1000);
            document.addEventListener('click', event => {
                const { id } = event.target;
                if ((id === 'cancelPhoto') && (timeLeft !== -1000)) {
                    clearInterval(intervalTimer);
                    setTimeLeft(null);
                    setWillCapturePhoto(false);
                }
            });
        };

        return () => {
            setWillCapturePhoto(false);
        }
    }, [willCapturePhoto])

    return (
        <div
            className="cameraContainer"
        >
            <div className="sub-cameraContainer">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="webCam"
                />
            </div>
            <section className="webCam-btn-container">
                <button onClick={event => {
                    closeWebCam(event)
                }
                } id="cancelPhoto">{timeLeft === null ? "Close camera" : "Cancel photo"}</button>
                <button onClick={event => { handleCaptureBtnClick(event) }}>Capture photo</button>
            </section>
            <div>
                {timeLeft}
            </div>
        </div>
    );
};

export default WebCamCapture;
