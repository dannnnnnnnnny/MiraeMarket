import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';

function CartPage(props) {
	const dispatch = useDispatch();
	const [Total, setTotal] = useState(0);
	useEffect(() => {
		let cartItems = [];

		// redux User State의 Cart안에 상품이 들어있는지 확인
		if (props.user.userData && props.user.userData.cart) {
			if (props.user.userData.cart.length > 0) {
				props.user.userData.cart.forEach((item) => {
					cartItems.push(item.id);
				});

				dispatch(getCartItems(cartItems, props.user.userData.cart)).then(
					(response) => {
						calculateTotal(response.payload);
					},
				);
			}
		}
	}, [dispatch, props.user.userData]);

	let calculateTotal = (cartDetail) => {
		let total = 0;
		cartDetail.forEach((item) => {
			total += parseInt(item.price, 10) * item.quantity;
		});

		setTotal(total);
	};

	let removeFromCart = (productId) => {
		dispatch(removeCartItem(productId));
		// .then((response) => {});
	};

	return (
		<div style={{ width: '85%', margin: '3rem auto' }}>
			<h1>Cart</h1>
			<div>
				<UserCardBlock
					products={props.user.cartDetail}
					removeItem={removeFromCart}
				/>
			</div>
			<div>
				<h2>Total Amount: {Total}</h2>
			</div>
		</div>
	);
}

export default CartPage;
