import React from 'react';
import './UserCardBlock.css';
import { Link } from 'react-router-dom';

function UserCardBlock(props) {
	const renderCartImage = (images) => {
		if (images.length > 0) {
			let image = images[0];
			return `http://localhost:5000/${image}`;
		}
	};
	const renderItems = () =>
		props.products &&
		props.products.map((product, index) => (
			<tr key={index}>
				<td>
					<Link to={`/product/${product._id}`}>
						<img
							style={{ width: '70px' }}
							alt="product"
							src={renderCartImage(product.image)}
						/>
					</Link>
				</td>
				<td>
					<Link to={`/profile/${product.writer._id}`}>
						{product.writer.major} {product.writer.name}
					</Link>
				</td>
				<td>{product.price} 원</td>
				<td>
					<button onClick={() => props.removeItem(product._id)}>Remove</button>
				</td>
			</tr>
		));
	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>도서 이미지</th>
						<th>판매자</th>
						<th>판매가</th>
						<th>버튼</th>
					</tr>
				</thead>
				<tbody>{renderItems()}</tbody>
			</table>
		</div>
	);
}

export default UserCardBlock;
