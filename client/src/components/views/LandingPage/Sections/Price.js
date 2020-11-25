import React, { useState } from 'react';
import { Input } from 'antd';

function Price(props) {
	// const [Value, setValue] = useState([]);
	const [lowPrice, setLowPrice] = useState([""]);
	const [highPrice, setHighPrice] = useState([""]);

	const onLowChange = (e) => {
		
		let newLow = [e.target.value];
		setLowPrice([e.target.value]);
		
		props.handleFilters(newLow.concat(highPrice));
	};

	const onHighChange = (e) => {
		let newHigh = [e.target.value];
		setHighPrice([e.target.value]);

		props.handleFilters(lowPrice.concat(newHigh))
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
			<span>
				<Input
					onChange={onLowChange}
					value={lowPrice}
					placeholder={'최소 가격'}
				/>
			</span>
			<b>&nbsp;&nbsp;~&nbsp;&nbsp;</b>
			<span>
				<Input
					onChange={onHighChange}
					value={highPrice}
					placeholder={'최대 가격'}
				/>
			</span>
		</div>
	);
}

export default Price;
