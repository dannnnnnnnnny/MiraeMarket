const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 채팅 모델
// 추후 이미지도 송수신할 수 있게 할 예정

// sender는 User의 ObjectId를 외래키처럼 넣어줌
const chatSchema = mongoose.Schema(
	{
		message: {
			type: String,
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		type: {
			type: String,
		},
	},
	{ timestamps: true },
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = { Chat };
