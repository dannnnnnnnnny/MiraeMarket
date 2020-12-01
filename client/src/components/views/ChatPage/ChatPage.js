import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
// import moment from 'moment';
import { getChats, afterPostMessage } from '../../../_actions/chat_actions';
import ChatCard from './Sections/ChatCard';
import { useHistory } from 'react-router-dom';

export function ChatPage() {
	const [chatMessage, setChatMessage] = useState('');
	const dispatch = useDispatch();
	const messagesEndLine = useRef(null);
	const history = useHistory();

	// let server = 'http://localhost:5000';
	let server = window.location.hostname;
	const socket = io(server);

	const user = useSelector((state) => state.user);
	const chats = useSelector((state) => state.chat.chats);
	// console.log(user, chats);

	useEffect(() => {
		dispatch(getChats());
		socket.on('Output Chat Message', (message) => {
			// console.log(message);
			dispatch(afterPostMessage(message));
		});
	}, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

	const scrollToBottom = () => {
		messagesEndLine.current.scrollIntoView({
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		if (messagesEndLine.current) {
			scrollToBottom();
		}
	});

	const handleChange = (e) => {
		setChatMessage(e.target.value);
	};

	const renderCards = () =>
		chats && chats.map((chat) => <ChatCard key={chat._id} chat={chat} />);

	const submitChatMessage = (e) => {
		e.preventDefault();

		if (user.userData && !user.userData.isAuth) {
			alert('로그인이 필요합니다.');
			return history.push({ pathname: '/login', state: '/chat' });
		}

		let userId = user.userData._id;
		// let userName = user.userData.name;
		let userImage = user.userData.image;
		// let nowTime = moment();
		let type = 'Text';

		socket.emit('Input Chat Message', {
			chatMessage,
			userId,
			// userName,
			userImage,
			// nowTime,
			type,
		});

		setChatMessage('');
	};

	return (
		<React.Fragment>
			<div>
				<p
					style={{
						fontFamily: 'Segoe UI',
						fontWeight: 700,
						fontSize: '24px',
						textAlign: 'center',
					}}
				>
					시끌시끌
				</p>
			</div>

			<div style={{ maxWidth: '800px', margin: '0 auto' }}>
				<div
					className="infinite-container"
					style={{ height: '500px', overflowY: 'scroll' }}
				>
					{chats && renderCards()}
					<div
						ref={messagesEndLine}
						// style={{ float: 'left', clear: 'both' }}
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
							{/* <Dropzone onDrop={this.onDrop}> */}
							{/* {({ getRootProps, getInputProps }) => (
										<section>
											<div {...getRootProps()}>
												<input {...getInputProps()} />
												<Button> */}
							{/* 업로드
													<Icon type="upload" />
												</Button>
											</div>
										</section>
									)}
								</Dropzone> */}
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
