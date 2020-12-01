const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');
const { isLoggedIn } = require('./middlewares');
const fs = require('fs');

//=================================
//             Product
//=================================

// npmjs.com/package/multer
var storage = multer.diskStorage({
	// 저장 위치
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	// 파일 명
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
});
var upload = multer({ storage: storage }).single('file');

router.post('/image', isLoggedIn, (req, res) => {
	// 가져온 이미지 저장
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

router.post('/', isLoggedIn, (req, res) => {
	// 받아온 정보 db에 저장
	const product = new Product(req.body);
	product.save((err) => {
		if (err) {
			return res.status(400).json({ success: false, err });
		}
		return res.status(201).json({ success: true });
	});
});

router.post('/products', (req, res) => {
	// product collections에 들어있는 모든 정보 가져옴

	let limit = req.body.limit ? parseInt(req.body.limit) : 20;
	let skip = req.body.skip ? parseInt(req.body.skip) : 0;
	let term = req.body.searchTerm;
	let findArgs = {};

	for (let key in req.body.filters) {
		if (req.body.filters[key].length > 0) {
			if (key === 'price') {
				findArgs[key] = {
					$gte: req.body.filters[key][0],
					$lte: req.body.filters[key][1],
				};
			} else {
				findArgs[key] = req.body.filters[key];
			}
		}
	}


	if (term) {
		Product.find(findArgs)
			.find({
				$or: [
					{ title: new RegExp(term, 'i') },
					{ describtion: new RegExp(term, 'i') },
				],
			})
			.populate('writer') // 올린 writer의 정보(이름, 이메일 등)를 가져오기 위해
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
	} else {
		Product.find(findArgs)
			.populate('writer')
			.sort({ 'createdAt': -1 })
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

router.get('/products_by_id', (req, res) => {
	//productId를 이용하여 정보 가져오기
	// let type = req.query.type;
	let productIds = req.query.id;

	// if (type == 'array') {
	// 	// id=123214124,132142121,12123213 를
	// 	//  productIds = ['12321421','1521213124','15125125']
	// 	// 이런식으로 바꿔줘야 함.
	// 	let ids = req.query.id.split(',');
	// 	productIds = ids.map((item) => {
	// 		return item;
	// 	});
	// }

	Product.findById(productIds)
		.populate('writer')
		.exec((err, product) => {
			if (err) res.status(400).send(err);
			product.views++;
			product.save();
			return res.status(200).send(product);
		});
});

router.put('/products_by_id', (req, res) => {
	Product.update({ _id: req.query.id }, { $set: req.body }).exec((err, result) => {
		if (err) res.status(500).send({ success: false, err});
		return res.status(200).send({ success: true });
	});
});

router.delete('/products_by_id', (req, res) => {

	Product.findByIdAndRemove({ _id: req.query.id })
		.exec((err, product) => {
			if (err) res.status(500).send({ success: false, err});
			
			product.image.forEach(image => {
				fs.unlink(image, (err) => {
					if(err)
						console.error(err)
				})
			})

			return res.status(200).send({ success: true });
		});
		
});

module.exports = router;
