const mongoose = require('mongoose');
// 베스트셀러 모델 
// 메인 페이지 이미지 슬라이더 (추후 관리자 계정으로 CRUD 할 수 있게 추가할 예정)
// 간단하게 title과 image 경로만 둠
const bestSellerSchema = mongoose.Schema(
	{
        title: String,
        image: String
	}
);

const BestSeller = mongoose.model('BestSeller', bestSellerSchema);

module.exports = { BestSeller };
