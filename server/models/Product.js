const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 상품 모델
// 지금은 중고서적만 판매하지만 벼룩시장이기 때문에 추후에 다른 상품도 판매할 수 있도록 확장성을 고려

// writer : 유저 정보 ObjectId로 가져옴
// title : 제목
// describtion : 설명
// price : 가격
// image : 이미지 (여러 장이 가능하게 배열)
// sold : 판매 여부
// views : 조회수
// category : 카테고리 분류
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

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };
