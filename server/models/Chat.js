const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// type은 text말고도 image도 받을 수 있게 해서 처리하려 했는데
// 아직 text만 처리 가능

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
