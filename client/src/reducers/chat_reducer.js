import { GET_CHATS, AFTER_POST_MESSAGE } from '../actions/types';

// action 타입에 따라서 switch문으로 분기

export default function (state = {}, action) {
	switch (action.type) {
		// 채팅 기록을 가져옴
		case GET_CHATS:
			return { ...state, chats: action.payload };
		// 기존 채팅 기록에 추가함
			case AFTER_POST_MESSAGE:
			return { ...state, chats: state.chats.concat(action.payload) };
		default:
			return state;
	}
}
