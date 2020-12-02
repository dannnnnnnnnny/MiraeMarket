import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { loginUser, socialUser } from '../../../_actions/user_actions';
import {
	Form,
	Input,
	Button,
	Checkbox,
	notification,
} from 'antd';
import './Login.css';

import {
	SmileOutlined,
	FrownOutlined,
	EditFilled,
	UserOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Icon } from 'react-icons-kit';
import { speech_bubble_1 } from 'react-icons-kit/ikons/speech_bubble_1';
import { facebook } from 'react-icons-kit/icomoon/facebook';
import { css } from 'emotion';
import { animateClass, animateText, samples } from 'react-punch';

function LoginPage() {
	const dispatch = useDispatch();
	const rememberMeChecked = localStorage.getItem('rememberMe') ? true : false;
	const [formErrorMessage, setFormErrorMessage] = useState('');
	const [rememberMe, setRememberMe] = useState(rememberMeChecked);
	const location = useLocation();
	const history = useHistory();

	useEffect(() => {
		fetch('/api/users/login/success', {
			method: 'GET',
			credentials: 'include',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				}
				// console.error("미 로그인");
			})
			.then((responseJson) => {
				dispatch(socialUser(responseJson.user));
				window.localStorage.setItem('userId', responseJson.user._id);
			})
			.catch((error) => {
				// console.error("미 로그인 : ", error);
			});
	}, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

	const loginKakao = (e) => {
		e.preventDefault();
		// window.open('http://localhost:5000/api/users/kakao', '_self');
		window.open('https://mirae-market.herokuapp.com/api/users/kakao', '_self');
	};

	const loginFacebook = (e) => {
		e.preventDefault();
		// window.open('http://localhost:5000/api/users/facebook', '_self');
		window.open('https://mirae-market.herokuapp.com/api/users/facebook', '_self');
	};

	const loginNaver = (e) => {
		e.preventDefault();
		// window.open('http://localhost:5000/api/users/naver', '_self');
		window.open('https://mirae-market.herokuapp.com/api/users/naver', '_self');
	};

	const handleRememberMe = () => {
		setRememberMe(!rememberMe);
	};

	const onFinish = (values) => {
		// console.log(values);
		const { email, password } = values;

		let dataToSubmit = {
			email: email,
			password: password,
		};
		dispatch(loginUser(dataToSubmit))
			.then((response) => {
				// console.log(response);
				if (response.payload.loginSuccess) {
					window.localStorage.setItem('userId', response.payload.userId);
					if (rememberMe === true) {
						// console.log('remeber : ', dataToSubmit.email);
						window.localStorage.setItem('rememberMe', dataToSubmit.email);
					} else {
						localStorage.removeItem('rememberMe');
					}
					notification.open({
						message: '로그인 성공',
						icon: <SmileOutlined style={{ color: '#108ee9' }} />,
						duration: 2.
					});
					history.push(location.state === undefined ? '/' : location.state);
				} else {
					setFormErrorMessage('계정 정보를 다시 확인해주세요.');
					notification.open({
						message: '로그인 실패',
						icon: <FrownOutlined style={{ color: '#ff3333' }} />,
						duration: 2
					});
				}
			})

			.catch((err) => {
				setFormErrorMessage('계정 정보를 다시 확인해주세요.');

				notification.open({
					message: '로그인 실패',
					icon: <FrownOutlined style={{ color: '#ff3333' }} />,
				});

				// setTimeout(() => {
				// 	setFormErrorMessage('');
				// }, 2000);
			});
	};

	const HandleFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	const initialEmail = localStorage.getItem('rememberMe')
		? localStorage.getItem('rememberMe')
		: '';

	const LeftAnimateHeader = (text, delay) =>
		animateText(text, samples.entrance.slide('left', 100), 0, 'span', delay);

	const RightAnimateHeader = (text, delay) =>
		animateText(text, samples.entrance.slide('left', 300), 0, 'span', delay);

	const HeaderStyle = `
	${css({
		color: 'skyblue',
		fontSize: 40,
		fontWeight: 800,
		fontFamily: 'Roboto, sans-serif',
		// paddingLeft: 30,
		marginTop: '200px',
	})}
	${animateClass()}
	`;

	return (
		<div
			style={{
				// flexDirection: 'column',
				display: 'block',
				margin: '0 auto',
				justifyContent: 'center',
				alignItems: 'center',
				width: '300px',
				height: '600px',
			}}
		>
			{/* <b style={{ fontSize: '20px', color: '#428bca' }}>
				{animateText('Login Page', samples.entrance.slide())}
			</b> */}
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<h1 className={HeaderStyle}>{LeftAnimateHeader('Login', 1000)}</h1>
				<h1 className={HeaderStyle}>{RightAnimateHeader('Page', 1000)}</h1>
			</div>
			<Form
				onFinish={onFinish}
				onFinishFailed={HandleFinishFailed}
				initialValues={{ email: initialEmail }}
			>
				<Form.Item
					// required
					name="email"
					rules={[
						{ type: 'email', message: 'E-mail 형식을 확인해주세요.' },
						{ required: true, message: 'Email을 입력해주세요.' },
					]}
				>
					<Input
						// id="email"
						prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
						placeholder="email"
					/>
				</Form.Item>

				<Form.Item
					name="password"
					rules={[{ required: true, message: '패스워드를 입력해주세요.' }]}
				>
					<Input.Password
						prefix={<EditFilled style={{ color: 'rgba(0,0,0,.25)' }} />}
						placeholder="password"
					/>
				</Form.Item>

				{formErrorMessage && (
					<label>
						<p
							style={{
								color: '#ff0000bf',
								fontSize: '0.7rem',
								border: '1px solid',
								padding: '1rem',
								borderRadius: '10px',
							}}
						>
							{formErrorMessage}
						</p>
					</label>
				)}
				<Form.Item
				// style={{ marginTop: "-10px"}}
				>
					<Button
						type="primary"
						htmlType="submit"
						className="login-form-button"
						style={{ minWidth: '100%' }}
					>
						로그인
					</Button>

					<Checkbox
						id="rememberMe"
						onChange={handleRememberMe}
						checked={rememberMe}
						style={{ marginTop: '10px' }}
					>
						<span style={{ fontSize: '13px', color: '#108ee9' }}>
							ID 저장하기
						</span>
					</Checkbox>

					<br />
					<div style={{ marginTop: '5px' }}>
						<a
							className="login-form-forgot"
							href="/reset_user"
							style={{ float: 'right' }}
						>
							비밀번호를 잊으셨나요?
						</a>

						<Link to="/register">회원가입 하러가기</Link>
					</div>
					<br />
				</Form.Item>
			</Form>

			<div
				style={{
					justifyContent: 'space-around',
					margin: '0 auto',
					display: 'flex',
					width: '200px',
				}}
			>
				<Button
					onClick={(e) => loginKakao(e)}
					style={{
						width: '32px',
						backgroundColor: 'yellow',
						borderRadius: '6px',
						border: 'none',
					}}
				>
					<Icon
						icon={speech_bubble_1}
						size={23}
						style={{ marginLeft: '-11px', color: 'black' }}
					/>
				</Button>
				<Button
					onClick={(e) => loginFacebook(e)}
					style={{
						width: '31px',
						backgroundColor: '#4267B2',
						borderRadius: '6px',
						border: 'none',
					}}
				>
					<Icon
						icon={facebook}
						size={24}
						style={{
							color: 'white',
							marginLeft: '-9px',
						}}
					/>
				</Button>

				<img
					onClick={(e) => loginNaver(e)}
					className="naver-btn"
					src="naver.png"
					alt="naver"
					style={{
						width: '32px',
						marginBottom: '5px',
					}}
				/>
			</div>
		</div>
	);
}

export default LoginPage;
