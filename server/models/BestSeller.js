const mongoose = require('mongoose');
// 베스트셀러 모델
// 간단하게 title과 image 경로만 둠
const bestSellerSchema = mongoose.Schema(
	{
        title: String,
        image: String
	}
);

const BestSeller = mongoose.model('BestSeller', bestSellerSchema);

module.exports = { BestSeller };
