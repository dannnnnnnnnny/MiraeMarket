import axios from 'axios';
import { GET_CHATS, AFTER_POST_MESSAGE } from './types';
import { CHAT_SERVER } from '../components/Config.js';

// 채팅 기록을 가져옴
export function getChats() {
	const request = axios
		.get(`${CHAT_SERVER}/getChats`)
		.then((response) => response.data);

	return {
		type: GET_CHATS,
		payload: request,
	};
}

// 채팅 작성 후 redux store에 추가
export function afterPostMessage(data) {
	return {
		type: AFTER_POST_MESSAGE,
		payload: data,
	};
}

// 채팅에 대한 데이터를 처리하는 redux action 함수
