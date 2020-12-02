import React from 'react';
import { Descriptions, Button, Badge } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../../../_actions/user_actions';
import moment from 'moment';
import { Link } from 'react-router-dom';

function ProductInfo(props) {
	const user = useSelector(state => state.user)
	const dispatch = useDispatch();
	const clickHandler = () => {
		// 필요한 정보 Cart Field에 넣음 (상품 id, 날짜정보)
		dispatch(addToCart(props.detail._id));
		props.detail.sold = true;
	};
	return (
		<div style={{ margin: '0 auto' }}>
			<br />
			<br />
			<br />
			<Descriptions style={{ textAlign: 'center' }} title="상품 정보" bordered>
				<Descriptions.Item label="분류">
					{props.detail && props.detail.category}
				</Descriptions.Item>
				<Descriptions.Item label="상품명">
					{props.detail && props.detail.title}
				</Descriptions.Item>
				<Descriptions.Item label="판매가">
					{props.detail && props.detail.price}
				</Descriptions.Item>

				<Descriptions.Item label="판매 상태" span={2}>
					<Badge
						status={`${
							props.detail && props.detail.sold ? 'error' : 'processing'
						}`}
						text={`${
							props.detail && props.detail.sold ? '판매완료' : '판매중'
						}`}
					/>
				</Descriptions.Item>
				<Descriptions.Item label="등록 시간" span={1}>
					{props.detail &&
						moment(props.detail.createdAt).format('YYYY-MM-DD HH:mm')}
				</Descriptions.Item>

				<Descriptions.Item label="판매자" span={2}>
					{props.detail.writer && (
						<Link to={`/profile/${props.detail.writer._id}`}>
							{props.detail.writer && props.detail.writer.name}
						</Link>
					)}
				</Descriptions.Item>
				<Descriptions.Item label="조회 수">
					{props.detail && props.detail.views}
				</Descriptions.Item>

				<Descriptions.Item label="상품 정보" span={3}>
					{props.detail && props.detail.describtion}
				</Descriptions.Item>
			</Descriptions>
			<br />
			<br />
			<br />
			
			{/* 유저가 로그인 되어있지않거나, 판매완료된 상품이라면 거래요청 버튼 감춤 */}
			{user.userData && !user.userData.isAuth | props.detail.sold ? (<div></div>) : (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button
						size="large"
						shape="round"
						type="danger"
						onClick={clickHandler}
					>
						거래요청
					</Button>
				</div>
			)}
		</div>
	);
}

export default ProductInfo;
