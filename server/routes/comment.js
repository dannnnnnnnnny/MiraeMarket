const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');
const { isLoggedIn } = require('./middlewares');

// 해당 상품ID를 쿼리스트링을 통해 받아와서 해당 상품게시물의 댓글 조회
// populate를 통해 댓글 작성자 정보와 상품 데이터 정보까지 모두 가져옴
router.get('/products', (req, res) => {
    let productIds = req.query.id;

	Comment.find({product: productIds})
        .populate('writer')
        .populate('product')

		.exec((err, comments) => {
            if (err) return res.status(400).send(err);
			res.status(200).send(comments);
		});
});

// 댓글 작성 API
// isLoggedIn 미들웨어로 로그인한 유저만 접근 허용
// body로 받아온 데이터 comment 인스턴스에 담아 저장
router.post('/', isLoggedIn, (req, res) => {
	// 받아온 정보 db에 저장
	const comment = new Comment(req.body);
	comment.save((err) => {
		if (err) {
			return res.status(400).json({ success: false, err });
		}
		return res.status(201).json({ success: true, comment });
	});
});

// 댓글 수정 API
// queryString으로 해당 댓글 id를 가져와서 찾은 후
// body로 받아온 데이터, $set으로 업데이트
router.put('/', isLoggedIn, (req, res) => {
	Comment.update({ _id: req.query.id }, { $set: req.body }).exec(
		(err, result) => {
			if (err) res.status(500).send({ success: false, err });
			return res.status(200).send({ success: true });
		},
	);
});

// 댓글 삭제 API
// queryString으로 해당 id 가져온 후 _id로 찾아서 삭제함.
router.delete('/', isLoggedIn, (req, res) => {
	Comment.findByIdAndRemove({ _id: req.query.id })
		.exec((err, comment) => {
			if (err) res.status(500).send({ success: false, err});
			return res.status(200).send({ success: true });
		})
});

module.exports = router;