const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// product 상품 정보 외래키로 ObjectId 가져옴
// writer 글쓴이 정보 외래키로 ObjectId 가져옴
const commentSchema = mongoose.Schema(
	{
		message: {
			type: String,
		},
		product: {
				type: Schema.Types.ObjectId,
				ref: 'Product',
		},
		writer: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		}
	},
	{ timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };
