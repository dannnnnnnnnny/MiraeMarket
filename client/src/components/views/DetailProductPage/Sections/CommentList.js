import React, { useRef, useEffect, useState } from 'react'
import {
	List,
	Avatar,
	Modal,
	notification,
	Input,
} from 'antd';
// import moment from 'moment';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
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

	
	console.log(props.commentList && props.commentList);
	const openNotificationWithIcon = (type, message, description) => {
		notification[type]({
			message,
			description,
			duration: 2,
		});
	};

	const scrollToBottom = () => {
		commentEndLine.current.scrollIntoView({
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		if (props.commentList && commentEndLine.current) {
			scrollToBottom();
		}
		
	});

	const showEditModal = (commentId) => {
		setEditVisible(true);
		setEditId(commentId)
	};

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
					style={{
						margin: '0 auto',
						width: '100%',
						maxHeight: '350px',
						overflowY: 'scroll',
					}}
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
													<EditOutlined />
												</p>,
												<p onClick={() => showDeleteModal(comment._id)}>
													<DeleteOutlined />
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
									title={<p>{comment.writer.name}</p>}
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
					<Input
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