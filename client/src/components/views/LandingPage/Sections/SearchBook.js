import React, { useState } from 'react';
import { Input } from 'antd';

const { Search } = Input;

function SearchBook(props) {
	const [SearchTerm, setSearchTerm] = useState('');
	const searchHandler = (event) => {
		console.log(event.currentTarget.value);
		setSearchTerm(event.currentTarget.value);
		props.refreshFunction(event.currentTarget.value);
	};

	return (
		<div>
			<Search
				placeholder="Search"
				onChange={searchHandler}
				value={SearchTerm}
				style={{ width: '100%' }}
			/>
		</div>
	);
}

export default SearchBook;
