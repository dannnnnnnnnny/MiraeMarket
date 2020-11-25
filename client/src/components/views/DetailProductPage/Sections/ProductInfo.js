import React from 'react';
import { Descriptions, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../_actions/user_actions';
function ProductInfo(props) {
	const dispatch = useDispatch();

	const clickHandler = () => {
		// 필요한 정보 Cart Field에 넣음 (상품 id, 갯수, 날짜정보)
		dispatch(addToCart(props.detail._id));
	};

	return (
		<div>
			<Descriptions title="Product Info">
				<Descriptions.Item label="Price">
					{props.detail.price}
				</Descriptions.Item>
				<Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
				<Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
				<Descriptions.Item label="Describtion">
					{props.detail.describtion}
				</Descriptions.Item>

				<br />
				<br />
				<br />
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button
						size="large"
						shape="round"
						type="danger"
						onClick={clickHandler}
					>
						Add to Cart
					</Button>
				</div>
			</Descriptions>
		</div>
	);
}

export default ProductInfo;
