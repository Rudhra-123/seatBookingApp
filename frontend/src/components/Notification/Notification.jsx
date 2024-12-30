import React, { useState, useEffect } from 'react'
import "./nottification.css"
export const Notification = ({ message }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);

        const timer = setTimeout(() => {
            setShow(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {show && <div className='notification'>{message}</div>}

        </div>
    )
}
