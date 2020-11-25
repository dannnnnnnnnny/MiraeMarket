/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu, Badge } from 'antd';
// import axios from 'axios';
import { logoutUser } from '../../../../_actions/user_actions';
// import { USER_SERVER } from '../../../Config';
import { withRouter, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ShoppingCartOutlined } from '@ant-design/icons';
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
				<Menu.Item key="mail">
					<Link to="/login">Signin</Link>
				</Menu.Item>
				<Menu.Item key="app">
					<Link to="/register">Signup</Link>
				</Menu.Item>
			</Menu>
		);
	} else {
		return (
			<Menu mode={props.mode}>
				<Menu.Item key="upload">
					<Link to="/upload">Upload</Link>
				</Menu.Item>
				<Menu.Item key="cart">
					<Badge count={5}>
						<Link
							to="/user/cart"
							style={{ marginRight: -22, color: '#667777' }}
						>
							<ShoppingCartOutlined style={{ fontSize: 30 }} />
						</Link>
					</Badge>
				</Menu.Item>
				<Menu.Item key="logout">
					<a onClick={(e) => logoutHandler(e)}>Logout</a>
				</Menu.Item>
			</Menu>
		);
	}
}

export default withRouter(RightMenu);

// useEffect(() => {
//   setUserId(window.localStorage.getItem('userId'))
// }, [])

// const logoutHandler = () => {
//   dispatch(logoutUser())
//   window.localStorage.setItem('userId', '')
//   setUserId(window.localStorage.getItem('userId'))
// };

// if (!userId || userId ==='') {
