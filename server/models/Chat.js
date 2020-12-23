const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 채팅 모델
// 추후 이미지나 파일도 송수신할 수 있게 할 예정 (Type 필드를 둬서 메시지의 타입에 따라 분기 처리)
// sender는 User의 ObjectId를 외래키처럼 연결
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
