import React, { useRef, useEffect, useState, useMemo } from 'react'
import {
	List,
	Avatar,
	Modal,
	notification,
	Input,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';


function CommentList(props) {
	const commentEndLine = useRef(null);
	const [editVisible, setEditVisible] = useState(false);
	const [editId, setEditId] = useState('')
	const [deleteId, setDeleteId] = useState('')
	const [deleteVisible, setDeleteVisible] = useState(false);
	const user = useSelector(state => state.user);
	const [editMessage, setEditMessage] = useState('')

	const CommentStyle = useMemo(
		() => ({
			margin: '0 auto',
			width: '100%',
			maxHeight: '350px',
			overflowY: 'scroll',
		}),
		[],
	);

	// 알림창
	const openNotificationWithIcon = (type, message, description) => {
		notification[type]({
			message,
			description,
			duration: 2,
		});
	};

	// 스크롤 아래로 내려가게
	const scrollToBottom = () => {
		commentEndLine.current.scrollIntoView({
			behavior: 'smooth',
		});
	};

	// 컴포넌트가 업데이트 될 때 마다 스크롤 내려줌
	useEffect(() => {
		if (props.commentList && commentEndLine.current) {
			scrollToBottom();
		}
		
	});

	const showEditModal = (commentId) => {
		setEditVisible(true);
		setEditId(commentId)
	};

	// 댓글 수정
	const handleEditOk = () => {
		let body = {
			message: editMessage
		};

		axios
			.put(`/api/comment/?id=${editId}`, body)
			.then((response) => {
				if (response.data.success) openNotificationWithIcon('success', '댓글 수정 완료', '댓글이 수정되었습니다.');
				setEditId('')
				setEditMessage('')
				setEditVisible(false)
				props.refresh()
			})
			.catch((err) => alert(err));
	};	

	const handleEditCancel = () => {
		setEditVisible(false);
	};

	const showDeleteModal = (commentId) => {
		setDeleteVisible(true);
		setDeleteId(commentId);
	};

	const handleDeleteOk = () => {
		axios
			.delete(`/api/comment/?id=${deleteId}`)
			.then((response) => {
				if (response.data.success)
					openNotificationWithIcon(
						'success',
						'댓글 삭제 완료',
						'댓글이 삭제되었습니다.',
					);
				setDeleteId('')
				setDeleteVisible(false);
				props.refresh();
			})
			.catch((err) => alert(err));
	};

	const handleDeleteCancel = () => {
		setDeleteVisible(false);
	}

    return (
			<div style={{ margin: '0 auto', width: '80%' }}>
				<p>{props.commentList && `${props.commentList.length}개의 댓글`}</p>
				<div
					style={CommentStyle}
				>
					<List
						// header={props.commentList && `${props.commentList.length}개의 댓글`}
						itemLayout="horizontal"
						dataSource={props.commentList}
						renderItem={(comment) => (
							<List.Item
								actions={
									comment.writer._id === user.userData._id
										? [
												<p
													onClick={() => {
														showEditModal(comment._id);
													}}
												>
													<Link to>
														<EditOutlined />
													</Link>
												</p>,
												<p onClick={() => showDeleteModal(comment._id)}>
													<Link to>
														<DeleteOutlined />
													</Link>
												</p>,
										  ]
										: []
								}
							>
								<List.Item.Meta
									avatar={
										<Avatar
											src={`http://localhost:5000/${comment.writer.image}`}
										/>
									}
									title={
										<Link to={`/profile/${comment.writer._id}`}>
											{comment.writer.name}
										</Link>
									}
									description={
										<p style={{ color: 'black' }}>{`${comment.message}`}</p>
									}
								/>
							</List.Item>
						)}
					/>
					<div ref={commentEndLine} />
				</div>

				{/* 댓글 수정 Modal 창  */}
				<Modal
					title="댓글 수정"
					visible={editVisible}
					onOk={handleEditOk}
					onCancel={handleEditCancel}
					okText={'수정'}
					cancelText={'취소'}
					okType="danger"
				>
					<Input.TextArea
						onChange={(e) => setEditMessage(e.target.value)}
						value={editMessage}
					/>
				</Modal>

				{/* 댓글 삭제 Modal 창 */}
				<Modal
					title="댓글 삭제"
					visible={deleteVisible}
					onOk={handleDeleteOk}
					onCancel={handleDeleteCancel}
					okText={'삭제'}
					cancelText={'취소'}
					okType="danger"
				>
					<p>댓글을 삭제하시겠습니까?</p>
				</Modal>
			</div>
		);
}

export default CommentList;