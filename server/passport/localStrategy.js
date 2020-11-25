const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/User');

module.exports = (passport) => {
	passport.use(
		new LocalStrategy(
			{
				// local 전략을 세움
				usernameField: 'email',
				passwordField: 'password',
				session: true, // 세션에 저장 여부
				passReqToCallback: false,
			},
			(email, password, done) => {
				User.findOne({ email }, (findError, user) => {
					if (findError) return done(findError); // 서버 에러 처리
					if (!user)
						return done(null, false, { message: '존재하지 않는 아이디입니다' }); // 임의 에러 처리
					return user.comparePassword(password, (passError, isMatch) => {
						if (isMatch) {
							return done(null, user); // 검증 성공
						}
						return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 임의 에러 처리
					});
				});
			},
		),
	);
};

// 1) 로그인 성공시
// done(null, exUser);
// => passport.authenticate('local', (authError, user, info) => {})
// authError에 null, user에 exUser 대입

// 2) 로그인 실패시
// done(null, false, { message: "비밀번호 일치하지 않음"});
// => passport.authenticate('local', (authError, user, info) => {})
// authError에 null, user에 false, info에 JSON(message) 대입

// 3) 서버 에러시
// done(error);
// passport.authenticate('local', (authError, user, info) => {})
// authError에 error 대입

// done이 호출된 이후에는 passport.authenticate 콜백 함수에서 나머지 로직 실행
