import React, { useMemo } from 'react';
import { Comment, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './ChatCard.css';

function ChatCard(props) {
	const user = useSelector((state) => state.user);
	const myChatStyle = useMemo(
		() => ({
			display: 'flex',
			width: '95%',
			justifyContent: 'flex-end',
			marginBottom: '1rem',
	}), []);

	const userChatStyle = useMemo(() => ({ display: 'flex', width: '100%' }), []);

	// 로그인한 유저와 채팅 글쓴이가 같으면
	if (props.chat.sender._id === user.userData._id) {
		return (
			<div
				key={props.chat._id}
				style={myChatStyle}
			>
				<span className="box">{props.chat.message}</span>
			</div>
		);
	} else {
		return (
			<div key={props.chat._id} style={ userChatStyle }>
				<Comment
					author={
						props.chat.sender && (
							<Link to={`/profile/${props.chat.sender._id}`}>
								{props.chat.sender.name}
							</Link>
						)
					}
					avatar={
						<Avatar
							src={
								props.chat.sender &&
								`http://localhost:5000/${props.chat.sender.image}`
								// `https://mirae-market.herokuapp.com/${props.chat.sender.image}`
							}
							alt={props.chat.sender && props.chat.sender.name}
						/>
					}
					content={
						<div style={{ height: '30px' }}>
							<span className="box" style={{ width: '200px' }}>
								{props.chat.message}
							</span>
						</div>
					}
				/>
			</div>
		);
	}
}

export default ChatCard;
