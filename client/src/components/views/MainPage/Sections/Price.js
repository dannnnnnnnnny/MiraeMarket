import React, { useState } from 'react';
import { Input, Typography } from 'antd';

const { Title } = Typography;

// 가격 설정 컴포넌트
function Price(props) {
	const [lowPrice, setLowPrice] = useState([""]);
	const [highPrice, setHighPrice] = useState([""]);

	// 최소 가격 설정
	const onLowChange = (e) => {
		let newLow = [e.target.value];
		setLowPrice([e.target.value]);
		
		props.handleFilters(newLow.concat(highPrice));
	};

	// 최고 가격 설정
	const onHighChange = (e) => {
		let newHigh = [e.target.value];
		setHighPrice([e.target.value]);

		props.handleFilters(lowPrice.concat(newHigh))
	};

	return (
		<div style={{ width: '50%', marginLeft: '10%' }}>
			<div style={{ display: 'flex'}} >
				<span style={{ width: '50%' }}>
					<Input
						type='number'
						size="middle"
						style={{ width: '60%' }}
						onChange={onLowChange}
						value={lowPrice}
						placeholder={'최소 가격'}
					/>
				</span>
				<Title level={2} style={{ color: 'white', marginLeft: '-75px' }}>
					~&nbsp;&nbsp;
				</Title>
				<span style={{ width: '50%' }}>
					<Input
						type='number'
						size="middle"
						style={{ width: '60%' }}
						onChange={onHighChange}
						value={highPrice}
						placeholder={'최대 가격'}
					/>
				</span>
			</div>
		</div>
	);
}

export default Price;
