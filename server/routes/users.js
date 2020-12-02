const express = require('express');
const router = express.Router();
const multer = require('multer');
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
		role: req.user.role,
		image: req.user.image,
		major: req.user.major,
		cart: req.user.cart,
		phone: req.user.phone,
	});
});

router.get('/logout', isLoggedIn, (req, res) => {
	// console.log(req.user, req.session);
	req.logout();
	req.session.destroy();
	// console.log(req.user, req.session);
	return res.clearCookie('connect.sid', { path: '/' }).status(200).send({
		success: true,
	});

});

// Email 중복 체크
router.get('/', isNotLoggedIn, (req, res) => {

	User.findOne({ email: req.query.email }, (err, userInfo) => {
		if (err) {
			return res.status(500).json({ success: false, err })
		}
		if (userInfo === null) {
			return res.status(200).json({ success: true })	
		} else {
			return res.status(200).json({
				success: false,
			});
		}
	})
});

// npmjs.com/package/multer
var storage = multer.diskStorage({
	// 저장 위치
	destination: function (req, file, cb) {
		cb(null, 'uploads/avatar/');
	},
	// 파일 명
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
});
var upload = multer({ storage: storage }).single('file');

router.post('/profileImage', (req, res) => {
	// 가져온 프로필 저장
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



router.put('/edit', isLoggedIn, (req, res) => {
	User.findOneAndUpdate({ _id: req.user._id }, { $set: req.body })
		.exec((err, result) => {
			// console.log(result)
			if (err) res.status(500).send({ success: false, err });
			return res.status(200).send({ success: true });
		})
})

// router.get('/profile', isLoggedIn, (req, res) => {
// 	User.findOne({ _id: req.user._id }, (err, user) => {
// 		if (err) return res.json({ success: false, err })
// 		return res.status(200).json({ success: true, user });
// 	})
// })

router.get('/kakao', passport.authenticate('kakao'));
router.get('/facebook', passport.authenticate('facebook'));
router.get('/naver', passport.authenticate('naver'));

router.get('/kakao/callback', function (req, res, next) {
	passport.authenticate('kakao', {
		// successRedirect: 'http://localhost:3000',
		// failureRedirect: 'http://localhost:3000/login',
		successRedirect: 'https://mirae-market.herokuapp.com',
		failureRedirect: 'https://mirae-market.herokuapp.com/login',
	})(req, res, next);
});

router.get('/facebook/callback', function (req, res, next) {
	passport.authenticate('facebook', {
		// successRedirect: 'http://localhost:3000/login',
		// failureRedirect: 'http://localhost:3000/login',
		successRedirect: 'https://mirae-market.herokuapp.com',
		failureRedirect: 'https://mirae-market.herokuapp.com/login',
	})(req, res, next);
});

router.get('/naver/callback', function (req, res, next) {
	passport.authenticate('naver', {
		// successRedirect: 'http://localhost:3000/login',
		// failureRedirect: 'http://localhost:3000/login',
		successRedirect: 'https://mirae-market.herokuapp.com',
		failureRedirect: 'https://mirae-market.herokuapp.com/login',
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
			if (item.id === req.body.bookId) {
				duplicate = true;
			}
		});

		// 판매완료로 변경
		Product.findOne({ _id: req.body.bookId }, (err, product) => {
			product.sold = true;
			product.save();
		})

		if (duplicate) {
			// 있다면
			return res.status(200).send(userInfo.cart);

		} else {
			// 있지 않다면
			User.findOneAndUpdate(
				{ _id: req.user._id },
				{
					$push: {
						cart: { id: req.body.bookId },
					},
				},
				{ new: true }, // Update된 정보를 받음
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

router.get('/userInfo', (req, res) => {
	User.findOne({ _id: req.query.id})
		.exec((err, user) => {
			// console.log("user : ", user)
			if(err) return res.send({ success: false, err })
			return res.send({ success: true, user })
		})
})

module.exports = router;
