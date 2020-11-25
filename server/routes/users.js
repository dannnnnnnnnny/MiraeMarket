const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Product } = require('../models/Product');

//=================================
//             User
//=================================

router.get('/auth', isLoggedIn, (req, res) => {
	// console.log("auth: ",req.user)
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image,
		cart: req.user.cart,
		history: req.user.history,
	});
});

router.post('/register', isNotLoggedIn, (req, res) => {
	const user = new User(req.body);

	user.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({
			success: true,
		});
	});
});

router.post('/login', isNotLoggedIn, function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err);
		}

		if (user) {
			req.login(user, function (err) {
				if (err) {
					return next(err);
				}
				return res.send({ loginSuccess: true, userId: user._id });
			});
		}
	})(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
	User.findOneAndUpdate(
		{ _id: req.user._id },
		{ token: '', tokenExp: '' },
		(err, doc) => {
			if (err) return res.json({ success: false, err });
			req.logout();
			req.session.destroy();
			return res.clearCookie('connect.sid', { path: '/' }).status(200).send({
				success: true,
			});
		},
	);
});

router.get('/kakao', passport.authenticate('kakao'));
router.get('/facebook', passport.authenticate('facebook'));
router.get('/naver', passport.authenticate('naver'));

router.get('/kakao/callback', function (req, res, next) {
	passport.authenticate('kakao', {
		successRedirect: 'http://localhost:3000',
		failureRedirect: 'http://localhost:3000/login',
	})(req, res, next);
});

router.get('/facebook/callback', function (req, res, next) {
	passport.authenticate('facebook', {
		successRedirect: 'http://localhost:3000/login',
		failureRedirect: 'http://localhost:3000/login',
	})(req, res, next);
});

router.get('/naver/callback', function (req, res, next) {
	passport.authenticate('naver', {
		successRedirect: 'http://localhost:3000/login',
		failureRedirect: 'http://localhost:3000/login',
	})(req, res, next);
});

router.get('/login/success', (req, res) => {
	// console.log("req.user : ", req.user)
	if (req.user) {
		res.json({
			loginSuccess: true,
			user: req.user,
		});
	} else {
		res.status(403).json({
			message: 'User Not Authenticated',
			loginSuccess: false,
		});
	}
});

router.post('/addToCart', isLoggedIn, (req, res) => {
	// 해당 유저 정보 가져오기
	User.findOne({ _id: req.user._id }, (err, userInfo) => {
		// 카트안에 이미 상품이 있는지 확인
		let duplicate = false;
		userInfo.cart.forEach((item) => {
			if (item.id === req.body.productId) {
				duplicate = true;
			}
		});

		if (duplicate) {
			// 있다면
			User.findOneAndUpdate(
				{ _id: req.user._id, 'cart.id': req.body.productId },
				{ $inc: { 'cart.$.quantity': 1 } },
				{ new: true }, // Update된 정보를 받음
				(err, userInfo) => {
					if (err) return res.status(200).json({ success: false, err });
					return res.status(200).send(userInfo.cart);
				},
			);
		} else {
			// 있지 않다면
			User.findOneAndUpdate(
				{ _id: req.user._id },
				{
					$push: {
						cart: {
							id: req.body.productId,
							quantity: 1,
							date: Date.now(),
						},
					},
				},
				{ new: true },
				(err, userInfo) => {
					if (err) return res.status(400).json({ success: false, err });
					return res.status(200).send(userInfo.cart);
				},
			);
		}
	});
});

router.get('/removeFromCart', isLoggedIn, (req, res) => {
	// 먼저 Cart 안에 지우려고 한 상품 지워주기
	User.findOneAndUpdate(
		{ _id: req.user._id },
		{
			$pull: { cart: { id: req.query.id } },
		},
		{ new: true },
		(err, userInfo) => {
			let cart = userInfo.cart;
			let array = cart.map((item) => {
				return item.id;
			});

			// product collection에서 현재 남아있는 상품 정보 가져오기
			Product.find({ _id: { $in: array } })
				.populate('writer')
				.exec((err, productInfo) => {
					return res.status(200).json({
						productInfo,
						cart,
					});
				});
		},
	);
});

module.exports = router;
