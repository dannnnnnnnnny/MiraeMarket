import React, { useState } from 'react'
import { Comment, Form, Button, Input, notification } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';

const { TextArea } = Input;

function CommentWrite(props) {
	const [message, setMessage] = useState('')

	const user = useSelector((state) => state.user);

	const openNotificationWithIcon = (type, NotificationMessage, description) => {
		notification[type]({
			message: NotificationMessage,
			description: description,
			duration: 2,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!message.replace(/\s/g, '')) {
			return alert('내용을 채워주세요.');
		}
		if (user.userData && !user.userData.isAuth) {
			return alert('로그인이 필요합니다.');
			// return history.push({ pathname: '/login', state: '/' });
		}

		const body = {
			// 로그인된 사람의 ID
			writer: user.userData._id,
			message: message,
			product: props.detail._id,
		};
		// ${props.detail._id}
		Axios.post(`/api/comment`, body)
			.then(
				(response) => {
					if (response.data.success) {
						console.log(response.data);
						props.refresh()
						openNotificationWithIcon(
							'success',
							'작성 완료',
							'댓글이 작성되었습니다.',
						);
					} else {
						openNotificationWithIcon('error', '작성 실패', '댓글 작성에 실패했습니다.');
					}
				},
			);

		setMessage('');
	}
	
	const handleChange = e => {
		setMessage(e.target.value);
	};

    return (
			<div style={{ margin: '0 auto', width: '60%' }}>
				<Comment
					content={
						<Form>
							<Form.Item>
								<TextArea rows={2} onChange={handleChange} value={message} />
							</Form.Item>
							<Form.Item>
								<Button
									style={{ float: 'right' }}
									htmlType="submit"
									onClick={handleSubmit}
									type="primary"
								>
									댓글 작성
								</Button>
							</Form.Item>
						</Form>
					}
				/>
			</div>
		);
}


export default CommentWrite;