/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { auth } from '../actions/user_actions';
import { useSelector, useDispatch } from 'react-redux';

// 접근제어 hoc 컴포넌트
/*
	option : true 로그인한 유저만 사용 가능
	option : false 비로그인 유저만 가능
	option : null 모두 이용 가능
*/
export default function (Component, option, adminRoute = null) {
	function AuthenticationCheck(props) {
		let user = useSelector((state) => state.user);
		const dispatch = useDispatch();

		useEffect(() => {

			// 유저 로그인 여부 확인
			dispatch(auth()).then((response) => {

				// 비로그인시 로그인 화면으로 이동
				if (!response.payload.isAuth) {
					if (option) {
						props.history.push('/login');
					}
				} else {

					// 로그인한 유저인데 option이 false면 메인화면으로 돌아감 
					if (option === false) {
						props.history.push('/');
					}
				}
			});
		}, []);

		// 모든 컴포넌트에서 user props를 사용하여 유저정보에 접근가능해짐.
		return <Component {...props} user={user} />;
	}
	return AuthenticationCheck;
}
