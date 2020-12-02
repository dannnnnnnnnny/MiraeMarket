import React, { useState } from 'react';
import { Input, Typography } from 'antd';
import "./Box.css";

const { Title } = Typography;

function SearchBook(props) {
	// const history = useHistory();
	const [SearchTerm, setSearchTerm] = useState('');
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
