import React, { useEffect } from 'react'
import { logoutUser } from '../../../actions/user_actions';
import { useDispatch } from 'react-redux';

function LogoutPage(props) {
    const dispatch = useDispatch();

		// 로그아웃 dispatch 호출
		// 로컬스토리지에 저장된 유저아이디 삭제
		// 로그인 페이지로 redirect
    useEffect(() => {
        dispatch(logoutUser()).then((response) => {
            if (response.payload.success) {
                window.localStorage.removeItem('userId');
                props.history.push('/login');
            }
        });
    }, [dispatch, props.history])

    return (
        <div>
            
        </div>
    )
}

export default LogoutPage
