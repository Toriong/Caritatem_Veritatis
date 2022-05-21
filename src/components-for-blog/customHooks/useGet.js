import { useState, useEffect } from 'react';

export const useGet = url => {
    const [data, setData] = useState({});
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setData(data);
                } else {
                    console.error(response.status);
                }
            } catch (err) {
                console.error(err.message);
            } finally {
                setHasFetched(true);
            }
        };

        !hasFetched && fetchData();

    }, [hasFetched]);

    return data;
};