const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
