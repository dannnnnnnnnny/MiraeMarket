import React, { useEffect } from 'react'
import { logoutUser } from '../../../_actions/user_actions';
import { useDispatch } from 'react-redux';

function LogoutPage(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logoutUser()).then((response) => {
            console.log(response);
            if (response.payload.success) {
                window.localStorage.removeItem('userId');
                props.history.push('/login');
            }
        });
    }, [dispatch, props.history])

    return (
        <div>
            logout    
        </div>
    )
}

export default LogoutPage
