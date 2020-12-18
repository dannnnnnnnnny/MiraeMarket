import React, { useState } from "react";
import { registerUser } from "../../../actions/user_actions";
import { useDispatch } from "react-redux";
import { USER_SERVER } from "../../Config";
import { Form, Input, Button, notification} from 'antd';
import Axios from "axios";
import { animateClass } from 'react-punch';
import { css } from 'emotion';
import ProfileImageUpload from '../../utils/ProfileImageUpload';
import {
	EditFilled,
	UserOutlined,
} from '@ant-design/icons';

function RegisterPage(props) {
  const dispatch = useDispatch();
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [formPasswordErrorMessage, setFormPasswordErrorMessage] = useState('');
  const [emailStatus, setEmailStatus] = useState(null)
  const [passwordStatus, setPasswordStatus] = useState(null)
  const [password, setPassword] = useState('')
  const [image, setImage] = useState('');
  
  const HeaderStyle = `
    ${css({
      color: 'skyblue',
      fontSize: 40,
      fontWeight: 800,
      fontFamily: 'Roboto, sans-serif',
      marginTop: '200px',
    })}
    ${animateClass()}`
  ;
	
	// 알림창
  const openNotificationWithIcon = (type) => {
	notification[type]({
		message: '환영합니다',
		description: '회원가입 성공!',
		duration: 2,
	});
};

	// 회원가입 버튼 제출
  const onFinish = (values) => {

    const { email, name, password, phone, major } = values;

    let dataToSubmit = {
			email: email,
			name: name,
			password: password,
			image: image,
			phone: phone,
			major: major
    };
		
		// 회원가입 dispatch action
		dispatch(registerUser(dataToSubmit)).then((response) => {
			if (response.payload.success) {
				openNotificationWithIcon('success');
				props.history.push('/login');
			} else {
				alert("회원가입 실패");
			}
		});
  }

  const HandleFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	// email Blur 처리시 정규표현식으로 이메일 여부 확인 후
	// 이메일 존재하는지 서버에 확인
  const handleEmailBlur = (e) => {
    setEmailStatus('validating')

    if (new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(e.target.value)) {
      Axios.get(`${USER_SERVER}?email=${e.target.value}`).then((response) => {
				if (response.data.success) {
					setEmailStatus('success');
					setFormErrorMessage('');
				} else {
					setEmailStatus('error');
					setFormErrorMessage('이미 존재하는 이메일 입니다.');
				}
			});
    } else {
      setEmailStatus('error');
      setFormErrorMessage('잘못된 이메일 형식입니다.')
    }
    
  }

  const passwordChange = (e) => {
    setPassword(e.target.value);
  }

	// password Blur이벤트 발생시 비밀번호 확인과 서로 일치하는지
  const handlePasswordBlur = (e) => {
    setPasswordStatus('validating')

    if (password === e.target.value) {
      setPasswordStatus('success')
      setFormPasswordErrorMessage('')
    } else {
      setPasswordStatus('error')
      setFormPasswordErrorMessage('비밀번호가 다릅니다. 확인해주세요.')
    }

  }

	// 프로필 사진 업로드
  const updateImages = (newImage) => {
		setImage(newImage);
	};

  return (
		<div
			style={{
				display: 'block',
				margin: '-7% auto auto auto',
				justifyContent: 'center',
				alignItems: 'center',
				width: '350px',
				height: '800px',
			}}
		>
			<div
				style={{ display: 'flex', margin: '0 auto', justifyContent: 'center' }}
			>
				<h1 className={HeaderStyle}>Register</h1>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ marginTop: '10%' }}>
					<label>프로필 이미지</label>
				</div>
				<div>
					<ProfileImageUpload refreshFunction={updateImages} />
				</div>
			</div>
			<br />
			<Form
				layout={'horizontal'}
				onFinish={onFinish}
				onFinishFailed={HandleFinishFailed}
				scrollToFirstError={true}
			>
				<Form.Item
					name="email"
					hasFeedback
					validateStatus={emailStatus}
					rules={[{ required: true, message: 'E-mail을 입력해주세요.' }]}
				>
					<Input
						prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
						placeholder="이메일"
						onBlur={handleEmailBlur}
					/>
				</Form.Item>
				{formErrorMessage && (
					<label>
						<p
							style={{
								color: '#ff0000bf',
								marginTop: '-5%',
								fontSize: '0.7rem',
								border: '0.5px solid',
								// height: '10px',
								padding: '3px',
								borderRadius: '10px',
							}}
						>
							{formErrorMessage}
						</p>
					</label>
				)}

				<Form.Item
					name="name"
					rules={[{ required: true, message: '닉네임을 입력해주세요' }]}
				>
					<Input
						prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
						placeholder="닉네임"
					/>
				</Form.Item>

				<Form.Item name="phone">
					<Input placeholder="전화번호" />
				</Form.Item>

				<Form.Item name="major">
					<Input placeholder="학과" />
				</Form.Item>

				<Form.Item
					name="password"
					hasFeedback
					validateStatus={passwordStatus}
					rules={[{ required: true, message: '패스워드를 입력해주세요.' }]}
				>
					<Input.Password
						prefix={<EditFilled style={{ color: 'rgba(0,0,0,.25)' }} />}
						placeholder="패스워드"
						onChange={passwordChange}
						value={password}
					/>
				</Form.Item>

				<Form.Item
					name="confirm_password"
					hasFeedback
					validateStatus={passwordStatus}
					rules={[{ required: true, message: '패스워드 확인이 필요합니다.' }]}
				>
					<Input.Password
						prefix={<EditFilled style={{ color: 'rgba(0,0,0,.25)' }} />}
						placeholder="패스워드 확인"
						onBlur={handlePasswordBlur}
					/>
				</Form.Item>
				{formPasswordErrorMessage && (
					<label>
						<p
							style={{
								color: '#ff0000bf',
								fontSize: '0.7rem',
								border: '0.5px solid',
								padding: '3px',
								borderRadius: '10px',
							}}
						>
							{formPasswordErrorMessage}
						</p>
					</label>
				)}

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className="register-form-button"
						style={{ minWidth: '100%' }}
					>
						회원가입
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};


export default RegisterPage
