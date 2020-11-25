import React from 'react';
import { Select } from 'antd';
import './Box.css';

const { Option } = Select;

function CheckCategory(props) {
	const children = [];
	let data = ['전공', '교양', '만화', '문학', '시 / 에세이', '자기 계발'];

	for (let key of data) {
		children.push(<Option key={key}>{key}</Option>);
	}
	function handleChange(value) {
		const CheckData = [...value];
		// console.log(CheckData);
		props.handleFilters(CheckData);
	}

	return (
		<div>
			<Select
				mode="multiple"
				allowClear
				style={{ width: '100%' }}
				placeholder="Please select"
				defaultValue={[]}
				onChange={handleChange}
			>
				{children}
			</Select>
		</div>
	);
}

export default CheckCategory;