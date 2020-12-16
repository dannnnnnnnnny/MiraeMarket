import { combineReducers } from 'redux';
import user from './user_reducer';
import chat from './chat_reducer';

// 채팅과 유저 reducer를 합침
const rootReducer = combineReducers({
	user,
	chat,
});

export default rootReducer;
