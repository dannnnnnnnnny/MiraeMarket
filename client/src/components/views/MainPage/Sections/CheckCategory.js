import React from 'react';
import { Select } from 'antd';
import './BoxStyle.css';

const { Option } = Select;

// Select Box를 이용한 Category 검색 기능
function CheckCategory(props) {
	const children = [];

	let data = ['전공', '교양', '만화', '문학', '시 / 에세이', '자기 계발'];

	// SelectBox Option에 위 배열 데이터 추가
	for (let key of data) {
		children.push(<Option key={key}>{key}</Option>);
	}

	// 선택한 데이터 저장 후 검색필터를 위해 상위 컴포넌트로 보냄
	function handleChange(value) {
		const CheckData = [...value];
		props.handleFilters(CheckData);
	}

	return (
		<div style={{ display: 'flex', width: '35%' }}>
			<Select
				mode="multiple"
				allowClear={false}
				size='middle'
				style={{ width: '100%' }}
				placeholder="원하시는 카테고리를 선택해주세요"
				defaultValue={[]}
				onChange={handleChange}
			>
				{children}
			</Select>
		</div>
	);
}

export default CheckCategory;
