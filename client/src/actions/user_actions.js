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

// 회원가입 action
export function registerUser(data) {
	const request = axios
		.post(`${USER_SERVER}/register`, data)
		.then((response) => response.data);

	return {
		type: REGISTER_USER,
		payload: request,
	};
}

// 로그인 action
export async function loginUser(data) {
	const request = await axios.post(`${USER_SERVER}/login`, data);

	return {
		type: LOGIN_USER,
		payload: request.data,
	};
}

// 소셜로그인 action
export function socialUser(data) {
	const { _id } = data;

	return {
		type: SOCIAL_USER,
		payload: { loginSuccess: true, userId: _id },
	};
}

// 유저 로그인여부 확인 action
export function auth() {
	const request = axios
		.get(`${USER_SERVER}/auth`)
		.then((response) => response.data);

	return {
		type: AUTH_USER,
		payload: request,
	};
}

// 로그아웃 action
export function logoutUser() {
	const request = axios
		.get(`http://localhost:3000/api/users/logout`)
		// .get(`https://mirae-market.herokuapp.com/api/users/logout`)
		.then((response) => response.data);

	return {
		type: LOGOUT_USER,
		payload: request,
	};
}

// 거래목록 추가 action
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

// 거래목록 조회 action
export function getCartItems(cartItems) {
	const request = axios
		.get(`/api/product/cart?id=${cartItems}`)
		.then((response) => response.data);


	return {
		type: GET_CART_ITEMS,
		payload: request,
	};
}

// 거래목록 삭제 action
export function removeCartItem(bookId) {
	const request = axios
		.get(`/api/users/removeFromCart?id=${bookId}`)
		.then((response) => {
			return response.data;
		});

	return {
		type: REMOVE_CART_ITEM,
		payload: request,
	};
}
