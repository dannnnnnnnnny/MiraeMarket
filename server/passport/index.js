const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const naver = require('./naverStrategy');
const facebook = require('./facebookStrategy');
const { User } = require('../models/User');

// serializeUser
// user 객체를 전달받아 세션(정확히는 req.session)에 user.id 저장하는 역할
// req.session 객체에 어떤 데이터를 저장할지 선택함 (user.id)
// => done 두 번째 인자로 user.id 보내 저장함
// (세션에 사용자 정보 객체 id 저장)

// deserializeUser
// deserializeUser은 실제 서버로 들어오는 요청마다 세션 정보(serializeUser에서 저장된)를 실제 DB의 데이터와 비교
// 매 요청시 passport.session() 미들웨어가 이 메서드를 호출함
// serializeUser에서 세션에 저장했던 ID를 받아 DB에서 사용자 정보 조회
// 조회한 정보를 req.user에 저장하여 앞으로
// req.user를 통해 로그인한 사용자의 정보 가져올 수 있음
// (세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴)

module.exports = (passport) => {
	passport.serializeUser((user, done) => {
		// Strategy 성공 시 호출됨
		done(null, user.id); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
	});

	passport.deserializeUser((id, done) => {
		// 매개변수 id는 serializeUser의 done의 인자 user.id를 받은 것 (둘 의 타입이 일치해야 함)
		User.findById(id, (err, user) => {
			done(null, user); // 인자 user가 req.user가 됨
		});
	});

	local(passport);
	kakao(passport);
	naver(passport);
	facebook(passport);
};