const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');

const { isLoggedIn } = require('./middlewares');

router.get('/products_by_id', (req, res) => {
    let productIds = req.query.id;


	Comment.find({product: productIds})
        .populate('writer')
        .populate('product')


		.exec((err, comments) => {
            if (err) return res.status(400).send(err);
			res.status(200).send(comments);
		});
});

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

router.put('/', (req, res) => {
	Comment.update({ _id: req.query.id }, { $set: req.body }).exec(
		(err, result) => {
			if (err) res.status(500).send({ success: false, err });
			return res.status(200).send({ success: true });
		},
	);
});

router.delete('/', (req, res) => {
	Comment.findByIdAndRemove({ _id: req.query.id })
		.exec((err, comment) => {
			if (err) res.status(500).send({ success: false, err});
			return res.status(200).send({ success: true });
		})
});

module.exports = router;