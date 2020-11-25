const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const naver = require('./naverStrategy');
const facebook = require('./facebookStrategy');
const { User } = require('../models/User');

module.exports = (passport) => {
	passport.serializeUser((user, done) => {
		// Strategy 성공 시 호출됨
		done(null, user.id); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
	});

	passport.deserializeUser((id, done) => {
		// 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
		User.findById(id, (err, user) => {
			done(null, user); // 여기의 user가 req.user가 됨
		});
	});

	local(passport);
	kakao(passport);
	naver(passport);
	facebook(passport);
};

// * seriailizeUser
// req.session 객체에 어떤 데이터를 저장할지 선택함
// done 두 번째 인자로 user.id 보내 저장함
// (세션에 사용자 정보 객체를 아이디로 저장)

// * deserializeUser
// 매 요청시 passport.session() 미들웨어가 이 메서드를 호출함
// serializeUser에서 세션에 저장했던 ID를 받아 DB에서 사용자 정보 조회
// 조회한 정보를 req.user에 저장하여 앞으로
// req.user를 통해 로그인한 사용자의 정보 가져올 수 있음
// (세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴)
