import React from 'react';
import { Descriptions, Button, Badge } from 'antd';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../_actions/user_actions';
import moment from 'moment';

function ProductInfo(props) {
	const dispatch = useDispatch();
	const clickHandler = () => {
		// 필요한 정보 Cart Field에 넣음 (상품 id, 갯수, 날짜정보)
		dispatch(addToCart(props.detail._id));
	};

	return (
		<div style={{ margin: '0 auto' }}>
			<br/>
			<br/>
			<br/>
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
					{props.detail.writer && props.detail.writer.name}
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
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Button size="large" shape="round" type="danger" onClick={clickHandler}>
					찜하기
				</Button>
			</div>
		</div>
	);
}

export default ProductInfo;
