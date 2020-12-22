import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
// import moment from 'moment';
import { getChats, afterPostMessage } from '../../../actions/chat_actions';
import ChatCard from './Sections/ChatCard';
import { useHistory } from 'react-router-dom';

export function ChatPage() {
	const [chatMessage, setChatMessage] = useState('');
	const dispatch = useDispatch();
	const messagesEndLine = useRef(null);
	const history = useHistory();

	let server = 'http://localhost:5000';
	const socket = io(server);
	// socketio 서버 추가

	// redux store에서 user 정보와 chat 기록 가져옴
	const user = useSelector((state) => state.user);
	const chats = useSelector((state) => state.chat.chats);
	
	const TitleStyle = useMemo(
		() => ({
			fontFamily: 'Segoe UI',
			fontWeight: 700,
			fontSize: '24px',
			textAlign: 'center',
	}), []);

	const ContainerStyle = useMemo(
		() => ({ maxWidth: '800px', margin: '0 auto' }),
		[],
	);

	const CardListStyle = useMemo(
		() => ({ height: '500px', overflowY: 'scroll' }),
		[],
	);

	// 채팅 데이터 가져옴
	// 누군가 채팅을 작성하여 'Output Chat Message' 이벤트가 발생하면
	// 해당 message를 redux store의 chats 데이터에 이어붙임
	useEffect(() => {
		dispatch(getChats());
		socket.on('Output Chat Message', (message) => {
			dispatch(afterPostMessage(message));
		});
	}, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

	// 스크롤을 아래로 내림
	const scrollToBottom = () => {
		messagesEndLine.current.scrollIntoView({
			behavior: 'smooth',
		});
	};

	// 컴포넌트 업데이트될 때 마다
	useEffect(() => {
		if (messagesEndLine.current) {
			scrollToBottom();
		}
	});

	// onChange 이벤트
	const handleChange = useCallback((e) => {
		setChatMessage(e.target.value);
	}, []);

	// store chats 데이터 하나씩 ChatCard 컴포넌트로 보냄
	const renderCards = () =>
		chats && chats.map((chat) => <ChatCard key={chat._id} chat={chat} />);

	// 채팅 보내기
	const submitChatMessage = (e) => {
		e.preventDefault();

		if (user.userData && !user.userData.isAuth) {
			alert('로그인이 필요합니다.');
			return history.push({ pathname: '/login', state: '/chat' });
		}

		let userId = user.userData._id;
		let userImage = user.userData.image;
		let type = 'Text';

		// socket에 'Input Chat Message'라는 이벤트로 데이터를 보냄
		socket.emit('Input Chat Message', {
			chatMessage,
			userId,
			userImage,
			type,
		});

		setChatMessage('');
	};

	return (
		<React.Fragment>
			<div>
				<p style={ TitleStyle }>
					시끌시끌
				</p>
			</div>

			<div style={ContainerStyle}>
				<div
					className="infinite-container"
					style={CardListStyle}
				>
					{chats && renderCards()}
					<div
						ref={messagesEndLine}
					/>
				</div>

				<Row gutter={[16, 16]} style={{ marginTop: '5px' }}>
					<Form
						layout="inline"
						onSubmit={submitChatMessage}
						style={{ width: '800px' }}
					>
						<Col span={18}>
							<Input
								id="message"
								placeholder="메시지를 입력해주세요."
								type="text"
								value={chatMessage}
								onChange={handleChange}
							/>
						</Col>
						<Col span={3}>

						</Col>

						<Col span={3}>
							<Button
								type="primary"
								style={{ width: '100%' }}
								onClick={submitChatMessage}
								htmlType="submit"
							>
								입력
							</Button>
						</Col>
					</Form>
				</Row>
			</div>
		</React.Fragment>
	);
}

export default ChatPage;
