const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');
const { isLoggedIn } = require('./middlewares');
const fs = require('fs');

// multer를 통한 이미지 저장 (저장 위치, 파일명으로 uploads/ 경로에 이미지 저장)
var storage = multer.diskStorage({
	destination: function (req, file, cb) {	// 저장 위치
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {	// 파일 명 (날짜_파일명)
		cb(null, `${Date.now()}_${file.originalname}`);
	},
});

var upload = multer({ storage: storage }).single('file');

// 이미지 저장 API
// 파일경로, 파일이름을 리턴해서 image 경로를 body에 같이 보냄
router.post('/image', isLoggedIn, (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			return res.json({ success: false, err });
		}
		return res.json({
			success: true,
			filePath: res.req.file.path,
			fileName: res.req.file.filename,
		});
	});
});

// 게시물 작성 API
// 받아온 body 데이터를 Product 모델 인스턴스 생성 후 저장
router.post('/', isLoggedIn, (req, res) => {
	const product = new Product(req.body);
	product.save((err) => {
		if (err) {
			return res.status(400).json({ success: false, err });
		}
		return res.status(201).json({ success: true });
	});
});

// 상품 필터, 검색을 위한 API & 전체 상품 조회 API (product collections에 들어있는 모든 정보 가져옴)
/*
	글 작성 시간 역순으로 최신 게시물부터 보여짐
	limit 은 한번에 가져올(load) 데이터 갯수
	skip은 (몇개의 데이터를 스킵할지) 몇번째 데이터부터 가져올지
	searching은 검색창에 입력한 검색 문자열
	filters는 Object Type으로 가격(price)키과 카테고리(category)키로 구분됨.
	price(가격)이면 2개의 배열 (최소가격, 최대가격)이 추가되는데
	최소가격 이상 (gte), 최대가격 이하 (lte)로 찾기 위해서 처리해줌 (findArgs={'price': $gte: 1000, $lte: 20000})
	최대가격만 입력했을 때 최소가격의 default=0, 최소가격만 입력했을 때 최대가격 default=5000000
	filters가 category면 그대로 저장 (findArgs = {'category': ['전공', '교양', ...]} )
*/
router.post('/products', (req, res) => {
	let limit = req.body.limit ? parseInt(req.body.limit) : 12;
	let skip = req.body.skip ? parseInt(req.body.skip) : 0;
	let searching = req.body.searchTerm;
	let findArgs = {};

	for (let key in req.body.filters) {
		if (req.body.filters[key].length > 0) {
			if (key === 'price') {
				findArgs[key] = {
					$gte: req.body.filters[key][0], // index 0은 최소가격
					$lte: req.body.filters[key][1], //	 "   1은 최대가격
				};
			} else {
				findArgs[key] = req.body.filters[key]; // category
			}
		}
	}
	// 검색 문자열이 있으면 정규식을 통해서 대소문자 구별없이(i) 제목과 설명에서 $or을 통해 상품을 찾음
	if (searching) {
		Product.find(findArgs)
			.find({
				$or: [
					{ title: new RegExp(searching, 'i') },
					{ describtion: new RegExp(searching, 'i') },
				],
			})
			.populate('writer') // 올린 writer의 정보(이름, 이메일 등)를 가져오기 위해
			.sort({ createdAt: -1 }) // 역정렬을 통해 최신데이터부터 보이도록 함.
			.skip(skip)
			.limit(limit)
			.exec((err, productInfo) => {
				if (err) {
					return res.status(400).json({ success: false, err });
				}
				return res
					.status(200)
					.json({ success: true, productInfo, postSize: productInfo.length });
			});
	} else {
		// 검색어 없이 filters 만 사용시 (기본 전체 조회도 이 로직으로)
		Product.find(findArgs)
			.populate('writer')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.exec((err, productInfo) => {
				if (err) {
					return res.status(400).json({ success: false, err });
				}
				return res
					.status(200)
					.json({ success: true, productInfo, postSize: productInfo.length });
			});
	}
});


// 거래목록 조회 API
// Redux store의 거래목록 상품 id가 '123, 234, 345' string 타입으로 쿼리스트링으로 넘어옴
// split을 이용해서 ['123', '234', '345'] 리스트 형식으로 변환시켜줌
// 리스트 형식의 상품ID로 해당 상품 정보들 검색
router.get('/cart', (req, res) => {

	let idArray = req.query.id.split(',');

	Product.find({ _id: idArray })
		.populate('writer')
		.exec((err, product) => {
			if (err) return res.status(400).send(err);
			return res.status(200).send(product);
		})
})

// 상세정보 조회 API
// productId를 이용하여 상품 상세정보 가져오기
// 조회수 1씩 증가시킴
router.get('/products', (req, res) => {
	let productId = req.query.id;

	Product.findById(productId)
		.populate('writer')
		.exec((err, product) => {
			if (err) 
				return res.status(400).send(err);
			product.views++;
			product.save();
			return res.status(200).send(product);
		});
});


// 게시물 수정 API
// id로 해당 상품 상세정보 찾은 후 $set에 수정한 body 데이터를 넣어 업데이트함
router.put('/products', (req, res) => {
	Product.update({ _id: req.query.id }, { $set: req.body }).exec((err, result) => {
		if (err) 
			return res.status(500).send({ success: false, err});
		return res.status(200).send({ success: true });
	});
});

// 게시물 삭제 API
// 해당 게시물 id로 게시물 찾아서 지운 뒤, 게시물에 연결되어있는 저장된 image도 unlink로 삭제
router.delete('/products', (req, res) => {
	Product.findByIdAndRemove({ _id: req.query.id })
		.exec((err, product) => {
			if (err) return res.status(500).send({ success: false, err});
			
			product.image.forEach(image => {
				fs.unlink(image, (err) => {
					if(err)
						console.error(err)
				})
			})
			return res.status(200).send({ success: true });
		});
});

// 마이페이지 API
// 모든 상품 중 해당 글쓴이가 작성한 글을 모두 가져옴 
// (해당 유저 id를 쿼리스트링으로 조회) 
// => 마이페이지뿐 아니라 다른 유저의 게시물이 필요할 때를 위해 (req.user가 아닌 req.query.id로)
router.get('/mypage', (req, res) => [
	Product.find({ writer: req.query.id })
		.exec((err, Product) => {
			if (err) return res.status(500).send({ success: false, err});
			return res.status(200).send({ success: true, Product })
		})
])

module.exports = router;