import React, { useState } from 'react';
import { Input, Typography } from 'antd';
import "./BoxStyle.css";

const { Title } = Typography;

// 책 검색 컴포넌트
function SearchBook(props) {
	const [SearchTerm, setSearchTerm] = useState('');

	// 검색 내용 상위 컴포넌트로 보냄
	const searchHandler = (event) => {
		setSearchTerm(event.currentTarget.value);
		props.refreshFunction(event.currentTarget.value);
	};

	return (
		<div style={{ marginLeft: '18%', paddingTop: '5%' }}>
			<Title level={1} style={{ marginLeft: '22%', color: 'white', width: '60%' }}>
				찾으시는 책을 검색해주세요
			</Title>
			<div style={{ display: 'flex' }}>
				<Input
					size="large"
					placeholder="찾으시는 도서명을 검색해보세요"
					onChange={searchHandler}
					value={SearchTerm}
					style={{ width: '80%' }}
				/>
			</div>
		</div>
	);
}

export default SearchBook;
