const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema(
	{
		writer: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		title: {
			type: String,
			maxlength: 50,
		},
		describtion: {
			type: String,
		},
		price: {
			type: Number,
			default: 0,
		},
		image: {
			type: Array,
			default: [],
		},
		sold: {
			type: Boolean,
			default: false,
		},
		category: {
			type: String,
		},
		views: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true },
);

// text로 title과 description을 검색하고 (키워드로 걸리길 원하는 컬럼)
// weight로 중요도를 줌
// productSchema.index(
// 	{
// 		title: 'text',
// 		describtion: 'text',
// 	},
// 	{
// 		weight: {
// 			title: 5,
// 			describtion: 1,
// 		},
// 	},
// );

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };
