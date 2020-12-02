import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCartItems, removeCartItem } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';

function CartPage(props) {
	const dispatch = useDispatch();
	const user = useSelector(state => state.user)
	const [Total, setTotal] = useState(0);

	useEffect(() => {

		let cartItems = [];

		
		// redux User State의 Cart안에 상품이 들어있는지 확인
		if (user.userData.cart) {
			if (user.userData.cart.length > 0) {
				user.userData.cart.forEach((item) => {
					cartItems.push(item.id);
				});

				dispatch(getCartItems(cartItems, user.userData.cart)).then(
					(response) => {
						// console.log(response.payload);
						calculateTotal(response.payload);
					},
				);
			}
		}
	}, [dispatch, user.userData]);

	const calculateTotal = (BookIds) => {
		let total = 0;
		BookIds.forEach((book) => {
			total += parseInt(book.price, 10);
		});

		setTotal(total);
	};

	let removeFromCart = (productId) => {
		dispatch(removeCartItem(productId));

	};

	return (
		<div style={{ width: '85%', margin: '3rem auto' }}>
			<h1>거래 목록</h1>
			<div>
				<UserCardBlock
					products={user.cartDetail}
					removeItem={removeFromCart}
				/>
			</div>
			<div>
				<h2>합계: {Total} 원</h2>
			</div>
		</div>
	);
}

export default CartPage;
