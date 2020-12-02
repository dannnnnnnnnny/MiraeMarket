import axios from 'axios';
import {
	LOGIN_USER,
	REGISTER_USER,
	AUTH_USER,
	SOCIAL_USER,
	LOGOUT_USER,
	ADD_TO_CART,
	GET_CART_ITEMS,
	REMOVE_CART_ITEM,
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit) {
	const request = axios
		.post(`${USER_SERVER}/register`, dataToSubmit)
		.then((response) => response.data);

	return {
		type: REGISTER_USER,
		payload: request,
	};
}

export async function loginUser(dataToSubmit) {
	const request = await axios.post(`${USER_SERVER}/login`, dataToSubmit);

	return {
		type: LOGIN_USER,
		payload: request.data,
	};
}

export function socialUser(dataToSubmit) {
	const { _id } = dataToSubmit;

	return {
		type: SOCIAL_USER,
		payload: { loginSuccess: true, userId: _id },
	};
}

export function auth() {
	const request = axios
		.get(`${USER_SERVER}/auth`)
		.then((response) => response.data);

	return {
		type: AUTH_USER,
		payload: request,
	};
}

export function logoutUser() {
	const request = axios
		// .get(`http://localhost:3000/api/users/logout`)
		.get(`https://mirae-market.herokuapp.com/api/users/logout`)
		.then((response) => response.data);

	return {
		type: LOGOUT_USER,
		payload: request,
	};
}

export function addToCart(bookId) {
	let body = {
		bookId: bookId,
	};
	const request = axios
		.post(`${USER_SERVER}/addToCart`, body)
		.then((response) => response.data);

	return {
		type: ADD_TO_CART,
		payload: request,
	};
}

export function getCartItems(cartItems) {
	const request = axios
		.get(`/api/product/bookcart?id=${cartItems}`)
		.then((response) => response.data);


	return {
		type: GET_CART_ITEMS,
		payload: request,
	};
}

export function removeCartItem(bookId) {
	const request = axios
		.get(`/api/users/removeFromCart?id=${bookId}`)
		.then((response) => {
			//productInfo ,  cart 정보를 조합해서   CartDetail을 만든다.
			console.log("remove : ", response.data)
			response.data.cart.forEach((item) => {
				response.data.productInfo.forEach((product, index) => {
					if (item.id === product._id) {
						response.data.productInfo[index].quantity = item.quantity;
					}
				});
			});
			return response.data;
		});

	return {
		type: REMOVE_CART_ITEM,
		payload: request,
	};
}
