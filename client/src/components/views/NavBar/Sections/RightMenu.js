/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
// import axios from 'axios';
import { logoutUser } from '../../../../_actions/user_actions';
// import { USER_SERVER } from '../../../Config';
import { withRouter, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

function RightMenu(props) {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const logoutHandler = (e) => {
		e.preventDefault();
		dispatch(logoutUser()).then((response) => {
			if (response.payload.success) {
				window.localStorage.removeItem('userId');
				props.history.push('/login');
			}
		});
	};

	if (user.userData && !user.userData.isAuth) {
		return (
			<Menu mode={props.mode}>
				<Menu.Item key="login">
					<Link to="/login">로그인</Link>
				</Menu.Item>
				<Menu.Item key="register">
					<Link to="/register">회원가입</Link>
				</Menu.Item>
			</Menu>
		);
	} else {
		return (
			<Menu mode={props.mode}>
				<Menu.Item key="upload">
					<Link to="/upload">업로드</Link>
				</Menu.Item>
				<Menu.Item key="cart">
						<Link
							to="/user/cart"
							style={{ marginRight: -22, color: '#667777' }}
						>
							거래 목록
						</Link>
				</Menu.Item>
				<Menu.Item key="mypage">
					<Link to="/mypage">마이페이지</Link>
				</Menu.Item>
				<Menu.Item key="logout">
					<a onClick={(e) => logoutHandler(e)}>로그아웃</a>
				</Menu.Item>
			</Menu>
		);
	}
}

export default withRouter(RightMenu);
