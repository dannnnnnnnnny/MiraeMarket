import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCartItems, removeCartItem } from '../../../actions/user_actions';
import UserCartBlock from './Sections/UserCartBlock';

function CartPage(props) {
	const dispatch = useDispatch();
	const user = useSelector(state => state.user)
	const style = useMemo(() => ({ 
		width: '85%', margin: '3rem auto'
	}), []);

	useEffect(() => {
		let cartItems = [];

		// redux User State의 Cart안에 상품이 들어있는지 확인
		// user.userData.cart에는 [{id: 1}, {id: 2}] 이런식의 데이터가 존재
		// 위 데이터를 [1, 2]로 전처리 해줌
		if (user.userData.cart) {
			if (user.userData.cart.length > 0) {
				user.userData.cart.forEach((item) => {
					cartItems.push(item.id);
				});

				dispatch(getCartItems(cartItems))
			}
		}
	}, [dispatch, user.userData]);

	// 목록 삭제 버튼 클릭시 해당 상품 id로 삭제
	let removeFromCart = (productId) => {
		dispatch(removeCartItem(productId));
	};

	return (
		<div style={style}>
			<h1>거래 목록</h1>
			<div>
				{/* user.cartDetail 유저의 거래상세목록 */}
				<UserCartBlock
					products={user.cartDetail}
					removeItem={removeFromCart}
				/>
			</div>

		</div>
	);
}

export default CartPage;
