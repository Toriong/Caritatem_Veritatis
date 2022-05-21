import React, { useEffect, useState } from 'react'

const useIsOnMobile = () => {
    const [isOnMobile, setIsOnMobile] = useState(false);
    const [isOnSmallerMobile, setIsOnSmallerMobile] = useState(false);
    const [widthPixels, setWidthPixels] = useState(0);

    const handleViewPortResize = () => {
        const innerWidth = window.innerWidth;
        const isOnMobile = innerWidth <= 767;
        const _isOnSmallerMobile = innerWidth <= 576;
        setWidthPixels(innerWidth);
        if (isOnMobile) {
            console.log('on mobile')
            setIsOnMobile(true);
            _isOnSmallerMobile ? setIsOnSmallerMobile(true) : setIsOnSmallerMobile(false);
        } else {
            console.log('not on mobile')
            setIsOnMobile(false);
            setIsOnSmallerMobile(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleViewPortResize);
        const innerWidth = window.innerWidth;
        setWidthPixels(innerWidth);
        const isOnMobile = innerWidth <= 767;
        if (isOnMobile) {
            console.log('user is on mobile')
            setIsOnMobile(true);
        } else {
            console.log('user is not on mobile')
            setIsOnMobile(false);
        }

        return () => {
            window.removeEventListener('resize', handleViewPortResize);
            setIsOnMobile(false);
        }
    }, []);

    return {
        _isOnMobile: [isOnMobile, setIsOnMobile],
        _isOnSmallerMobile: [isOnSmallerMobile, setIsOnSmallerMobile],
        widthPixels
    }
}

export default useIsOnMobile